/**
 * Created by donaldmartinez on 8/05/15.
 * THE START OF EVERYTHING
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

  core.strapUp(function() {
    console.log("strapped");
  }, "Main");
  /* instantiate using custom main class, remove 2nd parameter to instantiate using built-in core module */

})();
