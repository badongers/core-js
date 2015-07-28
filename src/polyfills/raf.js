(function(scope) {
  // Overwrite requestAnimationFrame so it works across browsers
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !scope.requestAnimationFrame; ++x) {
    scope.requestAnimationFrame = scope[vendors[x] + 'RequestAnimationFrame'];
    scope.cancelAnimationFrame =
      scope[vendors[x] + 'CancelAnimationFrame'] || scope[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!scope.requestAnimationFrame)
    scope.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = scope.setTimeout(function() {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!scope.cancelAnimationFrame)
    scope.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };

}(typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window));
