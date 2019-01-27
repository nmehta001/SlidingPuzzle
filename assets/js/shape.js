function Shape(height, width) {
    this.height = height;
    this.width = width;
}

Shape.prototype.getHeight = () => {
    return this.height;
};

Shape.prototype.width = () => {
    return this.width;
};