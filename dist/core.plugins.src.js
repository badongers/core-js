/*! core 2014-04-28 */
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

    core.registerNamespace("CoreWindow", o);

})();

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
    proto.updateAcceleration = function(evt){
        //console.log(evt);
        //untested
    };
    proto.initialize = function(){
        this.elements = this.findAll("[core-parallax]");
        CoreWindow.instance().on("window.scroll", this._("update"), this);
        CoreWindow.instance().on("window.device.motion", this._("updateAcceleration"), this);
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

    core.registerNamespace("CoreParallax", o);

})();

(function () {
    var Core = core.Core,
        __super__ = Core.prototype;

    function CoreSnap(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    CoreSnap.inherits(Core);
    var proto = CoreSnap.prototype;
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
    proto.update = function(evt){
        var len = this.elements.length;
        while(len--){
            var top = core.rect(this.elements[len]).top;
            var offset = Number(this.elements[len].getAttribute("core-snap-offset")) || 0;
            if(!this.elements[len]["origTop"]){
                this.elements[len]["origTop"] = top;
            }
            var style = this.elements[len].getAttribute("core-snap-style");
            if(evt.scrollTop+offset >= this.elements[len]["origTop"]){
                this.elements[len].style.position = "fixed";
                this.elements[len].style.top = offset+"px";
                if(style){
                    if(this.elements[len].className.indexOf(style) == -1){
                        toggleClass(this.elements[len], this.elements[len].getAttribute("core-snap-style"));
                        this.elements[len].snapped = true;
                    }
                }
            }else{
                this.elements[len].style.position = "relative";
                if(style){
                    if(this.elements[len].className.indexOf(style) != -1){
                        toggleClass(this.elements[len], this.elements[len].getAttribute("core-snap-style"));
                        this.elements[len].style.top = "";
                        this.elements[len].snapped = false;
                    }

                }
            }

        }
    };

    proto.initialize = function(){
        this.elements = this.findAll("[core-snap]");
        CoreWindow.instance().on("window.scroll", this._("update"), this);
    };
    function toggleClass(element, className){
        if (!element || !className){
            return;
        }

        var classString = element.className, nameIndex = classString.indexOf(className);
        if (nameIndex == -1) {
            classString += ' ' + className;
        }
        else {
            classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);
        }
        element.className = classString;
    }
    var instance;
    var o = {
        init:function (opts) {
            if (instance == null) {
                instance = new CoreSnap(opts);
            }
            return instance;
        }
    };
    o.instance = o.init;

    core.registerNamespace("CoreSnap", o);

})();