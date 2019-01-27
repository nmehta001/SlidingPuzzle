const MOVE_MATRIX_X = [0, 1, 0, -1, 0, 2, 0, -2];
const MOVE_MATRIX_Y = [1, 0, -1, 0, 2, 0, -2, 0];

function getMoveX(i) {
    return MOVE_MATRIX_X[i];
}

function getMoveY(i) {
    return MOVE_MATRIX_Y[i];
}