
(function () {
    var Core = core.Core,
        __super__ = Core.prototype;

    function StoryBoard(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }

    StoryBoard.inherits(Core);

    core.dependency("TweenMax", "StoryBoard class has TweenMax as dependency. Please ensure that this is included in your assets.");
    core.dependency("jQuery", "StoryBoard class has jQuery as dependency. Please ensure that this is included in your assets.");

    var proto = StoryBoard.prototype;
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
    proto.update = function(){


    };
    proto.updateAcceleration = function(evt){
        //console.log(evt);
        //untested
    };
    proto.initialize = function(){
        this.elements = this.findAll("[core-story]");
        CoreWindow.instance().on("window.scroll", this._("update"), this);
        CoreWindow.instance().on("window.device.motion", this._("updateAcceleration"), this);
        this.update();
    };
    var instance;
    var o = {
        init:function (opts) {
            if (instance == null) {
                instance = new StoryBoard(opts);
            }
            return instance;
        }
    };
    o.instance = o.init;

    core.registerNamespace("StoryBoard", o);

})();