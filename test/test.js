var expect = chai.expect,
  should = chai.should(),
  Log = '',
  $testModule,
  $testModuleParams,
  $testEventReceiverModule,
  $testEventReceiverModuleInner,
  $testEventEmitterModule;

function log(str) {
  Log = str || '';
  console.log(str);
}

describe("CoreJS is initialised correctly", function() {
  describe("'core'", function() {
    var obj = {
        k1: 'value1',
        k2: 'value2',
        k3: 'value3'
      },
      importedObj;

    core.registerNamespace("mo.cha.test.rnsObj", obj);
    importedObj = core._import("mo.cha.test.rnsObj");

    it("is available in 'window'", function() {
      expect('core' in window).to.be.true;
    });
    it("core.registerNamespace sets object in a namespaced fashion", function() {
      expect(mo.cha.test.rnsObj).to.be.deep.equal(obj);
    });
    it("core._import returns object in a namespaced fashion", function() {
      expect(importedObj).to.be.deep.equal(mo.cha.test.rnsObj);
    });
  });
});

describe("Main app is initialised correctly", function() {
  before(function() {
    // Register Main module
    core.registerModule({
      inherits: "core.Module",
      classname: "Main",
      module: ["core.WindowEvents", "app.Services", function(wevents, service) {
        this.initialized = function(opts) {
          // console.log(this);
          wevents.on("window.scroll", "onWindowScroll", this);
        };
        this.onWindowScroll = function(evt) {
          console.log(evt);
        };
      }]
    });

    //instantiate using custom main class, remove 2nd parameter to instantiate using built-in core module
    core.strapUp(function() {
      console.log('Strapped');
    }, 'Main');
  });

  describe("'__coreapp__'", function() {
    it("is available in 'window'", function() {
      expect('__coreapp__' in window).to.be.true;
    });
  });

  describe("'Main' app", function() {
    it("is strapped", function() {
      expect(__coreapp__.$classname).to.deep.equal('Main');
    });
    it("listens to & handles window scroll event", function(done) {
      // Trigger scroll on window
      var $div = $('<div>').css('height', 2000);
      $('body').append($div);
      $('body').animate({
        scrollTop: 1
      }, 0, function() {
        expect($(window).scrollTop()).to.deep.equal(1);
        done();
      }).animate({
        scrollTop: 0
      }, 0, function() {
        $div.remove();
      });
    });
  });

});

describe("TestModule", function() {

  before(function() {
    core.registerModule({
      inherits: "core.Module",
      classname: "TestModule",
      module: ["core.EventBroadcaster", function(evt) {
        this.initialized = function(opts) {
          this.$el.click(this.defaultClickHandler.bind(this));
        };

        this.defaultClickHandler = function() {
          log('TestModule default Handler was clicked');
        };
      }]
    });

    $testModule = $('<div>', {
      'class': 'TestModule',
      'data-core-module': 'TestModule',
      'data-core-id': 'test_module',
      'data-core-params': 'test:"test1";something:100;'
    }).text('{{$classname}}');

    $testModuleParams = $('<div>', {
      'class': 'TestModuleParams',
      'data-core-module': 'TestModule',
      'data-core-id': 'test_module_params',
      'data-core-params': '\'test\':\'test1\';"something":100;'
    }).text('{{$classname}}');

    $('body').append($testModule);
    $('body').append($testModuleParams);

  });

  describe("Module", function() {
    it("is initialized", function() {
      expect(__coreapp__.test_module.$classname).to.deep.equal('TestModule');
    });
    it("can handle 'click' event as per module definition", function() {
      $testModule.click();
      expect(Log).to.equal('TestModule default Handler was clicked');
      log('');
    });
    it("is binding correctly", function() {
      expect($testModule.text()).to.equal('TestModule');
    });
    describe("Params", function() {
      it("data params are set as per defined in attribute", function() {
        expect(__coreapp__.test_module.params).to.deep.equal({
          test: "test1",
          something: 100
        });
      });
      it("data param's key can be in either single quotes, double quotes or have no quotes at all", function() {
        expect(__coreapp__.test_module_params.params).to.deep.equal({
          test: "test1",
          something: 100
        });
      });
    });
  });

  describe("EventReceiver Module", function() {
    before(function() {
      // Register module TestEventReceiverModule as extended module of TestModule
      core.registerModule({
        inherits: "TestModule",
        classname: "TestEventReceiverModule",
        module: [function() {
          this.initialized = function(opts) {
            this.$super.initialized.call(this, opts);
            core.EventBroadcaster.on("customBehaviour", "removeMe", this);
          };
          this.removeMe = function() {
            log('TestEventReceiverModule behaviour called');
            // this.$el.remove();
          };
        }]
      });

      $testEventReceiverModule = $('<div>', {
        'class': 'TestEventReceiverModule',
        'data-core-module': 'TestEventReceiverModule',
        'data-core-id': 'test_event_receiver_module'
      }).text('{{$classname}}');

      $('body').append($testEventReceiverModule);

    });

    it("is initialized", function() {
      expect(__coreapp__.test_event_receiver_module.$classname).to.deep.equal('TestEventReceiverModule');
    });
    it("can handle 'click' event as per module definition of it's parent TestModule class", function() {
      $testEventReceiverModule.click();
      expect(Log).to.equal('TestModule default Handler was clicked');
      log('');
    });
    it("is binding correctly", function() {
      expect($testEventReceiverModule.text()).to.equal('TestEventReceiverModule');
    });
  });

  describe("EventEmitter Module", function() {
    before(function() {
      // Register module TestEventEmitterModule as extended module of TestModule
      core.registerModule({
        inherits: "TestModule",
        classname: "TestEventEmitterModule",
        module: [function() {
          this.initialized = function(opts) {
            this.$super.initialized.call(this, opts);
          };

          this.defaultClickHandler = function() {
            core.EventBroadcaster.trigger("customBehaviour");
            log('TestEventEmitterModule clicked');
          };

        }]
      });

      $testEventEmitterModule = $('<div>', {
        'class': 'TestEventEmitterModule',
        'data-core-module': 'TestEventEmitterModule',
        'data-core-id': 'test_event_emitter_module'
      }).text('{{$classname}}');

      $('body').append($testEventEmitterModule);

    });

    it("is initialized", function() {
      expect(__coreapp__.test_event_emitter_module.$classname).to.deep.equal('TestEventEmitterModule');
    });
    it("can handle 'click' event as per module definition (override parent)", function() {
      $testEventEmitterModule.click();
      expect(Log).to.equal('TestEventEmitterModule clicked');
      log('');
    });
    it("is binding correctly", function() {
      expect($testEventEmitterModule.text()).to.equal('TestEventEmitterModule');
    });
  });

  // after(function() {
  //   $testModule.remove();
  //   $testModuleParams.remove();
  //   delete __coreapp__.test_module;
  //   delete __coreapp__.test_module_params;
  // });

});
