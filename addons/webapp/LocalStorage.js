(function () {
    var Core = core.Core,
        __super__ = Core.prototype;
    /**
     * ** Singleton. ** <br>The main class that implements local storage functionalities on a web application.
     * This class wraps multiple storage mechanisms for storing information on the client side.
     * <br><br>** This class supports the following: **<br>
     * - SessionStorage
     * - LocalStorage
     * - WebSQL
     * @class LocalStorage
     * @module addons
     * @extends core.Core
     * @namespace core.addons.webapp
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core derived class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */
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
    /**
     * Method for storing key/value pair using local storage.
     *
     * @method storeLocal
     * @param {String} key The key to use when storing values
     * @param {Object} value The value to store paired with the key parameter
     */
    proto.storeLocal = function(key, value){
        if(this.hasLocalStorage){
            localStorage[key] = JSON.stringify(value);
        }

    };
    /**
     * Method for retrieving values in local storage.
     *
     * @method retrieveLocal
     * @param {String} key The key pair to use when retrieving values
     *
     */
    proto.retrieveLocal = function(key){
        if (this.hasLocalStorage && localStorage[key]) {
            return JSON.parse(localStorage[key]);
        }
        return null;
    };
    /**
     * Method for storing key/value pair using session storage.
     *
     * @method storeSession
     * @param {String} key The key to use when storing values
     * @param {Object} value The value to store paired with the key parameter
     */
    proto.storeSession = function(key, value){
        if(this.hasSessionStorage){
            sessionStorage[key] = value;
        }
    };
    /**
     * Method for retrieving values in session storage.
     *
     * @method retrieveSession
     * @param {String} key The key pair to use when retrieving values
     *
     */
    proto.retrieveSession = function(key){
        if(this.hasSessionStorage){
            return sessionStorage[key];
        }
    };
    /**
     * Method for creating tables on WebSQL
     *
     * @method createTable
     * @param {String} tablename The table name to use upon creation
     * @param {String} structure The columns to use when creating table
     */
    proto.createTable = function(tablename, struct){
        if(this.hasSQL){
            if(typeof this.sqlDB !== 'undefined'){
                this.sqlDB.transaction((function(sql){
                    sql.executeSql("CREATE TABLE IF NOT EXISTS " + tablename + "("+struct+")");
                }).bind(this));
            }
        }
    };
    /**
     * Method for inserting data on WebSQL
     *
     * @method insertSql
     * @param {String} query The string INSERT query to use upon insertion
     *
     */
    proto.updateSql = proto.insertSql = function(query){
        this.sqlDB.transaction((function(sql){
            sql.executeSql(query);
        }));
    };
    /**
     * Method for retrieving data on WebSQL
     *
     * @method retrieveSql
     * @param {String} query The string SELECT query to use upon retrieval
     *
     */
    proto.retrieveSql = function(query, callback){
        this.sqlDB.transaction((function(sql){
            sql.executeSql(query, [], callback);
        }))
    };
    /**
     * Method for configuring WebSQL, this includes database creation and all other meta information required on creation
     *
     * @method configureSQL
     * @param {String} dbname The name of the database to create
     * @param {String} version The version of the database to create
     * @param {String} desc The description of the database to create
     * @param {Number} size The size of the database to create, uses bytes. (ie. 1024*1024 * [intended mb size])
     *
     */
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

    core.registerNamespace("core.addons.webapp.LocalStorage", o);

})();