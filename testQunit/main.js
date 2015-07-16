(function() {

  core.registerModule({
    inherits: "core.Module",
    classname: "Main",
    module: ["core.WindowEvents", "app.Services", function(wevents, service) {

      this.initialized = function(opts) {
        console.log("using main", this);

        wevents.on("window.scroll", "onWindowScroll", this);
        wevents.on("window.resize", "onWindowResize", this);
        wevents.on("window.device.motion", "onDeviceMotion", this);
        this.properties.header.classList.toggle("hello");
      };
      this.removeMe = function() {
        console.log('Main was clicked');
      };
      this.onWindowScroll = function(evt) {
        console.log(evt);
      };
      this.onWindowResize = function(evt) {
        console.log("resizing window", evt);
      };
      this.onDeviceMotion = function(evt) {
        console.log("device motion", evt);
      };
    }]
  });

})();
