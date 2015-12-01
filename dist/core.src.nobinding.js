/*! core 2015-12-01 */
/**
 * The base module for the Core JS framework.
 * It provides helper methods for implementing OOP methodologies and basic utilities such as browser detection.
 *
 * @module core
 */
(function(scope) {

  var core = {},
    __queue__ = [];

  /**
   * Utility method for implementing prototypal inheritance within the core framework.
   *
   * @method inherits
   * @param {Object} obj The object where the prototype is going to be derived from.
   *
   */
  Function.prototype.inherits = function(obj) {
    this.prototype = new obj({
      __inheriting__: true
    });
  };

  /**
   * Set helper properties if the environment is a browser.
   * Creates a browser object in the core object containing browser information.
   *
   */
  (function setBrowser() {
    if (!navigator) {
      return;
    }

    var br = {
        mobile: false,
        ios: false,
        iphone: false,
        ipad: false,
        android: false,
        webos: false,
        mac: false,
        windows: false,
        other: true,
        touch: 'ontouchstart' in window
      },
      N = navigator.appName,
      ua = navigator.userAgent,
      tem = ua.match(/version\/([\.\d]+)/i),
      M = ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);

    if (M && tem) {
      M[2] = tem[1];
    }

    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];

    br.name = M[0].toLowerCase() == "trident" ? "msie" : M[0].toLowerCase();
    br.version = M[1].split(".")[0];
    br.fullVersion = M[1];

    if (/mobile/i.test(ua)) {
      br.mobile = true;
    }

    if (/like Mac OS X/.test(ua)) {
      br.ios = ver(/CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/, 2, /_/g, '.');
      br.iphone = /iPhone/.test(ua);
      br.ipad = /iPad/.test(ua);
    } else if (/Android/.test(ua)) {
      br.android = ver(/Android ([0-9\.]+)[\);]/, 1);
    } else if (/webOS\//.test(ua)) {
      br.webos = ver(/webOS\/([0-9\.]+)[\);]/, 1);
    } else if (/Windows NT/.test(ua)) {
      br.windows = ver(/Windows NT ([0-9\._]+)[\);]/, 1);
    } else if (/(Intel|PPC) Mac OS X/.test(ua)) {
      br.mac = ver(/(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/, 2, /_/g, '.');
    } else {
      br.other = false;
    }

    function ver(re, index, replaceA, replaceB) {
      var v = re.exec(ua);

      if (typeof v.length === 'number' && v.length >= (index + 1)) {
        if (replaceA && replaceB) {
          return v[index].replace(replaceA, replaceB);
        } else {
          return v[index];
        }
      } else {
        return true;
      }
    }

    /**
     * Store browser information based on the detection algorithm implemented within core.
     * @property browser
     * @type Object
     */
    core.browser = br;

  }()); // END setBrowser()

  (function defineUtils() {
    var util = {};

    /**
     * Utility method for generating GUID. [http://stackoverflow.com/a/873856/820640]
     * @method guid
     * @returns String Returns a GUID string
     */
    util.guid = function() {
      var s = [],
        hexDigits = "0123456789abcdef",
        uuid,
        i = 0;
      for (; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      uuid = s.join("");
      return uuid;
    };

    /**
     * Utility method for getting the bounding rect of the dom element - also adds support for IE8
     * @method rect
     * @returns Object Contains the rectangular information of a HTMLElement
     */
    util.rect = function(targ) {
      var box = {};
      box = (function() {
        var o;
        if (targ instanceof Array) {
          o = targ[0].getBoundingClientRect();
        } else {
          targ.getBoundingClientRect();
        }

        // Because the return value of getBoundingClientRect() is frozen, re-construct return object.
        return {
          top: o.top,
          left: o.left,
          right: o.right,
          bottom: o.bottom,
          width: o.width,
          height: o.height
        };
      }());
      if (typeof box.width == "undefined") {
        box.width = box.right - box.left;
        box.height = box.bottom + box.top;
      } else if (typeof box.right == "undefined") {
        box.right = box.left + box.width;
        box.bottom = box.top + box.height;
      }

      return box;
    };

    /**
     * Core utility object. Contains useful utility functions.
     * @property util
     * @type Object
     */
    core.util = util;
  }());

  /**
   * Utility method for exposing objects in a namespaced fashion.
   * @method registerNamespace
   */
  core.registerNamespace = function(nspace, obj) {
    var parts = nspace.split("."),
      root = parts.shift(),
      temp, sp, last;

    if (!scope[root]) {
      scope[root] = {};
    }
    temp = scope[root];

    while (parts.length > 1) {
      sp = parts.shift();
      if (!temp[sp]) {
        temp[sp] = {};
      }
      temp = temp[sp];
    }
    if (!parts.length) {
      scope[root] = obj;
    } else {
      last = parts.shift();
      if (last) {
        temp[last] = obj || {};
      }
    }
  };

  /**
   * Utility method for referencing objects within the core framework. This also adds existence checking for the objects being referenced on import.
   * @method _import
   * @param {String} package The namespace of the object being imported.
   * @returns Object The object being imported
   */
  core._import = function(pack) {
    var parts = pack.split("."),
      sc = scope,
      sp;

    while (parts.length) {
      sp = parts.shift();
      if (sc[sp]) {
        sc = sc[sp];
      } else {
        return null;
      }
    }

    return sc;
  };

  /**
   * Utility method for performing dependency checks on core classes.
   * @method dependency
   * @param {String} object The object to check if its defined.
   * @param {String} message The message to display on warning when the object passed for checking is undefined.
   * @returns Object The object being imported
   */
  core.dependency = function(obj, message) {
    if (!scope[obj]) {
      console.warn(message);
    }
  };

  /** DOCUMENT READY **/
  core.documentReady = function(win, fn) {
    if (typeof jQuery !== 'undefined') {
      jQuery(document).ready(fn);
    } else {
      (function() {
        var done = false,
          top = true,
          doc = win.document,
          root = doc.documentElement,
          add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
          rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
          pre = doc.addEventListener ? '' : 'on',

          init = function(e) {
            if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
            (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
            if (!done && (done = true)) fn.call(win, e.type || e);
          },

          poll = function() {
            try {
              root.doScroll('left');
            } catch (e) {
              setTimeout(poll, 50);
              return;
            }
            init('poll');
          };

        if (doc.readyState == 'complete') {
          fn.call(win, 'lazy');
        } else {
          if (doc.createEventObject && root.doScroll) {
            try {
              top = !win.frameElement;
            } catch (e) {}
            if (top) poll();
          }
          doc[add](pre + 'DOMContentLoaded', init, false);
          doc[add](pre + 'readystatechange', init, false);
          win[add](pre + 'load', init, false);
        }
      }());
    }
  };

  if (!scope.addEventListener) {
    (function(WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
      WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function(type, listener) {
        var target = this;

        registry.unshift([target, type, listener, function(event) {
          event.currentTarget = target;
          event.preventDefault = function() {
            event.returnValue = false
          };
          event.stopPropagation = function() {
            event.cancelBubble = true
          };
          event.target = event.srcElement || target;

          listener.call(target, event);
        }]);

        this.attachEvent("on" + type, registry[0][3]);
      };

      WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function(type, listener) {
        for (var index = 0, register; register = registry[index]; ++index) {
          if (register[0] == this && register[1] == type && register[2] == listener) {
            return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
          }
        }
      };

      WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function(eventObject) {
        return this.fireEvent("on" + eventObject.type, eventObject);
      };
    }(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []));
  }

  core.ENV = {};
  core.configure = function(o) {
    for (var prop in o) {
      if (o.hasOwnProperty(prop)) {
        this.ENV[prop] = o[prop];
      }
    }
  };

  core.mixin = function(base, mix) {
    for (var prop in mix) {
      if (mix.hasOwnProperty(prop)) {
        base[prop] = mix[prop];
      }
    }
  };

  core.registerModule = function(definition) {
    if (definition.classname) {
      if (checkDIs(definition)) {
        try{
          manageModuleRegistration(definition);
        }catch(err){
          //failure to register module.
          //push into first index of the __queue__
          __queue__.splice(0, 0, definition);
        }

        if (__queue__.length) {
          core.registerModule(__queue__.pop());
        }
      } else {
        __queue__.push(definition); //queue up classes with missing dependencies
      }
    } else if (definition.mixin) {
      (function() {
        var base = new Function("return " + definition.mixin)(),
          tscope = {},
          module = definition.module,
          mfunc, len;
        if (module instanceof Array && module.length) {
          mfunc = module.pop();
          len = module.length;
          while (len--) {
            module[len] = retrieveClass(module[len], scope);
          }
          mfunc.apply(tscope, module);
        } else if (typeof module == "function") {
          module.apply(tscope);
        }

        for (var prop in tscope) {
          if ("prototype" in base) {
            base.prototype[prop] = tscope[prop];
          } else {
            base[prop] = tscope[prop];
          }
        }
      }());
    } else {
      throw new Error("Error registering a module");
    }
  };

  core.strapUp = function(func, useclass) {
    if (__queue__.length) {
      while (__queue__.length) {
        manageModuleRegistration(__queue__.pop()); //load remaining definitions without checking dependencies.
      }
    }
    //instantiate body as a module
    //this will trigger instantiation of each child element as core modules.
    var found = false,
      evaluateRootApp = function(root) {
        var cls = useclass ? core._import(useclass) : core.Module,
          opts = {};

        opts.el = root;
        if ('jQuery' in window) {
          opts.$el = $(root);
        }
        if (!("__coreapp__" in window)) {
          window.__coreapp__ = new cls(opts);
        } else {
          if (!(window.__coreapp__ instanceof Array)) {
            window.__coreapp__ = [window.__coreapp__];
          }
          window.__coreapp__.push(new cls(opts));
        }
        found = true;
      };

    core.documentReady(window, function docready() {
      evaluateRootApp(window.document.body);
      func();
    });
  };

  function nameFunction(name, fn) {
    return (new Function("return function(call) { return function " + name + "() { return call(this, arguments) }; };")())(Function.apply.bind(fn));
  } // END nameFunction()

  function retrieveClass(namespace, scope) {
    var namespaces = namespace.split("."),
      len = namespaces.length,
      cscope = scope;

    for (var i = 0; i < len; i++) {
      try {
        cscope = cscope[namespaces[i]];
      } catch (err) {
        return null;
      }
    }
    return cscope;
  } // END retrieveClass()

  function manageModuleRegistration(definition) {
    var o = {},
      __super__,
      classsplit,
      proto,
      tscope,
      module;

    if (!("inherits" in definition)) {
      definition.inherits = "core.Core";
    }

    o.base = core._import(definition.inherits);
    if ("base" in o) {
      try {
        __super__ = o.base.prototype;
      } catch (err) {
        throw new Error("Module " + definition.classname + " failed to inherit " + definition.inherits);
      }
    }

    classsplit = definition.classname.split(".");
    o.funcname = classsplit[classsplit.length - 1];
    o[o.funcname] = nameFunction(o.funcname, function(opts) {
      //o[o.funcname] = function(opts) {

      if (opts && opts.__inheriting__) return;
      if (opts && "parent" in opts) {
        this.parent = opts.parent;
      }
      if (opts && "el" in opts) {
        this.el = opts.el;
        if ('$el' in opts) {
          this.$el = opts.$el;
        }
      }
      if (opts && "params" in opts) {
        this.params = opts.params;
      }

      if (__super__) {
        __super__.constructor.call(this, opts);
      }
      //};
    });

    if (o.base) {
      o[o.funcname].inherits(o.base);
    }

    proto = o[o.funcname].prototype;
    proto.dispose = function() {
      //clear
      if ("onBeforeDispose" in this && typeof this.onBeforeDispose === "function") {
        this.onBeforeDispose();
        this.onBeforeDispose = null; //TODO: investigate why this is triggered twice
      }
      try {
        __super__.dispose.call(this);
      } catch (err) {
        console.log("dispose", err);
      }
    };
    proto.construct = function(opts) {

      if ("onBeforeConstruct" in this && typeof this.onBeforeConstruct == "function") {
        this.onBeforeConstruct();
        this.onBeforeConstruct = null; //TODO: investigate why this is triggered twice
      }
      try {
        __super__.construct.call(this, opts);

        if ("onAfterConstruct" in this && typeof this.onAfterConstruct == "function") {
          this.onAfterConstruct();
          this.onAfterConstruct = null; //TODO: investigate why this is triggered twice
        }
      } catch (err) {
        console.log("construct", err.stack);
      }
    };

    tscope = {
      $super: __super__,
      $classname: o.funcname
    };

    module = definition.module;
    if (module instanceof Array && module.length) {
      (function() {
        var mfunc = module.pop(),
          len = module.length,
          tclass;
        while (len--) {
          tclass = retrieveClass(module[len], scope);
          module[len] = tclass;
        }
        if (typeof mfunc == "function") {
          mfunc.apply(tscope, module);
        } else {
          throw new Error("Property module does not contain a function.");
        }
      }());
    } else if (typeof module == "function") {
      module.apply(tscope);
    }

    for (var prop in tscope) {
      proto[prop] = tscope[prop];
    }

    core.registerNamespace(definition.classname, ("singleton" in definition && definition.singleton) ? new o[o.funcname]() : o[o.funcname]);

  } // manageModuleRegistration()

  function checkDIs(definition) {
    var module = definition.module,
      len, tclass, mfunc;

    if (module instanceof Array && module.length) {
      mfunc = module[module.length];
      len = module.length - 1;

      while (len--) {
        if (typeof module[len] !== "function") {
          tclass = retrieveClass(module[len], scope);
          if (!tclass) {
            return false
          }
        }
      }

      if (typeof mfunc == "function") {
        return true;
      }

    } else if (typeof module == "function") {
      return true;
    }
    return true;
  } // END checkDIs()

  if (!scope.core) {
    /**
     * The main module and namespace used within the core framework.
     *
     * @class core
     *
     */
    scope.core = core;
  }

})(window);

