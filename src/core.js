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
