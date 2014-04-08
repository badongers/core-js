
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
        return $(selector, this.el);
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
    core.registerNamespace("core.delegates.Module", Module);
})(core.selector, typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window);