/*************************************************************************************************************************/

if (window && !("console" in window)) {
  window.console = {
    log: function() {},
    warn: function() {},
    trace: function() {}
  };
}

(function() {

  var applyBindings = function() {

    this.$bindings = rivets.bind(this.el, this, {
      prefix: 'data-rv',
      preloadData: true,
      rootInterface: '.',
      templateDelimiters: ['{{', '}}']
    });
    setTimeout((function() {
      if ("bindingComplete" in this) {
        this.bindingComplete();
      }
    }).bind(this), 1);
  };
  var prepareBindings = function() {
    applyBindings.call(this);
  };


  /**
   * The base object of all core based classes. Every object created within the Core framework derives from this class.
   *
   * @class Core
   * @namespace core
   * @constructor
   * @param {Object} opts An object containing configurations required by the Core class.
   * @param {HTMLElement} opts.el The node element included in the class composition.
   *
   */
  function Core(opts) {
    //skips all process when instantiated from Function.inherits

    if (opts && opts.__inheriting__) {
      return;
    }
    if (opts) {
      //`this.el property` a dom element context
      if (opts.el) {
        /**
         * The selected HTML element node reference.
         *
         * @property node
         * @type HTMLElement
         *
         */
        this.el = opts.el;
        if ('$el' in opts) {
          this.$el = opts.$el;
        }
        if ("rivets" in window) {
          prepareBindings.call(this);
        }
      }
    }

    /**
     * Property for storing proxied function/methods
     *
     * @property proxyHandlers
     * @type Object
     *
     */
    this.proxyHandlers = {};
    if ("construct" in this) {
      this.construct(opts || {});
    }

    if (this.delayedConstruct) {
      this.delayedConstruct(opts || {});
    }

    // setTimeout((function(ref) {
    //   return function() {
    //     if (ref.delayedConstruct) {
    //       ref.delayedConstruct(opts || {});
    //     }
    //   };
    // }(this)), 0);

  } // Core()
  Core.prototype.bind = function(){
    prepareBindings.call(this);
  };
  Core.prototype.unbind = function(){
    this.$bindings.unbind();
  };
  Core.prototype.rebindTo = function(model){
    this.$bindings.unbind();
    this.$bindings.model = model;
    this.$bindings.build();
    this.bind();
  };
  /**
   * Returns a scope bound function and stores it on the proxyHandlers property.
   *
   * @method getProxyHandler
   * @param {String} method The string equivalent of the defined method name of the class.
   * @return {Function} The scope bound function defined on the parameter.
   */
  Core.prototype.handleEvent = Core.prototype._ = Core.prototype.getProxyHandler = function(str) {
    if (!this.proxyHandlers[str]) {
      if (typeof this[str] === "function") {
        this.proxyHandlers[str] = this[str].bind(this);
      } else {
        console.warn("Warning: attempt to create non existing method as proxy " + str);
      }

    }
    return this.proxyHandlers[str];
  };

  // ### Core.clearProxyHandler ######
  // Core method for clearing proxied function methods.
  /**
   * Core method for clearing proxied function methods.
   *
   * @method clearProxyHandler
   * @param {String} method The string equivalent of the defined method to clear.
   */
  Core.prototype.clearProxyHandler = function(str) {
    var ret = this.proxyHandlers[str];
    if (ret === null) {
      console.warn("Warning: attempt to clear a non-existing proxy - " + str);
    }
    this.proxyHandlers[str] = null;
    delete this.proxyHandlers[str];
    return ret;
  };

  /**
   * Core method initialization. This is called automatically on core sub classes.
   *
   * @method construct
   * @param {Object} options The object passed on the constructor of a core based class.
   */
  Core.prototype.construct = function(opts) {};

  /**
   * Core method initialization. This is called automatically on core sub classes. Adds delay when being called automatically, this allows
   * time to setup all the other classes and manage the sequence of instantiations.
   *
   * @method delayedConstruct
   * @param {Object} options The object passed on the constructor of a core based class.
   */
  Core.prototype.delayedConstruct = function(opts) {};

  /**
   * Core method for destroying/cleaning up objects.
   *
   * @method dispose
   * @param {Boolean} removeNode If true and there is a node attached in the class (el property) that element is going to be removed upon disposal.
   */
  Core.prototype.dispose = function(removeNode) {
    if (removeNode && this.el) {
      try {
        this.el.parentNode.removeChild(this.el);
      } catch (err) {}
    }
    this.el = null;
    for (var prop in this.proxyHandlers) {
      this.proxyHandlers[prop] = null;
      delete this.proxyHandlers[prop];
    }
    this.$bindings.unbind();
    delete this.$bindings;
  };

  /**
   * Core method for searching sub node elements.
   *
   * @method find
   * @param {String} selector The selector used for searching sub nodes.
   * @returns {NodeList} An array of HTMLElements, please note that this is not jQuery selected nodes.
   */
  Core.prototype.find = function(selector) {
    var select = null;
    if ("jQuery" in window) {
      select = window.jQuery;
    }
    return select ? select(this.el).find(selector) : this.el.querySelectorAll(selector);
  };

  /**
   * Core method for searching sub node elements within the document context.
   *
   * @method findAll
   * @param {String} selector The selector used for searching sub nodes within the document.
   * @returns {NodeList} An array of HTMLElements, please note that this is not jQuery selected nodes.
   */
  Core.prototype.findAll = function(selector) {
    var select = null;
    if ("jQuery" in window) {
      select = window.jQuery;
    }
    return select ? select(document).find(selector) : document.querySelectorAll(selector);
  };

  core.registerNamespace("core.Core", Core);

}());
if (typeof module !== 'undefined' && module.exports) {
  module.exports = core;
}

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

