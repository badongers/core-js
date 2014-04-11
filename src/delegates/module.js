
(function ($, scope) {
    var Signal = core.events.Signal,
        __super__ = Signal.prototype;
    function Module(opts) {
        if (opts && opts.__inheriting__) return;
        Signal.call(this, opts);
    }
    Module.inherits(Signal);
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
    function findImmediateClasses(node) {
        var recurse = function(modules) {
            var i = -1,
                cls,
                opts,
                len = modules.length-1;
            while(i++ < len){
                var mod = modules[i];
                if(mod.nodeType == 1){
                    if(mod.getAttribute("core-module") && mod.getAttribute("core-id") && !this[mod.getAttribute("core-id")]){
                        cls = Function.apply(scope, ["return "+mod.getAttribute("core-module")])();
                        opts = mod.getAttribute("data-params") ? JSON.parse(mod.getAttribute("data-params")) : {};
                        opts.el = typeof jQuery !== 'undefined' ? $(mod) : mod;
                        this[mod.getAttribute("core-id")] = new cls(opts);
                    }else if(mod.getAttribute("core-module") && !mod.getAttribute("core-id")){
                        cls = Function.apply(scope, ["return "+mod.getAttribute("core-module")])();
                        opts = mod.getAttribute("data-params") ? JSON.parse(mod.getAttribute("data-params")) : {};
                        opts.el = typeof jQuery !== 'undefined' ? $(mod) : mod;
                        new cls(opts); //do not assign to any property
                    }else if(mod.getAttribute("core-module") && mod.getAttribute("core-id") && this[mod.getAttribute("core-id")]){
                        if(!this[mod.getAttribute("core-id")] instanceof Array){
                            this[mod.getAttribute("core-id")] = [this[mod.getAttribute("core-id")]]
                        }else{
                            cls = Function.apply(scope, ["return "+mod.getAttribute("core-module")])();
                            opts = mod.getAttribute("data-params") ? JSON.parse(mod.getAttribute("data-params")) : {};
                            opts.el = typeof jQuery !== 'undefined' ? $(mod) : mod;
                            this[mod.getAttribute("core-id")].push(new cls(opts));
                        }
                    }else if(mod.hasChildNodes()){
                        recurse(mod.childNodes);
                    }
                }
            }
        };
        recurse(node.childNodes);
    }
    core.registerNamespace("core.delegates.Module", Module);
})();