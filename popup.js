$(document).ready(function(){
	$(document).on("contextmenu",function(){
		return false;
	});
	chrome.bookmarks.getRecent(20,function (items){
		recent.obj=items
	});
	contextmenu.init();
	searchbox.create();

	$('body').click(function(){
		$('#contextmenu').hide();
	})

	searchtype.init(); // 0.7
	keybord.init();
	dialog.init();

	$("#search-box>#input-box>#input-query").focus(function(){
		$("#search-box>#input-box").css({border: "1px solid #73A6FF"});
	}).blur(function(){
		$("#search-box>#input-box").css({border: "1px solid #D1D8E8"});
	})
	$("#button-back").click(function(){
		var id=$(this).data("parentId");
		if(id==0){id=1}
		folder.init(String(id))
	});

	$("#template-item, #template-search-item").mouseup(function(event){
		$("li[selected='true']").each(function(){
			$(this).attr({"selected": ""});
		});
		$(this).attr({"selected": true})
		switch(event.button){
			case 2:
				
				var x = Math.min(event.clientX, $("#list")[0].clientWidth - $("#contextmenu").width()-3);
				var y = Math.min(event.clientY, $("#list")[0].clientHeight -  $("#contextmenu")[0].clientHeight - 3);
				contextmenu.open({"x": x,"y": y})
				break;
		}
	});
	$(".item-parent-title").click(function(){
		var root=$(this).parent();
		folder.init(String(root.data("options").parentId))
	});
	
	$("span.item-title,span.item-url").click(function(event){
		
		var root=$(this).parent();
		
		switch(root.data("type")){
			case "folder":
			case "other":
				switch(check.open(event)){
					case "tab":
						chrome.bookmarks.getChildren(root.data("options").id,function (items){
							if(!items || !Array.isArray(items)){
								return;
							}
							for (var i=0; i < items.length; i++){
								if(check.bookmarklet(items[i].url)){continue;}
								chrome.tabs.create( {"url": items[i].url}, function (){});
							}
							return
						});
						break;
						case "window":
						chrome.runtime.sendMessage({ type: 'opneallbookmarks', itemId: root.data("options").id });
						break;
/*					case "selected":
						chrome.extension.sendRequest({ type: 'opneallbookmarks', itemId: root.data("options").id,incognito: true});
						break;*/
					default:
						folder.init(root.data("options").id)
				}
				break;
			case "recent":
				switch(check.open(event)){
					case "tab":
						chrome.bookmarks.getRecent(20,function (items){
							if(!items || !Array.isArray(items)){
								return;
							}
							for (var i=0; i < items.length; i++){
								if(check.bookmarklet(items[i].url)){continue;}
								chrome.tabs.create( {"url": items[i].url}, function (){});
							}
							return
						});
						break;
					case "window":
						chrome.runtime.sendMessage({ type: 'opneallrecentbookmarks', max: 20 });
						break;
					default:
						recent.init();
						$('#input-query').val('').focus(); // 0.7
				}
				
				break;
			default:
				if(root.data("type")=="bookmarklet"){
					chrome.runtime.sendMessage({type: 'opnebookmarklet',itemId: root.data("options").id});
					window.close();
				}else{

					var flag=check.open(event);
					if(flag=="current"){
						if(localStorage["opento"]){
							flag=localStorage["opento"];
						}
					}
			
					switch(flag){
						case "selected":
							chrome.tabs.create( {"url": root.data("options").url,"selected": true}, function (){
								window.close();
							});
							break;
						case "tab":
							if(!selected){var selected=false}
							chrome.tabs.create( {"url": root.data("options").url,"selected": false}, function (){});
							break;
						case "window":
							chrome.windows.create({"url": root.data("options").url}, function (){
								window.close();
							});
							break;
						case "flash":
							chrome.tabs.create( {"url": root.data("options").url,"selected": true}, function (){});
							chrome.bookmarks.remove(root.data("options").id, function (){});
							break;
						default:
							chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
								chrome.tabs.update(tabs[0].id, {"url": root.data("options").url}, function() { window.close();});
							})
					}
				}
			break;
		}
	});

	$("#template-search-item").hover(
		function(){
			var root=$(this)
//			if(root.find("span:eq(2)").text()){
			if(root.find(".item-parent-title>a").text()){
			}else{
				var parentId = root.data("options").parentId;
				if(parentId){
					chrome.bookmarks.get(parentId, function (item){
						if(item && item[0]){
//							root.find("span:eq(2)").text(item[0].title);
							root.find(".item-parent-title>a").text(item[0].title);
						}
					});
				}
			}
//			$(this).find("span:eq(2)").show()
			$(this).find(".item-parent-title").show()
		},function(){
			$(this).find(".item-parent-title").hide()
//			$(this).find("span:eq(2)").hide()
		}
	)
	folder.init("1")
});

