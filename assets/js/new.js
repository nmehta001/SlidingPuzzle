const MOVESET_X = [0, 1, 0, -1, 0, 2, 0, -2];
const MOVESET_Y = [1, 0, -1, 0, 2, 0, -2, 0];

const pieces = [
    {dims: {height: 2, width: 1}, letter: "A"},
    {dims: {height: 2, width: 2}, letter: "B"},
    {dims: {height: 2, width: 1}, letter: "C"},
    {dims: {height: 2, width: 1}, letter: "D"},
    {dims: {height: 1, width: 2}, letter: "E"},
    {dims: {height: 2, width: 1}, letter: "F"},
    {dims: {height: 1, width: 1}, letter: "G"},
    {dims: {height: 1, width: 1}, letter: "H"},
    {dims: {height: 1, width: 1}, letter: "I"},
    {dims: {height: 1, width: 1}, letter: "J"},
];

let targetPiece;

const coords = [
    {x: 0, y: 0}, {x: 1, y: 0}, {x: 3, y: 0}, {x: 0, y: 2},
    {x: 1, y: 2}, {x: 3, y: 2}, {x: 1, y: 3}, {x: 2, y: 3},
    {x: 0, y: 4}, {x: 3, y: 4}
];

function setTargetPiece(letter) {
    pieces.forEach(piece => {
        if (piece.letter === letter) {
            targetPiece = piece
        }
    });
}

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
            };

            this.gridItems.push(item);
            i++;
        }
    }

    console.log(this.gridItems)

    return this.grid;
}

Grid.prototype.setIsCorner = function (cols, c, rows, r) {
    return (cols/(c+1) === cols || cols/(c+1) === 1) && (rows/(r+1) === rows || rows/(r+1) === 1);
};

function GridState() {
    this.permutations = [];
    this.initalState = [];
    this.emptyCells = [];
    this.seen = buckets.Stack();
    this.solutions = buckets.Stack();
}

GridState.prototype.setInitialState = function () {
    pieces.forEach((piece, i) => {
        let item = [piece, coords[i]];
        this.initalState.push(item);
    });
};

GridState.prototype.getPermutations = function () {
    let lastState = this;

    pieces.forEach((piece, i) => {
        for (let move = 0; move < 8; move++) {
            let shifted = new GridState();

            if (this.areStatesSimilar(lastState, shifted)) {
                this.seen.add(shifted);
            }
        }
    });

    return this.permutations;
};

GridState.prototype.trackEmptyCells = function (gridState) {

};

GridState.prototype.areStatesSimilar = function (stateA, stateB) {
    return stateA !== stateB;
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

let init = () => {
    const grid = new Grid(5, 4);

    document.body.appendChild(grid);

    let gridState = new GridState();

    console.log(gridState);

    gridState.setInitialState();

    const letter = "B";

    setTargetPiece(letter);
};

window.addEventListener("load", () => {
    init();
});