/**
 * ** Singleton. ** <br>The base object of all core based classes. Every object created within the Core framework derives from this class.
 *
 * @class XHR
 * @namespace core
 * @extends core.Core
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core class.
 * @param {Object} opts.el The node element included in the class composition.
 *
 */
/**
 * LIFTED and renamed from qwest
 * TODO: Add httpMock and interceptors
 OPTIONS
 dataType : post (by default), json, text, arraybuffer, blob, document or formdata (you don't need to specify XHR2 types since they're automatically detected)
 responseType : the response type; either auto (default), json, xml, text, arraybuffer, blob or document
 cache : browser caching; default is false for GET requests and true for POST requests
 async : true (default) or false; used to make asynchronous or synchronous requests
 user : the user to access to the URL, if needed
 password : the password to access to the URL, if needed
 headers : javascript object containing headers to be sent
 withCredentials : false by default; sends credentials with your XHR2 request (more info in that post)
 timeout : the timeout for the request in ms; 3000 by default
 attempts : the total number of times to attempt the request through timeouts; 3 by default; if you want to remove the limit set it to null

 xhr.<method>(<url>[, data[, options]])
 .then(function(response){
        // Run when the request is successful
     })
 .error(function(e,url){
        // Process the error
     })
 .complete(function(){
        // Always run
     });


 xhr.limit(NUMBER) - sets simultaneous request limit
 */

