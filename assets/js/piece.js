function Piece(x, y, shape) {
    this.x = x;
    this.y = y;
    this.shape = shape;
}

Piece.prototype.shift = function (piece, x, y) {
    let p = Object.assign({}, piece);
    p.x += x;
    p.y += y;
    return p;
};

Piece.prototype.getBottom = () => {
    return this.getX() + this.getHeight();
};

Piece.prototype.getLeft = () => {
    return this.getX();
};

Piece.prototype.getRight = () => {
    return this.getX() + this.getWidth();
};

Piece.prototype.getTop = () => {
    return this.getY();
};

Piece.prototype.getHeight = () => {
    return this.shape.height;
};

Piece.prototype.getWidth = () => {
    return this.shape.width;
};

Piece.prototype.getX = () => {
    return this.x;
};

Piece.prototype.getY = () => {
    return this.y;
};

Piece.prototype.clonePiece = () => {
    return this;
};

