(function($) {
  core.registerModule({
    inherits: "core.Module",
    classname: "don.LoadedModule",
    module: function() {
      this.initialized = function(opts) {
        console.log('Ending')
        console.timeEnd("Setup");
      };
    }
  });
})(core.selector);