(function() {
  core.registerModule({
    classname: "core.XHR",
    singleton: true,
    module: function() {
      var __xhr__ = function() {
        return win.XMLHttpRequest ?
          new XMLHttpRequest() :
          new ActiveXObject('Microsoft.XMLHTTP');
      };
      var win = window,
        doc = document,
        before,
        defaultXdrResponseType = 'json',
        limit = null,
        requests = 0,
        request_stack = [],
        xhr2 = (__xhr__().responseType === '');

      var request = function(method, url, data, options, before) {

        // Format
        method = method.toUpperCase();
        data = data || null;
        options = options || {};

        // Define variables
        var nativeResponseParsing = false,
          crossOrigin,
          xhr,
          xdr = false,
          timeoutInterval,
          aborted = false,
          attempts = 0,
          headers = {},
          mimeTypes = {
            text: '*/*',
            xml: 'text/xml',
            json: 'application/json',
            post: 'application/x-www-form-urlencoded'
          },
          accept = {
            text: '*/*',
            xml: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
            json: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
          },
          contentType = 'Content-Type',
          vars = '',
          i, j,
          serialized,
          then_stack = [],
          catch_stack = [],
          complete_stack = [],
          response,
          success,
          error,
          func,

          // Define promises
          promises = {
            then: function(func) {

              if (options.async) {
                then_stack.push(func);
              } else if (success) {
                func.call(xhr, response);
              }
              return promises;
            },
            'error': function(func) {
              if (options.async) {
                catch_stack.push(func);
              } else if (error) {
                func.call(xhr, response);
              }
              return promises;
            },
            complete: function(func) {
              if (options.async) {
                complete_stack.push(func);
              } else {
                func.call(xhr);
              }
              return promises;
            }
          },
          promises_limit = {
            then: function(func) {
              request_stack[request_stack.length - 1].then.push(func);
              return promises_limit;
            },
            'error': function(func) {
              request_stack[request_stack.length - 1]['catch'].push(func);
              return promises_limit;
            },
            complete: function(func) {
              request_stack[request_stack.length - 1].complete.push(func);
              return promises_limit;
            }
          },

          // Handle the response
          handleResponse = function() {
            // Verify request's state
            // --- https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
            if (aborted) {
              return;
            }
            // Prepare
            var i, req, p, responseType;
            --requests;
            // Clear the timeout
            clearInterval(timeoutInterval);
            // Launch next stacked request
            if (request_stack.length) {
              req = request_stack.shift();
              p = qwest(req.method, req.url, req.data, req.options, req.before);
              for (i = 0; func = req.then[i]; ++i) {
                p.then(func);
              }
              for (i = 0; func = req['catch'][i]; ++i) {
                p['catch'](func);
              }
              for (i = 0; func = req.complete[i]; ++i) {
                p.complete(func);
              }
            }
            // Handle response
            try {
              // Verify status code
              // --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
              if ('status' in xhr && !/^2|1223/.test(xhr.status)) {
                throw xhr.status + ' (' + xhr.statusText + ')';
              }
              // Init
              var responseText = 'responseText',
                responseXML = 'responseXML',
                parseError = 'parseError';
              // Process response
              if (nativeResponseParsing && 'response' in xhr && xhr.response !== null) {
                response = xhr.response;
              } else if (options.responseType == 'document') {
                var frame = doc.createElement('iframe');
                frame.style.display = 'none';
                doc.body.appendChild(frame);
                frame.contentDocument.open();
                frame.contentDocument.write(xhr.response);
                frame.contentDocument.close();
                response = frame.contentDocument;
                doc.body.removeChild(frame);
              } else {
                // Guess response type
                responseType = options.responseType;
                if (responseType == 'auto') {
                  if (xdr) {
                    responseType = defaultXdrResponseType;
                  } else {
                    var ct = xhr.getResponseHeader(contentType) || '';
                    if (ct.indexOf(mimeTypes.json) > -1) {
                      responseType = 'json';
                    } else if (ct.indexOf(mimeTypes.xml) > -1) {
                      responseType = 'xml';
                    } else {
                      responseType = 'text';
                    }
                  }
                }
                // Handle response type
                switch (responseType) {
                  case 'json':
                    try {
                      if ('JSON' in win) {
                        response = JSON.parse(xhr[responseText]);
                      } else {
                        response = eval('(' + xhr[responseText] + ')');
                      }
                    } catch (e) {
                      throw "Error while parsing JSON body : " + e;
                    }
                    break;
                  case 'xml':
                    // Based on jQuery's parseXML() function
                    try {
                      // Standard
                      if (win.DOMParser) {
                        response = (new DOMParser()).parseFromString(xhr[responseText], 'text/xml');
                      }
                      // IE<9
                      else {
                        response = new ActiveXObject('Microsoft.XMLDOM');
                        response.async = 'false';
                        response.loadXML(xhr[responseText]);
                      }
                    } catch (e) {
                      response = undefined;
                    }
                    if (!response || !response.documentElement || response.getElementsByTagName('parsererror').length) {
                      throw 'Invalid XML';
                    }
                    break;
                  default:
                    response = xhr[responseText];
                }
              }
              // Execute 'then' stack
              success = true;
              p = response;
              if (options.async) {
                for (i = 0; func = then_stack[i]; ++i) {

                  //console.log(method, url, xhr);
                  p = func.call(xhr, p);
                }
              }
            } catch (e) {
              error = true;
              // Execute 'catch' stack
              if (options.async) {
                for (i = 0; func = catch_stack[i]; ++i) {
                  func.call(xhr, e, url);
                }
              }
            }
            // Execute complete stack
            if (options.async) {
              for (i = 0; func = complete_stack[i]; ++i) {
                func.call(xhr);
              }
            }
          },

          // Recursively build the query string
          buildData = function(data, key) {
            var res = [],
              enc = encodeURIComponent,
              p;
            if (typeof data === 'object' && data != null) {
              for (p in data) {
                if (data.hasOwnProperty(p)) {
                  var built = buildData(data[p], key ? key + '[' + p + ']' : p);
                  if (built !== '') {
                    res = res.concat(built);
                  }
                }
              }
            } else if (data != null && key != null) {
              res.push(enc(key) + '=' + enc(data));
            }
            return res.join('&');
          };

        // New request
        ++requests;

        // Normalize options
        options.async = 'async' in options ? !!options.async : true;
        options.cache = 'cache' in options ? !!options.cache : (method != 'GET');
        options.dataType = 'dataType' in options ? options.dataType.toLowerCase() : 'post';
        options.responseType = 'responseType' in options ? options.responseType.toLowerCase() : 'auto';
        options.user = options.user || '';
        options.password = options.password || '';
        options.withCredentials = !!options.withCredentials;
        options.timeout = 'timeout' in options ? parseInt(options.timeout, 10) : 3000;
        options.attempts = 'attempts' in options ? parseInt(options.attempts, 10) : 3;

        // Guess if we're dealing with a cross-origin request
        i = url.match(/\/\/(.+?)\//);
        crossOrigin = i && i[1] ? i[1] != location.host : false;

        // Prepare data
        if ('ArrayBuffer' in win && data instanceof ArrayBuffer) {
          options.dataType = 'arraybuffer';
        } else if ('Blob' in win && data instanceof Blob) {
          options.dataType = 'blob';
        } else if ('Document' in win && data instanceof Document) {
          options.dataType = 'document';
        } else if ('FormData' in win && data instanceof FormData) {
          options.dataType = 'formdata';
        }
        switch (options.dataType) {
          case 'json':
            data = JSON.stringify(data);
            break;
          case 'post':
            data = buildData(data);
        }

        // Prepare headers
        if (options.headers) {
          var format = function(match, p1, p2) {
            return p1 + p2.toUpperCase();
          };
          for (i in options.headers) {
            headers[i.replace(/(^|-)([^-])/g, format)] = options.headers[i];
          }
        }
        if (!headers[contentType] && method != 'GET') {
          if (options.dataType in mimeTypes) {
            if (mimeTypes[options.dataType]) {
              headers[contentType] = mimeTypes[options.dataType];
            }
          }
        }
        if (!headers.Accept) {
          headers.Accept = (options.responseType in accept) ? accept[options.responseType] : '*/*';
        }
        if (!crossOrigin && !headers['X-Requested-With']) { // because that header breaks in legacy browsers with CORS
          headers['X-Requested-With'] = 'XMLHttpRequest';
        }

        // Prepare URL
        if (method == 'GET') {
          vars += data;
        }
        if (!options.cache) {
          if (vars) {
            vars += '&';
          }
          vars += '__t=' + (+new Date());
        }
        if (vars) {
          url += (/\?/.test(url) ? '&' : '?') + vars;
        }

        // The limit has been reached, stock the request
        if (limit && requests == limit) {
          request_stack.push({
            method: method,
            url: url,
            data: data,
            options: options,
            before: before,
            then: [],
            'catch': [],
            complete: []
          });
          return promises_limit;
        }

        // Send the request
        var send = function() {
          // Get XHR object
          xhr = __xhr__();
          if (crossOrigin) {
            if (!('withCredentials' in xhr) && win.XDomainRequest) {
              xhr = new XDomainRequest(); // CORS with IE8/9
              xdr = true;
              if (method != 'GET' && method != 'POST') {
                method = 'POST';
              }
            }
          }
          // Open connection
          if (xdr) {
            xhr.open(method, url);
          } else {
            xhr.open(method, url, options.async, options.user, options.password);
            if (xhr2 && options.async) {
              xhr.withCredentials = options.withCredentials;
            }
          }
          // Set headers
          if (!xdr) {
            for (var i in headers) {
              xhr.setRequestHeader(i, headers[i]);
            }
          }
          // Verify if the response type is supported by the current browser
          if (xhr2 && options.responseType != 'document') { // Don't verify for 'document' since we're using an internal routine
            try {
              xhr.responseType = options.responseType;
              nativeResponseParsing = (xhr.responseType == options.responseType);
            } catch (e) {}
          }
          // Plug response handler
          if (xhr2 || xdr) {
            xhr.onload = handleResponse;
          } else {
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {
                handleResponse();
              }
            };
          }
          // Override mime type to ensure the response is well parsed
          if (options.responseType !== 'auto' && 'overrideMimeType' in xhr) {
            xhr.overrideMimeType(mimeTypes[options.responseType]);
          }
          // Run 'before' callback
          if (before) {
            before.call(xhr);
          }
          // Send request
          if (xdr) {
            setTimeout(function() { // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
              xhr.send(method != 'GET' ? data : null);
            }, 0);
          } else {
            xhr.send(method != 'GET' ? data : null);
          }
        };

        // Timeout/attempts
        var timeout = function() {
          timeoutInterval = setTimeout(function() {
            aborted = true;
            xhr.abort();
            if (!options.attempts || ++attempts != options.attempts) {
              aborted = false;
              timeout();
              send();
            } else {
              aborted = false;
              error = true;
              response = 'Timeout (' + url + ')';
              if (options.async) {
                for (i = 0; func = catch_stack[i]; ++i) {
                  func.call(xhr, response);
                }
              }
            }
          }, options.timeout);
        };

        // Start the request
        timeout();
        send();

        // Return promises
        return promises;

      };
      var checkMocks = function(url) {
        if (core.ENV.httpMocks) {
          console.log("TODO: implement http mock");
        }
      };
      var handleMockedPromise = function() {

      };
      var create = function(method) {
        return function(url, data, options) {
          var b = before;
          before = null;

          return request(method, url, data, options, b);
        };
      };
      this.before = function(callback) {
        before = callback;
        return this;
      }
      this.get = create('GET');
      this.post = create('POST');
      this.put = create('PUT');
      this['delete'] = create('DELETE');
      this.xhr2 = xhr2;
      this.limit = function(by) {
        limit = by;
      };
      this.setDefaultXdrResponseType = function(type) {
        defaultXdrResponseType = type.toLocaleLowerCase();
      };

    }
  });
})();

