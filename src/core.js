(function(scope){

    if(!scope.core){
        scope.core = {};
    }
    if(!scope.core.selector){
        try{
            scope.core.selector = typeof jQuery !== 'undefined' ? jQuery : typeof $ !== 'undefined' ?  $ : document.querySelectorAll || null;
        }catch(err){
            scope.core.selector = document.querySelectorAll || null;
        }
    }

    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        }
    }
    if(!Function.prototype.bind) {
        /**
         * Function "bind" support for other browsers
         * @method bind
         * @param oThis
         * @return {Function}
         */
        Function.prototype.bind = function(oThis) {
            if( typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
            }, fBound = function() {
                return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }
    /**
     * Function "inherits" prototype - inheritance implementation used by the "Core" micro-framework.
     * @method inherits
     * @param obj {Function} superclass
     */
    Function.prototype.inherits = function(obj){
        var tmp = function(){};
        tmp.prototype = new obj({__inheriting__:true});
        this.prototype = tmp.prototype;
        this.prototype.constructor = this;
        tmp = null;
    };
    /**
     * Function "augment" prototype - copies the prototype of an object without instantiation.
     * @param obj {Object}
     */
    Function.prototype.augment = function(obj){
        for(var prop in obj){
            this.prototype[prop] = obj[prop];
        }
    };
    if(typeof navigator !== 'undefined'){
        var N= navigator.appName, ua=navigator.userAgent, tem;
        var M= ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
        if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
        M= M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
        var br = {
            mobile: false,
            ios: false,
            iphone: false,
            ipad: false,
            android: false,
            webos: false,
            mac: false,
            windows: false,
            other: true,
            name: M[0].toLowerCase() == "trident" ? "msie" : M[0].toLowerCase(),
            version: M[1].split(".")[0],
            touch:'ontouchstart' in window,
            full_version:M[1]

        };
        function ver(re, index, replaceA, replaceB) {
            var v = re.exec(ua);
            if(v === null || typeof v !== 'object' || typeof v.length !== 'number') {
                return true;
            } else if(typeof v.length === 'number' && v.length >= (index + 1)) {
                if(replaceA && replaceB) return v[index].replace(replaceA, replaceB);
                else return v[index];
            } else {
                return true;
            }
        }
        if (/mobile/i.test(ua)) {
            br.mobile = true;
        }
        if (/like Mac OS X/.test(ua)) {
            br.ios 		= ver(/CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/, 2, /_/g, '.');
            br.iphone 	= /iPhone/.test(ua);
            br.ipad 		= /iPad/.test(ua);
        }
        if (/Android/.test(ua)) {
            br.android = ver(/Android ([0-9\.]+)[\);]/, 1);
        }

        if (/webOS\//.test(ua)) {
            br.webos = ver(/webOS\/([0-9\.]+)[\);]/, 1);
        }
        if (/(Intel|PPC) Mac OS X/.test(ua)) {
            br.mac = ver(/(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/, 2, /_/g, '.');
        }
        if (/Windows NT/.test(ua)) {
            br.windows = ver(/Windows NT ([0-9\._]+)[\);]/, 1);
        }
        for(var key in br) {
            if(key !== 'Other' && key !== 'Mobile' && br[key] !== false) {
                br.other = false;
            }
        }
        scope.core.browser = br;
        scope.core.browser[M[0].toLowerCase() == "trident" ? "msie" : M[0].toLowerCase()] = {version:M[1].split(".")[0]}; //old support
    }
    scope.core.GUID = function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    };
    scope.core.rect = function(targ){
        if(targ instanceof Array){
            return targ[0].getBoundingClientRect();
        }
        return targ.getBoundingClientRect();
    };
    scope.core.registerNamespace = function(nspace, obj){
        var parts = nspace.split(".");
        var root = parts.shift();
        if(!scope[root]) { scope[root] = {}; }
        var temp = scope[root];
        while(parts.length > 1){
            var sp = parts.shift();
            if(!temp[sp]){
                temp[sp] = {};
            }
            temp = temp[sp];
        }
        var last =parts.shift();
        temp[last] = obj || {};
    };
    scope.core.import = function(pack){
        var parts = pack.split(".");
        var sc = scope;
        while(parts.length){
            var sp = parts.shift();
            if(sc[sp]){
                sc = sc[sp];
            }else{
                return null;
            }
        }
        return sc;
    }
    //JSON support - needs to be dropped soon
    if(!scope.JSON){scope.JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

})(typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window); //supports node js

if(!console){
    console = {
        log:function(){},
        warn:function(){},
        trace:function(){}
    }
}
/** Core class - base object of everything **/
(function($, scope){
    /**
     * The base object for all core based classes.
     <code> new Core({el:"node/object"}); </code>
     * @class Core
     * @constructor
     * @param opts {Object} Configuration object. Property "el" ({el:$(node)} or {el:"#node/.node"} or {el:someObject})
     * creates the compositional structure of the class.
     */

    function Core(opts){

        if(opts && opts.__inheriting__) return; //skips all process - instantiated from Function.inherits

        if(opts && opts.el){
            /**
             * @property el - Optional
             * @type {Object} query selected element or object being wrapped by the Core class.
             */
            this.el = (typeof opts.el == "string" && (typeof jQuery !== 'undefined' || typeof $ !== 'undefined')) ? $(opts.el) : (typeof opts.el === "string" && typeof jQuery !== 'undefined' && typeof $ !== 'undefined') ? document.querySelectorAll(opts.el) : opts.el;
        }
        this.proxyHandlers = {};
        this.construct(opts);
        var ref = this;
        setTimeout(function(){
            if(ref.delayedConstruct){
                ref.delayedConstruct(opts);
            }
        }, 0);

    }
    /**
     * Creates/Returns a reference for a method proxy that maintains proper scope.
     * @method getProxyHandler
     * @param opts {Object} Configuration object passed on the constructor.
     * @returns {Function} the proxy handler specified
     */
    Core.prototype._ = Core.prototype.getProxyHandler = function(str){
        if(!this.proxyHandlers[str]){
            if(typeof this[str] === "function" ){
                this.proxyHandlers[str] = this[str].bind(this);
            }else{
                console.warn("Warning: attempt to create non existing method as proxy " + str);
            }

        }
        return this.proxyHandlers[str];
    }
    /**
     * Deletes a proxy handler reference.
     * @method getProxyHandler
     * @param opts {Object} Configuration object passed on the constructor.
     * @returns {Function} the proxy handler specified
     */
    Core.prototype.clearProxyHandler = function(str){
        var ret = this.proxyHandlers[str];
        if(ret === null){
            console.warn("Warning: attempt to clear a non-existing proxy - "+str);
        }
        this.proxyHandlers[str] = null;
        delete this.proxyHandlers[str];
        return ret;
    }
    /**
     * Automatically called after class instantiation
     * @method construct
     * @param opts {Object} Configuration object passed on the constructor.
     */
    Core.prototype.construct = function(opts){
    };
    /**
     * Convenience method for clearing references within "Core" based class.
     * @method dispose
     */
    Core.prototype.dispose = function(){
        this.el = null;
        for(var prop in this.proxyHandlers){
            this.proxyHandlers[prop] = null;
            delete this.proxyHandlers[prop];
        }
    };

    //completes registration and implements autocomplete for IDE

    core.registerNamespace("core.Core", Core);

})(core.selector, typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window);