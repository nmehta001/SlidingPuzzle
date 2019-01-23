// Pass in index to recognise which way to move
// Negative will go left and up in respective axis
const MOVESET_X = [0, 1, 0, -1, 0, 2, 0, -2];
const MOVESET_Y = [1, 0, -1, 0, 2, 0, -2, 0];

// TODO: Make this dynamic
// Pieces dictionary, contains only height and width
const pieces = {
    A: { height: 2, width: 1 },
    B: { height: 2, width: 2 },
    C: { height: 2, width: 1 },
    D: { height: 2, width: 1 },
    E: { height: 1, width: 2 },
    F: { height: 2, width: 1 },
    G: { height: 1, width: 1 },
    H: { height: 1, width: 1 },
    I: { height: 1, width: 1 },
    J: { height: 1, width: 1 },
};

const GRID_WIDTH = 4;
const GRID_HEIGHT = 5;

/**
 * Not fun to keep writing this, have a helper method
 * @returns {number}
 */
const piecesLength = () => Object.keys(pieces).length;

// Coords dictionary, contains only x and y
const coords = {
    A: { x: 0, y: 0 },
    B: { x: 1, y: 0 },
    C: { x: 3, y: 0 },
    D: { x: 0, y: 2 },
    E: { x: 1, y: 2 },
    F: { x: 3, y: 2 },
    G: { x: 1, y: 3 },
    H: { x: 2, y: 3 },
    I: { x: 0, y: 4 },
    J: { x: 3, y: 4 },
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

// State management for the grid
function GridState() {
    this.states = buckets.Stack();
    this.depth = 0;
    this.seen = buckets.Stack();
    this.solutions = buckets.Stack();
}

/**
 * Get all possible moves for the current state
 */
GridState.prototype.getAllMoves = function (gridState) {
    const states = gridState.toArray();
    const previousState = states.length <= 1 ? states[this.depth] : states[this.depth - 1];
    const state = states[this.depth];

    for (let i = 0; i < piecesLength(); i++) {
        // Get the piece to move
        const k = Object.keys(pieces)[i];
        const queriedPiece = state[k];

        // The piece can move in 8 different ways -> See MOVESET_X and MOVESET_Y
        for (let move = 0; move < 8; move++) {
            // Shift the currently selected piece by x and y of the below arrays
            const shifted = shift(queriedPiece, MOVESET_X[move], MOVESET_Y[move]);

            if (blockFits(shifted) && !pieceOverlaps(shifted, i)) {
                const newState = previousState;

                for (let j = 0; j < piecesLength(); j++) {
                    if (i === j) {
                        newState[Object.keys(newState)[j]] = shifted;
                    } else {
                        newState[Object.keys(previousState)[j]] = previousState[Object.keys(previousState)[j]];
                    }
                }

                console.log(newState);

                if (!this.alreadySeen(newState)) {
                    this.depth++;
                    this.addToSeen(newState);
                    this.addToStates(newState);
                    this.getAllMoves(this.states);
                }
            }
        }
    }
};

/**
 * Track all states as we find viable moves
 * @param state
 */
GridState.prototype.addToStates = function (state) {
    this.states.add(state);
};

/**
 * If the state happens to be a solution, add to the list
 * Later we can compare which solution has the least depth and offer it as the optimal solution
 * @param totalDepth
 * @param gridState
 */
GridState.prototype.addToSolutions = function (totalDepth, gridState) {
    const dict = {
        totalDepth: gridState,
    };
    this.solutions.push(dict);
};

/**
 * Track what states we have already seen
 * Useful to later ignore states so that we don't end up with duplicates
 */
GridState.prototype.addToSeen = function (state) {
    this.seen.add(state);
};

/**
 * Check if the state has been seen before
 * @param state
 * @returns {boolean}
 */
GridState.prototype.alreadySeen = function (state) {
    return this.seen.contains(state);
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
            if (hasOccupant(x, y, occupying) && hasOccupant(x, y, moved)) { return true; }
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

const init = () => {
    const grid = new Grid(GRID_HEIGHT, GRID_WIDTH);

    const gridState = new GridState();

    // Add the initial state
    gridState.addToStates(coords);

    gridState.getAllMoves(gridState.states);
};

window.addEventListener('load', () => {
    init();
});
