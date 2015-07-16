(function() {
  core.registerModule({
    inherits: "don.TestEventEmitterModule",
    classname: "don.SubTestModule",
    module: [function() {
      this.initialized = function(opts) {
        //this.$el.mouseenter(this.defaultClickHandler);
      };
      //function mainClicked
      // this.defaultClickHandler = function(evt) {
      //   console.log('SubTestModule was hovered');
      // }
    }]
  });
})();
