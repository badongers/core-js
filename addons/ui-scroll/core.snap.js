
(function () {
    var Core = core.Core,
        __super__ = Core.prototype;

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

                    }
                }
            }else{
                this.elements[len].style.position = "relative";
                if(style){
                    if(this.elements[len].className.indexOf(style) != -1){
                        toggleClass(this.elements[len], this.elements[len].getAttribute("core-snap-style"));
                        this.elements[len].style.top = "";
                    }

                }
            }

        }
    };
    proto.reset = function(){
        var len = this.elements.length;
        while(len--){
            this.elements[len]["origTop"] = null;
        }
        this.update({scrollTop:CoreWindow.instance().scrollTop, scrollLeft:CoreWindow.instance().scrollLeft});
    };
    proto.initialize = function(){
        this.elements = this.findAll("[core-snap]");
        CoreWindow.instance().on("window.scroll", this._("update"), this);
        CoreWindow.instance().on("window.resize", this._("reset"), this);
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

    core.registerNamespace("CoreSnap", o);

})();