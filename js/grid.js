function Grid(size, previousState) {
	this.size = size;
	this.cells = previousState ? this.fromState(previousState) : this.empty();
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

Grid.prototype.fromState = function(state) {
	var cells = [];
	for (var i=0;i<this.size;i++){
        cells[i] = [];
        for (var j=0;j<this.size;j++){
        	var tile = state[i][j];
            tile ? cells[i][j] = new Tile(tile.position, tile.value) : null;
        }
    }

    return cells;
}

Grid.prototype.cellAvailable = function(cell) {
	return !this.cellContent(cell);
}

Grid.prototype.cellsAvailable = function() {
	return !!this.availableCells().length;
};

Grid.prototype.availableCells = function() {
	var cells = [];

	this.eachCell(function(i, j, tile){
		if (!tile){
			cells.push({x: i, y: j});
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

Grid.prototype.insertTile = function(tile){
	this.cells[tile.x][tile.y] = tile;
}

Grid.prototype.removeTile = function(tile){
	this.cells[tile.x][tile.y] = null;
}

Grid.prototype.withinBounds = function(position){
	return (position.x >= 0 && position.x < this.size) && 
			(position.y >= 0 && position.y < this.size);
}

Grid.prototype.cellContent = function(cell) {
	if (this.withinBounds(cell)) {
		return this.cells[cell.x][cell.y];
	}
	return null;
}

Grid.prototype.serialize = function() {
	var cellState = [];

    for (var i=0;i<this.size;i++){
        cellState[i] = [];
        for (var j=0;j<this.size;j++){
          this.cells[i][j] ? cellState[i][j] = this.cells[i][j].serialize() : null;
        }
    }
    return {
        size: this.size,
        cells: cellState
    }   
}
