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
        oneItem['id'] = item.track.id ;
        oneItem['added_at'] = item.added_at;
        oneItem['artists'] = data_artist(item.track.artists)[0];
        if(oneItem['artists'].name.indexOf(',') > -1){
            oneItem['artists']['name'] = oneItem['artists'].name.replace(/,/g, " ")
        }
        oneItem['trackName'] = item.track.name;
        if(oneItem['trackName'].indexOf(',') > -1){
            oneItem['trackName'] = oneItem['trackName'].replace(/,/g, " ")
        }
        oneItem['albumid'] = item.track.album.id;
        oneItem['imagehref'] = item.track.album.images[0]['url'];
        oneItem['popularity'] = item.track.popularity
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


function getTrackGenre(token,i) {
    // var deferreds = [];
    var token = token;
    // for (var i=0; i<allTracks.length; i++) {
        var artistId = allTracks[i]['artists']['id'];
        var albumId = allTracks[i]['albumid'];
        var trackId = allTracks[i]['id'];
        // if (!(trackId in trackGenre)){
            return $.ajax({
            // var request =  $.ajax({
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
                            console.log('another method');
                            var request =  $.ajax({
                                url: 'https://api.spotify.com/v1/albums/'+ albumId,
                                headers: {
                                    "Authorization":"Bearer "+ token,
                                },
                                indexValue: i,
                                method: 'GET',
                                dataType: 'json',
                                success: function(data) {
                                    var genre = data.genres;//[]
                                    if(genre.length != 0){
                                        trackGenre[trackId] = genre//[]
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
        // }else{
        //     addToTrack(trackGenre[trackId], i);
        // }
    // } 


}


function addToTrack(data, i) {   
    if(i<allTracks.length){
        allTracks[i].genre = data[0];
    }
    console.log(i,typeof(allTracks[i].genre));
}

function GetIdLists(total,token){
    var oneHundredListNum =  Math.ceil(total / 100); 
    var index = 1;
    var token = token;
    for(track of allTracks) { 
        allIds.push(track.id)
    } 
    for (i = oneHundredListNum; i > 0; i--) {
        if(i!=1){
            var start = (index - 1)*100;
            var end = index * 100;
            GetFeaturesfromIds(allIds.slice(start,end),total,token)
            index ++;                        
        }else{
            var remainder = total % (100 * index);
            var start = (index - 1)*100;
            var end = remainder + start;
            GetFeaturesfromIds(allIds.slice(start,end),total,token)
        }
      }   
}


function GetFeaturesfromIds(ids,total,token){
    var token = token;
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
                    finalData = finalData.concat(data.audio_features)
                    if(finalData.length == total){
                        for(track_f of finalData){
                            
                            if ((track_f.danceability < 0.33)){
                                track_f['danceability_filter'] = 'low'
                            } else if ((0.33 < track_f.danceability && track_f.danceability < 0.66)){
                                track_f['danceability_filter'] = 'medium'
                            }else{
                                track_f['danceability_filter'] = 'high'
                            }; 

                            if ((track_f.energy < 0.33)){
                                track_f['energy_filter'] = 'low'
                            } else if ((0.33 < track_f.energy && track_f.energy < 0.66)){
                                track_f['energy_filter'] = 'medium'
                            }else{
                                track_f['energy_filter'] = 'high'
                            }; 
                            
                            if ((track_f.valence < 0.33)){
                                track_f['valence_filter'] = 'low'
                            } else if ((0.33 < track_f.valence && track_f.valence < 0.66)){
                                track_f['valence_filter'] = 'medium'
                            }else{
                                track_f['valence_filter'] = 'high'
                            }; 
                            
                            for (track_t of allTracks){
                                if(track_f.id == track_t.id){
                                    track_f['added_at'] = track_t.added_at;
                                    track_f['albumid'] = track_t.albumid;
                                    track_f['artists'] = track_t.artists.name;
                                    track_f['genre'] = track_t.genre;
                                    track_f['imagehref'] = track_t.imagehref;
                                    track_f['trackName'] = track_t.trackName;
                                    track_f['popularity'] = track_t.popularity;
                                }
                            }
                        }
        
                    downloadCSV({ filename: "stock-data.csv" },finalData)
                    for (item of finalData){
                        console.log(item)
                    }          
                    }
                }
            });
}

function convertArrayOfObjectsToCSV(args) {  
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCSV(args, newData ) {  
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
        data: newData
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

//add require module
require(['bubbleChart'],function(bubbleChart) {
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
            var defferreds2 = [];
            var total = data.total;
            for(var i=0; i<Math.ceil(total/50); i++) {
                deferreds.push(getMyTracks(token, i));
            }
            $.when.apply($, deferreds).then(function() {
                // console.log(allTracks);
                for(var i=0; i<total; i++) {
                    defferreds2.push(getTrackGenre(token, i));
                }
                $.when.apply($,defferreds2).then(function() {
                    console.log('should be allTrackdata',allTracks);
                    bubbleChart.displayGenreChart(allTracks);
                    $.when.apply($,GetIdLists(total,token)).then(function() {

                    });
                });
            })
        })

    });
    
});







