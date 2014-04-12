/*! core 2014-04-13 */

(function () {
    var Core = core.Core,
        __super__ = Core.prototype;

    function CoreParallax(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    CoreParallax.inherits(Core);
    var proto = CoreParallax.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        this.supportTouch = opts.supportTouch || false;
        this.initialize();


    };
    proto.dispose = function () {
        //clear

        __super__.dispose.call(this);
    };
    proto.update = function(){
        var len = this.elements.length;
        while(len--){
            var offset = Number(this.elements[len].getAttribute("scroll-offset")) || .1;
            var invert = Number(this.elements[len].getAttribute("scroll-invert")) || 0;
            var top = core.rect(this.elements[len]).top;
            var value = top*offset;
            if(invert){
                value *= -1;
            }
            this.elements[len].style.backgroundPosition = "center "+value+"px";
        }
        this.tick = false;
    };
    proto.onWindowScroll = function(){
        if(!this.supportTouch && core.browser.touch) return;
        if(!this.tick){
            requestAnimationFrame(this._("update"));
            this.tick = true;
        }
    };
    proto.initialize = function(){
        this.elements = this.findAll("[parallax]");
        window.addEventListener("scroll", this._("onWindowScroll"));
        requestAnimationFrame(this._("update"));
        this.tick = true;
    }
    var instance;
    var o = {
        init:function (opts) {
            if (instance == null) {
                instance = new CoreParallax(opts);
            }
            return instance;
        }
    };
    o.instance = o.init;

    core.registerNamespace("CoreParallax", o);

})();