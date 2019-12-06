var client_id = '99502aa428d041faaa173a5302ad498b';
var client_secret = 'da0cc8cf6d9a4ee085db63a4a0fe62b6';
var Base64Encode = btoa(client_id+':'+client_secret);
var auth = 'Basic ' + Base64Encode;
var myTrackUrl = "https://api.spotify.com/v1/me/tracks";
var proxyurl = 'https://cors-anywhere.herokuapp.com/';
var allTracks = [];
var trackGenre = {}
var allIds = [];
var idsUrl =  'https://api.spotify.com/v1/audio-features';
var finalData = [];


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
        oneItem['albumid'] = item.track.album.id;
        oneItem['imagehref'] = item.track.album.images[0]['url'];
        cleanItems.push(oneItem);
        // console.log(oneItem);
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


function getTrackGenre(token) {
    // var deferreds = [];
    var token = token;
    for (var i=0; i<allTracks.length; i++) {
        var artistId = allTracks[i]['artists'][0]['id'];
        var albumId = allTracks[i]['albumid'];
        var trackId = allTracks[i]['id'];
        if (!(trackId in trackGenre)){
            var request =  $.ajax({
                    url: 'https://api.spotify.com/v1/artists/'+ artistId,
                    headers: {
                        "Authorization":"Bearer "+ token,
                    },
                    indexValue: i,
                    method: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        var genre = data.genres;
                        if(genre.length != 0){
                            trackGenre[trackId] = genre
                            // console.log(genre)
                            addToTrack(genre, this.indexValue);
                        }else{
                            var request =  $.ajax({
                                url: 'https://api.spotify.com/v1/albums/'+ albumId,
                                headers: {
                                    "Authorization":"Bearer "+ token,
                                },
                                indexValue: i,
                                method: 'GET',
                                dataType: 'json',
                                success: function(data) {
                                    var genre = data.genres;
                                    if(genre.length != 0){
                                        trackGenre[trackId] = genre
                                        // console.log(genre)
                                        addToTrack(genre, this.indexValue);
                                    }else{
                                        genre = ['Unknown']
                                        addToTrack(genre, this.indexValue);
                                    } 
                                }
                            })
                        }
                    }
                })
        }else{
            addToTrack(trackGenre[trackId], i);
        }
    } 


}


function addToTrack(data, i) {   
    if(i<allTracks.length){
        allTracks[i]['genre'] = data[0];
    }
}




function GetIdLists(total){
    var oneHundredListNum =  Math.ceil(total / 100); 
    var index = 1;
    for(track of allTracks) { 
        allIds.push(track.id)
    } 
    for (i = oneHundredListNum; i > 0; i--) {
        if(i!=1){
            var start = (index - 1)*100;
            var end = index * 100;
            GetFeaturesfromIds(allIds.slice(start,end),total)
            index ++;                        
        }else{
            var remainder = totalnum % (100 * index);
            var start = (index - 1)*100;
            var end = remainder + start;
            GetFeaturesfromIds(allIds.slice(start,end),total)
        }
      }   
}


function GetFeaturesfromIds(ids,total){
    var trackIds = ids;
    var params = {ids:trackIds.join(',')}
    return $.ajax({
                url: idsUrl,
                headers: {
                    "Authorization":"Bearer "+ token,
                },
                method: 'GET',
                data: jQuery.param(params),
                dataType: 'json',
                success: function(data) {
                    console.log(data.audio_features);
                    finalData = finalData.concat(data.audio_features)
                    if(finalData.length == total){
                        for(track_f of finalData){
                            console.log(track_f)
                            for (track_t of allTracks){
                                if(tracf_f.id == track_t.id){
                                    track_f['added_at'] = track_t.added_at;
                                    track_f['albumid'] = track_t.albumid;
                                    track_f['artists'] = track_t.artists;
                                    track_f['genre'] = track_t.genre;
                                    track_f['imagehref'] = track_t.imagehref;
                                    track_f['trackName'] = track_t.trackName;
                                }
                            }
                        }
                        
                 
                    }

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
		$.when.apply($, deferreds).then(function() {
			// console.log(allTracks);
			$.when.apply($,getTrackGenre(token)).then(function() {
                console.log(allTracks)
                $.when.apply($,GetIdLists(total)).then(function() {
                    console.log(finalData);
                });
			});
		})
	})

});






