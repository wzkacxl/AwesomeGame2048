function Grid(size, previousState) {
	this.size = size;
	//this.cells = previousState ? 
	this.empty();
};

Grid.prototype.empty = function() {
	var cells = [];
	for (var i=0;i<this.size;i++){
		cells[i] = [];
		for (var j=0;j<this.size;j++){
			cells[i][j] = null;
		}
	}
	return cells;
};

Grid.prototype.cellsAvailable = function() {
	return !!this.availableCells().length;
};

Grid.prototype.availableCells = function() {
	var cells = [];

	this.eachCell(function(i, j, tile){
		if (!tile){
			cells.push({x: x, y: y});
		}
	});
	return cells;
};

Grid.prototype.eachCell = function(callback) {
	for (var i=0;i<this.size;i++){
		for (var j=0;j<this.size;j++){
			callback(i, j, this.cells[i][j]);
		}
	}
};

Grid.prototype.randomAvailableCell = function() {
	var cells = this.availableCells();

	if (cells.length){
		return cells[Math.floor(Math.random() * cells.length)];
	}
}

Grid.prototype.insertTile(tile){
	this.cells[tile.x][tile.y] = tile;
}