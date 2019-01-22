// Pass in index to recognise which way to move
// Negative will go left and up in respective axis
const MOVE_SET_X = [0, 1, 0, -1, 0, 2, 0, -2];
const MOVE_SET_Y = [1, 0, -1, 0, 2, 0, -2, 0];

// TODO: Make this dynamic
// Pieces dictionary, contains only height and width
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

/**
 * Not fun to keep writing this, have a helper method
 * @returns {number}
 */
let piecesLength = () => {
    return Object.keys(pieces).length
};

// Coords dictionary, contains only x and y
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

// Build visible Grid on screen
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
                coords: {x: r, y: c}
            };

            this.gridItems.push(item);
            i++;
        }
    }

    document.body.appendChild(this.grid);
}

// Return what areas are corners
Grid.prototype.setIsCorner = function (cols, c, rows, r) {
    return (cols / (c + 1) === cols || cols / (c + 1) === 1) && (rows / (r + 1) === rows || rows / (r + 1) === 1);
};

/*
 * State management for the grid
 */
function GridState() {
    this.states = buckets.Stack();
    this.initalState = [[], []];
    this.currentState = [[], []];
    this.seen = buckets.Stack();
    this.solutions = buckets.Stack();
}

GridState.prototype.setInitialState = function () {
    this.initalState = this.currentState;
};

GridState.prototype.generateState = function () {
    Object.keys(pieces).forEach((piece) => {
        Object.keys(coords).forEach((coOrd) => {
            if (piece === coOrd) {
                for (let i = coords[coOrd].x; i < pieces[piece].width; i++) {
                    for (let j = coords[coOrd].y; j < pieces[piece].height; j++) {
                        this.currentState[i][j] = 1;
                    }
                }
            }
        });
    });
};

GridState.prototype.getAllMoves = function () {
    Object.keys(pieces).forEach((piece, i) => {
        let queriedPiece = coords[piece];
        for (let move = 0; move < 8; move++) {
            let shifted = cloneAndShift(queriedPiece, MOVE_SET_X[move], MOVE_SET_Y[move]);

            if (blockFits(shifted) && !pieceOverlaps(shifted, i)) {
                let shiftedPieces = [];

                for (let j = 0; j < piecesLength(); j++) {
                    if (i === j) {
                        shiftedPieces[j] = shifted;
                    } else {
                        shiftedPieces[j] = coords[Object.keys(coords)[j]];
                    }
                }
            }
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

let cloneAndShift = (piece, x, y) => {
    piece.x += x;
    piece.y += y;

    return piece;
};

function blockFits(piece) {
    let key = key(piece);
    return piece.x >= 0 && piece.y >= 0
        && (piece.x + (pieces[key].width - 1)) <= (pieces[key].width - 1)
        && (piece.y + (pieces[key].height-1)) <= (pieces[key].height -1);
}

/**
 * Helper method for getting piece Key
 * @param piece
 * @returns {string}
 */
let key = (piece) => {
    return Object.keys(coords).find(key => coords[key] === piece);
};

let init = () => {
    const grid = new Grid(5, 4);

    let gridState = new GridState();

    gridState.generateState();
    gridState.setInitialState();

    // gridState.getAllMoves();
};

window.addEventListener("load", () => {
    init();
});