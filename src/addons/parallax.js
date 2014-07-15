/**
 * Created by donaldmartinez on 13/05/15.
 */
(function(){
    core.registerModule({
        inherits:"core.Core",
        classname:"core.Parallax",
        singleton:true,
        module:["core.WindowEvents", function(windowevents){
            this.onAfterConstruct = function(){
                this.supportTouch = core.browser.touch;
                this.elements = this.findAll("[core-parallax]");
                if(this.elements.length){
                    windowevents.on("window.scroll", this._("update"), this);
                    windowevents.on("window.device.motion", this._("updateAcceleration"), this);
                    this.tick = true;
                    this.update();
                }
            }
            this.update = function(){
                var len = this.elements.length;
                while(len--){
                    var offset = Number(this.elements[len].getAttribute("scroll-offset")) || .1;
                    var invert = Number(this.elements[len].getAttribute("scroll-invert")) || 0;
                    var top = core.rect(this.elements[len]).top;
                    var value = top*offset;
                    if(invert){
                        value *= -1;
                    }
                    this.elements[len].style.backgroundPosition = "center "+value+"px";
                }
                this.tick = false;
            };
            this.updateAcceleration = function(evt){
                //console.log(evt);
                //untested
                this.update();
            };

        }]
    });
})();