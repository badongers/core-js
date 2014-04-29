(function ($) {
    var Module = core.wirings.Module,
        __super__ = Module.prototype;
    function Main(opts) {
        if (opts && opts.__inheriting__) return;

        __super__.constructor.call(this, opts);

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
        //console.log("created test", this.el);

        CoreParallax.init(); //test parallax scrolling
        CoreSnap.init();

        //this.tmodule.once("test.event", this.onTestEvent, this);
        //core.events.EventBroadcaster.instance().on("global.test.event", this.onTestEvent, this)
    };
    proto.onTestEvent = function(evt){
        console.log("event test");

    };

    core.registerNamespace("Main", Main);


})(core.selector);