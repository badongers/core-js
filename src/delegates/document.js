(function ($, scope) {
    var Core = core.Core,
        __super__ = Core.prototype;

    function Document(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    Document.inherits(Core);

    var proto = Document.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        if(document){
            $(document).on("ready", this.getProxyHandler("onDocumentReady"));
        }
        if(window){
            $(window).on("resize", this.getProxyHandler("onWindowResize"));
        }

    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.onWindowResize = function(evt){

    };
    var findRootClass = function(){
        try{
            var root = this.el.find("[data-root]");
            if(!this[root.attr("id")]){
                if(root.length > 1){
                    throw new Error("ROOT CLASS ERROR: Only 1 root class is allowed per document delegate.");
                }
                var cls = Function.apply(scope, ["return "+root.attr("data-root")])();
                var opts = root.attr("data-params") ? JSON.parse(root.attr("data-params")) : {};
                opts.el = root;
                this[root.attr("id")] = new cls(opts);
            }
        }catch(err){
            throw new Error("ROOT CLASS ERROR: "+err);
        }
    };

    proto.onDocumentReady = function(automate){
        if(automate){
            findRootClass.call(this);

        }
        if(window){
            $(window).trigger("resize");
        }

    };
    core.registerNamespace("core.delegates.Document");
    scope.core.delegates.Document = Document;

})(core.selector, typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window);