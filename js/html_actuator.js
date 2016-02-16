function HTMLActuator() {
	this.tileContainer    = document.querySelector(".tile-container");
	this.scoreContainer   = document.querySelector(".score-container");
	this.bestContainer    = document.querySelector(".best-container");
	this.messageContainer = document.querySelector(".game-message");

	this.score = 0;
}

HTMLActuator.prototype.actuate = function(grid, metadata){
	var self = this;

  	window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.over == true){
    	self.messageContainer.classList.add("game-over");
    }
    });
}

HTMLActuator.prototype.clearContainer = function(container){
	while(container.firstChild){
		container.removeChild(container.firstChild);
	}
}

HTMLActuator.prototype.updateScore = function(score) {
	this.scoreContainer.textContent = score;
}

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.clearMessage = function() {
	this.messageContainer.classList.remove("game-over");
}

HTMLActuator.prototype.addTile = function(tile){
	var self = this;

	var wrapper       = document.createElement("div");
	var inner 	 	  = document.createElement("div");
	var position      = tile.previousPosition || { x: tile.x, y: tile.y };
	var positionClass = this.positionClass(position);

	//classList???
	var classes = ["tile", "tile-" + tile.value, positionClass];

	if (tile.value > 2048) classes.push("tile-super");

	this.applyClasses(wrapper, classes);

	inner.classList.add("tile-inner");
	inner.textContent = tile.value;

	//merged
	if (tile.previousPosition) {
		window.requestAnimationFrame(function(){
			classes[2] = self.positionClass({x: tile.x, y: tile.y});
			self.applyClasses(wrapper, classes);
		});
	}else if(tile.mergedFrom) {
		classes.push("tile-merged");
		this.applyClasses(wrapper, classes);

		//合并的两个元素的运行过程
		tile.mergedFrom.forEach(function(merged){
			self.addTile(merged);
		});
	}else{
		classes.push("tile-new");
		this.applyClasses(wrapper, classes);
	}

	wrapper.appendChild(inner);

	this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.normalizePosition = function(position){
	return { x: position.x + 1, y: position.y + 1 };
}

HTMLActuator.prototype.positionClass = function(position){
	position = this.normalizePosition(position);
	return "tile-position-" + position.x + "-" + position.y;
}

HTMLActuator.prototype.applyClasses = function(elem, classes){
	elem.setAttribute("class", classes.join(" "));
}