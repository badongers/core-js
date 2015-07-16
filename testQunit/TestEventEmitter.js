(function() {
  core.registerModule({
    inherits: "don.TestModule",
    classname: "don.TestEventEmitterModule",
    module: [function() {
      this.initialized = function(opts) {
        this.$el.click((function(ref) {
          return function() {
            console.log('TestEventEmitterModule clicked');
            core.EventBroadcaster.trigger("customBehaviour");
          };
        }(this)));
      };
      //function mainClicked
    }]
  });
})();
