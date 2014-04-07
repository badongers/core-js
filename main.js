(function ($) {
    var Module = core.delegates.Module,
        __super__ = Module.prototype,
        EventChannel = core.events.EventChannel;

    function Main(opts) {
        if (opts && opts.__inheriting__) return;
        Module.call(this, opts);
    }
    Main.inherits(Module);
    var proto = Main.prototype;

    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.construct = function(opts){
        __super__.construct.call(this, opts);
    };

    proto.initialized = function(opts){
        console.log("created test", this.el);
    };

    core.registerNamespace("window.Main");
    window.Main = Main;

})(core.selector);