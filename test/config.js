/**
 * Created by donaldmartinez on 8/05/15.
 */
(function(){
    core.configure({
        var1:"Test",
        var2:"Test again",
        httpMocks:function(){
            return {
                "/test":{
                    success:function(){

                    },
                    error:function(){

                    }
                }
            }
        }
    })
})();