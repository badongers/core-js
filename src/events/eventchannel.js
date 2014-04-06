
(function ($, scope) {
    var instance = null;
    var Signal = core.events.Signal;
    var __super__ = Signal.prototype;
    function EventChannel(opts) {
        if (opts && opts.__inheriting__) return;
        Signal.call(this, opts);
    }
    EventChannel.inherits(Signal);
    var proto = EventChannel.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    var o = {
        init:function () {
            if (instance == null) {
                instance = new EventChannel();
            }
            return instance;
        }
    };
    o.instance = o.init;
    core.registerNamespace("core.events.EventChannel", o);
})(core.selector, typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window);