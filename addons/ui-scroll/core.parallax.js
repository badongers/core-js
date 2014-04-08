
(function ($, scope) {
    var Core = core.Core,
        __super__ = Core.prototype;

    function CoreParallax(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    CoreParallax.inherits(Core);
    var proto = CoreParallax.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.findBackgrounds = function(){

    };
    core.registerNamespace("CoreParallax", CoreParallax);

})(core.selector, typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window);