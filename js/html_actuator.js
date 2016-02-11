function HTMLActuator() {
	this.tileContainer = document.querySelector(".tile-container");
	this.scoreContainer = document.querySelector(".score-container");
	this.bestContainer = document.querySelector(".best-container");
	this.messageContainer = document.querySelector(".message-container");

	this.score = 0;
}

HTMLActuator.prototype.actuate = function(grid){
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
    });
}

HTMLActuator.prototype.addTile = function(tile){
	var self = this;

	var wrapper = document.createElement("div");
	var inner = document.createElement("div");
	var position = { x: tile.x, y: tile.y };
	var positionClass = this.positionClass(position);

	//classList???
	var classes = ["tile", "tile-" + tile.value, positionClass];

	if (tile.value > 2048) classes.push("tile-super");

	this.applyClasses(wrapper, classes);

	inner.classList.add("tile-inner");
	inner.textContent = tile.value;

	//merged

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

HTMLActuator.prototype.clearContainer = function(container){
	while(container.firstChild){
		container.removeChild(container.firstChild);
	}
}
