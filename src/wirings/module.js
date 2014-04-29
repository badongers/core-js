
(function ($, scope) {
    var EventDispatcher = core.events.EventDispatcher,
        __super__ = EventDispatcher.prototype;
    function Module(opts) {
        if (opts && opts.__inheriting__) return;
        if(opts && opts.parent){
            this.parent = opts.parent;
        }
        EventDispatcher.call(this, opts);
    }
    Module.inherits(EventDispatcher);
    var proto = Module.prototype;
    proto.delayedConstruct = function (opts) {
        //create
        findImmediateClasses.call(this, this.el);
        this.initialized(opts);
    };
    proto.dispose = function (removeNode) {
        //clear
        __super__.dispose.call(this, removeNode);
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
                    var cmod = mod.getAttribute("core-module");
                    var cid = mod.getAttribute("core-id");
                    var params = mod.getAttribute("core-params");
                    if(cmod && cid && !this[cid]){
                        cls = Function.apply(scope, ["return "+cmod])();
                        opts = params ? JSON.parse(params) : {};
                        opts.el = mod;
                        opts.parent = this;
                        this[cid] = new cls(opts);
                    }else if(cmod && !cid){
                        cls = Function.apply(scope, ["return "+cmod])();
                        opts = params ? JSON.parse(params) : {};
                        opts.parent = this;
                        opts.el = mod;
                        new cls(opts); //do not assign to any property
                    }else if(cmod && cid && this[cid]){
                        cls = Function.apply(scope, ["return "+cmod])();
                        opts = params ? JSON.parse(params) : {};
                        opts.el = mod;
                        opts.parent = this;
                        var o = new cls(opts);
                        try{
                            this[cid].push(o);
                        }catch(err){
                            this[cid] = [this[cid]];
                            this[cid].push(o);
                        }
                    }else if(mod.hasChildNodes()){
                        recurse.call(this, mod.childNodes);
                    }
                }
            }
        };
        recurse.call(this, node.childNodes);
    }
    core.registerNamespace("core.wirings.Module", Module);
})();