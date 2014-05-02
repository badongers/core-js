/*! core 2014-05-02 */
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

    function StoryBoard(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }

    StoryBoard.inherits(Core);

    core.dependency("TweenMax", "StoryBoard class has TweenMax as dependency. Please ensure that this is included in your assets.");
    core.dependency("jQuery", "StoryBoard class has jQuery as dependency. Please ensure that this is included in your assets.");

    var proto = StoryBoard.prototype;
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


    };
    proto.updateAcceleration = function(evt){
        //console.log(evt);
        //untested
    };
    proto.initialize = function(){
        this.elements = this.findAll("[core-story]");
        CoreWindow.instance().on("window.scroll", this._("update"), this);
        CoreWindow.instance().on("window.device.motion", this._("updateAcceleration"), this);
        this.update();
    };
    var instance;
    var o = {
        init:function (opts) {
            if (instance == null) {
                instance = new StoryBoard(opts);
            }
            return instance;
        }
    };
    o.instance = o.init;

    core.registerNamespace("StoryBoard", o);

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
(function () {
    var Core = core.Core,
        __super__ = Core.prototype;
    function LocalStorage(opts) {
        if (opts && opts.__inheriting__) return;
        __super__.constructor.call(this, opts);

    }
    LocalStorage.inherits(Core);
    var proto = LocalStorage.prototype;
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.construct = function(opts){
        __super__.construct.call(this, opts);
        this.hasLocalStorage = "localStorage" in window;
        this.hasSessionStorage = "sessionStorage" in window;
        this.hasSQL = "openDatabase" in window;
    };
    proto.storeLocal = function(key, value){
        if(this.hasLocalStorage){
            localStorage[key] = value;
        }

    };
    proto.retrieveLocal = function(key){
        if(this.hasLocalStorage){
            return localStorage[key];
        }
        return null;
    };
    proto.storeSession = function(key, value){
        if(this.hasSessionStorage){
            sessionStorage[key] = value;
        }
    };
    proto.retrieveSession = function(key){
        if(this.hasSessionStorage){
            return sessionStorage[key];
        }
    };
    proto.createTable = function(tablename, struct){
        if(this.hasSQL){
            if(typeof this.sqlDB !== 'undefined'){
                this.sqlDB.transaction((function(sql){
                    sql.executeSql("CREATE TABLE IF NOT EXISTS " + tablename + "("+struct+")");
                }).bind(this));
            }
        }
    };

    proto.updateSql = proto.insertSql = function(query){
        this.sqlDB.transaction((function(sql){
            sql.executeSql(query);
        }));
    };
    proto.retrieveSql = function(query, callback){
        this.sqlDB.transaction((function(sql){
            sql.executeSql(query, [], callback);
        }))
    };
    proto.configureSQL = function(dbname, version, desc, size){
        if(this.hasSQL){
            this.sqlDB = openDatabase(dbname, version, desc, size);
        }
    };
    var instance = null;
    var o = {
        init:function () {
            if (instance == null) {
                instance = new LocalStorage();
            }
            return instance;
        }
    };
    o.instance = o.init;

    core.registerNamespace("core.LocalStorage", o);

})();
(function ($) {
    var Module = core.wirings.Module,
        __super__ = Module.prototype;
    function OfflineModule(opts) {
        if (opts && opts.__inheriting__) return;
        __super__.constructor.call(this, opts);

    }
    OfflineModule.inherits(Module);
    var proto = OfflineModule.prototype;
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
        clearInterval(this.cacheStatusTimer);
    };
    proto.construct = function(opts){
        __super__.construct.call(this, opts);
        prepare.call(this);
    };
    proto.initialized = function(opts){
        console.warn("OfflineModule subclass requires initialized method.");
    };
    proto.onApplicationCacheStatus = function(evt){

        switch(evt.type){
            case "error":
                if(this.currentOnlineStatus !== false){
                    this.currentOnlineStatus = false;
                    this.onlineStatus(false);
                }

                break;
            case "cached":
                if(this.currentOnlineStatus !== true){
                    this.currentOnlineStatus = true;
                    this.onlineStatus(true);
                }
                this.cacheStatus("cached");
                break;
            case "checking":
                break;
            case "downloading":
                break;
            case "noupdate":

                if(this.currentOnlineStatus !== true){
                    this.currentOnlineStatus = true;
                    this.onlineStatus(true);
                }
                break;
            case "obsolete":
                if(this.currentOnlineStatus !== true){
                    this.currentOnlineStatus = true;
                    this.onlineStatus(true);
                }
                this.cacheStatus("updateAvailable");
                break;
            case "progress":
                break;
            case "ready":
                if(this.currentOnlineStatus !== true){
                    this.currentOnlineStatus = true;
                    this.onlineStatus(true);
                }
                break;
            default:
                if(this.currentOnlineStatus !== true){
                    this.currentOnlineStatus = true;
                    this.onlineStatus(true);
                }
                break;
        }
    };
    proto.cacheStatus = function(status){

    };
    proto.onlineStatus = function(isonline){

    };
    var prepare = function(){
        this.currentOnlineStatus = -1;
        if("applicationCache" in window){
            var ac = window.applicationCache;
            ac.addEventListener("error", this._("onApplicationCacheStatus"));
            ac.addEventListener("cached", this._("onApplicationCacheStatus"));
            ac.addEventListener("checking", this._("onApplicationCacheStatus"));
            ac.addEventListener("downloading", this._("onApplicationCacheStatus"));
            ac.addEventListener("noupdate", this._("onApplicationCacheStatus"));
            ac.addEventListener("obsolete", this._("onApplicationCacheStatus"));
            ac.addEventListener("progress", this._("onApplicationCacheStatus"));
            ac.addEventListener("ready", this._("onApplicationCacheStatus"));
            this.cacheStatusTimer = setInterval(function(){
                window.applicationCache.update();
            }, 3000);
        }
        this.localStorage = core.LocalStorage.init();

    };
    core.registerNamespace("core.wirings.OfflineModule", OfflineModule);


})(core.selector);