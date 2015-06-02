/**
 * The base module for the Core JS framework.
 * It provides helper methods for implementing OOP methodologies and basic utilities such as browser detection.
 *
 * @module core
 */
(function(scope, document){

    /**
     * Function prototype extension in the core framework.
     *
     * @class Function
     * @constructor
     *
     */
    if(!Function.prototype.bind) {
        /**
         * Added support for older browser. Only applied when the method is not available. Returns a scope bound function.
         *
         * @method bind
         * @param {Object} scope The scope where the function is bound to
         * @return {Function} A scope bound function
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
     * Utility method for implementing prototypal inheritance within the core framework.
     *
     * @method inherits
     * @param {Object} obj The object where the prototype is going to be derived from.
     *
     */
    Function.prototype.inherits = function(obj){
        this.prototype = new obj({__inheriting__:true});
    };
    /**
     * Utility method for implementing mixins/augmentation/partial in the core framework
     *
     * @method mixin
     * @param {Object} obj The object where the prototype is going to be mix with.
     *
     */

    Function.prototype.augment = Function.prototype.mixin = Function.prototype.partial = function(obj){
        if(typeof obj == "function"){
            for(var prop in obj.prototype){
                this.prototype[prop] = obj.prototype[prop];
            }
        }
        if(typeof obj == "object"){
            for(var prop in obj){
                this.prototype[prop] = obj[prop];
            }
        }
    }
    if(!scope.core){
        /**
         * The main module and namespace used within the core framework.
         *
         * @class core
         *
         *
         */
        scope.core = {};
    }
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
        /**
         * Stored browser information based on the detection algorithm implemented within core.
         * @property browser
         * @type Object
         */
        scope.core.browser[M[0].toLowerCase() == "trident" ? "msie" : M[0].toLowerCase()] = {version:M[1].split(".")[0]};
        //
        // ### core.browser ######
        // Browser detection implementation
        // Creates a browser object in the core object containing browser information.

    }
    /**
     * Utility method for generating GUID
     * @method GUID
     * @returns String Returns a GUID string
     */
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
    /**
     * Utility method for getting the bounding rect of the dom element - also adds support for IE8
     * @method rect
     * @returns Object Contains the rectangular information of a HTMLElement
     */
    scope.core.rect = function(targ){
        var o = {};
        if(targ instanceof Array){
            o = targ[0].getBoundingClientRect()

        }
        o = targ.getBoundingClientRect();
        if(typeof o.width == "undefined"){
            var x = o;
            o = {
                top: x.top,
                left: x.left,
                right: x.right,
                bottom: x.bottom
            }
            o.width = o.right - o.left;
            o.height = o.bottom + o.top;
        }else
        if(typeof o.right == "undefined"){
            o = {
                top: x.top,
                left: x.left,
                width: x.width,
                height: x.height
            }
            o.right = o.left+ o.width;
            o.bottom = o.top + o.height;
        }
        return o;
    };
    /**
     * Utility method for exposing objects in a namespaced fashion.
     * @method registerNamespace
     */
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
        if(!parts.length){
            scope[root] = obj;
        }else{
            var last = parts.shift();
            if(last){
                temp[last] = obj || {};
            }
        }
    };
    /**
     * Utility method for referencing objects within the core framework. This also adds existence checking for the objects being referenced on import.
     * @method import
     * @param {String} package The namespace of the object being imported.
     * @returns Object The object being imported
     */
    scope.core._import = function(pack){
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
    };
    /**
     * Utility method for performing dependency checks on core classes.
     * @method dependency
     * @param {String} object The object to check if its defined.
     * @param {String} message The message to display on warning when the object passed for checking is undefined.
     * @returns Object The object being imported
     */
    scope.core.dependency = function(obj, message){
        if(!scope[obj]){
            console.warn(message);
        }
    };
    /** DOCUMENT READY **/
    scope.core.documentReady = function(win, fn) {
        var done = false, top = true,
            doc = win.document, root = doc.documentElement,
            add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
            rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
            pre = doc.addEventListener ? '' : 'on',
            init = function(e) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) fn.call(win, e.type || e);
            },

            poll = function() {
                try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
                init('poll');
            };

        if (doc.readyState == 'complete') fn.call(win, 'lazy');
        else {
            if (doc.createEventObject && root.doScroll) {
                try { top = !win.frameElement; } catch(e) { }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }
    }
    // ### addEventListener/removeEventListener/dispatchEvent ## //
    // EventListener implementation for browsers without support
    if(scope == window){
        !window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
            WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
                var target = this;

                registry.unshift([target, type, listener, function (event) {
                    event.currentTarget = target;
                    event.preventDefault = function () { event.returnValue = false };
                    event.stopPropagation = function () { event.cancelBubble = true };
                    event.target = event.srcElement || target;

                    listener.call(target, event);
                }]);

                this.attachEvent("on" + type, registry[0][3]);
            };

            WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
                for (var index = 0, register; register = registry[index]; ++index) {
                    if (register[0] == this && register[1] == type && register[2] == listener) {
                        return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
                    }
                }
            };

            WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
                return this.fireEvent("on" + eventObject.type, eventObject);
            };
        })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
    }
    scope.core.ENV = {};
    scope.core.configure = function(o){
        for(var prop in o){
            this.ENV[prop] = o[prop];
        }
    };
    var __queue__ = [];
    function nameFunction(name, fn){
        return (new Function("return function(call) { return function " + name + "() { return call(this, arguments) }; };")())(Function.apply.bind(fn));
    }
    function retrieveClass(namespace, scope){
        var namespaces = namespace.split(".");
        var len = namespaces.length;
        var cscope = scope;
        for(var i = 0;i<len;i++){
            try{
                cscope = cscope[namespaces[i]];
            }catch(err){
                return null;
            }

        }
        return cscope;
    }
    function manageModuleRegistration(definition){
        var o = {};
        if(!("inherits" in definition)){
            definition.inherits = "core.Core";
        }


        o.base = scope.core._import(definition.inherits);
        if("base" in o){
            try{
                var __super__ = o.base.prototype;
            }catch(err){
                throw new Error("Module "+definition.classname+" failed to inherit " + definition.inherits);
            }

        }

        var classsplit = definition.classname.split(".");
        o.funcname = classsplit[classsplit.length-1];
        o[o.funcname] = nameFunction(o.funcname, function (opts){
            if (opts && opts.__inheriting__) return;
            if(opts && "parent" in opts){
                this.parent = opts.parent;
            }
            if(opts && "el" in opts){
                this.node = this.el = opts.el;
            }
            if(opts && "params" in opts){
                this.params = opts.params;
            }
            if(__super__){
                __super__.constructor.call(this, opts);
            }
        });
        if(o.base){
            o[o.funcname].inherits(o.base);
        }
        var proto = o[o.funcname].prototype;
        proto.dispose = function () {
            //clear
            if("onBeforeDispose" in this && typeof this.onBeforeDispose == "function") {
                this.onBeforeDispose();
                this.onBeforeDispose = null; //TODO: investigate why this is triggered twice
            }
            try{
                __super__.dispose.call(this);
            }catch(err){
                console.log("dispose", err);
            }
        };
        proto.construct = function(opts){
            if("onBeforeConstruct" in this && typeof this.onBeforeConstruct == "function"){
                this.onBeforeConstruct();
                this.onBeforeConstruct = null; //TODO: investigate why this is triggered twice
            }
            try{
                __super__.construct.call(this, opts);

                if("onAfterConstruct" in this && typeof this.onAfterConstruct == "function") {
                    this.onAfterConstruct();
                    this.onAfterConstruct = null; //TODO: investigate why this is triggered twice
                }
            }catch(err){
                console.log("construct", err.stack);
            };
        };
        var tscope = {$super:__super__, $classname: o.funcname};
        var module = definition.module;
        if(module instanceof Array && module.length){
            var mfunc = module.pop();
            var len = module.length;
            while(len--){
                var tclass = retrieveClass(module[len], scope);
                module[len] = tclass;
            }
            if(typeof mfunc == "function"){
                mfunc.apply(tscope, module);
            }else{
                throw new Error("Property module does not contain a function.");
            }

        }else if(typeof module == "function"){
            module.apply(tscope);
        }
        for(var prop in tscope){
            proto[prop] = tscope[prop];
        }
        scope.core.registerNamespace(definition.classname, ("singleton" in definition && definition.singleton) ? new o[o.funcname]() : o[o.funcname]);

    }
    scope.core.mixin = function(base, mix){
        for(var prop in mix){
            base[prop] = mix[prop];
        }
    };
    function checkDIs(definition){
        var module = definition.module;
        if(module instanceof Array && module.length){
            var len = module.length-1;
            while(len--){
                if(typeof module[len] !== "function"){
                    var tclass = retrieveClass(module[len], scope);
                    if(!tclass){
                        return false
                    }
                }

            }
            if(typeof mfunc == "function"){
                return true;
            }

        }else if(typeof module == "function"){
            return true;
        }
        return true;
    }
    scope.core.registerModule = function(definition){
        if(definition.classname){
            if(checkDIs(definition)){
                manageModuleRegistration(definition);
                if(__queue__.length){
                    scope.core.registerModule(__queue__.pop());
                }
            }else{
                __queue__.push(definition); //queue up classes with missing dependencies
            }
        }else if(definition.mixin){
            var base = new Function("return " + definition.mixin)();
            var tscope = {};
            var module = definition.module;
            if(module instanceof Array && module.length){
                var mfunc = module.pop();
                var len = module.length;
                while(len--){
                    module[len] = retrieveClass(module[len], scope);
                }
                mfunc.apply(tscope, module);
            }else if(typeof module == "function"){
                module.apply(tscope);
            }
            for(var prop in tscope){
                if("prototype" in base){
                    base.prototype[prop] = tscope[prop];
                }else{
                    base[prop] = tscope[prop];
                }

            }
        }else{
            throw new Error("Error registering a module");
        }
    };
    scope.core.strapUp = function(func, useclass){
        if(__queue__.length){
            while(__queue__.length){
                manageModuleRegistration(__queue__.pop()); //load remaining definitions without checking dependencies.
            }
        }
        //instantiate body as a module
        //this will trigger instantiation of each child element as core modules.
        if(typeof document !== 'undefined'){
            var found = false;
            var evaluateRootApp = function(root){
                var scope = typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window;
                var cls = useclass ? core._import(useclass) : scope.core.Module;
                var opts = {};
                opts.el = root;
                if(!("__coreapp__" in window)){
                    window.__coreapp__ = new cls(opts);
                }else{
                    if(!(window.__coreapp__ instanceof Array)){
                        window.__coreapp__ = [window.__coreapp__];
                    }
                    window.__coreapp__.push(new cls(opts));
                }
                found = true;
            };
            scope.core.documentReady(window, function docready(){
                evaluateRootApp(document.body);
                func();
            });
        }
    };


})(typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window, document); //supports node js