$(window).resize(function(){
	$('#home-box').height(550-$('#header-box').outerHeight(true));
	$('#list').height(550-($('#header-box').outerHeight(true)+$('#search').outerHeight(true))-8);
})

var search={
	init: function(){
		var query = $("#input-query").val();
		if(!query || query==""){
			if($('#search-type-box>button').attr('searchtype')!='2'){ // 0.7
				folder.init("1");
				return;
			}
		}

		if($('#search-type-box>button').attr('searchtype')=='2'){ // 0.7
			var items=$('#home-box>#list>li');
			var regexp=new RegExp(query,'i')
			for (var i=0; i < items.length; i++){
				var root=$(items[i])
//				console.log(ops)
				if(!root){
					root.attr('hiddend','true')//.hide()
					continue
				}
				if(new String(root.find('.item-title').text()).match(regexp)||new String(root.find('.item-url').text()).match(regexp)){
					root.attr('hiddend','false')//.show()
				}else{
					root.attr('hiddend','true')//.hide()
				}
				
			}
			return
		}
		
		chrome.bookmarks.search(query, function (items){

			$("#back-box").attr({back:true}).find("#button-back").attr({"data-parentId": "1"});

			$("#list").empty().scrollTop(0);
			var length=0;
			var template=$("li#template-search-item");
//			var query=$("#input-query").val().toLowerCase();

			var docFragm = document.createDocumentFragment();
			var itemsToRender = [];

			for (var i=0; i < items.length; i++){
//				if(query.length==1 && localStorage["initialsearch"]){
				if(/*query.length==1 &&*/ searchtype.root().find('button').attr('searchtype')==1){// 0.7
					var re = new RegExp('^'+$("#input-query").val(),'i');
		//			console.log(items[i].title.match(re))
					//if(query[0]!=items[i].title[0].toLowerCase()){
					if(!items[i].title.match(re)&&!items[i].url.match(re)){continue;} // 0.7
				}

				var itemData = {
					id: items[i].id,
					options: items[i],
					type: check.bookmarklet(items[i].url) ? "bookmarklet" : "bookmark",
					title: items[i].title,
					url: items[i].url
				};
				itemsToRender.push(itemData);
				length++;
			}

			var renderedCount = 0;
			itemsToRender.forEach(function(item){
				getFaviconUrl(item.url, function(faviconUrl){
					var root=template.clone(true);
					root.attr({id: item.id,"data-options": JSON.stringify(item.options),"data-type": item.type})
					root.find(".item-title").text(item.title).css({"background-image": "url('"+(faviconUrl || 'bookmark.png')+"')"})
					root.find(".item-url").text(item.url);
					docFragm.appendChild(root[0]);
					renderedCount++;

					if(renderedCount === itemsToRender.length){
						$("#list").append(docFragm);
						$("#header-box-title").text(chrome.i18n.getMessage("search_result",[length]));
					}
				});
			});
		})
	}
}

