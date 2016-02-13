window.requestAnimationFrame(function () {
  //new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  new GameManager(4, InputManager, HTMLActuator, HTMLActuator);
});