if(!("console" in window)){
    console = {
        log:function(){},
        warn:function(){},
        trace:function(){}
    }
}

(function(){

    /**
     * The base object of all core based classes. Every object created within the Core framework derives from this class.
     *
     * @class Core
     * @namespace core
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */



    function Core(opts){
        //skips all process when instantiated from Function.inherits
        if(opts && opts.__inheriting__) return;
        if(opts){
            //`this.el property` a dom element context
            if(opts.el){
                /**
                 * The selected HTML element node reference.
                 *
                 * @property node
                 * @type HTMLElement
                 *
                 */
                this.node = this.el = opts.el;
                if("rivets" in window){
                    prepareBindings.call(this);
                }

            }
        }
        /**
         * Property for storing proxied function/methods
         *
         * @property proxyHandlers
         * @type Object
         *
         */
        this.proxyHandlers = {};
        if("construct" in this){
            this.construct(opts || {});
        }
        var ref = this;
        setTimeout(function(){
            if(ref.delayedConstruct){
                ref.delayedConstruct(opts || {});
            }
        }, 0);

    }
    var applyBindings = function(){
        this.$bindings = rivets.bind(this.node, this, {
            prefix: 'data-rv',
            preloadData: true,
            rootInterface: '.',
            templateDelimiters: ['{{', '}}']

        });
        setTimeout((function(){
            if("bindingComplete" in this){
                this.bindingComplete();
            }
        }).bind(this), 1);
    };
    var prepareBindings = function(){
        applyBindings.call(this);
    };
    /**
     * Returns a scope bound function and stores it on the proxyHandlers property.
     *
     * @method getProxyHandler
     * @param {String} method The string equivalent of the defined method name of the class.
     * @return {Function} The scope bound function defined on the parameter.
     */
    Core.prototype.handleEvent = Core.prototype._ = Core.prototype.getProxyHandler = function(str){
        if(!this.proxyHandlers[str]){
            if(typeof this[str] === "function" ){
                this.proxyHandlers[str] = this[str].bind(this);
            }else{
                console.warn("Warning: attempt to create non existing method as proxy " + str);
            }

        }
        return this.proxyHandlers[str];
    }
    // ### Core.clearProxyHandler ######
    // Core method for clearing proxied function methods.
    /**
     * Core method for clearing proxied function methods.
     *
     * @method clearProxyHandler
     * @param {String} method The string equivalent of the defined method to clear.
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
     * Core method initialization. This is called automatically on core sub classes.
     *
     * @method construct
     * @param {Object} options The object passed on the constructor of a core based class.
     */
    Core.prototype.construct = function(opts){
    };
    /**
     * Core method initialization. This is called automatically on core sub classes. Adds delay when being called automatically, this allows
     * time to setup all the other classes and manage the sequence of instantiations.
     *
     * @method delayedConstruct
     * @param {Object} options The object passed on the constructor of a core based class.
     */
    Core.prototype.delayedConstruct = function(opts){
    };
    /**
     * Core method for destroying/cleaning up objects.
     *
     * @method dispose
     * @param {Boolean} removeNode If true and there is a node attached in the class (el property) that element is going to be removed upon disposal.
     */
    Core.prototype.dispose = function(removeNode){
        if(removeNode && this.el){
            try{
                this.el.parentNode.removeChild(this.el);
            }catch(err){}
        }
        this.el = null;
        for(var prop in this.proxyHandlers){
            this.proxyHandlers[prop] = null;
            delete this.proxyHandlers[prop];
        }
        this.$bindings.unbind();
        delete this.$bindings;
    };
    /**
     * Core method for searching sub node elements.
     *
     * @method find
     * @param {String} selector The selector used for searching sub nodes.
     * @returns {NodeList} An array of HTMLElements, please note that this is not jQuery selected nodes.
     */
    Core.prototype.find = function(selector){
        var select = null;
        if("jQuery" in window){
            select = window.jQuery;
        }
        return select ? select(this.node).find(selector) : this.node.querySelectorAll(selector);
    };
    /**
     * Core method for searching sub node elements within the document context.
     *
     * @method findAll
     * @param {String} selector The selector used for searching sub nodes within the document.
     * @returns {NodeList} An array of HTMLElements, please note that this is not jQuery selected nodes.
     */
    Core.prototype.findAll = function(selector){
        var select = null;
        if("jQuery" in window){
            select = window.jQuery;
        }
        return select ? select(document).find(selector) : document.querySelectorAll(selector);
    };
    core.registerNamespace("core.Core", Core);

})();
if(typeof module !== 'undefined' && module.exports){
    module.exports = core;
}