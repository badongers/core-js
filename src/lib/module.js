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