var searchtype={ // 0.7
	root:function(){return $('#search-box2>#search-type-box')},
	init:function(){
		$('#input-clear-box').click(function(){
			$('#input-query').val('').focus();
			$('#input-clear-box').hide();
			if($('#search-type-box>button').attr('searchtype')=='2'){
				$('#list>li').attr('hiddend',false)//.show()
			}
		}).hide()

		$('#dummy-box').click(function(){
				$(this).hide();
				searchtype.root().find('button').attr('open','false')
				$('#search-type-menu').hide();
				$('#contextmenu').hide();
		}).hide()
		searchtype.root().find('button').click(function(){ // 0.7
			if($(this).attr('open')=='true'){
				$(this).attr('open','false');
				$('#search-type-menu').hide();
				$('#dummy-box').hide();
				return
			}
			$('#search-type-menu').css({left:(($(this).position().left+$(this).width())-$('.dropdown-menu').width())+'px'}).show();
			$('#dummy-box').show()
			$(this).attr('open','true')
		});
		
		$('#search-type-menu>li>.label').click(function(){ // 0.7
			var root=$(this);
			var val=root.parent().attr('value')
			$('#search-type-box>button').attr('searchtype',val).find('.button-label').text(root.parent().attr('short-label'));
			$('#search-type-menu>li').attr('selected','false');
			root.parent().attr('selected','true')
			$('#search-box2>#search-type-box>button').trigger('click');
			if($('#search-type-box>button').attr('searchtype')=='2'){
				$('#input-query').val('').focus();
				$('#input-clear-box').hide()
			}
			search.init();
		});
		
		$('#search-type-menu>li>.star').click(function(){ // 0.7
			localStorage['searchtype']=$(this).attr('value');
			searchtype.change(true)
		});
		searchtype.root().find('button').attr({'searchtype': localStorage['searchtype'],'open': 'false'});
		$('#search-type-menu').hide();
		searchtype.change()
	},
	change:function(def){
//		console.log(localStorage['searchtype'])
		$('#search-type-menu>li>.star').attr('def','false');
		$('#search-type-menu>li').attr('selected','false');
			
		switch(localStorage["searchtype"]){ // 0.7
			case '1':
				if(!def) {$('#search-box2>#search-type-box>button>span').text($('#search-type-menu>li:eq(1)').attr('short-label'));}
				$('#search-type-menu>li:eq(1)>.star').attr({'def':'true'})
				$('#search-type-menu>li:eq(1)').attr({'selected':'true'})
				break;
			case '2':
				if(!def) {$('#search-box2>#search-type-box>button>span').text($('#search-type-menu>li:eq(2)').attr('short-label'));}
				$('#search-type-menu>li:eq(2)>.star').attr({'def':'true'})
				$('#search-type-menu>li:eq(2)').attr({'selected':'true'})
				break;
			default:
				localStorage["searchtype"]=0;
				if(!def) {$('#search-box2>#search-type-box>button>span').text($('#search-type-menu>li:eq(0)').attr('short-label'));}
				$('#search-type-menu>li:eq(0)>.star').attr('def','true')
				$('#search-type-menu>li:eq(0)').attr({'selected':'true'})
		}
		if(!def) {
			$('#search-box2>#search-type-box>button>span').text(searchtype.root().find('#search-type-menu>li[value="'+localStorage["searchtype"]+'"]').attr('short-label'));
		}
	},
}

var faviconHelper={
	cachePrefix: 'favicon_',
	defaultSize: 32,
	getDomain: function(url){
		try{
			return new URL(url).hostname;
		}catch(e){
			return null;
		}
	},
	getCacheKey: function(domain){
		return this.cachePrefix + domain;
	},
	getCached: function(domain){
		try{
			var cached = localStorage.getItem(this.getCacheKey(domain));
			if(cached){
				var data = JSON.parse(cached);
				if(Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000){
					return data.url;
				}
			}
		}catch(e){
			console.error('Favicon cache error:', e);
		}
		return null;
	},
	setCache: function(domain, url){
		try{
			localStorage.setItem(this.getCacheKey(domain), JSON.stringify({
				url: url,
				timestamp: Date.now()
			}));
		}catch(e){
			console.error('Favicon cache save error:', e);
		}
	},
	fetchFavicon: function(domain){
		var self = this;
		var fallbackServices = [
			'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(domain) + '&sz=32',
			'https://icons.duckduckgo.com/ip3/' + encodeURIComponent(domain) + '.ico',
			'https://favicons.githubusercontent.com/' + encodeURIComponent(domain)
		];

		return new Promise(function(resolve){
			var index = 0;
			function tryNext(){
				if(index >= fallbackServices.length){
					resolve('bookmark.png');
					return;
				}
				var imgUrl = fallbackServices[index];
				var img = new Image();
				img.onload = function(){
					self.setCache(domain, imgUrl);
					resolve(imgUrl);
				};
				img.onerror = function(){
					index++;
					tryNext();
				};
				img.timeout = setTimeout(function(){
					index++;
					tryNext();
				}, 3000);
				img.src = imgUrl;
			}
			tryNext();
		});
	},
	getUrl: function(url, callback){
		if(!url){
			callback('bookmark.png');
			return;
		}

		var domain = this.getDomain(url);
		if(!domain){
			callback('bookmark.png');
			return;
		}

		var cached = this.getCached(domain);
		if(cached){
			callback(cached);
			return;
		}

		this.fetchFavicon(domain).then(function(faviconUrl){
			callback(faviconUrl);
		});
	}
};

