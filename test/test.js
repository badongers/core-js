/**
 * Created by badongers on 13/04/2014.
 */
test( "Core Application running", function() {
    ok( typeof __coreapp__ !== 'undefined', "Passed!" );
});
test( "Core Application derives from core.Core", function() {
    ok( __coreapp__ instanceof core.Core, "Passed!" );
});
test( "Core Application test module created", function() {
    ok( typeof __coreapp__.tmodule !== 'undefined' , "Passed!" );
});
