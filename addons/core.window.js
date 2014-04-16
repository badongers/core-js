/**
 * Created by donaldmartinez on 16/04/2014.
 */

(function () {
    var EventDispatcher = core.events.EventDispatcher,
        __super__ = EventDispatcher.prototype;

    function CoreWindow(opts) {
        if (opts && opts.__inheriting__) return;
        EventDispatcher.call(this, opts);
    }
    CoreWindow.inherits(EventDispatcher);
    var proto = CoreWindow.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        this.initialize();
    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.dispatchScroll = function(){
        var scrollLeft = this.scrollLeft =  (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        var scrollTop = this.scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        this.trigger("window.scroll", {scrollTop:scrollTop, scrollLeft:scrollLeft});
        this.tick = false;
    };
    proto.dispatchResize = function(){

        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.trigger("window.resize", {width:h, height:h});
        this.tickResize = false;
    }
    proto.onWindowScroll = function(){
        if(!this.tick){
            this.tick = true;
            requestAnimationFrame(this._("dispatchScroll"));
        }
    };
    proto.onWindowResize = function(){
        if(!this.tickResize){
            this.tickResize = true;
            requestAnimationFrame(this._("dispatchResize"));
        }
    };
    proto.initialize = function(){
        this.scrollTop = 0;
        this.scrollLeft = 0;
        window.addEventListener("scroll", this._("onWindowScroll"));
        window.addEventListener("resize", this._("onWindowResize"));
    };
    var instance;
    var o = {
        init:function (opts) {
            if (instance == null) {
                instance = new CoreWindow(opts);
            }
            return instance;
        }
    };
    o.instance = o.init;

    core.registerNamespace("CoreWindow", o);

})();