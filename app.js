(function ($) {
    var Document = core.delegates.Document,
        __super__ = Document.prototype;

    function Application(opts) {
        if (opts && opts.__inheriting__) return;
        Document.call(this, opts);
    }
    Application.inherits(Document);
    var proto = Application.prototype;
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.onDocumentReady = function(evt){
        __super__.onDocumentReady.call(this, false); //2nd parameter triggers automation
    };
    new Application();

})(core.selector);
