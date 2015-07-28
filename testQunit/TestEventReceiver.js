(function() {
  core.registerModule({
    inherits: "don.TestModule",
    classname: "don.TestEventReceiverModule",
    module: [function() {
      this.initialized = function(opts) {
        console.log(this);

        this.$super.initialized.call(this, opts);
        core.EventBroadcaster.on("customBehaviour", "removeMe", this);
      };
      this.removeMe = function() {
        console.log(this, 'TestEventReceiverModule behaviour called');
        this.$el.remove();
      };
      this.defaultClickHandler = function(evt) {
        this.$super.defaultClickHandler.call(this, evt);

      }

      //function mainClicked
    }]
  });
})();
