function Grid(height, width, gridState, goal) {
    this.height = height;
    this.width = width;
    this.gridState = gridState;
    this.goal = goal;
    this.goalDistance = -1;

    console.log(this)
}

Grid.prototype.getWidth = function () {
    return this.width;
};

Grid.prototype.getHeight = function () {
    return this.height;
};

Grid.prototype.getGridStateLength = function () {
    return Object.keys(this.gridState).length;
};

Grid.prototype.getAllMoves = function (dest) {
    for (let i = 0; i < this.getGridStateLength(); i++) {
        let key = Object.keys(this.gridState)[i];
        let moving = this.gridState[key];

        for (let move = 0; move < 8; move++) {
            let moved = moving.cloneShifted(getMoveX(move), getMoveY(move));

            if (this.blockFits(moved) && !this.blocksOverlap(this.gridState, moved, i)) {
                let state = [];
                for (let j = 0; j < this.getGridStateLength(); j++) {
                    if (i === j) {
                        state.push(moved)
                    } else {
                        state.push(this.gridState[j].clonePiece())
                    }
                }

                let nGrid = new Grid(this.height, this.width, state, this.goal);

                dest.add(nGrid);
            }
        }
    }
};

Grid.prototype.blockFits = function (piece) {
    return piece.getLeft() >= 0 && piece.getTop() >= 0 && piece.getRight() <= this.getWidth() && piece.getBottom() <= this.getHeight();
};

Grid.prototype.blocksOverlap = function (array, piece, exclusionIndex) {
    for (let i = 0; i < array.length; i++) {
        if (exclusionIndex === i) continue;
        if (piece.overlaps(array[i], piece)) return true;
    }
    return false
};

Grid.prototype.getDistanceFromGoal = function () {
    return this.goalDistance;
};

Grid.prototype.setDistanceFromGoal = function (grid) {
    console.log(grid)
};