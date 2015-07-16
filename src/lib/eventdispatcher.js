/**
 * The main class that implements broadcaster pattern. Ideally subclassed by objects that will perform broadcasting functions.
 *
 * @class EventDispatcher
 * @namespace core
 * @extends core.Core
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core derived class.
 * @param {HTMLElement} opts.el The node element included in the class composition.
 * TODO: Refactor and simplify listening function - something like this.on("EVENT", method); but still retain garbage collection
 */
(function() {
  core.registerModule({
    classname: "core.EventDispatcher",
    module: function() {
      this.onAfterConstruct = function(opts) {
        this.events = {};
      };
      this.onBeforeDispose = function() {
        this.removeAll();
        this.events = null;
      };

      /**
       * Subscribe function. Called when adding a subscriber to the broadcasting object.
       *
       * @method on
       * @param {String} eventName The event name being subscribed to
       * @param {Function} method The method handler to trigger when the event specified is dispatched.
       * @param {core.Core} scope Reference to the scope of the event handler
       */
      this.on = function(evt, method, scope) {

        if (!("events" in this)) {
          this.events = {};
        }

        if (!this.events[evt]) {
          this.events[evt] = [];
        }

        register.call(this, evt, scope, method);
      };

      /**
       * Subscribe once function. Called when adding a subscriber to the broadcasting object.
       *
       * @method once
       * @param {String} eventName The event name being subscribed to
       * @param {Function} method The method handler to trigger when the event specified is dispatched.
       * @param {core.Core} scope Reference to the scope of the event handler
       */
      this.once = function(evt, method, scope) {
        if (!this.events[evt + "_once"]) {
          this.events[evt + "_once"] = [];
        }
        register.call(this, evt, scope, method, true);
      };

      /**
       * Unsubscribe function. Called when removing a subscriber from the broadcasting object.
       *
       * @method off
       * @param {String} eventName The event name unsubscribing from.
       * @param {Function} method The method handler to trigger when the event specified is dispatched.
       * @param {core.Core} scope Reference to the scope of the event handler
       */
      this.off = function(evt, method, scope) {
        unregister.call(this, evt, scope, method);
        unregister.call(this, evt + "_once", scope, method);
      };

      /**
       * Unsubscribe function - scope context. Unsubscribes a specific scope from ALL events
       *
       * @method removeScope
       * @param {core.Core} scope Reference to the scope subscriber being removed.
       */
      this.removeScope = function(scope) {
        var len, o;

        for (var prop in this.events) {
          len = this.events[prop].length;
          while (len--) {
            if (this.events[prop][len].scope === scope) {
              o = this.events[prop].splice(len, 1).pop();
              if (o.scope.dispose && o.dispose_orig) {
                o.scope.dispose = o.dispose_orig;
              }
              delete o.scope.__core__signal__id__;
              o = null;
            }
          }
          if (this.events[prop].length === 0) {
            delete this.events[prop];
          }
        }
      };

      /**
       * Removes all items from the listener list.
       *
       * @method removeAll
       */
      this.removeAll = function() {
        var len, o;

        for (var prop in this.events) {
          len = this.events[prop].length;
          while (this.events[prop].length) {
            o = this.events[prop].shift();
            if (o.scope.dispose && o.dispose_orig) {
              o.scope.dispose = o.dispose_orig;
            }
            delete o.__core__signal__id__;
            o = null;
          }
          if (this.events[prop].length === 0) {
            delete this.events[prop];
          }
        }
        this.events = {};
      };

      /**
       * Broadcast functions. Triggers a broadcast on the EventDispatcher/derived object.
       *
       * @method trigger
       * @param {String} eventName The event name to trigger/broadcast.
       * @param {Object} variables An object to send upon broadcast
       */
      this.trigger = function(evt, vars) {
        var dis = vars || {},
          sevents, len, obj, i, oevents;

        if (!dis.type) {
          dis.type = evt;
        }
        if (this.events && this.events[evt]) {
          sevents = this.events[evt];
          len = sevents.length;
          for (i = 0; i < len; i++) {
            obj = sevents[i];
            obj.scope[obj.method].call(obj.scope, dis);
            obj = null;
          }
        }
        if (this.events && this.events[evt + "_once"]) {
          oevents = this.events[evt + "_once"];
          while (oevents.length) {
            obj = oevents.shift();
            obj.scope[obj.method].call(obj.scope, dis);
            obj = null;
          }
          if (!oevents.length) {
            delete this.events[evt + "_once"];
          }
        }
        dis = null;
      };

      /**
       * Checks the array of listeners for existing scopes.
       *
       * @method containsScope
       * @param {Array} list Reference to the array of subscribed listeners
       * @param {Object} scope Reference to the scope being queried for existence
       * @private
       * @return {Booleans} Returns boolean indicating the existence of the scope passed on the parameters
       */
      function containsScope(arr, scope) {
        for (var i = 0, len = arr.length; i < len; i++) {
          if (arr[i].scope === scope) {
            return arr[i];
          }
        }

        scope.__core__signal__id__ = core.util.guid();
        return -1;
      } // END containsScope()

      /**
       * Private method handler for event registration.
       *
       * @method register
       * @param {String} eventName The event name being added on the listener list.
       * @param {Object} scope Reference to the scope of the event handler
       * @param {Function} method The method used by the scope to handle the event being broadcasted
       * @param {Boolean} once Specify whether the event should only be handled once by the scope and its event handler
       * @private
       */
      function register(evt, scope, method, once) {

        var __sig_dispose__ = null,
          exists = containsScope.call(this, this.events[evt + (once ? "_once" : "")], scope);

        if (exists === -1 && scope.dispose) {
          __sig_dispose__ = scope.dispose;

          scope.dispose = (function() {
            var meth = Array.prototype.shift.call(arguments);
            var sig = Array.prototype.shift.call(arguments);
            sig.removeScope(this, scope);
            sig = null;
            meth = null;

            return __sig_dispose__.apply(this, arguments);
          }).bind(scope, method, this);
          //
          this.events[evt + (once ? "_once" : "")].push({
            method: method,
            scope: scope,
            dispose_orig: __sig_dispose__
          });
        } else {
          //if scope already exists, check if the method has already been added.
          if (exists !== -1) {
            if (exists.method != method) {
              this.events[evt + (once ? "_once" : "")].push({
                method: method,
                scope: exists.scope,
                dispose_orig: exists.dispose_orig
              });
            }
          } else {

            this.events[evt + (once ? "_once" : "")].push({
              method: method,
              scope: scope,
              dispose_orig: null
            });
          }
        }
      } // END register()

      /**
       * Private method handler for unregistering events
       *
       * @method unregister
       * @param {String} eventName The event name being added on the listener list.
       * @param {Object} scope Reference to the scope of the event handler
       * @param {Function} method The method used by the scope to handle the event being broadcasted
       * @param {Boolean} once Specify whether the event should only be handled once by the scope and its event handler
       * @private
       */
      function unregister(evt, scope, method) {
        var len, o;
        if (this.events[evt]) {
          len = this.events[evt].length;
          while (len--) {
            if (this.events[evt][len].scope === scope && this.events[evt][len].method === method) {
              o = this.events[evt].splice(len, 1).pop();
              if (o.scope.dispose && o.dispose_orig) {
                o.scope.dispose = o.dispose_orig;
              }
              delete o.scope.__core__signal__id__;
              o.scope = null;
              o.dispose_orig = null;
              delete o.dispose_orig;
              o = null;
            }
          }
          if (this.events[evt].length === 0) {
            delete this.events[evt];
          }
        }
      } // END unregister()
    }
  });
})();
