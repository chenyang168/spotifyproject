var client_id = '99502aa428d041faaa173a5302ad498b';
var client_secret = 'da0cc8cf6d9a4ee085db63a4a0fe62b6';
// var getTokenUrl = 'https://accounts.spotify.com/api/token';
var Base64Encode = btoa(client_id+':'+client_secret);
var auth = 'Basic ' + Base64Encode;
var myTrackUrl = "https://api.spotify.com/v1/me/tracks";
var proxyurl = 'https://cors-anywhere.herokuapp.com/';

function getParameterByName(url,name) {
    var name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(url);
    return results == null ? "": decodeURIComponent(results[1]);
}
// the above function is from https://www.cnblogs.com/season-huang/p/3322561.html
function getMyTracks(token) {
	var params = {'offset':0, 'limit': 50}
	$.ajax({
		url: myTrackUrl,
		headers: {
    		"Authorization":"Bearer "+ token,
    	},
    	method: 'GET',
    	data: jQuery.param(params),
    	dataType: 'json',
	}).then(function(data) {
		console.log(data);
	});
}

$(function() {
    var url = window.location.href;
	var access_token = getParameterByName(url, '#access_token');
	var access_token_2 = getParameterByName(url, 'access_token');
	var type = getParameterByName(url, 'token_type');
	var expires_in = getParameterByName(url, 'expires_in');

	console.log(url);
	console.log(access_token);
	console.log(access_token_2);
	console.log(type);
	console.log(expires_in);
	console.log(url.access_token_2);
    // var grant_type = 'authorization_code';
    // var redirect_uri = 'https://yinyinumsi.github.io/649GroupProject/main.html';
    // var params = {	code: code,
	// 		        redirect_uri: redirect_uri,
	// 		        grant_type: grant_type,
	// 		     };
    // $.ajax({
    // 	url: proxyurl + getTokenUrl,
    // 	headers: {
    // 		'Authorization': auth,
    // 	},
    // 	method: 'POST',
    // 	data: jQuery.param(params),
    // 	dataType: 'json',
    // }).then(function(data) {
    // 	console.log(data.access_token);
    // 	getMyTracks(data.access_token);
    // });  
});