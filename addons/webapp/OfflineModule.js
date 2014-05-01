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