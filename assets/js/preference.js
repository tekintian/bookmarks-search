window.onload=function(){
	var prefs=document.querySelectorAll("preference");
	for (var i=0; i < prefs.length; i++){
		var pref=document.querySelectorAll("[preference="+prefs[i].getAttribute("name")+"]");
		var val=localStorage[prefs[i].getAttribute("name")];
		if(!val){
			if(prefs[i].getAttribute("defval")){
				val=prefs[i].getAttribute("defval")
			}else{
				val="";
			}
		}
		
		for (var a=0; a < pref.length; a++){
			console.log(pref[a].type)
			switch (pref[a].type) {
				case "radio":
					if(pref[a].value==val){
						pref[a].checked=true;
					}
					break;
				case "select-one":
					pref[a].value=val;
					break;
			}
		}
	}
}

$(window).on('beforeunload', function() {
	var prefs=document.querySelectorAll("preference");
	for (var i=0; i < prefs.length; i++){
		var pref=document.querySelectorAll("[preference="+prefs[i].getAttribute("name")+"]");

		for (var a=0; a < pref.length; a++){
			console.log(pref[a].type)
			switch (pref[a].type) {
				case "radio":
					if(pref[a].checked){
						localStorage[prefs[i].getAttribute("name")]=pref[a].value;
					}
					break;
				case "select-one":
					localStorage[prefs[i].getAttribute("name")]=pref[a].value;
					break;
			}
		}
		
	}
});