/**
 * The base object of all core based classes. Every object created within the Core framework derives from this class.
 *
 * @class Module
 * @namespace core
 * @extends core.EventDispatcher
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core derived class.
 * @param {HTMLElement} opts.el The node element included in the class composition.
 *
 */
(function(scope) {
  core.registerModule({
    inherits: "core.EventDispatcher",
    classname: "core.Module",
    module: ["core.XHR", function(xhr) {

      /*
       * Intializes module(dom) including the class it has been extended from (if the parent class in not included)
       */
      this.delayedConstruct = function(opts) {
        var className, parentClass, prop;

        //create
        findImmediateClasses.call(this, this.el);
        checkNodeProperties.call(this, this.el);
        if ("initialized" in this) {
          this.initialized(opts);
        }


        // if ('$super' in this) {
        //   parentClass = this.$super;
        //   if ('$classname' in parentClass) {
        //     className = parentClass.$classname;
        //   }
        // }

        // if ('parent' in this && className !== this.parent.$classname) {
        //   while (className && className !== 'Module') {
        //     if ("initialized" in parentClass) {
        //       parentClass.initialized.call(this, opts);
        //     }

        //     if ('$super' in parentClass) {
        //       parentClass = parentClass.$super;
        //       if ('$classname' in parentClass) {
        //         className = parentClass.$classname;
        //       }
        //     }
        //   }

        //   this.el.addEventListener("DOMNodeRemoved", nodeRemoved.bind(this), false);
        // }

        this.el.addEventListener("DOMNodeInserted", nodeMutated.bind(this), false);
      };
      this.loadViewModule = function(src) {
        var fragment;
        xhr.get(src).then((function(res) {
          fragment = res;

        }).bind(this)).error(function(err) {

        }).complete((function(res) {
          appendFragment(fragment);
        }).bind(this));
      };

      this.triggerSubModules = function() {
        findImmediateClasses.call(this, this.el);
      };

      function nodeMutated(evt) {
        findImmediateClasses.call(this, this.el);
        checkNodeProperties.call(this, this.el);
        if ("domMutated" in this) {
          this.domMutated(evt);
        }
      } // END nodeMutated()

      function nodeRemoved(evt) {
        //this.dispose();
      } // END nodeRemoved()

      function appendFragment(str, appendto) {
        var wrap = document.createElement("div");
        wrap.innerHTML = str;

        for (var i in wrap.childNodes) {
          try {
            if (appendto) {
              appendto.appendChild(wrap.childNodes[i]);
            } else {
              this.el.appendChild(wrap.childNodes[i]);
            }
          } catch (err) {}

        }
        findImmediateClasses.call(this, wrap);
        checkNodeProperties.call(this, wrap);
        wrap = null;
      };

      function parseParameters(params) {
        var len, pair, jsonStr = '',
          split = params.split(";");

        function addValidQuotes(str, forceString) {
          if (str[0] === '"' && str[str.length - 1] === '"') {
            return str;
          } else if (str[0] === "'" && str[str.length - 1] === "'") {
            return '"' + str.substr(1, str.length - 2) + '"';
          } else if (forceString) {
            return '"' + str + '"';
          }
          return str;
        } // END addValidQuotes()

        len = split.length;
        while (len--) {
          if (split[len] === '') {
            continue;
          }
          pair = split[len].split(":");

          pair[0] = addValidQuotes(pair[0], true);
          pair[1] = addValidQuotes(pair[1]);

          jsonStr += pair[0] + ':' + pair[1];

          if (len > 0) {
            jsonStr += ',';
          }
        }

        return JSON.parse('{' + jsonStr + '}');
      } // END paresParameters()

      function checkNodeProperties(node) {
        var children = node.childNodes,
          attr, child, isdata;

        for (var i in children) {
          child = children[i];
          if (child.nodeType === 1) {
            if (child.getAttribute("core-module") || child.getAttribute("data-core-module")) {
              break; //stop when encountering another module
            }
            isdata = false;
            if (child.getAttribute("data-core-prop") || child.getAttribute("core-prop")) {
              if (child.getAttribute("data-core-prop")) {
                isdata = true;
              }
              if (!this.properties) {
                this.properties = {};
              }

              attr = child.getAttribute("data-core-prop") || child.getAttribute("core-prop");

              if (this.properties[attr] && !(this.properties[attr] instanceof Array)) {
                this.properties[attr] = [this.properties[attr]];
              }
              if (this.properties[attr] instanceof Array) {
                this.properties[attr].push(child);
              } else {
                this.properties[attr] = child;
              }
              if (isdata) {
                child.setAttribute("data-core-prop-init", child.getAttribute("data-core-prop"));
                child.removeAttribute("data-core-prop");
              } else {
                child.setAttribute("core-prop-init", child.getAttribute("core-prop"));
                child.removeAttribute("core-prop");
              }
            }
            if (child.hasChildNodes()) {
              checkNodeProperties.call(this, child);
            }

          }
        }
      } // END checkNodeProperties()

      function findImmediateClasses(node) {
        var recurse = function(modules) {
          var i = 0,
            cls,
            opts,
            len = modules.length;

          for (; i < len; i += 1) {
            (function() {
              var mod = modules[i],
                cmod, cid, params, inited, o;

              if (mod.nodeType === Node.ELEMENT_NODE) {
                cmod = mod.getAttribute("core-module") || mod.getAttribute("data-core-module");
                cid = mod.getAttribute("core-id") || mod.getAttribute("data-core-id");
                params = mod.getAttribute("core-params") || mod.getAttribute("data-core-params");
                inited = mod.classList.contains("core-init");

                if (!inited && cmod) {

                  cls = core._import(cmod);
                  opts = {};
                  opts.params = params ? parseParameters(params) : null;
                  opts.parent = this;
                  opts.el = mod;
                  if ('jQuery' in window) {
                    opts.$el = $(mod);
                  }
                  mod.classList.add("core-init");
                  if (cid && !this[cid]) {
                    this[cid] = new cls(opts);
                  } else if (!cid) {
                    if (cls) {
                      new cls(opts); //do not assign to any property
                    } else {
                      throw new Error(cmod + " module not found.");
                    }
                  } else if (cid && this[cid]) {
                    o = new cls(opts);
                    try {
                      this[cid].push(o);
                    } catch (err) {
                      this[cid] = [this[cid]];
                      this[cid].push(o);
                    }
                  }
                } else if (mod.hasChildNodes()) {
                  recurse.call(this, mod.childNodes);
                }
              }
            }.bind(this)());
          }
        };
        recurse.call(this, node.childNodes);
      } // END findImmediateClasses()

    }]
  });

})(window);

