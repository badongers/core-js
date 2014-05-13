/**
 * The base module for the Core JS framework.
 * It provides helper methods for implementing OOP methodologies and basic utilities such as browser detection.
 *
 * @module addons
 */
(function () {
    var EventDispatcher = core.events.EventDispatcher,
        __super__ = EventDispatcher.prototype;
    /**
     * The main class that implements Geolocation services.
     *
     * @class CoreLocation
     * @extends core.Core
     * @namespace core.addons
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core derived class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */
    function CoreLocation(opts) {
        if (opts && opts.__inheriting__) return;
        EventDispatcher.call(this, opts);
    }
    CoreLocation.inherits(EventDispatcher);
    var proto = CoreLocation.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        this.initialize();
    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.initialize = function(){
        if(typeof navigator.geolocation == "undefined"){
            return console.warn("Geolocation not available.")
        }
        navigator.geolocation.getCurrentPosition(this._("onLocationRetrieved"), this._("onErrorLocation"));
    };
    proto.onLocationRetrieved = function(position){
        this.current = position.coords;
        this.trigger("ready", {target:this, coords:position.coords});
    };
    proto.onErrorLocation = function(msg){
        this.trigger("error", {target:this, message:msg});
    };
    var calculateDistance = function(point1, point2){
        //haversine
        var lat2 = point2.latitude;
        var lon2 = point2.longitude;
        var lat1 = point1.latitude;
        var lon1 = point1.longitude;
        var R = 6371; // km
        var x1 = lat2-lat1;
        var dLat = x1 * Math.PI / 180;
        var x2 = lon2-lon1;
        var dLon = x2 * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    proto.getDistanceFromCurrentLocation = function(point){
        return calculateDistance(this.current, point);
    };
    proto.getDistanceFromLocations = function(point1, point2){
        return calculateDistance(point1, point2);
    };
    var instance;
    var o = {
        init:function (opts) {
            if (instance == null) {
                instance = new CoreLocation(opts);
            }
            return instance;
        }
    };
    o.instance = o.init;

    core.registerNamespace("core.addons.location.CoreLocation", o);

})();