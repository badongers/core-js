(function () {
    core.registerModule({
        inherits:"core.Module",
        classname:"TestModule",
        module:[function(){
            this.initialized = function(opts){






                this.loadViewModule("./loaded.html");

            };

        }]
    });
})();