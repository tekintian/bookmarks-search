chrome.action.setIcon({path: "assets/img/bookmark.png"});

chrome.runtime.onMessage.addListener(function(request) {
	switch (request.type){
		case "opneallrecentbookmarks":
			chrome.bookmarks.getRecent(request.max,function (items){
				chrome.windows.create({"url": items[0].url}, function (windows){
					for (var i=1; i < items.length; i++){
						if(check.bookmarklet(items[i].url)==true){console.log("next");continue;}
						chrome.tabs.create( {"windowId": windows.id,"url": items[i].url}, function (){});
					}
				});
			});
			break;
		case "opneallbookmarks":
			chrome.bookmarks.getChildren(request.itemId,function (items){
				chrome.windows.create({"url": items[0].url}, function (windows){
					for (var i=1; i < items.length; i++){
						if(check.bookmarklet(items[i].url)==true){console.log("next");continue;}
						chrome.tabs.create( {"windowId": windows.id,"url": items[i].url}, function (){});
					}
				});
			});
			break;
		case "opnebookmarklet":
			chrome.bookmarks.get(request.itemId, function (items){
				chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
					var scriptUrl = decodeURIComponent(items[0].url).replace(/^javascript:/, '');
					chrome.scripting.executeScript({
						target: {tabId: tabs[0].id},
						func: (url) => { eval(url); },
						args: [scriptUrl]
					});
				});
			});
			break;
	}
});
var check={
	"bookmarklet": function(url){
		if (/^javascript:/.test(url)) {
			return true;
		}else{
			return false;
		}
	}
}