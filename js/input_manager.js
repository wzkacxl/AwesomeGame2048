function InputManager(){
	this.events = [];

	this.listen();
}

InputManager.prototype.on = function(event, callback){
	if (!this.events[event]){
		this.events[event] = [];
	}
	this.events[event].push(callback);
}

InputManager.prototype.emit = function(event, data){
	var callbacks  = this.events[event];
	if (callbacks){
		callbacks.forEach(function(callback){
			callback(data);
		});
	}
}

InputManager.prototype.listen = function(){
  	var self = this;

	var map = {
		38: 0, // Up
	    39: 1, // Right
	    40: 2, // Down
	    37: 3, // Left
	    87: 0, // W
	    68: 1, // D
	    83: 2, // S
	    65: 3  // A
	  };

	document.addEventListener("keydown",function(event){
		var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
        var mapped = map[event.which];
        if(!modifiers && event.which != undefined){
        	event.preventDefault();
        	self.emit("move", mapped);
        }

        //R
        if (!modifiers && event.which == 82)
        {
        	self.restart.call(self, event);
        }
	});

	this.bindButtonPress(".btn-restart", this.restart);
	this.bindButtonPress(".retry-button", this.restart);
	this.bindButtonPress(".btn-restart", this.restart);
}

InputManager.prototype.restart = function(event){
	event.preventDefault();
	this.emit("restart");
}

InputManager.prototype.bindButtonPress = function(selector, fn){
	var btn = document.querySelector(selector);
	btn.addEventListener("click",fn.bind(this));

}