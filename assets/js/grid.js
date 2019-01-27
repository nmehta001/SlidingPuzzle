/**
 * Construct the grid using the following params
 * @param height
 * @param width
 * @param gridState
 * @param goal
 * @constructor
 */
function Grid(height, width, gridState, goal) {
    this.height = height;
    this.width = width;
    this.gridState = gridState;
    this.goal = goal;
    this.goalDistance = -1;

    console.log(this)
}

/**
 * Return grid width
 * @returns {number}
 */
Grid.prototype.getWidth = function () {
    return this.width;
};

/**
 * Return grid height
 * @returns {number}
 */
Grid.prototype.getHeight = function () {
    return this.height;
};

/**
 * Length of the gridState helper
 * @returns {number}
 */
Grid.prototype.getGridStateLength = function () {
    return Object.keys(this.gridState).length;
};

/**
 * Clone the piece, shift it, check it fits in the grid and doesn't overlap with another piece
 * @param dest
 */
Grid.prototype.getAllMoves = function (dest) {
    for (let i = 0; i < this.getGridStateLength(); i++) {
        let key = Object.keys(this.gridState)[i];
        let moving = this.gridState[key];

        // 8 moves, 1 step in each direction or 2
        for (let move = 0; move < 8; move++) {
            // take original coords, clone and shift
            let moved = moving.cloneShifted(getMoveX(move), getMoveY(move));

            if (this.blockFits(moved) && !this.blocksOverlap(this.gridState, moved, i)) {
                let state = [];
                for (let j = 0; j < this.getGridStateLength(); j++) {
                    if (i === j) {
                        state.push(moved)
                    } else {
                        state.push(this.gridState[Object.keys(this.gridState)[j]]);
                    }
                }

                // draw new grid with the new state
                let nGrid = new Grid(this.height, this.width, state, this.goal);
                // update the block and its distance from the goal
                this.setDistanceFromGoal(nGrid);
                dest.push(nGrid);
            }
        }
    }
};

/**
 * Check the piece fits in the grid
 * @param piece
 * @returns {boolean}
 */
Grid.prototype.blockFits = function (piece) {
    return piece.getLeft() >= 0 && piece.getTop() >= 0 &&
        piece.getRight() <= this.getWidth() &&
        piece.getBottom() <= this.getHeight();
};

/**
 * Check the piece does not overlap on other blocks
 * @param array
 * @param piece
 * @param exclusionIndex
 * @returns {boolean}
 */
Grid.prototype.blocksOverlap = function (array, piece, exclusionIndex) {
    for (let i = 0; i < array.length; i++) {
        if (exclusionIndex === i) continue;
        if (piece.overlaps(array[i], piece)) return true;
    }
    return false
};

/**
 * Get the distance of the piece from the goal
 * @returns {number|*}
 */
Grid.prototype.getDistanceFromGoal = function () {
    return this.goalDistance;
};

/**
 * Set the distance of the piece from the goal
 * @param grid
 */
Grid.prototype.setDistanceFromGoal = function (grid) {
    let coords = grid.gridState[Object.keys(grid.gridState)[1]];
    this.goalDistance = (coords.x - this.goal[Object.keys(goal)[0]].x) + (coords.y - this.goal[Object.keys(goal)[0]].y);
};