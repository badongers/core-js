
(function(){
    var Core = core.Core; //shorthand variable assignment.
    var __super__ = Core.prototype;
    /**
     * Testing
     * @constructor
     * @param opts {object}
     *
     */
    function EventDispatcher(opts){
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    EventDispatcher.inherits(Core);
    var proto = EventDispatcher.prototype;
    proto.construct = function(opts){
        __super__.construct.call(this, opts);
        this.events = {};
    };
    proto.dispose = function(){
        __super__.dispose.call(this);
        this.removeAll();
        this.events = null;

    };
    var containsScope = function(arr, scope){
        var len = arr.length;
        for(var i = 0;i<len;i++){
            if(arr[i].scope === scope){
                return arr[i];
            }
        }
        scope.__core__signal__id__ = core.GUID();
        return -1;
    };
    var register = function(evt, scope, method, once){
        var __sig_dispose__ = null;
        var exists = containsScope.call(this, this.events[evt+(once ? "_once" : "")], scope);
        if(exists === -1 && scope.dispose){
            __sig_dispose__ = scope.dispose;

            scope.dispose = (function(){
                var meth = Array.prototype.shift.call(arguments);
                var sig = Array.prototype.shift.call(arguments);
                sig.removeScope(this, scope);
                sig = null;
                meth = null;

                return __sig_dispose__.apply(this, arguments);
            }).bind(scope, method, this);
            //
            this.events[evt+(once ? "_once" : "")].push({method:method, scope:scope, dispose_orig:__sig_dispose__});
        }else{
            //if scope already exists, check if the method has already been added.
            if(exists !== -1){
                if(exists.method != method){
                    this.events[evt+(once ? "_once" : "")].push({method:method, scope:exists.scope, dispose_orig:exists.dispose_orig});
                }
            }else{

                this.events[evt+(once ? "_once" : "")].push({method:method, scope:scope, dispose_orig:null});
            }
        }
    };
    proto.on = function(evt, method, scope){
        if(!this.events[evt]){
            this.events[evt] = [];
        }
        register.call(this, evt, scope, method);
    };
    proto.once = function(evt, method, scope){
        if(!this.events[evt+"_once"]){
            this.events[evt+"_once"] = [];
        }
        register.call(this, evt, scope, method, true);
    };
    var unregister = function(evt, scope, method){
        if(this.events[evt]){
            var len = this.events[evt].length;
            while(len--){
                if(this.events[evt][len].scope === scope && this.events[evt][len].method === method){
                    var o = this.events[evt].splice(len, 1).pop();
                    if(o.scope.dispose && o.dispose_orig){
                        o.scope.dispose = o.dispose_orig;
                    }
                    delete o.scope.__core__signal__id__;
                    o.scope = null;
                    o.dispose_orig = null;
                    delete o.dispose_orig;
                    o = null;

                }
            }
            if(this.events[evt].length === 0){
                delete this.events[evt];
            }
        }
    };
    proto.off = function(evt, method, scope){
        unregister.call(this, evt, scope, method);
        unregister.call(this, evt+"_once", scope, method);
    };
    proto.removeScope = function(scope){
        for(var prop in this.events){
            var len = this.events[prop].length;
            while(len--){
                if(this.events[prop][len].scope === scope){
                    var o = this.events[prop].splice(len, 1).pop();
                    if(o.scope.dispose && o.dispose_orig){
                        o.scope.dispose = o.dispose_orig;
                    }
                    delete o.scope.__core__signal__id__;
                    o = null;
                }
            }
            if(this.events[prop].length === 0){
                delete this.events[prop];
            }
        }
    };
    proto.removeAll = function(){
        for(var prop in this.events){
            var len = this.events[prop].length;
            while(this.events[prop].length){
                var o = this.events[prop].shift();
                if(o.scope.dispose && o.dispose_orig){
                    o.scope.dispose = o.dispose_orig;
                }
                delete o.__core__signal__id__;
                o = null;
            }
            if(this.events[prop].length === 0){
                delete this.events[prop];
            }
        }
        this.events = {};
    };
    proto.trigger = function(evt, vars){
        var dis = vars || {};
        if(!dis.type){
            dis.type = evt;
        }
        if(this.events && this.events[evt]){
            var sevents = this.events[evt];
            var len = sevents.length;
            for(var i = 0;i<len;i++){
                var obj = sevents[i];
                obj.method.call(obj.scope, dis);
                obj = null;
            }
        }
        if(this.events && this.events[evt+"_once"]){
            var oevents = this.events[evt+"_once"];
            while(oevents.length){
                var obj = oevents.shift();
                obj.method.call(obj.scope, dis);
                obj = null;
            }
            if(!oevents.length){
                delete this.events[evt+"_once"];
            }
        }

        dis = null;
    };
    core.registerNamespace("core.events.EventDispatcher", EventDispatcher);
})();