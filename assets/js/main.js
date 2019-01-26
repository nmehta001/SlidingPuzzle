// Pass in index to recognise which way to move
// Negative will go left and up in respective axis
const MOVE_MATRIX_X = [0, 1, 0, -1, 0, 2, 0, -2];
const MOVE_MATRIX_Y = [1, 0, -1, 0, 2, 0, -2, 0];

// TODO: Make this dynamic
// Pieces dictionary, contains only height and width
const pieces = {
    A: {height: 2, width: 1},
    B: {height: 2, width: 2},
    C: {height: 2, width: 1},
    D: {height: 2, width: 1},
    E: {height: 1, width: 2},
    F: {height: 2, width: 1},
    G: {height: 1, width: 1},
    H: {height: 1, width: 1},
    I: {height: 1, width: 1},
    J: {height: 1, width: 1},
};

const GRID_WIDTH = 4;
const GRID_HEIGHT = 6;

/**
 * Not fun to keep writing this, have a helper method
 * @returns {number}
 */
const piecesLength = () => Object.keys(pieces).length;

// Coords dictionary, contains only x and y
const coords = {
    A: {x: 0, y: 0},
    B: {x: 1, y: 0},
    C: {x: 3, y: 0},
    D: {x: 0, y: 2},
    E: {x: 1, y: 2},
    F: {x: 3, y: 2},
    G: {x: 1, y: 3},
    H: {x: 2, y: 3},
    I: {x: 0, y: 4},
    J: {x: 3, y: 4},
};

const goal = {
    x: 1, y: 4
};

/**
 * Build visible Grid on screen
 * @param rows
 * @param cols
 * @constructor
 */
function Grid(rows, cols) {
    this.grid = document.createElement('table');
    this.grid.className = 'grid';

    for (let r = 0; r < rows; r++) {
        const tr = this.grid.appendChild(document.createElement('tr'));
        for (let c = 0; c < cols; c++) {
            tr.appendChild(document.createElement('td'));
        }
    }

    document.body.appendChild(this.grid);
}

function Solver(state) {
    this.seen = new Set();
    this.pending = buckets.Stack();
    this.temp = [];
    this.currentDepth = 0;
    this.positionsEvaluated = 0;
    this.duplicatePositions = 0;

    this.addStateToPending(state)
}

Solver.prototype.run = function () {
    let date = new Date();
    let start = date.getTime();

    do {
        let stepsRemaining = 50;

        while (stepsRemaining-- > 0) {
            let currentState = this.pending.pop();
            this.positionsEvaluated++;

            if (isAtGoal(currentState)) {
                alert("FOUND");
                return;
            }

            this.addChildrenToPending();

            if (this.pending.isEmpty()) {
                alert("FAILED");
                return;
            }

        }
    } while ((date.getMilliseconds() - start) < 100);
};


Solver.prototype.addChildrenToPending = function () {
    this.getAllMoves(this.temp);
    let numChildren = this.temp.length;
    for (let i = 0; i < numChildren; i++) {
        let s = this.temp[i];
        if (s !== null) {
            this.addStateToPending(s)
        }
    }
};

/**
 * Get all possible moves for the current state
 * @param dest
 */
Solver.prototype.getAllMoves = function (dest) {
    // Iterate through the total number of pieces
    for (let i = 0; i < piecesLength(); i++) {
        const k = Object.keys(pieces)[i];
        const topLeftCoordinates = coords[Object.keys(coords)[i]];
        const comparableArray = dest.length > 0 ? dest[this.currentDepth] : coords;

        console.log(`Assessing piece ${k}`);
        console.log(`Starting coordinates, x: ${topLeftCoordinates.x}, y : ${topLeftCoordinates.y}`);

        for (let move = 0; move < 8; move++) {
            // Clone the object otherwise it shifts topLeftCoordinates too
            const topLeftShifted = shift(Object.assign({}, topLeftCoordinates), MOVE_MATRIX_X[move], MOVE_MATRIX_Y[move]);
            let newState = [];

            console.log(`Moving ${k} to x: ${topLeftShifted.x}, y: ${topLeftShifted.y}`);

            if (blockFits(k, topLeftShifted) && !pieceOverlaps(k, comparableArray, topLeftShifted, i) && !occupiesImmutable(topLeftShifted)) {
                for (let j = 0; j < piecesLength(); j++) {
                    if (i === j) {
                        newState.push(topLeftShifted)
                    } else {
                        newState.push(topLeftCoordinates);
                    }
                }

                if (this.seen.has(newState)) {
                    dest.push(newState);
                }
            }
        }
        this.currentDepth++;
    }
};

