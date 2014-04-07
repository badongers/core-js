
(function ($, scope) {
    var Core = core.Core,
        __super__ = Core.prototype;

    function Module(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    Module.inherits(Core);
    var proto = Module.prototype;
    proto.delayedConstruct = function (opts) {
        //create
        findImmediateClasses.call(this, this.el);
        this.initialized(opts);
    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.find = function(selector){
        if("querySelectorAll" in document){
            return document.querySelectorAll(selector);
        }
        var recurse = function(modules) {
            var i = -1,
                len = modules.length-1;
            while(i++ < len){
                var mod = modules[i];
                if(mod.nodeType == 1){

                }
                if(mod.hasChildNodes()){
                    recurse(mod.childNodes);
                }
            }
        };
        recurse(this.el instanceof Array && typeof jQuery !== 'undefined' ? this.el[0].childNodes : this.el.childNodes);
    };
    function findImmediateClasses(node) {
        var recurse = function(modules) {
            var i = -1,
                cls,
                opts,
                len = modules.length-1;
            while(i++ < len){
                var mod = modules[i];
                if(mod.nodeType == 1){
                    if(mod.getAttribute("core-module") && mod.getAttribute("id") && !this[mod.getAttribute("id")]){
                        cls = Function.apply(scope, ["return "+mod.getAttribute("core-module")])();
                        opts = mod.getAttribute("data-params") ? JSON.parse(mod.getAttribute("data-params")) : {};
                        opts.el = typeof jQuery !== 'undefined' ? $(mod) : mod;
                        this[mod.getAttribute("id")] = new cls(opts);
                    }else if(mod.getAttribute("core-module") && !mod.getAttribute("id")){
                        cls = Function.apply(scope, ["return "+mod.getAttribute("core-module")])();
                        opts = mod.getAttribute("data-params") ? JSON.parse(mod.getAttribute("data-params")) : {};
                        opts.el = typeof jQuery !== 'undefined' ? $(mod) : mod;
                        new cls(opts); //do not assign to any property

                    }else if(mod.hasChildNodes()){
                        recurse(mod.childNodes);
                    }
                }
            }
        };
        recurse(node.childNodes);

    }
    /*
     var handlePropertyWithEvents = function(targ, evt, handler, isfunc){
     targ.on(evt, isfunc ? Function.apply(window, ["return "+handler])() : this.getProxyHandler(handler));
     this[targ.attr("id")] = targ;
     }
    var findImmediateClasses = function(el, opts){

        var children = el.find(">*");
        var len = children.length;
        while(len--){
            var mod = $(children[len]);
            try{
                if(mod.attr("core-module") && mod.attr("id") && !this[mod.attr("id")]){
                    var cls = Function.apply(scope, ["return "+mod.attr("core-module")])();
                    var opts = mod.attr("data-params") ? JSON.parse(root.attr("data-params")) : {};
                    opts.el = mod;
                    this[mod.attr("id")] = new cls(opts);
                }else if(mod.attr("core-module") && mod.attr("id") && mod.attr("data-event") && (mod.attr("data-event-handler") || mod.attr("data-event-function"))){
                    handlePropertyWithEvents.call(this, mod, mod.attr("data-event"), mod.attr("data-event-handler") || mod.attr("data-event-function"), !mod.attr("data-event-handler") && mod.attr("data-event-function"));
                }else if(mod.attr("core-module") && !mod.attr("id")){
                    var cls = Function.apply(scope, ["return "+mod.attr("core-module")])();
                    var opts = mod.attr("data-params") ? JSON.parse(root.attr("data-params")) : {};
                    opts.el = mod;
                    new cls(opts); //do not assign to any property
                }else{
                    findImmediateClasses.call(this, $(children[len]));
                }
            }catch(err){
                console.log("UNABLE TO CREATE MODULE", mod.attr("module"), " ERR:", err);
            }
        }

    };*/
    core.registerNamespace("core.delegates.Module", Module);

})(core.selector, typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window);