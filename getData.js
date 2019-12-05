var client_id = '99502aa428d041faaa173a5302ad498b';
var client_secret = 'da0cc8cf6d9a4ee085db63a4a0fe62b6';
var Base64Encode = btoa(client_id+':'+client_secret);
var auth = 'Basic ' + Base64Encode;
var myTrackUrl = "https://api.spotify.com/v1/me/tracks";
var proxyurl = 'https://cors-anywhere.herokuapp.com/';
var offset = 0


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
		var totalnum = data.total
		var times = Math.ceil(totalnum / 50) - 1
		console.log(times)
	});
}

$(function() {
	var hash = window.location.hash.substr(1);
	var result = hash.split('&').reduce(function (result, item) {
    var parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
	}, {});
	getMyTracks(result.access_token)

});