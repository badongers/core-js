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
        while(i++ < len-1){
            var img = document.createElement("img");
            img.style.position = "absolute";
            img.style.left = 0+"px";
            img.style.top = 0+"px";
            img.style.visibility = "hidden";
            fakes[i] = img;
            document.body.appendChild(img);
            img.setAttribute("src", this.img[i].getAttribute("data-src"));
            img.onload = (function(xx){
                loaded++;
                this.img[xx].style.width = core.rect(fakes[xx]).width+"px";
                this.img[xx].style.height = core.rect(fakes[xx]).height+"px";
                document.body.removeChild(fakes[xx]);
                if(loaded == len){
                    fakes = null;
                    this.startHandlingImages();
                }
            }).bind(this, i);

        }
    };
    proto.startHandlingImages = function(){
        var len2 = this.img.length;
        var i2 = -1;

        while(i2++ < len2-1){
            this.orig[i2] = {w:core.rect(this.img[i2]).width, h:core.rect(this.img[i2]).height};
            this.img[i2].style.backgroundImage = "url('"+this.img[i2].getAttribute("data-src")+"')";
            this.img[i2].style.backgroundPosition = "50% 0";
            this.img[i2].style.backgroundRepeat = "no-repeat";
            this.img[i2].style.backgroundAttachment = core.browser.touch ? "static" : "fixed";
        }
        window.onresize = this._("onWindowResize");
        window.onscroll = this._("onWindowScroll");
        this.onWindowResize();

    };

    proto.initialized = function(opts){
        this.img = this.find("[parallax]");
        if(!this.img.length){
            if(this.el.getAttribute("data-src")){
                //set to self
            }
        }
        this.setParentSize();
        this.offset = 200;
        this.orig = [];
        this.loadImages();
    };
    proto.setParentSize = function(){

        this.parent = {size:{width:core.rect(this.el).width, height:core.rect(this.el).height}};

    };
    proto.onWindowScroll = function(evt){
        if(core.browser.touch) return;

        var len = this.img.length;
        while (len--) {
            var offset = this.img[len].getAttribute("scroll-offset") || .1;
            var top = core.rect(this.img[len]).top;
            this.img[len].style.backgroundPosition = "center "+(top * offset)+"px";
        }
    };
    proto.onWindowResize = function(evt){
        this.setParentSize();
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.stage = {w:w, h:h};
        var len = this.img.length;
        var i = -1;
        var fakes = [];

        while(i++ < len-1){

            if(w <= this.midW && w > this.smallW && this.img[i].getAttribute("data-src-medium")){

                    fakes[i] = document.createElement("img");
                    fakes[i].style.position = "absolute";
                    fakes[i].style.left = fakes[i].style.top = 0+"px";
                    fakes[i].style.visibility = "hidden";
                    document.body.appendChild(fakes[i]);
                    fakes[i].setAttribute("src", this.img[i].getAttribute("data-src-medium"));

                fakes[i].onload = (function(xx){
                    this.img[xx].style.width = core.rect(fakes[xx]).width+"px";
                    this.img[xx].style.height = core.rect(fakes[xx]).height+"px";
                    document.body.removeChild(fakes[xx]);
                    this.img[xx].setAttribute("data-src-medium-loaded", 1);
                    this.orig[xx] = {w:core.rect(this.img[xx]).width, h:core.rect(this.img[xx]).width};


                    this.img[xx].style.backgroundImage = "url('"+this.img[xx].getAttribute("data-src-medium")+"')";
                    this.img[xx].style.backgroundPosition = "50% 0",
                    this.img[xx].style.backgroundRepeat = "no-repeat",
                    this.img[xx].style.backgroundAttachment = core.browser.touch ? "static" : "fixed"

                    var aw = this.aspectScaleW(this.orig[xx].w, this.orig[xx].h, this.stage.w+this.offset);
                    if(aw.height < this.parent.size.height){
                        aw = this.aspectScaleH(this.orig[xx].w, this.orig[xx].h, this.parent.size.height+this.offset);
                    }
                    this.img[xx].style.width = aw.width+"px";
                    this.img[xx].style.height = aw.height+"px";
                    this.checkOverflow();
                }).bind(this, i);

            }else if(w <= this.smallW && this.img[i].getAttribute("data-src-small")){

                fakes[i] = document.createElement("img");
                fakes[i].style.position = "absolute";
                fakes[i].style.left = fakes[i].style.top = 0+"px";
                fakes[i].style.visibility = "hidden";
                document.body.appendChild(fakes[i]);
                fakes[i].setAttribute("src", this.img[i].getAttribute("data-src-small"));

                fakes[i].onload = (function(xx){
                    this.img[xx].style.width = core.rect(fakes[xx]).width+"px";
                    this.img[xx].style.height = core.rect(fakes[xx]).height+"px";
                    document.body.removeChild(fakes[xx]);
                    this.img[xx].setAttribute("data-src-small-loaded", 1);
                    this.orig[xx] = {w:core.rect(this.img[xx]).width, h:core.rect(this.img[xx]).width};



                    this.img[xx].style.backgroundImage = "url('"+this.img[xx].getAttribute("data-src-small")+"')";
                    this.img[xx].style.backgroundPosition = "50% 0",
                    this.img[xx].style.backgroundRepeat = "no-repeat",
                    this.img[xx].style.backgroundAttachment = core.browser.touch ? "static" : "fixed"

                    var aw = this.aspectScaleW(this.orig[xx].w, this.orig[xx].h, this.stage.w+this.offset);
                    if(aw.height < this.parent.size.height){
                        aw = this.aspectScaleH(this.orig[xx].w, this.orig[xx].h, this.parent.size.height+this.offset);
                    }
                    this.img[xx].style.width = aw.width+"px";
                    this.img[xx].style.height = aw.height+"px";
                    this.checkOverflow();
                }).bind(this, i);
            }else{
                if(this.img[i].getAttribute("data-src-medium") || this.img[i].getAttribute("data-src-small")){
                    this.img[i].style.backgroundImage = "url('"+this.img[i].getAttribute("data-src")+"')";
                    this.img[i].style.backgroundPosition = "50% 0",
                    this.img[i].style.backgroundRepeat = "no-repeat",
                    this.img[i].style.backgroundAttachment = core.browser.touch ? "static" : "fixed"
                }
                var aw = this.aspectScaleW(this.orig[i].w, this.orig[i].h, this.stage.w+this.offset);
                if(aw.height < this.parent.size.height){
                    aw = this.aspectScaleH(this.orig[i].w, this.orig[i].h, this.parent.size.height+this.offset);
                }
                this.img[i].style.width = aw.width+"px";
                this.img[i].style.height = aw.height+"px";
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
            mtop = pbounds.height/2 - core.rect(this.img[len]).height/2;
            mleft = pbounds.width/2-core.rect(this.img[len]).width/2;
            this.img[len].style.backgroundSize = core.rect(this.img[len]).width+"px "+core.rect(this.img[len]).height;
            this.img[len].style.left = mleft+"px";
            this.img[len].style.top = mtop+"px";

        }
        setTimeout((function(){
            this.onWindowScroll();
        }).bind(this), 100);


    };
    proto.aspectScaleH = function(ow, oh, th){
        return {height:th, width:(th/oh)*ow};
    };
    proto.aspectScaleW = function(ow, oh, tw){

        return {height:(tw/ow)*oh, width:tw};
    };
    core.registerNamespace("window.ResponsiveParallaxBG", ResponsiveParallaxBG);

})(core.selector);