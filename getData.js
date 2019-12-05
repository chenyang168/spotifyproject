var client_id = '99502aa428d041faaa173a5302ad498b';
var client_secret = 'da0cc8cf6d9a4ee085db63a4a0fe62b6';
var Base64Encode = btoa(client_id+':'+client_secret);
var auth = 'Basic ' + Base64Encode;
var myTrackUrl = "https://api.spotify.com/v1/me/tracks";
var proxyurl = 'https://cors-anywhere.herokuapp.com/';
var allTracks = [];


function getTrackNumber(token) {
	var params = {'offset':0, 'limit': 50};
    console.log('shouldprint');
	return $.ajax({
        		url: myTrackUrl,
        		headers: {
            		"Authorization":"Bearer "+ token,
            	},
                data: jQuery.param(params),
            	method: 'GET',
            	dataType: 'json',
        	});
}

function data_savedTrack(allItems) {
    var cleanItems = [];
    for(item of allItems) {
        var oneItem = {}
        oneItem['id'] = item.track.id;
        oneItem['added_at'] = item.added_at;
        oneItem['artists'] = data_artist(item.track.artists);
        oneItem['trackName'] = item.track.name;
        console.log(item.track.id, oneItem['artists']);
        cleanItems.push(oneItem);
    }
    return cleanItems;
}

function data_artist(artists) {
    var allArtists = [];
    for(artist of artists) {
        var oneArtist = {};
        oneArtist['id'] = artist['id'];
        oneArtist['name'] = artist['name'];
        allArtists.push(oneArtist);
    }
    return allArtists;
}

function getMyTracks(token, pageNo) {
    var offset = 50*pageNo;
    var params = {'offset':offset, 'limit': 50}
    return $.ajax({
                url: myTrackUrl,
                headers: {
                    "Authorization":"Bearer "+ token,
                },
                method: 'GET',
                data: jQuery.param(params),
                dataType: 'json',
                success: function(data) {
                    allTracks = allTracks.concat(data_savedTrack(data.items));
                }
            });
}



$(function() {
	var hash = window.location.hash.substr(1);
	var result = hash.split('&').reduce(function (result, item) {
    var parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
	}, {});
	var token = result.access_token;
	getTrackNumber(result.access_token).then(function(data) {
		var deferreds = [];
		var total = data.total;
		for(var i=0; i<Math.ceil(total/50); i++) {
			deferreds.push(getMyTracks(token, i));
		}
		// $.when.apply($, deferreds).then(function() {
		// 	// console.log(allTracks);
		// 	$.when.apply($,getTrackGenre()).then(function() {
		// 		console.log(allTracks);
		// 	});
		// })
	})

});

// ****************





