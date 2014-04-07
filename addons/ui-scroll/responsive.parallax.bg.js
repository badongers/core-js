(function ($) {
    var Module = core.delegates.Module,
        __super__ = Module.prototype;

    function ResponsiveParallaxBG(opts) {
        if (opts && opts.__inheriting__) return;
        Module.call(this, opts);
    }
    ResponsiveParallaxBG.inherits(Module);
    var proto = ResponsiveParallaxBG.prototype;

    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.construct = function(opts){
        __super__.construct.call(this, opts);

    };
    proto.loadImages = function(){
        this.midW = 768;
        this.smallW = 480;
        var len = this.img.length;
        var i = -1;
        var loaded = 0;

        var fakes = [];
        while(i++ < len){
            fakes[i] = $("<img/>").css({
                position:"absolute",
                left:0,
                top:0,
                visibility:"hidden"

            });
            $("body").append(fakes[i]);
            fakes[i].attr("src", $(this.img[i]).attr("data-src"));
            fakes[i].on("load", (function(xx){
                loaded++;
                $(this.img[xx]).width(fakes[xx].width());
                $(this.img[xx]).height(fakes[xx].height());
                fakes[xx].remove();
                if(loaded == len){
                    fakes = null;
                    this.startHandlingImages();
                }
            }).bind(this, i));
        }
    };
    proto.startHandlingImages = function(){
        var len2 = this.img.length;
        var i2 = -1;
        while(i2++ < len2-1){
            this.orig[i2] = {w:$(this.img[i2]).width(), h:$(this.img[i2]).height()};
            $(this.img[i2]).css({
                "background-image":"url('"+$(this.img[i2]).attr("data-src")+"')",
                "background-position":"50% 0",
                "background-repeat":"no-repeat",
                "background-attachment":core.browser.isTouch ? "static" : "fixed"
            });
        }
        $(window).on("resize", this._("onWindowResize"));
        $(window).on("scroll", this._("onWindowScroll"));
        $(window).trigger("resize");

    };

    proto.initialized = function(opts){
        this.img = this.el.find("[img-dummy]");
        this.setParentSize();
        this.offset = 200;
        this.orig = [];
        this.loadImages();
    };
    proto.setParentSize = function(){
        this.parent = {size:{width:this.el.width(), height:this.el.height()}}
    };
    proto.onWindowScroll = function(evt){
        if(core.browser.isTouch) return;
        var len = this.img.length;
        while (len--) {
            var offset = this.img[len].getAttribute("scroll-offset") || .1;
            var top = core.rect(this.img[len]).top;
            $(this.img[len]).css({"background-position":"center "+(top * offset)+"px"});
        }
    };
    proto.onWindowResize = function(evt){
        this.setParentSize();
        var w = $(window).width();
        var h = $(window).height();
        this.stage = {w:w, h:h};
        var len = this.img.length;
        var i = -1;
        var fakes = [];

        while(i++ < len-1){

            if($(window).width() <= this.midW && $(window).width() > this.smallW && $(this.img[i]).attr("data-src-medium")){

                fakes[i] = $("<img/>").css({
                    position:"absolute",
                    left:0,
                    top:0,
                    visibility:"hidden"

                });
                $("body").append(fakes[i]);
                fakes[i].attr("src", $(this.img[i]).attr("data-src-medium"));
                fakes[i].on("load", (function(xx){
                    $(this.img[xx]).width(fakes[xx].width());
                    $(this.img[xx]).height(fakes[xx].height());
                    fakes[xx].remove();
                    $(this.img[xx]).attr("data-src-medium-loaded", 1);
                    this.orig[xx] = {w:$(this.img[xx]).width(), h:$(this.img[xx]).height()};

                    $(this.img[xx]).css({
                        "background-image":"url('"+$(this.img[xx]).attr("data-src-medium")+"')",
                        "background-position":"50% 0",
                        "background-repeat":"no-repeat",
                        "background-attachment":core.browser.isTouch ? "static" : "fixed"
                    });

                    var aw = this.aspectScaleW(this.orig[xx].w, this.orig[xx].h, this.stage.w+this.offset);
                    if(aw.height < this.parent.size.height){
                        aw = this.aspectScaleH(this.orig[xx].w, this.orig[xx].h, this.parent.size.height+this.offset);
                    }
                    $(this.img[xx]).width(aw.width);
                    $(this.img[xx]).height(aw.height);
                    this.checkOverflow();
                }).bind(this, i));
            }else if($(window).width() <= this.smallW && $(this.img[i]).attr("data-src-small")){

                fakes[i] = $("<img/>").css({
                    position:"absolute",
                    left:0,
                    top:0,
                    visibility:"hidden"

                });
                $("body").append(fakes[i]);
                fakes[i].attr("src", $(this.img[i]).attr("data-src-small"));
                fakes[i].on("load", (function(xx){
                    $(this.img[xx]).width(fakes[xx].width());
                    $(this.img[xx]).height(fakes[xx].height());
                    fakes[xx].remove();
                    $(this.img[xx]).attr("data-src-small-loaded", 1);
                    this.orig[xx] = {w:$(this.img[xx]).width(), h:$(this.img[xx]).height()};

                    $(this.img[xx]).css({
                        "background-image":"url('"+$(this.img[xx]).attr("data-src-small")+"')",
                        "background-position":"50% 0",
                        "background-repeat":"no-repeat",
                        "background-attachment":core.browser.isTouch ? "static" : "fixed"
                    });

                    var aw = this.aspectScaleW(this.orig[xx].w, this.orig[xx].h, this.stage.w+this.offset);
                    if(aw.height < this.parent.size.height){
                        aw = this.aspectScaleH(this.orig[xx].w, this.orig[xx].h, this.parent.size.height+this.offset);
                    }
                    $(this.img[xx]).width(aw.width);
                    $(this.img[xx]).height(aw.height);
                    this.checkOverflow();
                }).bind(this, i));
            }else{
                if($(this.img[i]).attr("data-src-medium") || $(this.img[i]).attr("data-src-small")){
                    $(this.img[i]).css({
                        "background-image":"url('"+$(this.img[i]).attr("data-src")+"')",
                        "background-position":"50% 0",
                        "background-repeat":"no-repeat",
                        "background-attachment":core.browser.isTouch ? "static" : "fixed"
                    });
                }


                var aw = this.aspectScaleW(this.orig[i].w, this.orig[i].h, this.stage.w+this.offset);
                if(aw.height < this.parent.size.height){
                    aw = this.aspectScaleH(this.orig[i].w, this.orig[i].h, this.parent.size.height+this.offset);
                }
                $(this.img[i]).width(aw.width);
                $(this.img[i]).height(aw.height);
                this.checkOverflow();
            }

        }


    };
    proto.checkOverflow = function(){
        var pbounds = {width:this.parent.size.width, height:this.parent.size.height}
        var len = this.img.length;
        var mleft = 0;
        var mtop = 0;
        while(len--){
            mtop = pbounds.height/2 - $(this.img[len]).height()/2;
            mleft = pbounds.width/2-$(this.img[len]).width()/2;
            $(this.img[len]).css({
                "background-size":$(this.img[len]).width()+"px "+$(this.img[len]).height()+"px",
                "left":mleft,
                "top":mtop
            });

        }
        setTimeout(function(){
            $(window).trigger("scroll");
        }, 100);


    };
    proto.aspectScaleH = function(ow, oh, th){
        return {height:th, width:(th/oh)*ow};
    };
    proto.aspectScaleW = function(ow, oh, tw){
        return {height:(tw/ow)*oh, width:tw};
    };
    core.registerNamespace("window.ResponsiveParallaxBG", ResponsiveParallaxBG);

})(core.selector);