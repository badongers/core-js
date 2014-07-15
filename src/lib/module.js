/**
 * The base object of all core based classes. Every object created within the Core framework derives from this class.
 *
 * @class Module
 * @namespace core.wirings
 * @extends core.events.EventDispatcher
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core derived class.
 * @param {HTMLElement} opts.el The node element included in the class composition.
 *
 */
(function (scope) {
    core.registerModule({
        inherits:"core.EventDispatcher",
        classname:"core.Module",
        module:["core.XHR", function(xhr){
            this.delayedConstruct = function (opts) {
                //create
                findImmediateClasses.call(this, this.el);
                checkNodeProperties.call(this, this.el);
                if("initialized" in this){
                    this.initialized(opts);
                }

            };
            this.loadViewModule = function(src){
                var fragment;
                xhr.get(src).then((function(res){
                    fragment = res;

                }).bind(this)).error(function(err){

                }).complete((function(res){
                    this.appendFragment(fragment);
                }).bind(this));
            };
            this.appendNode = function(node){
                var wrap = document.createElement("div");
                wrap.appendChild(node);
                findImmediateClasses.call(this, wrap);
                this.el.appendChild(wrap.firstChild);
                wrap = null;
            };
            this.appendFragment = function(str){
                var wrap = document.createElement("div");
                wrap.innerHTML = str;
                findImmediateClasses.call(this, wrap);

                for(var i in wrap.childNodes){
                    try{
                        this.el.appendChild(wrap.childNodes[i]);
                    }catch(err){}

                }
                wrap = null;
            };
            function parseParameters(params){
                var o = {};
                var split = params.split(";");
                if(split[split.length-1] == ""){
                    split.pop();
                }
                var len = split.length;
                while(len--){

                    var pair = split[len].split(":");
                    o[pair[0]] = pair[1];
                }
                return o;
            };
            function checkNodeProperties(node){
                var children = node.childNodes;
                for(var i in children){
                    var child = children[i];
                    if(child.nodeType === 1){
                        if(child.getAttribute("core-module") || child.getAttribute("data-core-module")){
                            break;
                        }
                        if(child.getAttribute("data-core-prop") || child.getAttribute("core-prop")){
                            if(!this.properties){
                                this.properties = {};
                            }
                            var attr = child.getAttribute("data-core-prop") || child.getAttribute("core-prop");
                            if(this.properties[attr] && !(this.properties[attr] instanceof Array)){
                                this.properties[attr] = [this.properties[attr]];
                            }
                            if(this.properties[attr] instanceof Array){
                                this.properties[attr].push(child);
                            }else{
                                this.properties[attr] = child;
                            }
                        }

                    }
                }
            };
            function findImmediateClasses(node) {
                var recurse = function(modules) {
                    var i = -1,
                        cls,
                        opts,
                        len = modules.length-1;

                    while(i++ < len){
                        var mod = modules[i];

                        if(mod.nodeType == 1){

                            var cmod = mod.getAttribute("core-module") || mod.getAttribute("data-core-module");
                            var cid = mod.getAttribute("core-id") || mod.getAttribute("data-core-id");
                            var params = mod.getAttribute("core-params") || mod.getAttribute("data-core-params");

                            if(cmod && cid && !this[cid]){
                                cls = Function.apply(scope, ["return "+cmod])();
                                opts = {};
                                opts.params = params ? parseParameters(params) : null;
                                opts.el = mod;
                                opts.parent = this;

                                this[cid] = new cls(opts);
                            }else if(cmod && !cid){
                                cls = Function.apply(scope, ["return "+cmod])();
                                opts = {};
                                opts.params = params ? parseParameters(params) : null;
                                opts.parent = this;
                                opts.el = mod;
                                new cls(opts); //do not assign to any property

                            }else if(cmod && cid && this[cid]){
                                cls = Function.apply(scope, ["return "+cmod])();
                                opts = {};
                                opts.params = params ? parseParameters(params) : null;
                                opts.el = mod;
                                opts.parent = this;
                                var o = new cls(opts);
                                try{
                                    this[cid].push(o);
                                }catch(err){
                                    this[cid] = [this[cid]];
                                    this[cid].push(o);
                                }
                            }else if(mod.hasChildNodes()){
                                recurse.call(this, mod.childNodes);
                            }
                        }
                    }
                };
                recurse.call(this, node.childNodes);
            }


        }]
    });

})(typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window);