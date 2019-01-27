const MOVE_MATRIX_X = [0, 1, 0, -1, 0, 2, 0, -2];
const MOVE_MATRIX_Y = [1, 0, -1, 0, 2, 0, -2, 0];

/**
 * Move across the x axis
 * @param i
 * @returns {number}
 */
function getMoveX(i) {
    return MOVE_MATRIX_X[i];
}

/**
 * Move across the y axis
 * @param i
 * @returns {number}
 */
function getMoveY(i) {
    return MOVE_MATRIX_Y[i];
}