(function($) {

  core.registerModule({
    inherits: "core.Core",
    classname: "app.Services",
    singleton: true,
    module: ["core.XHR", function(xhr) {
      this.initialized = function(opts) {}
    }]
  });
})(core.selector);
