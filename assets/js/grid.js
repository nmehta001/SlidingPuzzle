function Grid(height, width, gridState, goal) {
    this.height = height;
    this.width = width;
    this.gridState = gridState;
    this.goal = goal;
}

Grid.prototype.getWidth = function () {
    return this.width;
};

Grid.prototype.getHeight = function () {
    return this.height;
};

Grid.prototype.getAllMoves = function (dest) {
    for (let i = 0; i < this.gridState.size; i++){
        let moving = this.gridState[i];

        for(let move = 0;move<8;move++){
            let moved = moving
        }
    }
};