function getFaviconUrl(url, callback){
	faviconHelper.getUrl(url, callback || function(url){ return url; });
}

var folder={
	init: function(id){
		$('#input-query').val('').focus();
		$('#input-clear-box').hide()
		
		if(id=="1"){
			$("#back-box").attr({back: false}).find("#button-back").attr({"data-parentId":0});
			$("#header-box-title").text(chrome.i18n.getMessage("def_title"));
//			$("#header-box-back").attr({"data-parentId": 0}).hide(); //0.7
		}else{
			chrome.bookmarks.get(id, function (item){
				if(item && item[0]){
					$("#header-box-title").text(item[0].title);
//					$("#header-box-back").attr({"data-parentId": item[0].parentId}).show(); //0.7
					$("#back-box").attr({back: true}).find("#button-back").attr({"data-parentId": item[0].parentId})
				}
			});
		}
		

		chrome.bookmarks.getChildren(id,function (items){
			$("#list").empty().scrollTop(0);
			var template=$("#template-item")
			var docFragm = document.createDocumentFragment();
			var itemsToRender = [];

			if (!items || !Array.isArray(items)) {
				items = [];
			}

			for (var i=0; i < items.length; i++){

				var itemData = {
					id: null,
					options: items[i],
					title: items[i].title,
					url: items[i].url
				};

				if(items[i].dateGroupModified){
					itemData.type = "folder";
					itemData.url = null;
					itemsToRender.push(itemData);
				}else{
					if(recent.check(items[i].id)){
						itemData.recent = true;
					}
					if(check.bookmarklet(items[i].url)==true){
						itemData.type = "bookmarklet";
					}else{
						itemData.type = "bookmark";
					}
					itemsToRender.push(itemData);
				}
			}

			var renderedCount = 0;
			itemsToRender.forEach(function(item){
				var root=template.clone(true);
				root.attr({id: item.id,"data-options": JSON.stringify(item.options)})
				root.find("span:eq(0)").text(item.title)

				if(item.type === "folder"){
					root.attr({"data-type": "folder"})
					root.find("span:eq(1)").hide()
					docFragm.appendChild(root[0]);
					renderedCount++;
					checkRenderComplete();
				}else{
					if(item.recent){
						root.attr({"recent": "true"})
					}
					root.attr({"data-type": item.type})
					root.find("span:eq(1)").text(item.url)

					getFaviconUrl(item.url, function(faviconUrl){
						root.find("span:eq(0)").css({"background-image": "url('"+(faviconUrl || 'bookmark.png')+"')"})
						docFragm.appendChild(root[0]);
						renderedCount++;
						checkRenderComplete();
					});
				}
			});

			function checkRenderComplete(){
				if(renderedCount === itemsToRender.length){
					$("#list").append(docFragm);
				}
			}
		});
		
		if(id=="1"){

			chrome.bookmarks.getChildren("0",function (items){
				if(!items || items.length < 2){
					return;
				}
				var root=$("#template-item").clone(true).appendTo("#list");
				root.attr({id: null,"data-type": "recent"})
				root.find("span:eq(1)").text("Recently Bookmarks").hide()
				root.find("span:eq(0)").text(chrome.i18n.getMessage('lbl_recent')).css({"background-image": "url('folder.png')"})

				items[1].parentId="1";
				var root=$("#template-item").clone(true).appendTo("#list");
				root.attr({id: null,"data-options": JSON.stringify(items[1]),"data-type": "other"})
				root.find("span:eq(1)").hide()
				root.find("span:eq(0)").text(items[1].title).css({"background-image": "url('folder.png')"})
			});
		}
	},
	item:{
		create: function(){}
	}
}

