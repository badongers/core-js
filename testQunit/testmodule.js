(function() {
  core.registerModule({
    inherits: "core.Module",
    classname: "don.TestModule",
    module: ["core.EventBroadcaster", function(evt) {
      this.initialized = function(opts) {
        console.log(this)
        this.$el.click(this.defaultClickHandler.bind(this));
      };

      this.defaultClickHandler = function() {
        console.log('TestModule default Handler was Clicked');
      };
    }]
  });
})();
