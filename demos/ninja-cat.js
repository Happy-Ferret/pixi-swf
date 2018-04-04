var container = document.getElementById('easelContainer');
container.style.width = "711px";
container.style.height = "400px";

var swfUrl = "ninja-cat.swf";

function getDocumentBase() {
    var baseElement = document.getElementsByTagName('base')[0];
    return baseElement ? baseElement.href : document.location.href;
}

function combineUrl(baseUrl, url) {
    return new URL(url, baseUrl).href;
}

function started() {
    document.removeEventListener('shumwaystarted', started, true);
    appStart();
}
document.addEventListener('shumwaystarted', started, true);

runViewer({
    //url: combineUrl(getDocumentBase(), swfUrl)
    empty: true
});

var loader;

function appStart() {
    var flash = Shumway.flash;
    loader = new flash.display.Loader();
    loader.contentLoaderInfo.addEventListener(flash.events.Event.COMPLETE, addEverything);
    var request = new flash.net.URLRequest(combineUrl(getDocumentBase(), swfUrl));
    var stage = player.stage;
    stage.addChild(loader);
    loader.load(request);
}

function addEverything() {
    var flash = Shumway.flash;
    var stage = player.stage;

    stage.addChild(loader.contentLoaderInfo.content);
}