var open={
	folder: function(id){
		folder.create(id)
	},
	parent: function(){},
	item: function(){}
}

var check={
	"bookmarklet": function(url){
		if (/^javascript:/.test(url)) {
			return true;
		}else{
			return false;
		}
	},
	"open": function(event){
		if(event.ctrlKey && event.shiftKey){return "selected"}
		if(event.ctrlKey){return "tab"}
		if(event.shiftKey){return "window"}
		if(event.altKey){return "flash"}
		return "current"
	}
}

var keybord={
	status: {
		shift: null,
		ctrl: null,
		alt: null,
	},
	"init": function(){
		$("body").keydown(function(event){
			if(contextmenu.status()){ return; }
			if(dialog.status()){ return; }
			
//			var elm=$("#list > li[selected=true]");
			var elm=$('#list > li[selected=true]:not([hiddend=true])'); // 0.7
			var li=$('#list > li');
			console.log(event.keyCode)
			switch (event.keyCode){
				case 8:
					if(document.activeElement.id=="input-query"){return;}
					var id=$("#button-back").data("parentId");
					if(id==0){id=1}
					folder.init(String(id));
					break
				case 13:
					if(elm.hasClass("item-editing")){return;}
					
					if(elm.data("type")=="folder" || elm.data("type")=="other"){
						switch(check.open(event)){
							case "tab":
								chrome.bookmarks.getChildren(elm.data("options").id,function (items){
									if(!items || !Array.isArray(items)){
										return;
									}
									for (var i=0; i < items.length; i++){
										if(check.bookmarklet(items[i].url)){continue;}
										chrome.tabs.create( {"url": items[i].url}, function (){});
									}
									return
								});
								break;
							case "window":
								chrome.runtime.sendMessage({ type: 'opneallbookmarks', itemId: elm.data("options").id });
								break;
							case "selected":
								//chrome.extension.sendRequest({ type: 'opneallbookmarks', itemId: root.data("options").id,incognito: true});
								break;
							default:
								folder.init(elm.data("options").id)
						}
					}else if(elm.data("type")=="recent"){
						switch(check.open(event)){
							case "tab":
								chrome.bookmarks.getRecent(20,function (items){
									if(!items || !Array.isArray(items)){
										return;
									}
									for (var i=0; i < items.length; i++){
										if(check.bookmarklet(items[i].url)){continue;}
										chrome.tabs.create( {"url": items[i].url}, function (){});
									}
									return
								});
								break;
						case "window":
							chrome.runtime.sendMessage({ type: 'opneallrecentbookmarks',max: 20});
							break;
							case "selected":
								//chrome.extension.sendRequest({ type: 'opneincognitoallrecentbookmarks', max: 20});
								break;
							default:
								recent.init()
						}						
					}else{
					if(elm.data("type")=="bookmarklet"){
						chrome.runtime.sendMessage({type: 'opnebookmarklet',itemId: elm.data("options").id});
						window.close();
					}else{

							var flag=check.open(event);
							if(flag=="current"){
								if(localStorage["opento"]){
									flag=localStorage["opento"];
								}
							}
		
							switch(flag){
								case "selected":
									chrome.tabs.create( {"url": elm.data("options").url,"selected": true}, function (){
										window.close();
									});
									break;
								case "tab":
									if(!selected){var selected=false}
									chrome.tabs.create( {"url": elm.data("options").url,"selected": false}, function (){});
									break;
								case "window":
									chrome.windows.create({"url": elm.data("options").url}, function (){
										window.close();
									});
									break;
								case "flash":
									chrome.tabs.create( {"url": elm.data("options").url,"selected": true}, function (){});
									chrome.bookmarks.remove(elm.data("options").id, function (){});
									break;
						default:
							chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
								chrome.tabs.update(tabs[0].id, {"url": elm.data("options").url}, function() { window.close();});
							})
							}
						}
					}

					break;
				case 46:
					if(elm.length==0||document.activeElement.id=="input-query"){return;}
					dialog.open("remove")
					break;
				case 40:

					if($('#search-type-box>button').attr('searchtype')=='2'){ // 0.7
						var li=$('#list>li:not([hiddend=true])')
						var sel=$('#list>li[selected=true]:not([hiddend=true])')
						if(sel.length==0){ 
							$(li[0]).attr({"selected":true});
						}else{
							var i=0
							$('#list>li:not([hiddend=true])').each(function(){
								
								if(i==li.length){return;}
								if($(this).attr('selected')=='true'){
									if((li.length-1)==i){return}
									$(this).attr('selected', 'false')
									$(li[i+1]).attr('selected', 'true');
									$("#list").scrollTop($("#list").scrollTop()+($(li[i+1]).position().top-260));
									return
								}
								i++;
							}); 
						}
						break
					}
					
					if(elm.length==0){ 
						$(li[0]).attr({"selected":true});
						return;
					};

					var i=elm.index()+1;
					if(i>=li.length){return;}

 					$("#list>li[selected='true']").each(function(){
						$(this).attr({"selected": ""});
					}); 

					$(li[i]).attr({"selected":true});
					$("#list").scrollTop($("#list").scrollTop()+($(li[i]).position().top-260))
					break;
				case 38:
				

					if($('#search-type-box>button').attr('searchtype')=='2'){ // 0.7
						var li=$('#list>li:not([hiddend=true])')
						var sel=$('#list>li[selected=true]:not([hiddend=true])')
						if(sel.length==0){ 
							$(li[li.length]).attr({"selected":true});
						}else{
							var i=0
							$('#list>li:not([hiddend=true])').each(function(){
								
								if($(this).attr('selected')=='true'){
									if(i==0){return}
									$(this).attr('selected', 'false')
									$(li[i-1]).attr('selected', 'true');
									$("#list").scrollTop($("#list").scrollTop()-(260-$(li[i]).position().top))
									return
								}
								i++;
							}); 
						}
						break
					}
					
					if(elm.length==0){ 
						var i=li.length-1
						$(li[i]).attr({"selected":true});
						return;
					};
					var i=elm.index()-1;
					if(i<0){return;}
					$("#list>li[selected='true']").each(function(){
						$(this).attr({"selected": ""});
					});
					$(li[i]).attr({"selected":true});
					$("#list").scrollTop($("#list").scrollTop()-(260-$(li[i]).position().top))
					break;

/* 				case 65:
					if($('#search-type-box>button').attr('open')=='true'){
						$('#search-type-menu>li[value=0]>.label').focus().trigger('click')
					}
					break;

				case 70:
					if($('#search-type-box>button').attr('open')=='true'){
						$('#search-type-menu>li[value=2]>.label').focus().trigger('click')
					}
					break;

				case 73:
					if($('#search-type-box>button').attr('open')=='true'){
						$('#search-type-menu>li[value=1]>.label').focus().trigger('click');
						
					}
					break; */
			}
		}).keyup(function(event){
			if(contextmenu.status()){ return; }
			if(dialog.status()){ return; }
			var elm=$("#list > li[selected=true]");
			if(elm.length==0||document.activeElement.id=="input-query"){return;}
			
			switch (event.keyCode){
				case 68:
					dialog.open("remove")
					break;
				case 77:
					dialog.open("edit");
					break;
				case 111:
					$("#search-box").show()
					$("#input-query").focus()
					break;
			}
		});
	},
}

