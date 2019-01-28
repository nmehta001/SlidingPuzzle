/**
 * Initialisation for Solver
 * @param grid
 * @constructor
 */
function Solver(grid) {
    this.pending = buckets.Stack();
    this.temp = [];
    this.seen = new Set();
    this.answer = null;
    this.movesChecked = 0;
    this.duplicateMoves = 0;

    this.addStateToPending(grid);
}

/**
 * If the grid has not be seen add it to seen and to pending
 * @param grid
 */
Solver.prototype.addStateToPending = function (grid) {
    if (!this.seen.has(grid)) {
        this.seen.add(grid);
        this.pending.add(grid);
    } else {
        this.duplicateMoves++;
    }
};

/**
 * getAllMoves and add state to pending if the newGrid returned is not a null
 * @param grid
 */
Solver.prototype.addChildrenToPending = function (grid) {
    grid.getAllMoves(this.temp);
    let numChildren = this.temp.length;
    for (let i = 0; i < numChildren; i++) {
        let newGrid = this.temp[i];
        if (newGrid != null) {
            this.addStateToPending(newGrid);
        }
    }
    this.temp = [];
};

Solver.prototype.run = function () {
    if (this.answer != null) {
        alert("SOLVED");
        return;
    }

    let start = new Date().getMilliseconds();

    do {
        let g = this.pending.pop();
        this.movesChecked++;

        let positionFromGoal = g.getDistanceFromGoal();

        if (positionFromGoal === 0) {
            this.answer = g;
            alert("SOLVED");
            return;
        }

        this.addChildrenToPending(g);

        if (this.pending.isEmpty()) {
            alert("FAILED");
            return;
        }
    } while ((new Date().getMilliseconds() - start) < 100);
};