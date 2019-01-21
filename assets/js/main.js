/**
 * Move set
 */

const SHIFT_X = [0, 1, 0, -2, 0, 2, 0, -2];
const SHIFT_Y = [1, 0, -1, 0, 2, 0, -2, 0];


function MoveSet(moveIndex, permutation) {

    this.moveIndex = moveIndex;
    this.permutation = permutation;
}

MoveSet.prototype.getMovedIndex = function () {
    return this.moveIndex;
};

MoveSet.prototype.setMoveIndex = function (moveIndex) {
    return this.moveIndex = moveIndex;
};

MoveSet.prototype.getPermutation = function () {
    return this.permutation;
};

MoveSet.prototype.setPermutation = function (permutation) {
    this.permutation = permutation;
};


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

Block.prototype.cloneShifted = function (x, y) {
    return new Block(this.x + x, this.y + y);
};

Block.prototype.cloneAll = function () {
    return new Block(this);
};

Block.prototype.getHeight = function () {
    return this.height;
};

Block.prototype.getWidth = function () {
    return this.width
};

Block.prototype.getBottom = function () {
    return this.y + this.getHeight();
};

Block.prototype.getLeft = function () {
    return this.x;
};

Block.prototype.getRight = function () {
    return this.x + this.getWidth();
};

Block.prototype.getTop = function () {
    return this.y;
};

Block.prototype.fits = function () {
    return this.getLeft() >= 0 && this.getTop() >= 0 && this.getRight() <= this.getWidth() && this.getBottom() <= this.getHeight();
};

Block.prototype.hasCellAt = function (x, y) {
    return !(this.getLeft() > x || this.getRight() <= x || this.getTop() > y || this.getBottom() <= y);
};

Block.prototype.intersects = function (block1, block2) {
    if (block1.getRight() <= block2.getLeft() || block1.getBottom() <= block2.getTop()) return false;
    if (block2.getRight() <= block1.getLeft() || block2.getBottom() <= block1.getTop()) return false;

    let overlapLeft = Math.max(block1.getLeft(), block2.getLeft());
    let overlapRight = Math.min(block1.getRight(), block2.getRight());
    let overlapTop = Math.max(block1.getTop(), block2.getTop());
    let overlapBottom = Math.min(block1.getBottom(), block2.getBottom());

    for (let y = overlapTop; y < overlapBottom; y++) {
        for (let x = overlapLeft; x < overlapRight; y++) {

            if (block1.hasCellAt(x, y) && block2.hasCellAt(x, y)) {
                return true;
            }
        }
    }
    return false;
};


const randomColor = (() => {

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

function Grid(rows, cols, callback) {
    const grid = document.createElement('table');
    grid.className = 'grid';

    for (let r = 0; r < rows; r++) {
        let tr = grid.appendChild(document.createElement('tr'));
        for (let c = 0; c < cols; c++) {
            let cell = tr.appendChild(document.createElement('td'));
            cell.addEventListener('click', ((el, r, c) => {
                return () => {
                    callback(el, r, c);
                }
            })(cell, r, c), false);
            if (r === 6 && (c === 2 || c === 3)) {
                cell.style.backgroundColor = "red";
            }
        }
    }

    return grid;
}

/**
 * Canvas State Modifications and methods
 */
function CanvasState(canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');

    // Setting to false will redraw Canvas
    this.valid = false;

    // Collection of items to draw
    this.blocks = [];

    const myState = this;

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

// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function () {
    // if our state is invalid, redraw and validate!
    if (!this.valid) {
        let ctx = this.ctx;
        let blocks = this.blocks;
        this.clear();

        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            // We can skip the drawing of elements that have moved off the screen:
            if (block.x > this.width || block.y > this.height || block.x + block.w < 0 || block.y + block.height < 0) continue;
            blocks[i].draw(ctx);
        }

        this.valid = true;
    }
};

CanvasState.prototype.blockIntersects = function (previousState, block, ignoredIndex) {
    for (let i = 0; i < previousState.size(); i++) {
        if (ignoredIndex === i) {
            continue;
        }
        if (block.intersects(previousState.get(i), block)) {
            return true;
        }
    }
};

CanvasState.prototype.getValidPermutations = function (blocks) {
    blocks.forEach((block, i) => {
        for (let move = 0; move < 8; move++) {
            let shiftedBlock = block.cloneShifted(SHIFT_X[move], SHIFT_Y[move]);
            if (shiftedBlock.fits() && this.blockIntersects(blocks, block, i)) {
                let shiftedBlocks = [];
                for (let j = 0; j < blocks.size(); j++) {
                    if (i === j) {
                        shiftedBlocks.add(shiftedBlock);
                    } else {
                        shiftedBlocks.add(blocks[j].cloneAll());
                    }
                }
            }
        }
    });
};

/**
 * Init the function
 */
const blocks = [
    {x: 84, y: 84, width: 84, height: 168, letter: "A"}, //A
    {x: 168, y: 84, width: 168, height: 168, letter: "B"}, //B
    {x: 336, y: 84, width: 84, height: 168, letter: "C"}, //C
    {x: 84, y: 252, width: 84, height: 168, letter: "D"}, //D
    {x: 168, y: 252, width: 168, height: 84, letter: "E"}, //E
    {x: 336, y: 252, width: 84, height: 168, letter: "F"}, //F
    {x: 84, y: 420, width: 84, height: 84, letter: "G"}, //G
    {x: 168, y: 336, width: 84, height: 84, letter: "H"}, //H
    {x: 252, y: 336, width: 84, height: 84, letter: "I"}, //I
    {x: 336, y: 420, width: 84, height: 84, letter: "J"}, //J
];

function init() {
    let lastClicked;
    const canvas = document.getElementById('canvas');
    const state = new CanvasState(canvas);

    blocks.forEach(block => {
        state.addBlock(new Block(block.height, block.letter, block.width, block.x, block.y));
    });

    const grid = Grid(7, 6, function (el, row, col) {
        console.log("You clicked on element:", el);
        console.log("You clicked on row:", row);
        console.log("You clicked on col:", col);

        el.className = 'clicked';
        if (lastClicked) lastClicked.className = '';
        lastClicked = el;
    });

    document.body.appendChild(grid);
}

window.addEventListener('load', () => {
    init();
});
