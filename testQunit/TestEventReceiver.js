(function() {
  core.registerModule({
    inherits: "don.TestModule",
    classname: "don.TestEventReceiverModule",
    module: [function() {
      this.initialized = function(opts) {
        console.log(this);
        core.EventBroadcaster.on("customBehaviour", "removeMe", this);
      };
      this.removeMe = function() {
        console.log(this, 'TestEventReceiverModule behaviour called');
        this.$el.remove();
      };
      this.defaultClickHandler = function() {
        console.log('TestEventReceiverModule default Handler was Clicked');
      };
      //function mainClicked
    }]
  });
})();
