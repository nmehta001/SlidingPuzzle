function Piece(x, y, shape) {
    this.x = x;
    this.y = y;
    this.shape = shape;
}

Piece.prototype.getBottom = function () {
    return this.getX() + this.getHeight();
};

Piece.prototype.getLeft = function () {
    return this.getX();
};

Piece.prototype.getRight = function () {
    return this.getX() + this.getWidth();
};

Piece.prototype.getTop = function () {
    return this.getY();
};

Piece.prototype.getHeight = function () {
    return this.shape.height;
};

Piece.prototype.getWidth = function () {
    return this.shape.width;
};

Piece.prototype.getX = function () {
    return this.x;
};

Piece.prototype.getY = function () {
    return this.y;
};

Piece.prototype.clonePiece = function () {
    return new Piece(this);
};

Piece.prototype.cloneShifted = function (x, y) {
    let piece = Object.assign({}, this);
    piece.x += x;
    piece.y += y;
    return piece;
};

Piece.prototype.overlaps = function (occupying, moved) {
    if (occupying.getRight() <= moved.getLeft() || occupying.getBottom() <= moved.getLeft()) return false;
    if (moved.getRight() <= occupying.getLeft() || moved.getBottom() <= occupying.getLeft()) return false;

    let overlapLeft = Math.max(occupying.getLeft(), moved.getLeft());
    let overlapRight = Math.min(occupying.getRight(), moved.getRight());
    let overlapTop = Math.max(occupying.getTop(), moved.getTop());
    let overlapBottom = Math.min(occupying.getBottom(), moved.getBottom());

    for (let y = overlapTop; y < overlapBottom; y++) {
        for (let x = overlapLeft; x < overlapRight; x++) {
            if (occupying.hasCellAt(x, y) && moved.hasCellAt(x, y)) {
                return true;
            }
        }
    }
    return false;
};

Piece.prototype.hasCellAt = function (x, y) {
    return (this.getLeft() > x || this.getRight() <= x || this.getTop() > y || this.getBottom() <= y);
};