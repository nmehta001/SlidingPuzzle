// Pass in index to recognise which way to move
// Negative will go left and up in respective axis
const MOVESET_X = [0, 1, 0, -1, 0, 2, 0, -2];
const MOVESET_Y = [1, 0, -1, 0, 2, 0, -2, 0];

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
                // constraints: this.setConstraints(),
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
 * State management fro the grid
 */
function GridState() {
    this.seen = buckets.Stack();
    this.solutions = buckets.Stack();
}

GridState.prototype.getAllMoves = function () {
    Object.keys(pieces).forEach((piece, i) => {
        let queriedPiece = coords[piece];
        for (let move = 0; move < 8; move++) {
            let shifted = cloneAndShift(queriedPiece, MOVESET_X[move], MOVESET_Y[move]);

            if (blockFits(shifted) && !pieceOverlaps(shifted, i)) {
                let shiftedPieces = [];

                for (let j = 0; j < piecesLength(); j++) {
                    if (i === j) {
                        shiftedPieces[j] = shifted;
                    } else {
                        shiftedPieces[j] = coords[Object.keys(coords)[j]]
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
    return getLeft(piece) >= 0 && getTop(piece) >= 0 &&
        getRight(piece, key(piece)) <= getWidth(key(piece))
        && getBottom(piece, key(piece)) <= getHeight(key(piece));
}

/**
 * Check if the newPieces position overlaps with the oldPiece
 * @param newPiece
 * @param excludeIndex
 * @returns {boolean}
 */
function pieceOverlaps(newPiece, excludeIndex) {
    for (let i = 0; i < piecesLength(); i++) {
        if (excludeIndex === i) continue;
        let oldKey = Object.keys(pieces)[i];
        let oldPiece = coords[oldKey];
        if (overlaps(oldPiece, newPiece)) return true;
    }

    return false;
}

/**
 * Check all edges for overlaps
 * @param oldPiece
 * @param newPiece
 * @returns {boolean}
 */
function overlaps(oldPiece, newPiece) {
    let key1 = key(oldPiece);
    let key2 = key(newPiece);

    const pieceOneTop = getTop(oldPiece);
    const pieceOneRight = getRight(oldPiece, key1);
    const pieceOneLeft = getLeft(oldPiece);
    const pieceOneBottom = getBottom(oldPiece, key1);

    const pieceTwoTop = getTop(newPiece);
    const pieceTwoRight = getRight(newPiece, key2);
    const pieceTwoLeft = getLeft(newPiece);
    const pieceTwoBottom = getBottom(newPiece, key2);

    if (pieceOneRight <= pieceTwoLeft || pieceOneBottom <= pieceTwoTop) return false;
    if (pieceTwoRight <= pieceOneLeft || pieceTwoBottom <= pieceOneTop) return false;

    let topOverlap = Math.max(pieceOneTop, pieceTwoTop);
    let rightOverlap = Math.max(pieceOneRight, pieceTwoRight);
    let bottomOverlap = Math.max(pieceOneBottom, pieceTwoBottom);
    let leftOverlap = Math.max(pieceOneLeft, pieceTwoLeft);

    for (let y = topOverlap; y < bottomOverlap; y++) {
        for (let x = leftOverlap; x < rightOverlap; x++) {
            if (hasOccupant(x, y, oldPiece, key1) && hasOccupant(x, y, newPiece, key2))
                return true;
        }
    }

    return false;
}

/**
 * Check if grid has piece occupying the area where current piece can be moved
 * @param x
 * @param y
 * @param piece
 * @param key
 * @returns {boolean}
 */
function hasOccupant(x, y, piece, key) {
    return (getLeft(piece) > x || getRight(piece, key) <= x || getTop(piece) > y || getBottom(piece, key) <= y);
}

/**
 * Helper method for getting piece Key
 * @param piece
 * @returns {string}
 */
let key = (piece) => {
    return Object.keys(coords).find(key => coords[key] === piece);
};

/**
 * Helper method for left of piece
 * @param piece
 * @returns {number}
 */
let getLeft = piece => {
    return piece.x
};

/**
 * Helper method for right of piece
 * @param piece
 * @param key
 * @returns {number}
 */
let getRight = (piece, key) => {
    return getLeft(piece) + getWidth(key);
};

/**
 * Helper method for top of piece
 * @param piece
 * @returns {number}
 */
let getTop = piece => {
    return piece.y;
};

/**
 * Helper method for bottom of piece
 * @param piece
 * @param key
 * @returns {number}
 */
let getBottom = (piece, key) => {
    return getTop(piece) + getHeight(key);
};

/**
 * Helper method for height of piece
 * @param key
 * @returns {number}
 */
let getHeight = key => {
    return pieces[key].height;
};

/**
 * Helper method for width of piece
 * @param key
 * @returns {number}
 */
let getWidth = key => {
    return pieces[key].width;
};

let init = () => {
    const grid = new Grid(5, 4);

    let gridState = new GridState();

    gridState.getAllMoves();
};

window.addEventListener("load", () => {
    init();
});