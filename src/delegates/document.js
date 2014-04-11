(function ($, scope) {
    var Core = core.import("core.Core"),
        __super__ = Core.prototype;

    function Document(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    Document.inherits(Core);
    function contentLoaded(win, fn) {

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
    var proto = Document.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        if(typeof document !== 'undefined'){
            contentLoaded(window, this.getProxyHandler("onDocumentReady"));
        }
    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    var findRootClass = function(){
        var root = document.body;
        if(root.hasAttribute("core-app") || root.hasAttribute("data-root")){
            var cls = Function.apply(scope, ["return "+(root.hasAttribute("core-app") ? root.getAttribute("core-app") : root.getAttribute("data-root"))])();
            var opts = root.getAttribute("data-params") ? JSON.parse(root.getAttribute("data-params")) : {};
            opts.el = root;
            window.__coreapp__ = new cls(opts);
        }else{
            doc = null;
        }
    };
    proto.onDocumentReady = function(automate){
        if(automate){
            findRootClass.call(this);
        }
    };
    var doc = new Document();
})();