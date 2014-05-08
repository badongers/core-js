
(function () {
    var Core = core.Core,
        __super__ = Core.prototype;
    /**
     * The main class that implements broadcaster pattern. Ideally subclassed by objects that will perform broadcasting functions.
     *
     * @class CoreParallax
     * @module addons
     * @namespace core.addons.uiscroll
     * @extends core.Core
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core derived class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */
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
    proto.updateAcceleration = function(evt){
        //console.log(evt);
        //untested
    };
    proto.initialize = function(){
        this.elements = this.findAll("[core-parallax]");
        core.addons.CoreWindow.instance().on("window.scroll", this._("update"), this);
        core.addons.CoreWindow.instance().on("window.device.motion", this._("updateAcceleration"), this);
        this.tick = true;
        this.update();
    };
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

    core.registerNamespace("core.addons.uiscroll.CoreParallax", o);

})();