// Pass in index to recognise which way to move
// Negative will go left and up in respective axis
const MOVESET_X = [0, 1, 0, -1, 0, 2, 0, -2];
const MOVESET_Y = [1, 0, -1, 0, 2, 0, -2, 0];

// TODO: Make this dynamic
const pieces = {
    "A": {height: 2, width: 1},
    "B": {height: 2, width: 2},
    "C": {height: 2, width: 1},
    "D": {height: 2, width: 1},
    "E": {height: 1, width: 2},
    "F": {height: 2, width: 1},
    "G": {height: 1, width: 1},
    "H": {height: 1, width: 1},
    "I": {height: 1, width: 1},
    "J": {height: 1, width: 1},
};

// Hold top-left positioning
const coords = {
    "A": {x: 0, y: 0},
    "B": {x: 1, y: 0},
    "C": {x: 3, y: 0},
    "D": {x: 0, y: 2},
    "E": {x: 1, y: 2},
    "F": {x: 3, y: 2},
    "G": {x: 1, y: 3},
    "H": {x: 2, y: 3},
    "I": {x: 0, y: 4},
    "J": {x: 3, y: 4},
};

function Grid(rows, cols) {
    this.grid = document.createElement("table");
    this.grid.className = "grid";
    this.gridItems = [];

    let i = 0;
    for (let r = 0; r < rows; r++) {
        let tr = this.grid.appendChild(document.createElement("tr"));
        for (let c = 0; c < cols; c++) {
            tr.appendChild(document.createElement("td"));

            let item = {
                position: i,
                isCorner: this.setIsCorner(cols, c, rows, r),
                // constraints: this.setConstraints(),
                coords: {x: r, y: c}
            };

            this.gridItems.push(item);
            i++;
        }
    }

    document.body.appendChild(this.grid);
}

Grid.prototype.setIsCorner = function (cols, c, rows, r) {
    return (cols / (c + 1) === cols || cols / (c + 1) === 1) && (rows / (r + 1) === rows || rows / (r + 1) === 1);
};

function GridState() {
    this.permutations = [];
    this.initalState = [];
    this.state = [];
    this.emptyCells = [];
    this.seen = buckets.Stack();
    this.solutions = buckets.Stack();
}

GridState.prototype.setInitialState = function () {
    return this.initalState = this;
};

GridState.prototype.setState = function () {
    return this.state.push(coords)
};

GridState.prototype.getPermutations = function () {
    let lastState = this;

    pieces.forEach((piece, i) => {
        for (let move = 0; move < 8; move++) {
            let shifted = new GridState();

            if (this.areStatesSimilar(lastState, shifted)) {
                this.seen.add(shifted);
            }
        }
    });

    return this.permutations;
};

GridState.prototype.trackEmptyCells = function (gridState) {

};

GridState.prototype.areStatesSimilar = function (stateA, stateB) {
    return stateA !== stateB;
};

GridState.prototype.getAllMoves = function () {
    Object.keys(pieces).forEach((piece) => {
        let queriedPiece = coords[piece];
        for (let move = 0; move < 8; move++) {
            let shifted = clone(queriedPiece, MOVESET_X[move], MOVESET_Y[move]);

            console.log(blockFits(shifted))

            // if (blockFits(queriedPiece) && !blockIntesects(pieces, queriedPiece, i)) {
            //     console.log(queriedPiece)
            //
            // }


        }
    });
};


GridState.prototype.addToSolutions = function (totalDepth, gridState) {
    let dict = {
        totalDepth: gridState
    };
    this.solutions.push(dict);
};

GridState.prototype.addToSeen = function () {
    return this.seen.add(this);
};

GridState.prototype.clearSeen = function () {
    return this.seen.clear();
};

let clone = (piece, x, y) => {
    piece.x += x;
    piece.y += y;

    return piece;
};

function blockFits(piece) {
    return getLeft(piece) >= 0 && getTop(piece) >= 0 &&
        getRight(piece, key(coords, piece)) <= getWidth(key(coords, piece))
        && getBottom(piece, key(coords, piece)) <= getHeight(key(coords, piece));
}

let key = (arr, piece) => {
    return Object.keys(arr).find(key => arr[key] === piece);
};

let getLeft = piece => {
    return piece.x
};

let getRight = (piece, key) => {
    return getLeft(piece) + getWidth(key);
};

let getTop = piece => {
    return piece.y;
};

let getBottom = (piece, key) => {
    return getTop(piece) + getHeight(key);
};

let getHeight = key => {
    return pieces[key].height;
};

let getWidth = key => {
    return pieces[key].width;
};

let init = () => {
    const grid = new Grid(5, 4);

    let gridState = new GridState();

    gridState.setInitialState();

    gridState.getAllMoves();
};

window.addEventListener("load", () => {
    init();
});