/**
 * The base module for the Core JS framework.
 * It provides helper methods for implementing OOP methodologies and basic utilities such as browser detection.
 *
 * @module addons
 */
(function() {
  core.registerModule({
    inherits: "core.EventDispatcher",
    classname: "core.WindowEvents",
    singleton: true,
    module: function() {
      /**
       * The main class that implements broadcaster pattern. Ideally subclassed by objects that will perform broadcasting functions.
       *
       * @class CoreWindow
       * @extends core.Core
       * @namespace core.addons
       * @constructor
       * @param {Object} opts An object containing configurations required by the Core derived class.
       * @param {HTMLElement} opts.el The node element included in the class composition.
       *
       */
      this.dispatchScroll = function() {
        var scrollLeft = this.scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        var scrollTop = this.scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        this.trigger("window.scroll", {
          scrollTop: scrollTop,
          scrollLeft: scrollLeft
        });
        this.tick = false;
      };
      this.dispatchResize = function() {
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var t = "mobile";
        if (w >= 992 && w < 1200) {
          t = "medium";
        } else if (w < 992 && w >= 768) {
          t = "small";
        } else if (w >= 1200) {
          t = "large";
        }
        this.trigger("window.resize", {
          width: w,
          height: h,
          type: t
        });
        this.tickResize = false;
      };
      this.dispatchMotion = function() {
        var evt = this.motionEvent;
        var accelX = evt.accelerationIncludingGravity.x;
        var accelY = evt.accelerationIncludingGravity.y;
        var accelZ = evt.accelerationIncludingGravity.z;
        var rotationAlpha = evt.rotationRate.alpha;
        var rotationGamma = evt.rotationRate.gamma;
        var rotationBeta = evt.rotationRate.beta;
        this.trigger("window.device.motion", {
          accelX: accelX,
          accelY: accelY,
          accelZ: accelZ,
          rotationAlpha: rotationAlpha,
          rotationBeta: rotationBeta,
          rotationGamma: rotationGamma
        });
        this.tickMotion = false;
        this.motionEvent = null;

      };
      this.onWindowScroll = function() {
        if (!this.tick) {
          this.tick = true;
          requestAnimationFrame(this._("dispatchScroll"));
        }
      };
      this.onWindowResize = function() {
        if (!this.tickResize) {
          this.tickResize = true;
          requestAnimationFrame(this._("dispatchResize"));
        }
      };
      this.onDeviceMotion = function(evt) {
        this.motionEvent = evt;
        if (!this.tickMotion) {
          this.tickMotion = true;
          requestAnimationFrame(this._("dispatchMotion"));
        }
      };
      this.onAfterConstruct = function() {

        this.scrollTop = 0;
        this.scrollLeft = 0;
        window.addEventListener("scroll", this._("onWindowScroll"));
        window.addEventListener("resize", this._("onWindowResize"));
        if (core.browser.touch) {
          window.addEventListener("devicemotion", this._("onDeviceMotion"));
        }
        this.$super.onAfterConstruct.call(this);
      };
    }
  });

})();

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
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

  // Full polyfill for browsers with no classList support
  if (!("classList" in document.createElement("_"))) {

    (function(view) {

      "use strict";

      if (!('Element' in view)) return;

      var
        classListProp = "classList",
        protoProp = "prototype",
        elemCtrProto = view.Element[protoProp],
        objCtr = Object,
        strTrim = String[protoProp].trim || function() {
          return this.replace(/^\s+|\s+$/g, "");
        },
        arrIndexOf = Array[protoProp].indexOf || function(item) {
          var
            i = 0,
            len = this.length;
          for (; i < len; i++) {
            if (i in this && this[i] === item) {
              return i;
            }
          }
          return -1;
        }
        // Vendors: please allow content code to instantiate DOMExceptions
        ,
        DOMEx = function(type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
        },
        checkTokenAndGetIndex = function(classList, token) {
          if (token === "") {
            throw new DOMEx(
              "SYNTAX_ERR", "An invalid or illegal string was specified"
            );
          }
          if (/\s/.test(token)) {
            throw new DOMEx(
              "INVALID_CHARACTER_ERR", "String contains an invalid character"
            );
          }
          return arrIndexOf.call(classList, token);
        },
        ClassList = function(elem) {
          var
            trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
            i = 0,
            len = classes.length;
          for (; i < len; i++) {
            this.push(classes[i]);
          }
          this._updateClassName = function() {
            elem.setAttribute("class", this.toString());
          };
        },
        classListProto = ClassList[protoProp] = [],
        classListGetter = function() {
          return new ClassList(this);
        };
      // Most DOMException implementations don't allow calling DOMException's toString()
      // on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function(i) {
        return this[i] || null;
      };
      classListProto.contains = function(token) {
        token += "";
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function() {
        var
          tokens = arguments,
          i = 0,
          l = tokens.length,
          token, updated = false;
        do {
          token = tokens[i] + "";
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        }
        while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.remove = function() {
        var
          tokens = arguments,
          i = 0,
          l = tokens.length,
          token, updated = false,
          index;
        do {
          token = tokens[i] + "";
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        }
        while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toggle = function(token, force) {
        token += "";

        var
          result = this.contains(token),
          method = result ?
          force !== true && "remove" :
          force !== false && "add";

        if (method) {
          this[method](token);
        }

        if (force === true || force === false) {
          return force;
        } else {
          return !result;
        }
      };
      classListProto.toString = function() {
        return this.join(" ");
      };

      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter,
          enumerable: true,
          configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) { // IE 8 doesn't support enumerable:true
          if (ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }

    }(self));

  } else {
    // There is full or partial native classList support, so just check if we need
    // to normalize the add/remove and toggle APIs.

    (function() {
      "use strict";

      var testElement = document.createElement("_");

      testElement.classList.add("c1", "c2");

      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
      // classList.remove exist but support only one argument at a time.
      if (!testElement.classList.contains("c2")) {
        var createMethod = function(method) {
          var original = DOMTokenList.prototype[method];

          DOMTokenList.prototype[method] = function(token) {
            var i, len = arguments.length;

            for (i = 0; i < len; i++) {
              token = arguments[i];
              original.call(this, token);
            }
          };
        };
        createMethod('add');
        createMethod('remove');
      }

      testElement.classList.toggle("c3", false);

      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
      // support the second argument.
      if (testElement.classList.contains("c3")) {
        var _toggle = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function(token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          } else {
            return _toggle.call(this, token);
          }
        };

      }

      testElement = null;
    }());

  }

}

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