var contextmenu={
	"init": function(){
		$("#contextmenu-item-incognito").click(function(){
			var root=$("li[selected='true']");
			chrome.windows.create({"url": root.data("options").url,incognito: true}, function (){ window.close(); });
			$('#dummy-box').hide() // 0.7
		})
	
		$("#contextmenu-item-tab").click(function(){
			var root=$("li[selected='true']");
			chrome.tabs.create( {"url": root.data("options").url,"selected": false}, function (){});
			$('#dummy-box').hide() // 0.7
		});
		
		$("#contextmenu-item-window").click(function(){
			var root=$("li[selected='true']");
			chrome.windows.create({"url": root.data("options").url}, function (){ window.close(); });
			$('#dummy-box').hide() // 0.7
		});
		
		$("#contextmenu-item-edit").text(chrome.i18n.getMessage("btn_edit")).click(function(){
			dialog.open("edit");
			$('#dummy-box').hide() // 0.7
		});
		
		$("#contextmenu-item-remove").text(chrome.i18n.getMessage("btn_remove")).click(function(){
			dialog.open("remove");
			$('#dummy-box').hide() // 0.7
		});
	},
	"open": function(res){
		
		var root=$("li[selected=true]");

		switch(root.data("type")){
			case "other":
			case "recent":
				$("#contextmenu").fadeOut("fast");
				break
			case "folder":
			case "bookmarklet":
				$("#contextmenu-open").hide()
				$("#contextmenu").css({top: res.y+"px",left: res.x+"px"}).fadeIn("fast");
				break
			default:
				$("#contextmenu > li").show()
				$("#contextmenu").css({top: res.y+"px",left: res.x+"px"}).fadeIn("fast");
				break
		}
		$('#dummy-box').show() // 0.7
	},
	"status":function(){
		if($("#contextmenu").css("display")=="none"){
			return false;
		}else{
			return true;
		}
	}
}

