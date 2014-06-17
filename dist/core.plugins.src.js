/*! core 2014-06-18 */
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
     * The main class that implements HTML5 Geolocation functions.
     *
     * @class CoreLocation
     * @extends core.events.EventDispatcher
     * @namespace core.addons
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core derived class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */
    function CoreLocation(opts) {
        if (opts && opts.__inheriting__) return;
        EventDispatcher.call(this, opts);
    }
    CoreLocation.inherits(EventDispatcher);
    var proto = CoreLocation.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        this.initialize();
    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.initialize = function(){
        if(typeof navigator.geolocation == "undefined"){
            return console.warn("Geolocation not available.")
        }
        navigator.geolocation.getCurrentPosition(this._("onLocationRetrieved"), this._("onErrorLocation"));
    };
    proto.onLocationRetrieved = function(position){
        this.current = position.coords;
        this.trigger("ready", {target:this, coords:position.coords});
    };
    proto.onErrorLocation = function(msg){
        this.trigger("error", {target:this, message:msg});
    };
    var calculateDistance = function(point1, point2){
        //haversine
        var lat2 = point2.latitude;
        var lon2 = point2.longitude;
        var lat1 = point1.latitude;
        var lon1 = point1.longitude;
        var R = 6372.795477598; // km
        var x1 = lat2-lat1;
        var dLat = x1 * Math.PI / 180;
        var x2 = lon2-lon1;
        var dLon = x2 * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };
    /**
     * Retrieves the distance from the last detected position. Returns distance result in km.
     *
     * @method getDistanceFromCurrentLocation
     * @param {Object} point An object containing latitude and longitude properties.
     * @param {Number} point.latitude The latitude of the value to calculate distance.
     * @param {Number} point.longitude The longitude of the value to calculate distance.
     *
     */
    proto.getDistanceFromCurrentLocation = function(point){
        return calculateDistance(this.current, point);
    };
    /**
     * Calculates the distance between 2 coordinates.
     *
     * @method getDistanceFromLocations
     * @param {Object} point1 An object containing latitude and longitude properties.
     * @param {Number} point1.latitude The latitude of the value to calculate distance.
     * @param {Number} point1.longitude The longitude of the value to calculate distance.
     * @param {Object} point2 An object containing latitude and longitude properties.
     * @param {Number} point2.latitude The latitude of the value to calculate distance.
     * @param {Number} point2.longitude The longitude of the value to calculate distance.
     *
     */
    proto.getDistanceFromLocations = function(point1, point2){
        return calculateDistance(point1, point2);
    };
    /**
     * Refreshes current location and last known location. Runs geolocation check again.
     *
     * @method update
     *
     */
    proto.update = function(){
        navigator.geolocation.getCurrentPosition(this._("onLocationRetrieved"), this._("onErrorLocation"));
    };
    var instance;
    var o = {
        init:function (opts) {
            if (instance == null) {
                instance = new CoreLocation(opts);
            }
            return instance;
        }
    };
    o.instance = o.init;

    core.registerNamespace("core.addons.location.CoreLocation", o);

})();

(function () {
    var Core = core.Core,
        __super__ = Core.prototype;

    function StoryBoard(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);

    }
    StoryBoard.inherits(Core);
    core.dependency("TweenMax", "StoryBoard class requires TweenMax. Please ensure that this is included in your assets.");
    core.dependency("jQuery", "StoryBoard class requires jQuery. Please ensure that this is included in your assets.");
    $ = jQuery;
    var proto = StoryBoard.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        this.supportTouch = opts.supportTouch || false;
        this.initialize(opts);

    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.update = function(){
        if(this.timeline){
            var offset = core.rect(this.heightOffset[0]);
            var pct = Math.abs(offset.top)/(offset.height-$(window).height());
            this.timeline.seek(pct * this.timeline.duration());
        }
    };
    proto.resizeElements = function(){
        var w = $(window).width();
        var h = $(window).height();

        this.elements.css({
            width:w,
            height:h,
            position:"fixed",
            top:0,
            left:0
        });
        this.checkOffset(h);
        this.update();
    };
    proto.checkOffset = function(h){
        h *= this.timeScale;
        if(!this.heightOffset){
            this.heightOffset = $("<div></div>");
            $("body").append(this.heightOffset);
        }
        this.heightOffset.css({
            width:1,
            height:h*this.elements.length,
            position:"absolute",
            top:0,
            left:0
        });
    };
    proto.initialize = function(opts){
        this.timeScale = opts && opts.timeScale ? opts.timeScale : 1;
        this.elements = $("[core-story]");
        core.addons.CoreWindow.instance().on("window.scroll", this._("update"), this);
        core.addons.CoreWindow.instance().on("window.resize", this._("resizeElements"), this);
        this.resizeElements();
        this.timeline = new TimelineMax();
        this.configureStory();
        this.update();
    };
    proto.configureStory = function(){
        var len = -1;
        var len2 = this.elements.length;
        while(len++ < len2){
            var current = $(this.elements[len]);
            var config = current.attr("core-story-animation");
            var label = current.attr("core-story");
            if(config){
                var configObj = new Function("return "+config)();
                if(configObj.speed){
                    var speed = configObj.speed;
                    delete configObj.speed;
                }
                this.timeline.add(TweenMax.from(current, speed || 1, configObj));
            }
            var children = current.find("[core-element-animation]");
            var i = -1;
            var clen = children.length;
            while(i++ < clen){
                var config = $(children[i]).attr("core-element-animation");
                if(config){
                    var configObj = new Function("return "+config)();
                    if(configObj.speed){
                        var speed = configObj.speed;
                        delete configObj.speed;
                    }
                    this.timeline.add(TweenMax.from(children[i], speed || 1, configObj));
                }
            }

        }
        this.timeline.pause();
    };
    core.registerNamespace("core.addons.storyboard.StoryBoard", StoryBoard);

})();

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

