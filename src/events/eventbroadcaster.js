
(function () {
    var instance = null;
    var EventDispatcher = core.events.EventDispatcher;
    var __super__ = EventDispatcher.prototype;
    function EventBroadcaster(opts) {
        if (opts && opts.__inheriting__) return;
        EventDispatcher.call(this, opts);
    }
    EventBroadcaster.inherits(EventDispatcher);
    var proto = EventBroadcaster.prototype;
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
                instance = new EventBroadcaster();
            }
            return instance;
        }
    };
    o.instance = o.init;
    core.registerNamespace("core.events.EventBroadcaster", o);
})();