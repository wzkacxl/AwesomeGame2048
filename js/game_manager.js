function GameManager(size, InputManager, Actuator, StorageManager){
	this.size = size;
	this.inputManager = new InputManager;
	this.actuator = new Actuator;
	this.storageManager = new StorageManager;

	this.startTiles = 2;

	this.inputManager.on("move",this.move.bind(this));
	this.inputManager.on("restart",this.restart.bind(this));

	this.setup();
}

GameManager.prototype.setup = function() {
	var previousState = this.storageManager.getGameState();

	if (previousState){
		this.grid = new Grid(previousState.grid.size,
							 previousState.grid.cells);
		this.score = previousState.score;
		this.over = previousState.over;

	}else{
		this.grid = new Grid(this.size);
		this.score = 0;
		this.over = false;
		this.addStartTiles();	
	}
	
	this.actuate();
}

GameManager.prototype.restart = function() {
	this.storageManager.clearGameState();
	this.actuator.clearMessage();
	this.setup();
}

GameManager.prototype.addStartTiles = function(){
	for (var i=0;i<this.startTiles;i++){
		this.addRandomTile();
	}
};

GameManager.prototype.addRandomTile = function(){
	if(this.grid.cellsAvailable()){
		var value = Math.random() < 0.9 ? 2 : 4;
		var tile = new Tile(this.grid.randomAvailableCell(), value);

		this.grid.insertTile(tile);
	}
};

GameManager.prototype.serialize = function () {
	return {
		grid: this.grid.serialize(),
		score: this.score
	}
}

GameManager.prototype.actuate = function(){
	if (this.storageManager.getBestScore() < this.score){
		this.storageManager.setBestScore(this.score);
	}
	if (this.over) {
		this.storageManager.clearGameState();
	} else {
		this.storageManager.setGameState(this.serialize());
	}

	this.actuator.actuate(this.grid, {score: this.score, 
									  over: this.over, 
									  bestScore: this.storageManager.getBestScore()});
}

GameManager.prototype.prepareTiles = function(){
	this.grid.eachCell(function(x, y, tile){
		if (tile) {
			tile.mergedFrom = null;
			tile.savePosition();
		}
	});
}

GameManager.prototype.moveTile = function(tile, cell) {
	this.grid.cells[tile.x][tile.y] = null;
	this.grid.cells[cell.x][cell.y] = tile;
	tile.updatePosition(cell);
}

GameManager.prototype.move = function(direction){
	var self = this;

	//if (this.over) return;

	var cell, tile;

	var vector = this.getVector(direction);
	var traversals = this.getTraversals(vector);
	moved = false;

	this.prepareTiles();

	traversals.x.forEach(function(x){
		traversals.y.forEach(function(y){
			cell = {x : x, y : y};
			tile = self.grid.cellContent(cell);

			if (tile) {
				var positions = self.findFarthestPosition(cell, vector);
				var next = self.grid.cellContent(positions.next);

				if (next && next.value == tile.value && !next.mergedFrom){
					var merged = new Tile(positions.next, tile.value * 2);
					merged.mergedFrom = [tile, next];

					self.grid.insertTile(merged);
					self.grid.removeTile(tile);

					tile.updatePosition(positions.next);

					self.score += merged.value;
				}else{
					self.moveTile(tile, positions.farthest);
				}

				if (!self.positionsEqual(cell, tile)){
					moved = true;
				}
			}
		});
	});

	if (moved) {
		this.addRandomTile();

		if (!this.moveAvailable()){
			this.over = true;
		}

		this.actuate();
	}
}

GameManager.prototype.moveAvailable = function(){
	return this.grid.cellsAvailable() || this.tileMatchAvailable();
}

GameManager.prototype.tileMatchAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.getVector = function(direction){
	var map = {
		0 : {x : 0, y : -1},
		1 : {x : 1, y : 0},
		2 : {x : 0, y : 1},
		3 : {x : -1, y : 0}
	}
	return map[direction];
}

GameManager.prototype.getTraversals = function(vector){
	var traversals = { x : [], y : [] };

	for (var i = 0; i < this.size; i++) {
		traversals.x.push(i);
		traversals.y.push(i);
	}

	if (vector.x == 1) traversals.x.reverse();
	if (vector.y == 1) traversals.y.reverse();

	return traversals;
}

GameManager.prototype.findFarthestPosition = function(cell, vector) {
	var previous;

	do {
		previous = cell;
		cell = {x : cell.x + vector.x, y : cell.y + vector.y};
	}while(this.grid.withinBounds(cell) &&
		   this.grid.cellAvailable(cell));

	return {
		farthest : previous,
		next : cell
	};
};

GameManager.prototype.positionsEqual = function(pos1, pos2) {
	return pos1.x == pos2.x && pos1.y == pos2.y;
}