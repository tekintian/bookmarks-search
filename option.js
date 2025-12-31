$(document).ready(function(){
	document.title=chrome.i18n.getMessage("pref_title")+" - "+chrome.i18n.getMessage("extName");
	$(".label-on").text(chrome.i18n.getMessage("pref_label_on"));
	$(".label-off").text(chrome.i18n.getMessage("pref_label_off"));
	$("#label-initialsearch").text(chrome.i18n.getMessage("pref_label_initialsearch"));
	$("#label-current").text(chrome.i18n.getMessage("pref_label_current"));
	$("#label-tab").text(chrome.i18n.getMessage("pref_label_tab"));
	$("#label-selected").text(chrome.i18n.getMessage("pref_label_selected"));
	$("#label-window").text(chrome.i18n.getMessage("pref_label_window"));
	$("#label-flash").text(chrome.i18n.getMessage("pref_label_flash"));
});
