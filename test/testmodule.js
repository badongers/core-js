(function ($) {
    var Module = core.delegates.Module,
        __super__ = Module.prototype,
        EventBroadcaster = core.events.EventBroadcaster;

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

        setInterval((function(){
            this.trigger("test.event", {somevalue:"value"})
            EventBroadcaster.instance().trigger("global.test.event", {somevalue:"value"});
        }).bind(this), 500)
    };

    core.registerNamespace("TestModule", TestModule);


})(core.selector);