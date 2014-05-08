
(function () {
    var Core = core.Core,
        __super__ = Core.prototype;
    /**
     * The main class that implements broadcaster pattern. Ideally subclassed by objects that will perform broadcasting functions.
     *
     * @class CoreSnap
     * @module addons
     * @namespace core.addons.uiscroll
     * @extends core.Core
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core derived class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */
    function CoreSnap(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    CoreSnap.inherits(Core);
    var proto = CoreSnap.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        this.supportTouch = opts.supportTouch || false;
        this.initialize();
    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.update = function(evt){
        var len = this.elements.length;
        while(len--){
            var top = core.rect(this.elements[len]).top;
            var offset = Number(this.elements[len].getAttribute("core-snap-offset")) || 0;
            if(!this.elements[len]["origTop"]){
                this.elements[len]["origTop"] = top;
            }
            var style = this.elements[len].getAttribute("core-snap-style");
            if(evt.scrollTop+offset >= this.elements[len]["origTop"]){
                this.elements[len].style.position = "fixed";
                this.elements[len].style.top = offset+"px";
                if(style){
                    if(this.elements[len].className.indexOf(style) == -1){
                        toggleClass(this.elements[len], this.elements[len].getAttribute("core-snap-style"));
                        this.elements[len].snapped = true;
                    }
                }
            }else{
                this.elements[len].style.position = "relative";
                if(style){
                    if(this.elements[len].className.indexOf(style) != -1){
                        toggleClass(this.elements[len], this.elements[len].getAttribute("core-snap-style"));
                        this.elements[len].style.top = "";
                        this.elements[len].snapped = false;
                    }

                }
            }

        }
    };

    proto.initialize = function(){
        this.elements = this.findAll("[core-snap]");
        core.addons.CoreWindow.instance().on("window.scroll", this._("update"), this);
    };
    function toggleClass(element, className){
        if (!element || !className){
            return;
        }

        var classString = element.className, nameIndex = classString.indexOf(className);
        if (nameIndex == -1) {
            classString += ' ' + className;
        }
        else {
            classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);
        }
        element.className = classString;
    }
    var instance;
    var o = {
        init:function (opts) {
            if (instance == null) {
                instance = new CoreSnap(opts);
            }
            return instance;
        }
    };
    o.instance = o.init;

    core.registerNamespace("core.addons.uiscroll.CoreSnap", o);

})();