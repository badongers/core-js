
(function ($, scope) {
    var instance = null;
    var Core = core.Core;
    var __super__ = Core.prototype;
    var __xhr__ = function( a ){ for(a=0;a<4;a++) try { return a ? new ActiveXObject([,"Msxml2", "Msxml3", "Microsoft"][a] + ".XMLHTTP" ) : new XMLHttpRequest } catch(e){} };
    function XHR(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    XHR.inherits(Core);
    var proto = XHR.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        this.settingsCache = {};
    };
    proto.dispose = function () {
        //clear
        instance = null;
        this.settingsCache = null;
        delete this.settingsCache;
        __super__.dispose.call(this);
    };
    var parseResponse = function(resp, format){
        if(format === "json"){
            try{
                return JSON.parse(resp);
            }catch(err){
                return null;
            }
        }
        if(format === "html"){
            return resp.trim();
        }
        return resp;
    };
    var applyConfig = function(o){
        for(var prop in this.settingsCache){
            if(!o[prop]){
                o[prop] = this.settingsCache[prop];
            }
        }
        return o;
    };
    proto.setConfig = function(o){
        this.settingsCache = o;
    };
    proto.request = function(o) {
        if(o == undefined) throw new Error("XHR:Invalid parameters");
        o = applyConfig.call(this, o);
        var req = __xhr__();
        var method = o.method || "get";
        o.location = o.url || o.location;
        var async = o.async = (typeof o.async != 'undefined' ? o.async : true);
        req.queryString = o.data || null;
        req.open(method, o.location+(o.nocache ? "?cache="+new Date().getTime() : ""), async);
        try{
            req.setRequestHeader('X-Requested-With','XMLHttpRequest');
        }catch(err){
            throw new Error("XHR: " + err);
        }
        var format = o.dataType || o.format || "plain";

        if (method.toLowerCase() === 'post') req.setRequestHeader('Content-Type', o.contentType || 'application/x-www-form-urlencoded');
        var rstate = function() {
            if(req.readyState===4) {
                //todo: handle other error codes
                if(req.status === 0 || req.status===200){

                    o.callback(parseResponse.call(this, req.responseText, format));
                }
                if((/^[45]/).test(req.status)) {
                    try{
                        o.error();
                    }catch(err){
                    }

                }
                req = null;
                o = null;
            }else{
                //
                switch(req.readyState){
                    case 1:
                        try{
                            o.requestSetup();
                        }catch(err) {}
                        break;
                    case 2:
                        try{
                            o.requestSent();
                        }catch(err) {}
                        break;
                    case 3:
                        try{
                            o.requestInProcess();
                        }catch(err) {}
                }
            }
        }
        if(async){
            req.onreadystatechange = rstate;
            if(!async) rstate();
        }
        try{
            req.send(o.data || null);
        }catch(err){
            o.error(err);
            o = null;
            req = null;
        }

    };
    core.registerNamespace("core.net.XHR");
    var o = {
        init:function () {
            if (instance == null) {
                instance = new XHR();
            }
            return instance;
        }
    };
    o.instance = o.init;
    scope.core.net.XHR = o;
})(core.selector, typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window);