var searchbox={
	"create": function(){
		var _timer;
		$("#input-query").attr({"placeholder": chrome.i18n.getMessage("msg_search")}).keypress(function(event){
			if(event.keyCode==13){
				if(this.value==""){return;}
				if (_timer){
					clearTimeout(_timer);
				}
				search.init();
				event.preventDefault();
			}
		})
		
		$("#input-query")[0].oninput=function(){
 			if($('#search-type-box>button').attr('searchtype')=='2'&&$(this).val().length){ // 0.7
				$('#input-clear-box').show();
			}else{
				$('#input-clear-box').hide();
			}
/* 				if(!$(this).val().length){
					$('#input-clear-box').hide();
				}else{
					$('#input-clear-box').show();
				}
			}else{
				$('#input-clear-box').hide();
			} */
			
			if(_timer){
				clearTimeout(_timer);
			}
			_timer=setTimeout(function(){ 
				search.init(); 
			}, $("#input-query").attr("timeout"));
		}


	}
}

var dialog={
	init: function(){
		$("#edit-box-button-ok").click(function(){
			var root=$("li[selected='true']");
			var url=$("#edit-box-url-input").val()
			var title=$("#edit-box-title-input").val()

			if(!root.data("options").url){
				var url2="";
			}else{
				var url2=root.data("options").url;
			}
				
			if(url==url2 && title==root.data("options").title){
				$("#mask-box").fadeOut("slow");
				return
			}
				
			var object={}
			object.title=title
			if(root.data("type")=="bookmark" || root.data("type")=="bookmarklet"){
				object.url=$("#edit-box-url-input").val()
			}

			chrome.bookmarks.update(String(root.data("options").id), object, function (){
				var root=$("li[selected='true']");
				var object=root.data("options")
				
				object.title=$("#edit-box-title-input").val()
				root.find("span:eq(0)").text($("#edit-box-title-input").val())
				if(root.data("type")=="bookmark" || root.data("type")=="bookmarklet"){
					root.find("span:eq(1)").text($("#edit-box-url-input").val())
					object.url=$("#edit-box-url-input").val()
				}
				root.attr({"data-options": JSON.stringify(object)})
				$("#mask-box").fadeOut("slow");
			})
				
		});
			
		$("#edit-box-button-cancel").click(function(){
			$("#mask-box").fadeOut("slow");
		});
		$("#remove-box-button-ok").click(function(){
			var root=$("li[selected='true']");
			switch (root.data("type")){
				case "bookmark":
				case "bookmarklet":
					chrome.bookmarks.remove(String(root.data("options").id), function(){
						$("li[selected='true']").remove()
						$("#mask-box").fadeOut("slow");
					});
					break;
				case "folder":
					chrome.bookmarks.removeTree(String(root.data("options").id), function(){
						$("li[selected='true']").remove()
						$("#mask-box").fadeOut("slow");
					});
					break;
			}




		});
		$("#remove-box-button-cancel").click(function(){
			$("#mask-box").fadeOut("slow");
		});
	},
	remove: {
		show: function(){
			var root=$("li[selected='true']");
			switch (root.data("type")){
				case "bookmark":
					$("#remove-box > .dialog-title").text("Remove Bookmark?")
					break;
				case "bookmarklet":
					$("#remove-box > .dialog-title").text("Remove Bookmarklet?")
					break;
				case "folder":
					$("#remove-box > .dialog-title").text("Remove Folder?")
					break;
			}
			$("#remove-box > #remove-box-msg").html('Are you shure you want Remove <strong>"'+root.data("options").title+'"</strong>?')
			
			$("#remove-box").show();
			$("#edit-box").hide();
			return true;
		}
	},
	open: function(type){
		switch (type){
			case "remove":
				var root=$("li[selected='true']").data("type");
				if(root=="other" || root=="recent"){return;}
				dialog.remove.show();
				break;
			case "edit":
				var root=$("li[selected='true']");
				switch (root.data("type")){
					case "bookmark":
						$("#edit-box > .dialog-title").text("Edit Bookmark?")
						break;
					case "bookmarklet":
						$("#edit-box > .dialog-title").text("Edit Bookmarklet?")
						break;
					case "folder":
						$("#edit-box > .dialog-title").text("Edit Folder?")
						break;
				}
				$("#edit-box").show()
				$("#remove-box").hide()
				var root=$("li[selected='true']");
				
				$("#edit-box-title-input").val(root.data("options").title)
				if(root.data("options").dateGroupModified){
					$("#edit-box-url").hide()
				}else{
					$("#edit-box-url-input").val(root.data("options").url)
					$("#edit-box-url").show()
				}
				
				dialog.open();
				$("#edit-box-title-input").focus();
				break;
		}
		
		$("#mask-box").css({top: $("#home-box").position().top+"px",left: $("#home-box").position().left+"px",width: $("#home-box").width()+"px",height: $("#home-box").height()+"px"}).fadeIn("slow");
		
		
	},
	"status":function(){
		if($("#mask-box").css("display")=="none"){
			return false;
		}else{
			return true;
		}
	}
}

