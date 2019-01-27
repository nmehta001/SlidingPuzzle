const goal = {x: 1, y: 4};

function Solver(grid) {
    this.pending = buckets.Stack();
    this.temp = [];
    this.seen = new Set();
    this.answer = null;
    this.currentDepth = 0;
    this.movesChecked = 0;
    this.duplicateMoves = 0;

    this.addStateToPending(grid)
}

Solver.prototype.addStateToPending = function (grid) {
    if (!this.seen.has(grid)) {
        this.pending.add(grid);
    } else {
        this.duplicateMoves++;
    }
};

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
        let stepsRemaining = 50;

        while (stepsRemaining-- > 0) {
            let g = this.pending.pop();
            this.movesChecked++;

            let positionFromGoal = g.distanceFromGoal();

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

        }
    } while ((new Date().getMilliseconds() - start) < 100);
};