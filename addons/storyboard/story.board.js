
(function () {
    var Core = core.Core,
        __super__ = Core.prototype;

    function StoryBoard(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);

    }
    StoryBoard.inherits(Core);
    core.dependency("TweenMax", "StoryBoard class requires TweenMax. Please ensure that this is included in your assets.");
    core.dependency("jQuery", "StoryBoard class requires jQuery. Please ensure that this is included in your assets.");
    $ = jQuery;
    var proto = StoryBoard.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        this.supportTouch = opts.supportTouch || false;
        this.initialize(opts);

    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.update = function(){
        if(this.timeline){
            var offset = core.rect(this.heightOffset[0]);
            var pct = Math.abs(offset.top)/(offset.height-$(window).height());
            this.timeline.seek(pct * this.timeline.duration());
        }
    };
    proto.resizeElements = function(){
        var w = $(window).width();
        var h = $(window).height();

        this.elements.css({
            width:w,
            height:h,
            position:"fixed",
            top:0,
            left:0
        });
        this.checkOffset(h);
        this.update();
    };
    proto.checkOffset = function(h){
        h *= this.timeScale;
        if(!this.heightOffset){
            this.heightOffset = $("<div></div>");
            $("body").append(this.heightOffset);
        }
        this.heightOffset.css({
            width:1,
            height:h*this.elements.length,
            position:"absolute",
            top:0,
            left:0
        });
    };
    proto.initialize = function(opts){
        this.timeScale = opts && opts.timeScale ? opts.timeScale : 1;
        this.elements = $("[core-story]");
        core.addons.CoreWindow.instance().on("window.scroll", this._("update"), this);
        core.addons.CoreWindow.instance().on("window.resize", this._("resizeElements"), this);
        this.resizeElements();
        this.timeline = new TimelineMax();
        this.configureStory();
        this.update();
    };
    proto.configureStory = function(){
        var len = -1;
        var len2 = this.elements.length;
        while(len++ < len2){
            var current = $(this.elements[len]);
            var config = current.attr("core-story-animation");
            var label = current.attr("core-story");
            if(config){
                var configObj = new Function("return "+config)();
                if(configObj.speed){
                    var speed = configObj.speed;
                    delete configObj.speed;
                }
                this.timeline.add(TweenMax.from(current, speed || 1, configObj));
            }
            var children = current.find("[core-element-animation]");
            var i = -1;
            var clen = children.length;
            while(i++ < clen){
                var config = $(children[i]).attr("core-element-animation");
                if(config){
                    var configObj = new Function("return "+config)();
                    if(configObj.speed){
                        var speed = configObj.speed;
                        delete configObj.speed;
                    }
                    this.timeline.add(TweenMax.from(children[i], speed || 1, configObj));
                }
            }

        }
        this.timeline.pause();
    };
    core.registerNamespace("core.addons.storyboard.StoryBoard", StoryBoard);

})();