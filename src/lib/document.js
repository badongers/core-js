/**
 * The base object of all core based classes. Every object created within the Core framework derives from this class.
 *
 * @class Document
 * @namespace core.wirings
 * @extends
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core derived class.
 * @param {HTMLElement} opts.el The node element included in the class composition.
 *
 */
(function () {
    function _isready(win, fn) {
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
    core.registerModule({
        inherits:"core.Core",
        classname:"core.Document",
        module:function(){

            this.onAfterConstruct = function(opts){
                if(typeof document !== 'undefined'){
                    _isready(window, this._("onDocumentReady"));
                }
            };
            var findRootClass = function(){
                var root = document.body;

                if(root.hasAttribute("core-app") || root.hasAttribute("data-core-app")){
                    var scope = typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window;
                    var cls = Function.apply(scope, ["return "+(root.hasAttribute("data-core-app")  ? root.getAttribute("data-core-app") : root.getAttribute("core-app"))])();
                    var opts = root.getAttribute("data-params") ? JSON.parse(root.getAttribute("data-params")) : {};
                    opts.el = root;
                    window.__coreapp__ = new cls(opts);
                }else{
                    doc = null;
                }
            };
            this.onDocumentReady = function(automate){
                if(automate){
                    findRootClass.call(this);
                }
            };
            setTimeout(function(){
                var t = new core.Document();
            }, 1);
        }
    });



})();