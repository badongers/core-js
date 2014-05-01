(function () {
    var Core = core.Core,
        __super__ = Core.prototype;
    function LocalStorage(opts) {
        if (opts && opts.__inheriting__) return;
        __super__.constructor.call(this, opts);

    }
    LocalStorage.inherits(Core);
    var proto = LocalStorage.prototype;
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.construct = function(opts){
        __super__.construct.call(this, opts);
        this.hasLocalStorage = "localStorage" in window;
        this.hasSessionStorage = "sessionStorage" in window;
        this.hasSQL = "openDatabase" in window;
    };
    proto.storeLocal = function(key, value){
        if(this.hasLocalStorage){
            localStorage[key] = value;
        }

    };
    proto.retrieveLocal = function(key){
        if(this.hasLocalStorage){
            return localStorage[key];
        }
        return null;
    };
    proto.storeSession = function(key, value){
        if(this.hasSessionStorage){
            sessionStorage[key] = value;
        }
    };
    proto.retrieveSession = function(key){
        if(this.hasSessionStorage){
            return sessionStorage[key];
        }
    };
    proto.createTable = function(tablename, struct){
        if(this.hasSQL){
            if(typeof this.sqlDB !== 'undefined'){
                this.sqlDB.transaction((function(sql){
                    sql.executeSql("CREATE TABLE IF NOT EXISTS " + tablename + "("+struct+")");
                }).bind(this));
            }
        }
    };

    proto.updateSql = proto.insertSql = function(query){
        this.sqlDB.transaction((function(sql){
            sql.executeSql(query);
        }));
    };
    proto.retrieveSql = function(query, callback){
        this.sqlDB.transaction((function(sql){
            sql.executeSql(query, [], callback);
        }))
    };
    proto.configureSQL = function(dbname, version, desc, size){
        if(this.hasSQL){
            this.sqlDB = openDatabase(dbname, version, desc, size);
        }
    };
    var instance = null;
    var o = {
        init:function () {
            if (instance == null) {
                instance = new LocalStorage();
            }
            return instance;
        }
    };
    o.instance = o.init;

    core.registerNamespace("core.LocalStorage", o);

})();