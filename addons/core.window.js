/**
 * The base module for the Core JS framework.
 * It provides helper methods for implementing OOP methodologies and basic utilities such as browser detection.
 *
 * @module addons
 */
(function () {
    var EventDispatcher = core.events.EventDispatcher,
        __super__ = EventDispatcher.prototype;
    /**
     * The main class that implements broadcaster pattern. Ideally subclassed by objects that will perform broadcasting functions.
     *
     * @class CoreWindow
     * @extends core.Core
     * @namespace core.addons
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core derived class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */
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
        var t = "mobile";
        if(w >= 992 && w < 1200){
            t = "medium";
        }else if(w < 992 && w >= 768){
            t = "small";
        }else if(w >= 1200){
            t = "large";
        }
        this.trigger("window.resize", {width:w, height:h, type:t});
        this.tickResize = false;
    };
    proto.dispatchMotion = function(){
        var evt = this.motionEvent;
        var accelX = evt.accelerationIncludingGravity.x;
        var accelY = evt.accelerationIncludingGravity.y;
        var accelZ = evt.accelerationIncludingGravity.z;
        var rotationAlpha = evt.rotationRate.alpha;
        var rotationGamma = evt.rotationRate.gamma;
        var rotationBeta = evt.rotationRate.beta;
        this.trigger("window.device.motion", {accelX:accelX, accelY:accelY, accelZ:accelZ, rotationAlpha:rotationAlpha, rotationBeta:rotationBeta, rotationGamma:rotationGamma});
        this.tickMotion = false;
        this.motionEvent = null;

    };
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
    proto.onDeviceMotion = function(evt){
        this.motionEvent = evt;
        if(!this.tickMotion){
            this.tickMotion = true;
            requestAnimationFrame(this._("dispatchMotion"));
        }
    };
    proto.initialize = function(){
        this.scrollTop = 0;
        this.scrollLeft = 0;
        window.addEventListener("scroll", this._("onWindowScroll"));
        window.addEventListener("resize", this._("onWindowResize"));
        if(core.browser.touch){
            window.addEventListener("devicemotion", this._("onDeviceMotion"));
        }

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

    core.registerNamespace("core.addons.CoreWindow", o);

})();