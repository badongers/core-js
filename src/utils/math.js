(function(){
    Math.prototype.randomFloat = function(min, max){
        return (Math.random() * (max - min)) + min;
    };
    Math.prototype.randomInt = function(min, max){
        return Math.min(max, Math.floor(Math.random() * (1 + max - min)) + min);
    };
    Math.prototype.aspectScaleHeight = function(origW, origH, targH){
        return {height:targH, width:(targH/origH)*origW};
    };
    Math.prototype.aspecScaleWidth = function(origW, origH, targW){
        return {height:(targW/origH)*oh, width:targW};
    };
})();
