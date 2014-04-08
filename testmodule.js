(function ($) {
    var Module = core.delegates.Module,
        __super__ = Module.prototype,
        EventChannel = core.events.EventChannel;

    function TestModule(opts) {
        if (opts && opts.__inheriting__) return;
        Module.call(this, opts);
    }
    TestModule.inherits(Module);
    var proto = TestModule.prototype;

    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.construct = function(opts){
        __super__.construct.call(this, opts);
    };

    proto.initialized = function(opts){
        //console.log("created test module", this.el);
    };

    core.registerNamespace("window.TestModule");
    window.TestModule = TestModule;

})(core.selector);