(function () {
    var Core = core.Core,
        __super__ = Core.prototype;
    /**
     * The main class that implements broadcaster pattern. Ideally subclassed by objects that will perform broadcasting functions.
     *
     * @class CoreSnap
     * @module addons
     * @namespace core.addons.uiscroll
     * @extends core.Core
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core derived class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */
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
        core.addons.CoreWindow.instance().on("window.scroll", this._("update"), this);
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

    core.registerNamespace("core.addons.uiscroll.CoreSnap", o);

})();
(function () {
    var Core = core.Core,
        __super__ = Core.prototype;
    /**
     * ** Singleton. ** <br>The main class that implements local storage functionalities on a web application.
     * This class wraps multiple storage mechanisms for storing information on the client side.
     * <br><br>** This class supports the following: **<br>
     * - SessionStorage
     * - LocalStorage
     * - WebSQL
     * @class LocalStorage
     * @module addons
     * @extends core.Core
     * @namespace core.addons.webapp
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core derived class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */
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
    /**
     * Method for storing key/value pair using local storage.
     *
     * @method storeLocal
     * @param {String} key The key to use when storing values
     * @param {Object} value The value to store paired with the key parameter
     */
    proto.storeLocal = function(key, value){
        if(this.hasLocalStorage){
            localStorage[key] = value;
        }

    };
    /**
     * Method for retrieving values in local storage.
     *
     * @method retrieveLocal
     * @param {String} key The key pair to use when retrieving values
     *
     */
    proto.retrieveLocal = function(key){
        if(this.hasLocalStorage){
            return localStorage[key];
        }
        return null;
    };
    /**
     * Method for storing key/value pair using session storage.
     *
     * @method storeSession
     * @param {String} key The key to use when storing values
     * @param {Object} value The value to store paired with the key parameter
     */
    proto.storeSession = function(key, value){
        if(this.hasSessionStorage){
            sessionStorage[key] = value;
        }
    };
    /**
     * Method for retrieving values in session storage.
     *
     * @method retrieveSession
     * @param {String} key The key pair to use when retrieving values
     *
     */
    proto.retrieveSession = function(key){
        if(this.hasSessionStorage){
            return sessionStorage[key];
        }
    };
    /**
     * Method for creating tables on WebSQL
     *
     * @method createTable
     * @param {String} tablename The table name to use upon creation
     * @param {String} structure The columns to use when creating table
     */
    proto.createTable = function(tablename, struct){
        if(this.hasSQL){
            if(typeof this.sqlDB !== 'undefined'){
                this.sqlDB.transaction((function(sql){
                    sql.executeSql("CREATE TABLE IF NOT EXISTS " + tablename + "("+struct+")");
                }).bind(this));
            }
        }
    };
    /**
     * Method for inserting data on WebSQL
     *
     * @method insertSql
     * @param {String} query The string INSERT query to use upon insertion
     *
     */
    proto.updateSql = proto.insertSql = function(query){
        this.sqlDB.transaction((function(sql){
            sql.executeSql(query);
        }));
    };
    /**
     * Method for retrieving data on WebSQL
     *
     * @method retrieveSql
     * @param {String} query The string SELECT query to use upon retrieval
     *
     */
    proto.retrieveSql = function(query, callback){
        this.sqlDB.transaction((function(sql){
            sql.executeSql(query, [], callback);
        }))
    };
    /**
     * Method for configuring WebSQL, this includes database creation and all other meta information required on creation
     *
     * @method configureSQL
     * @param {String} dbname The name of the database to create
     * @param {String} version The version of the database to create
     * @param {String} desc The description of the database to create
     * @param {Number} size The size of the database to create, uses bytes. (ie. 1024*1024 * [intended mb size])
     *
     */
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

    core.registerNamespace("core.addons.webapp.LocalStorage", o);

})();
(function ($) {
    var Module = core.wirings.Module,
        __super__ = Module.prototype;
    /**
     * The main class that implements offline webapp functionalities using application cache and local storage.
     * Extends core.wirings.Module to have the ability to be instantiated in the same fashion.
     *
     * @class OfflineModule
     * @module addons
     * @namespace core.wirings
     * @extends core.wirings.Module
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core derived class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */
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
    /**
     * The main method handler for checking the application status. Also determines if a web application has gone offline/online
     *
     * @method onApplicationCacheStatus
     * @param {Object} event Contains the information about the current application cache status.
     */
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
    /**
     * Virtual protected function. Should be overridden on subclasses. Called automatically when the cache status has changed.
     *
     * @method cacheStatus
     * @param {String} status The status of the application cache.
     */
    proto.cacheStatus = function(status){

    };
    /**
     * Virtual protected function. Should be overridden on subclasses. Called automatically when the online/offline state of the application changes.
     *
     * @method onlineStatus
     * @param {Boolean} isonline True/false depending on the applications online/offline state.
     */
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
            var ref = this;
            this.cacheStatusTimer = setInterval(function(){
                try{
                    window.applicationCache.update();
                }catch(err){
                    console.warn("Using application cache without a manifest. Cache update check and online status check will not work.");
                    clearInterval(ref.cacheStatusTimer);

                }

            }, 3000);
        }
        this.localStorage = core.addons.webapp.LocalStorage.init();

    };
    core.registerNamespace("core.wirings.OfflineModule", OfflineModule);


})(core.selector);