function GameManager(size, InputManager, Actuator, StorageManager){
	this.size = size;
	this.inputManager = new InputManager;
	this.actuator = new Actuator;
	this.storageManager = new StorageManager;

	this.startTiles = 2;


	this.setup();
}

GameManager.prototype.setup = function() {
	this.grid = new Grid(this.size);
	this.score = 0;
	this.over = false;

	this.addStartTiles();


	this.actuate();
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

GameManager.prototype.actuate = function(){
	this.actuator.actuate(this.grid);
}