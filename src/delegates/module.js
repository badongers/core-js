
(function ($, scope) {
    var Core = core.Core,
        __super__ = Core.prototype;

    function Module(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    Module.inherits(Core);
    var proto = Module.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        findImmediateClasses.call(this, this.el, opts);
        try{
            this.initialized(opts);
        }catch(err){}
    };
    proto.dispose = function () {
        //clear
        for(var prop in this){
            try{
                if(this[prop].attr("data-event")){
                    this[prop].off(this[prop].attr("data-event"));
                }
            }catch(err){}
        }
        __super__.dispose.call(this);
    };
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
                if(mod.attr("data-module") && mod.attr("id") && !this[mod.attr("id")]){
                    var cls = Function.apply(scope, ["return "+mod.attr("data-module")])();
                    var opts = mod.attr("data-params") ? JSON.parse(root.attr("data-params")) : {};
                    opts.el = mod;
                    this[mod.attr("id")] = new cls(opts);
                }else if(mod.attr("data-module") && mod.attr("id") && mod.attr("data-event") && (mod.attr("data-event-handler") || mod.attr("data-event-function"))){
                    handlePropertyWithEvents.call(this, mod, mod.attr("data-event"), mod.attr("data-event-handler") || mod.attr("data-event-function"), !mod.attr("data-event-handler") && mod.attr("data-event-function"));
                }else if(mod.attr("data-module") && !mod.attr("id")){
                    var cls = Function.apply(scope, ["return "+mod.attr("data-module")])();
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

    };
    core.registerNamespace("core.delegates.Module");
    scope.core.delegates.Module = Module;

})(core.selector, typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window);