var recent={
	obj: null,
	check: function(id){
		if(!recent.obj || !Array.isArray(recent.obj)){
			return false;
		}
		for (var i=0; i < recent.obj.length; i++){
			if(id==recent.obj[i].id){return true;}
		}
		return false;
	},
	init: function(){
		chrome.bookmarks.getRecent(20,function (items){
			$("#header-box-title").text(chrome.i18n.getMessage('lbl_recent'));
//			$("#header-box-back").attr({"data-parentId": 1}).show(); // 0.7
			$("#back-box").attr({back: true}).find("#button-back").attr({"data-parentId": 1});

			$("#list").empty().scrollTop(0);
			var template=$("#template-item")
			var itemsToRender = [];

			for (var i=0; i < items.length; i++){

				var itemData = {
					id: null,
					options: items[i],
					title: items[i].title,
					url: items[i].url
				};

				if(items[i].dateGroupModified){
					itemData.type = "folder";
					itemData.url = null;
					itemsToRender.push(itemData);
				}else{
					if(check.bookmarklet(items[i].url)==true){
						itemData.type = "bookmarklet";
					}else{
						itemData.type = "bookmark";
					}
					itemsToRender.push(itemData);
				}
			}

			var renderedCount = 0;
			itemsToRender.forEach(function(item){
				var root=template.clone(true);
				root.attr({id: item.id,"data-options": JSON.stringify(item.options)})
				root.find("span:eq(0)").text(item.title)

				if(item.type === "folder"){
					root.attr({"data-type": "folder"})
					root.find("span:eq(1)").hide()
					docFragm.appendChild(root[0]);
					renderedCount++;
					checkRenderComplete();
				}else{
					root.attr({"data-type": item.type})
					root.find("span:eq(1)").text(item.url)

					getFaviconUrl(item.url, function(faviconUrl){
						root.find("span:eq(0)").css({"background-image": "url('"+(faviconUrl || 'bookmark.png')+"')"})
						docFragm.appendChild(root[0]);
						renderedCount++;
						checkRenderComplete();
					});
				}
			});

			var docFragm = document.createDocumentFragment();

			function checkRenderComplete(){
				if(renderedCount === itemsToRender.length){
					$("#list").append(docFragm);
				}
			}
		});
	}
}