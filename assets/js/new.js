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

const coords = [
    {x: 0, y: 0}, {x: 1, y: 0}, {x: 3, y: 0}, {x: 0, y: 2},
    {x: 1, y: 2}, {x: 3, y: 2}, {x: 1, y: 3}, {x: 2, y: 3},
    {x: 0, y: 4}, {x: 3, y: 4}
];

function Grid(rows, cols) {
    const grid = document.createElement("table");
    grid.className = "grid";

    let i = 0;
    for (let r = 0; r < rows; r++) {
        let tr = grid.appendChild(document.createElement("tr"));
        for (let c = 0; c < cols; c++) {
            i++;
            tr.appendChild(document.createElement("td"));
        }
    }
    return grid;
}


function GridState() {
    this.permutations = [];
    this.initalState = [];
    this.seen = buckets.Stack();
    this.solutions = buckets.Stack();
}

GridState.prototype.setInitialState = function () {
    pieces.forEach((piece, i) => {
        let item = [piece, coords[i]];
        this.initalState.push(item);
    });

    console.log(this.initalState)
};

GridState.prototype.getPermutations = function () {
    return this.permutations;
};

GridState.prototype.compareStates = function (stateA, stateB) {
    return stateA === stateB;
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
    const grid = new Grid(5, 4, function (el, row, col) {
        console.log("You clicked on element:", el);
        console.log("You clicked on row:", row);
        console.log("You clicked on col:", col);

        el.className = "clicked";
    });

    document.body.appendChild(grid);

    let gridState = new GridState();

    gridState.setInitialState(grid);
};

window.addEventListener("load", () => {
    init();
});