if (typeof WeakMap === 'undefined') {
  (function() {
    var defineProperty = Object.defineProperty;
    var counter = Date.now() % 1e9;

    var WeakMap = function() {
      this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
    };

    WeakMap.prototype = {
      set: function(key, value) {
        var entry = key[this.name];
        if (entry && entry[0] === key)
          entry[1] = value;
        else
          defineProperty(key, this.name, {
            value: [key, value],
            writable: true
          });
        return this;
      },
      get: function(key) {
        var entry;
        return (entry = key[this.name]) && entry[0] === key ?
          entry[1] : undefined;
      },
      delete: function(key) {
        var entry = key[this.name];
        if (!entry || entry[0] !== key) return false;
        entry[0] = entry[1] = undefined;
        return true;
      },
      has: function(key) {
        var entry = key[this.name];
        if (!entry) return false;
        return entry[0] === key;
      }
    };

    window.WeakMap = WeakMap;
  })();
}
/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is goverened by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(global) {

  var registrationsTable = new WeakMap();

  // We use setImmediate or postMessage for our future callback.
  var setImmediate = window.msSetImmediate;

  // Use post message to emulate setImmediate.
  if (!setImmediate) {
    var setImmediateQueue = [];
    var sentinel = String(Math.random());
    window.addEventListener('message', function(e) {
      if (e.data === sentinel) {
        var queue = setImmediateQueue;
        setImmediateQueue = [];
        queue.forEach(function(func) {
          func();
        });
      }
    });
    setImmediate = function(func) {
      setImmediateQueue.push(func);
      window.postMessage(sentinel, '*');
    };
  }

  // This is used to ensure that we never schedule 2 callas to setImmediate
  var isScheduled = false;

  // Keep track of observers that needs to be notified next time.
  var scheduledObservers = [];

  /**
   * Schedules |dispatchCallback| to be called in the future.
   * @param {MutationObserver} observer
   */
  function scheduleCallback(observer) {
    scheduledObservers.push(observer);
    if (!isScheduled) {
      isScheduled = true;
      setImmediate(dispatchCallbacks);
    }
  }

  function wrapIfNeeded(node) {
    return window.ShadowDOMPolyfill &&
      window.ShadowDOMPolyfill.wrapIfNeeded(node) ||
      node;
  }

  function dispatchCallbacks() {
    // http://dom.spec.whatwg.org/#mutation-observers

    isScheduled = false; // Used to allow a new setImmediate call above.

    var observers = scheduledObservers;
    scheduledObservers = [];
    // Sort observers based on their creation UID (incremental).
    observers.sort(function(o1, o2) {
      return o1.uid_ - o2.uid_;
    });

    var anyNonEmpty = false;
    observers.forEach(function(observer) {

      // 2.1, 2.2
      var queue = observer.takeRecords();
      // 2.3. Remove all transient registered observers whose observer is mo.
      removeTransientObserversFor(observer);

      // 2.4
      if (queue.length) {
        observer.callback_(queue, observer);
        anyNonEmpty = true;
      }
    });

    // 3.
    if (anyNonEmpty)
      dispatchCallbacks();
  }

  function removeTransientObserversFor(observer) {
    observer.nodes_.forEach(function(node) {
      var registrations = registrationsTable.get(node);
      if (!registrations)
        return;
      registrations.forEach(function(registration) {
        if (registration.observer === observer)
          registration.removeTransientObservers();
      });
    });
  }

  /**
   * This function is used for the "For each registered observer observer (with
   * observer's options as options) in target's list of registered observers,
   * run these substeps:" and the "For each ancestor ancestor of target, and for
   * each registered observer observer (with options options) in ancestor's list
   * of registered observers, run these substeps:" part of the algorithms. The
   * |options.subtree| is checked to ensure that the callback is called
   * correctly.
   *
   * @param {Node} target
   * @param {function(MutationObserverInit):MutationRecord} callback
   */
  function forEachAncestorAndObserverEnqueueRecord(target, callback) {
    for (var node = target; node; node = node.parentNode) {
      var registrations = registrationsTable.get(node);

      if (registrations) {
        for (var j = 0; j < registrations.length; j++) {
          var registration = registrations[j];
          var options = registration.options;

          // Only target ignores subtree.
          if (node !== target && !options.subtree)
            continue;

          var record = callback(options);
          if (record)
            registration.enqueue(record);
        }
      }
    }
  }

  var uidCounter = 0;

  /**
   * The class that maps to the DOM MutationObserver interface.
   * @param {Function} callback.
   * @constructor
   */
  function JsMutationObserver(callback) {
    this.callback_ = callback;
    this.nodes_ = [];
    this.records_ = [];
    this.uid_ = ++uidCounter;
  }

  JsMutationObserver.prototype = {
    observe: function(target, options) {
      target = wrapIfNeeded(target);

      // 1.1
      if (!options.childList && !options.attributes && !options.characterData ||

        // 1.2
        options.attributeOldValue && !options.attributes ||

        // 1.3
        options.attributeFilter && options.attributeFilter.length &&
        !options.attributes ||

        // 1.4
        options.characterDataOldValue && !options.characterData) {

        throw new SyntaxError();
      }

      var registrations = registrationsTable.get(target);
      if (!registrations)
        registrationsTable.set(target, registrations = []);

      // 2
      // If target's list of registered observers already includes a registered
      // observer associated with the context object, replace that registered
      // observer's options with options.
      var registration;
      for (var i = 0; i < registrations.length; i++) {
        if (registrations[i].observer === this) {
          registration = registrations[i];
          registration.removeListeners();
          registration.options = options;
          break;
        }
      }

      // 3.
      // Otherwise, add a new registered observer to target's list of registered
      // observers with the context object as the observer and options as the
      // options, and add target to context object's list of nodes on which it
      // is registered.
      if (!registration) {
        registration = new Registration(this, target, options);
        registrations.push(registration);
        this.nodes_.push(target);
      }

      registration.addListeners();
    },

    disconnect: function() {
      this.nodes_.forEach(function(node) {
        var registrations = registrationsTable.get(node);
        for (var i = 0; i < registrations.length; i++) {
          var registration = registrations[i];
          if (registration.observer === this) {
            registration.removeListeners();
            registrations.splice(i, 1);
            // Each node can only have one registered observer associated with
            // this observer.
            break;
          }
        }
      }, this);
      this.records_ = [];
    },

    takeRecords: function() {
      var copyOfRecords = this.records_;
      this.records_ = [];
      return copyOfRecords;
    }
  };

  /**
   * @param {string} type
   * @param {Node} target
   * @constructor
   */
  function MutationRecord(type, target) {
    this.type = type;
    this.target = target;
    this.addedNodes = [];
    this.removedNodes = [];
    this.previousSibling = null;
    this.nextSibling = null;
    this.attributeName = null;
    this.attributeNamespace = null;
    this.oldValue = null;
  }

  function copyMutationRecord(original) {
    var record = new MutationRecord(original.type, original.target);
    record.addedNodes = original.addedNodes.slice();
    record.removedNodes = original.removedNodes.slice();
    record.previousSibling = original.previousSibling;
    record.nextSibling = original.nextSibling;
    record.attributeName = original.attributeName;
    record.attributeNamespace = original.attributeNamespace;
    record.oldValue = original.oldValue;
    return record;
  };

  // We keep track of the two (possibly one) records used in a single mutation.
  var currentRecord, recordWithOldValue;

  /**
   * Creates a record without |oldValue| and caches it as |currentRecord| for
   * later use.
   * @param {string} oldValue
   * @return {MutationRecord}
   */
  function getRecord(type, target) {
    return currentRecord = new MutationRecord(type, target);
  }

  /**
   * Gets or creates a record with |oldValue| based in the |currentRecord|
   * @param {string} oldValue
   * @return {MutationRecord}
   */
  function getRecordWithOldValue(oldValue) {
    if (recordWithOldValue)
      return recordWithOldValue;
    recordWithOldValue = copyMutationRecord(currentRecord);
    recordWithOldValue.oldValue = oldValue;
    return recordWithOldValue;
  }

  function clearRecords() {
    currentRecord = recordWithOldValue = undefined;
  }

  /**
   * @param {MutationRecord} record
   * @return {boolean} Whether the record represents a record from the current
   * mutation event.
   */
  function recordRepresentsCurrentMutation(record) {
    return record === recordWithOldValue || record === currentRecord;
  }

  /**
   * Selects which record, if any, to replace the last record in the queue.
   * This returns |null| if no record should be replaced.
   *
   * @param {MutationRecord} lastRecord
   * @param {MutationRecord} newRecord
   * @param {MutationRecord}
   */
  function selectRecord(lastRecord, newRecord) {
    if (lastRecord === newRecord)
      return lastRecord;

    // Check if the the record we are adding represents the same record. If
    // so, we keep the one with the oldValue in it.
    if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord))
      return recordWithOldValue;

    return null;
  }

  /**
   * Class used to represent a registered observer.
   * @param {MutationObserver} observer
   * @param {Node} target
   * @param {MutationObserverInit} options
   * @constructor
   */
  function Registration(observer, target, options) {
    this.observer = observer;
    this.target = target;
    this.options = options;
    this.transientObservedNodes = [];
  }

  Registration.prototype = {
    enqueue: function(record) {
      var records = this.observer.records_;
      var length = records.length;

      // There are cases where we replace the last record with the new record.
      // For example if the record represents the same mutation we need to use
      // the one with the oldValue. If we get same record (this can happen as we
      // walk up the tree) we ignore the new record.
      if (records.length > 0) {
        var lastRecord = records[length - 1];
        var recordToReplaceLast = selectRecord(lastRecord, record);
        if (recordToReplaceLast) {
          records[length - 1] = recordToReplaceLast;
          return;
        }
      } else {
        scheduleCallback(this.observer);
      }

      records[length] = record;
    },

    addListeners: function() {
      this.addListeners_(this.target);
    },

    addListeners_: function(node) {
      var options = this.options;
      if (options.attributes)
        node.addEventListener('DOMAttrModified', this, true);

      if (options.characterData)
        node.addEventListener('DOMCharacterDataModified', this, true);

      if (options.childList)
        node.addEventListener('DOMNodeInserted', this, true);

      if (options.childList || options.subtree)
        node.addEventListener('DOMNodeRemoved', this, true);
    },

    removeListeners: function() {
      this.removeListeners_(this.target);
    },

    removeListeners_: function(node) {
      var options = this.options;
      if (options.attributes)
        node.removeEventListener('DOMAttrModified', this, true);

      if (options.characterData)
        node.removeEventListener('DOMCharacterDataModified', this, true);

      if (options.childList)
        node.removeEventListener('DOMNodeInserted', this, true);

      if (options.childList || options.subtree)
        node.removeEventListener('DOMNodeRemoved', this, true);
    },

    /**
     * Adds a transient observer on node. The transient observer gets removed
     * next time we deliver the change records.
     * @param {Node} node
     */
    addTransientObserver: function(node) {
      // Don't add transient observers on the target itself. We already have all
      // the required listeners set up on the target.
      if (node === this.target)
        return;

      this.addListeners_(node);
      this.transientObservedNodes.push(node);
      var registrations = registrationsTable.get(node);
      if (!registrations)
        registrationsTable.set(node, registrations = []);

      // We know that registrations does not contain this because we already
      // checked if node === this.target.
      registrations.push(this);
    },

    removeTransientObservers: function() {
      var transientObservedNodes = this.transientObservedNodes;
      this.transientObservedNodes = [];

      transientObservedNodes.forEach(function(node) {
        // Transient observers are never added to the target.
        this.removeListeners_(node);

        var registrations = registrationsTable.get(node);
        for (var i = 0; i < registrations.length; i++) {
          if (registrations[i] === this) {
            registrations.splice(i, 1);
            // Each node can only have one registered observer associated with
            // this observer.
            break;
          }
        }
      }, this);
    },

    handleEvent: function(e) {
      // Stop propagation since we are managing the propagation manually.
      // This means that other mutation events on the page will not work
      // correctly but that is by design.
      e.stopImmediatePropagation();

      switch (e.type) {
        case 'DOMAttrModified':
          // http://dom.spec.whatwg.org/#concept-mo-queue-attributes

          var name = e.attrName;
          var namespace = e.relatedNode.namespaceURI;
          var target = e.target;

          // 1.
          var record = new getRecord('attributes', target);
          record.attributeName = name;
          record.attributeNamespace = namespace;

          // 2.
          var oldValue =
            e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;

          forEachAncestorAndObserverEnqueueRecord(target, function(options) {
            // 3.1, 4.2
            if (!options.attributes)
              return;

            // 3.2, 4.3
            if (options.attributeFilter && options.attributeFilter.length &&
              options.attributeFilter.indexOf(name) === -1 &&
              options.attributeFilter.indexOf(namespace) === -1) {
              return;
            }
            // 3.3, 4.4
            if (options.attributeOldValue)
              return getRecordWithOldValue(oldValue);

            // 3.4, 4.5
            return record;
          });

          break;

        case 'DOMCharacterDataModified':
          // http://dom.spec.whatwg.org/#concept-mo-queue-characterdata
          var target = e.target;

          // 1.
          var record = getRecord('characterData', target);

          // 2.
          var oldValue = e.prevValue;

          forEachAncestorAndObserverEnqueueRecord(target, function(options) {
            // 3.1, 4.2
            if (!options.characterData)
              return;

            // 3.2, 4.3
            if (options.characterDataOldValue)
              return getRecordWithOldValue(oldValue);

            // 3.3, 4.4
            return record;
          });

          break;

        case 'DOMNodeRemoved':
          this.addTransientObserver(e.target);
          // Fall through.
        case 'DOMNodeInserted':
          // http://dom.spec.whatwg.org/#concept-mo-queue-childlist
          var target = e.relatedNode;
          var changedNode = e.target;
          var addedNodes, removedNodes;
          if (e.type === 'DOMNodeInserted') {
            addedNodes = [changedNode];
            removedNodes = [];
          } else {

            addedNodes = [];
            removedNodes = [changedNode];
          }
          var previousSibling = changedNode.previousSibling;
          var nextSibling = changedNode.nextSibling;

          // 1.
          var record = getRecord('childList', target);
          record.addedNodes = addedNodes;
          record.removedNodes = removedNodes;
          record.previousSibling = previousSibling;
          record.nextSibling = nextSibling;

          forEachAncestorAndObserverEnqueueRecord(target, function(options) {
            // 2.1, 3.2
            if (!options.childList)
              return;

            // 2.2, 3.3
            return record;
          });

      }

      clearRecords();
    }
  };

  global.JsMutationObserver = JsMutationObserver;

  if (!global.MutationObserver)
    global.MutationObserver = JsMutationObserver;

})(this);

(function(scope) {
  // Overwrite requestAnimationFrame so it works across browsers
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !scope.requestAnimationFrame; ++x) {
    scope.requestAnimationFrame = scope[vendors[x] + 'RequestAnimationFrame'];
    scope.cancelAnimationFrame =
      scope[vendors[x] + 'CancelAnimationFrame'] || scope[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!scope.requestAnimationFrame)
    scope.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = scope.setTimeout(function() {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!scope.cancelAnimationFrame)
    scope.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };

}(typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window));
