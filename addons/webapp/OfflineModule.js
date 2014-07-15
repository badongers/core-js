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
        //if cacheUpdateInterval is not overridden from outside, then assign a default value which is 3000
        if (!this.cacheUpdateInterval)
            this.cacheUpdateInterval = 3000;
			
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

            }, this.cacheUpdateInterval);
        }
        this.localStorage = core.addons.webapp.LocalStorage.init();

    };
    core.registerNamespace("core.wirings.OfflineModule", OfflineModule);


})(core.selector);