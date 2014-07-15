// String prototypes
// ----------------
// Additional methods to the String prototype.
(function(){
    core.registerModule({
        mixin:"String",
        module:function(){
            if(typeof String.prototype.trim !== 'function') {
                this.trim = function () {
                    return this.replace(/^\s+|\s+$/g, '');
                }
            }
        }
    });
})();