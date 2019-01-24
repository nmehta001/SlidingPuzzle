// Pass in index to recognise which way to move
// Negative will go left and up in respective axis
const MOVESET_X = [0, 1, 0, -1, 0, 2, 0, -2];
const MOVESET_Y = [1, 0, -1, 0, 2, 0, -2, 0];

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
 * Helper method for getting piece Key
 * @param piece
 * @returns {string}
 */
const key = piece => Object.keys(coords).find(k => coords[k] === piece);

// Build visible Grid on screen
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

    this.currentDepth = this.pending.peek();
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
 */
Solver.prototype.getAllMoves = function (destination) {
    for (let i = 0; i < piecesLength(); i++) {
        // Get the piece to move
        const k = Object.keys(pieces)[i];
        const queriedPiece = pieces[k];

        // The piece can move in 8 different ways -> See MOVESET_X and MOVESET_Y
        for (let move = 0; move < 8; move++) {
            // Shift the currently selected piece by x and y of the below arrays
            const shifted = shift(queriedPiece, MOVESET_X[move], MOVESET_Y[move]);

            if (blockFits(shifted) && !pieceOverlaps(shifted, i)) {
                const newState = [];

                console.log("I AM WORKING")

                for (let j = 0; j < piecesLength(); j++) {
                    if (i === j) {
                        newState[Object.keys(newState)[j]] = shifted;
                    } else {
                        newState[Object.keys(pieces)[j]] = pieces[Object.keys(pieces)[j]];
                    }
                }

                destination.push(newState)
            }
        }
    }
};

/**
 * Track what states we have already seen
 * Useful to later ignore states so that we don't end up with duplicates
 */
Solver.prototype.addStateToPending = function (state) {
    console.log(this.seen.add(state))
    if (this.seen.add(state)) {
        this.pending.add(state);
        console.log(this.pending.toArray())
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
 * @param piece
 * @returns {boolean}
 */
function blockFits(piece) {
    const k = key(piece);
    return piece.x >= 0 && piece.y >= 0 &&
        (piece.x + pieces[k].width) <= GRID_WIDTH &&
        (piece.y + pieces[k].height) <= GRID_HEIGHT;
}

/**
 * Check if the moved piece's position overlaps with an occupying piece
 * @param moved
 * @param excludeIndex
 * @returns {boolean}
 */
function pieceOverlaps(moved, excludeIndex) {
    for (let i = 0; i < piecesLength(); i++) {
        if (excludeIndex === i) continue;
        const occupyingKey = Object.keys(pieces)[i];
        const occupyingPiece = coords[occupyingKey];
        if (overlaps(occupyingPiece, moved)) return true;
    }

    return false;
}

/**
 * Check all edges of pieces for overlaps
 * @param occupying
 * @param moved
 * @returns {boolean}
 */
function overlaps(occupying, moved) {
    const key1 = key(occupying);
    const key2 = key(moved);

    const occupyingTop = occupying.y;
    const occupyingRight = occupying.x + pieces[key1].width;
    const occupyingLeft = occupying.x;
    const occupyingBottom = occupying.y + pieces[key1].height;

    const movedTop = moved.y;
    const movedRight = moved.x + pieces[key2].width;
    const movedLeft = moved.x;
    const movedBottom = moved.y + pieces[key2].height;

    if (occupyingRight <= movedLeft || occupyingBottom <= movedTop) return false;
    if (movedRight <= occupyingLeft || movedBottom <= occupyingTop) return false;

    const topOverlap = Math.max(occupyingTop, movedTop);
    const rightOverlap = Math.max(occupyingRight, movedRight);
    const bottomOverlap = Math.max(occupyingBottom, movedBottom);
    const leftOverlap = Math.max(occupyingLeft, movedLeft);

    for (let y = topOverlap; y < bottomOverlap; y++) {
        for (let x = leftOverlap; x < rightOverlap; x++) {
            if (hasOccupant(x, y, occupying) && hasOccupant(x, y, moved) && occupiesImmutable(moved)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Check if grid has piece occupying the area where current piece is moving
 * @param x
 * @param y
 * @param piece
 * @returns {boolean}
 */
function hasOccupant(x, y, piece) {
    const k = key(piece);
    return (piece.x > x || (piece.x + pieces[k].width) <= x
        || piece.y > y || (piece.y + pieces[k].height) <= y);
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
