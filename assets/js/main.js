/**
 * Block modifications and methods
 */

function Block(height, letter, width, x, y) {
    this.height = height;
    this.letter = letter;
    this.width = width;
    this.x = x;
    this.y = y;
    this.fill = randomColor();
}

Block.prototype.draw = function (ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.fill;
    ctx.font = "90px Arial";
    ctx.fillText(this.letter, this.x, this.y + 72);
};

Block.prototype.contains = function (mouseX, mouseY) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Width) and its Y and (Y + Height)
    return (this.x <= mouseX) && (this.x + this.width >= mouseX)
        && (this.y <= mouseY) && (this.y + this.height >= mouseY);
};

const randomColor = (() => {
    "use strict";

    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return () => {
        let h = randomInt(0, 360);
        let s = randomInt(42, 98);
        let l = randomInt(40, 90);
        return `hsl(${h}, ${s}% ,${l}%)`;
    };
})();

/**
 * Canvas Modifications and methods
 */

function CanvasState(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');

    // **** Keep track of state! ****

    // Setting to false will redraw Canvas
    this.valid = false;

    // Collection of items to draw
    this.blocks = [];

    this.isDragging = false;
    this.selection = null;

    this.dragOffX = 0;
    this.dragOffY = 0;

    const myState = this;

    // Up, down, and move are for isDragging
    canvas.addEventListener('mousedown', function (e) {
        let mouse = myState.getMouse(e);
        let mouseX = mouse.x;
        let mouseY = mouse.y;
        let blocks = myState.blocks;
        let l = blocks.length;
        for (let i = l - 1; i >= 0; i--) {
            if (blocks[i].contains(mouseX, mouseY)) {
                let mySel = blocks[i];
                // Keep track of where in the object we clicked
                // move smoothly on position clicked
                myState.dragOffX = mouseX - mySel.x;
                myState.dragOffY = mouseY - mySel.y;
                myState.dragOffY = mouseY - mySel.y;
                myState.isDragging = true;
                myState.selection = mySel;
                myState.valid = false;
                return;
            }
        }

        console.log(myState.selection)
        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        if (myState.selection) {
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }
    }, true);

    canvas.addEventListener('mousemove', function (e) {
        if (myState.isDragging) {
            const mouse = myState.getMouse(e);
            // Use offset so we don't drag by top left corner
            myState.selection.x = mouse.x - myState.dragOffX;
            myState.selection.y = mouse.y - myState.dragOffY;
            myState.valid = false;

            
        }
    }, true);

    canvas.addEventListener('mouseup', function (e) {
        myState.isDragging = false;
    }, true);

    // **** Options! ****
    this.selectionColor = '#E7004E';
    this.selectionWidth = 1;
    this.interval = 30;
    setInterval(function () {
        myState.draw();
    }, myState.interval);
}

CanvasState.prototype.addBlock = function (block) {
    this.blocks.push(block);
    this.valid = false;
};

CanvasState.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
};

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function () {
    // if our state is invalid, redraw and validate!
    if (!this.valid) {
        var ctx = this.ctx;
        var shapes = this.blocks;
        this.clear();

        // ** Add stuff you want drawn in the background all the time here **

        // draw all blocks
        var l = shapes.length;
        for (var i = 0; i < l; i++) {
            var shape = shapes[i];
            // We can skip the drawing of elements that have moved off the screen:
            if (shape.x > this.width || shape.y > this.height ||
                shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
            shapes[i].draw(ctx);
        }

        // draw selection
        // right now this is just a stroke along the edge of the selected Shape
        if (this.selection != null) {
            ctx.strokeStyle = this.selectionColor;
            ctx.lineWidth = this.selectionWidth;
            let mySel = this.selection;
            ctx.strokeRect(mySel.x, mySel.y, mySel.width, mySel.height);
        }

        // ** Add stuff you want drawn on top all the time here **

        this.valid = true;
    }
};


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function (e) {
    let element = this.canvas, offsetX = 0, offsetY = 0, mouseX, mouseY;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    mouseX = e.pageX - offsetX;
    mouseY = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return {x: mouseX, y: mouseY};
};

/**
 * Init the function
 */
const blocks = [
    {x: 0, y: 0, width: 84, height: 168, letter: "A"}, //A
    {x: 84, y: 0, width: 168, height: 168, letter: "B"}, //B
    {x: 252, y: 0, width: 84, height: 168, letter: "C"}, //C
    {x: 0, y: 168, width: 84, height: 168, letter: "D"}, //D
    {x: 84, y: 168, width: 168, height: 84, letter: "E"}, //E
    {x: 252, y: 168, width: 84, height: 168, letter: "F"}, //F
    {x: 84, y: 252, width: 84, height: 84, letter: "G"}, //G
    {x: 168, y: 252, width: 84, height: 84, letter: "H"}, //H
    {x: 0, y: 336, width: 84, height: 84, letter: "I"}, //I
    {x: 252, y: 336, width: 84, height: 84, letter: "J"}, //J
];

function init() {
    const canvas = document.getElementById('canvas');
    const state = new CanvasState(canvas);

    blocks.forEach(block => {
        state.addBlock(new Block(block.height, block.letter, block.width, block.x, block.y));
    });
}

window.addEventListener('load', () => {
    init();
});
