/**
 * Created by donaldmartinez on 8/05/15.
 */

(function() {

  core.configure({
    var1: "Test",
    var2: "Test again",
    httpMocks: function() {
      return {
        "/test": {
          success: function() {

          },
          error: function() {

          }
        }
      }
    }
  });

  console.time("Setup");
  core.strapUp(function() {
    console.log('Strapped');
  }, "Main"); //instantiate using custom main class, remove 2nd parameter to instantiate using built-in core module

})();
