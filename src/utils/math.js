// Math prototypes
// ----------------
// Additional methods to the Math prototype.
(function(){
    //
    //### Math.randomFloat ######
    //Generates a random float<br>
    if(!Math.randomFloat){
        Math.randomFloat = function(min, max){
            return (Math.random() * (max - min)) + min;
        };
    }

    //
    //### Math.randomFloat ######
    //Generates a random int<br>
    if(!Math.randomInt){
        Math.randomInt = function(min, max){
            return Math.min(max, Math.floor(Math.random() * (1 + max - min)) + min);
        };
    }
    //
    //### Math.aspectScaleHeight ######
    //Maintains scale ratio resizing using a target/intended height<br>
    Math.aspectScaleHeight = function(origW, origH, targH){
        return {height:targH, width:(targH/origH)*origW};
    };
    //### Math.aspectScaleWidth ######
    //Maintains scale ratio resizing using a target/intended width<br>
    Math.aspectScaleWidth = function(origW, origH, targW){
        return {height:(targW/origH)*oh, width:targW};
    };
})();