/**
 * Track what states we have already seen
 * Useful to later ignore states so that we don't end up with duplicates
 */
Solver.prototype.addStateToPending = function (state) {
    if (!this.seen.has(state)) {
        this.seen.add(state);
        this.pending.add(state);
    } else {
        this.duplicatePositions++;
    }
};

/**
 * Move the piece from its top left positioning
 * @param piece
 * @param x
 * @param y
 * @returns {object}
 */
let shift = (piece, x, y) => {
    piece.x += x;
    piece.y += y;

    return piece;
};

/**
 * Check the top left position does not go outside of the grid
 * and that the piece piece's shape does not exceed the grid
 * @param key
 * @param piece
 * @returns {boolean}
 */
function blockFits(key, piece) {
    console.log(`Piece fits within grid: ${piece.x >= 0 && piece.y >= 0 &&
    (piece.x + pieces[key].width) <= GRID_WIDTH &&
    (piece.y + pieces[key].height) <= GRID_HEIGHT}`);

    return piece.x >= 0 && piece.y >= 0 &&
        (piece.x + pieces[key].width) <= GRID_WIDTH &&
        (piece.y + pieces[key].height) <= GRID_HEIGHT;
}

/**
 * Check if the moved piece's position overlaps with an occupying piece
 * @param key
 * @param previousState
 * @param moved
 * @param excludeIndex
 * @returns {boolean}
 */
function pieceOverlaps(key, previousState, moved, excludeIndex) {
    for (let i = 0; i < piecesLength(); i++) {
        if (excludeIndex === i) continue;
        if (overlaps(key, previousState[Object.keys(previousState)[i]], moved)) return true;
    }

    return false;
}

/**
 * Check all edges of pieces for overlaps
 * @param key
 * @param occupying
 * @param moved
 * @returns {boolean}
 */
function overlaps(key, occupying, moved) {
    const occupyingTop = occupying.y;
    const occupyingRight = occupying.x + pieces[key].width;
    const occupyingLeft = occupying.x;
    const occupyingBottom = occupying.y + pieces[key].height;

    const movedTop = moved.y;
    const movedRight = moved.x + pieces[key].width;
    const movedLeft = moved.x;
    const movedBottom = moved.y + pieces[key].height;

    if (occupyingRight <= movedLeft || occupyingBottom <= movedTop) return false;
    if (movedRight <= occupyingLeft || movedBottom <= occupyingTop) return false;

    const topOverlap = Math.max(occupyingTop, movedTop);
    const rightOverlap = Math.max(occupyingRight, movedRight);
    const bottomOverlap = Math.max(occupyingBottom, movedBottom);
    const leftOverlap = Math.max(occupyingLeft, movedLeft);

    for (let y = topOverlap; y < bottomOverlap; y++) {
        for (let x = leftOverlap; x < rightOverlap; x++) {
            if (hasOccupant(key, x, y, occupying) && hasOccupant(key, x, y, moved)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Check if grid has piece occupying the area where current piece is moving
 * @param key
 * @param x
 * @param y
 * @param piece
 * @returns {boolean}
 */
function hasOccupant(key, x, y, piece) {
    return !(piece.x > x || (piece.x + pieces[key].width) <= x
        || piece.y > y || (piece.y + pieces[key].height) <= y);
}

function occupiesImmutable(piece) {
    return (piece.x === 0 || piece.x === 3) && piece.y === 5;
}

function isAtGoal(state) {
    let key = Object.keys(state)[1];
    let coords = state[key];
    return (coords.x === goal.x) && (coords.y === goal.y);
}

const init = () => {
    new Grid(GRID_HEIGHT, GRID_WIDTH);

    let puzzleSolver = new Solver(coords);

    puzzleSolver.run();
};

window.addEventListener('load', () => {
    init();
});
