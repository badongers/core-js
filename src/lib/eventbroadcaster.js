/**
 * ** Singleton. ** <br>Allows a global object to be utilized for broadcasting events.<br><br>
 * ** Example: ** <br> <pre>EventBroadcaster.instance().on("eventName", scope._("someEvent"), scope);</pre>
 * @class EventBroadcaster
 * @namespace core
 * @extends core.EventDispatcher
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core derived class.
 *
 */
(function() {
  core.registerModule({
    inherits: "core.EventDispatcher",
    singleton: true,
    classname: "core.EventBroadcaster",
    module: function() {}
  });

})();
