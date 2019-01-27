let shapes = {
    A: {height: 2, width: 1},
    B: {height: 2, width: 2},
    C: {height: 2, width: 1},
    D: {height: 2, width: 1},
    E: {height: 1, width: 2},
    F: {height: 2, width: 1},
    G: {height: 1, width: 1},
    H: {height: 1, width: 1},
    I: {height: 1, width: 1},
    J: {height: 1, width: 1}
};

/**
 * Map the shape values back to the piece
 * @param key
 * @constructor
 */
function Shape(key) {
    this.height = shapes[key].height;
    this.width = shapes[key].width;
}

Shape.prototype.getHeight = function () {
    return this.height;
};

Shape.prototype.getWidth = function () {
    return this.width;
};