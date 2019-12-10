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
var filterOptions = ["all","all","all"]
var allVals = ['high','meidum','low']


var tracklist_chen = ``
function GenerateList(DataDict){
    for (item of DataDict){
        tracklist_chen += `
        <li class = 'listitem hide dance${item.danceability_filter} energy${item.energy_filter} valence${item.valence_filter} show'> ${item.trackName}, ${item.artists}, ${item.genre} </li> 
        `
        }
    document.getElementById("tracklist_chen").innerHTML = tracklist_chen
}

var valencelist = ` <button class="vbtn active" onclick="filterValence('all')">all</button>`
for (val of allVals){
    valencelist += `
        <button class="vbtn" onclick="filterValence('${val}')">${val}</button>
    `
}
document.getElementById('ValenceDropdown').innerHTML = valencelist

var energylist = ` <button class="ebtn active" onclick="filterEnergy('all')">all</button>`
for (val of allVals){
    energylist += `
        <button class="ebtn" onclick="filterEnergy('${val}')">${val}</button>
    `
}
document.getElementById('EnergyDropdown').innerHTML = energylist

var danceabilitylist = ` <button class="dbtn active" onclick="filterDanceability('all')">all</button>`
for (val of allVals){
    danceabilitylist += `
        <button class="dbtn" onclick="filterDanceability('${val}')">${val}</button>
    `
}
document.getElementById('DanceabilityDropdown').innerHTML = danceabilitylist


filterValence("all")
function filterValence(c) {
    var x, i;
    x = document.getElementsByClassName("listitem");
    if (c == "all") {c = ""
    } else {   
        c = 'valence'+c
    };
    console.log(c)
    for (i = 0; i < x.length; i++) {
      w3RemoveClass(x[i], "show");
      if (x[i].className.indexOf(c) > -1) filterOptions.splice(0,1,c);
      filterSelection(filterOptions)
    }
}

filterEnergy("all")
function filterEnergy(c) {
    var x, i;
    x = document.getElementsByClassName("listitem");
    if (c == "all") {c = ""
    }else {
        c = 'energy'+c
    };
    console.log(c)
    for (i = 0; i < x.length; i++) {
      w3RemoveClass(x[i], "show");
      if (x[i].className.indexOf(c) > -1) filterOptions.splice(1,2,c);
      filterSelection(filterOptions)
    }
}

filterDanceability("all")
function filterDanceability(c) {
    var x, i;
    x = document.getElementsByClassName("listitem");
    if (c == "all") {c = ""
    }else{
        c = 'dance'+c
    };
    console.log(c)
    for (i = 0; i < x.length; i++) {
      w3RemoveClass(x[i], "show");
      if (x[i].className.indexOf(c) > -1) filterOptions.splice(2,3,c);
      filterSelection(filterOptions)
    }
}

filterSelection(['all','all','all'])
function filterSelection(c) {
    var x, i;
    x = document.getElementsByClassName("listitem");
    if (c[0] == "all") c[0] = "";
    if (c[1] == "all") c[1] = "";
    if (c[2] == "all") c[2] = "";
    for (i = 0; i < x.length; i++) {
      w3RemoveClass(x[i], "show");
      if ((x[i].className.indexOf(c[0]) > -1) && (x[i].className.indexOf(c[1]) > -1) && (x[i].className.indexOf(c[2]) > -1)) {w3AddClass(x[i], "show")};
    }
}

function w3AddClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
    }
}

function w3RemoveClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
        arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
    }
    element.className = arr1.join(" ");
}

// show the filter dropdown
var dropdown = document.getElementsByClassName('dropbtn')
for (item of dropdown){
    item.addEventListener('click',function(){
        var uniqueClassName =  this.classList[1]
        var all = document.getElementsByClassName('dropdown-content')
        for(item of all){
            if(item.id != uniqueClassName){
                item.classList.remove("show")
            }         
        }
        var listener = document.getElementById(uniqueClassName)
        listener.classList.toggle('show')
    });
}    

var vbtns = document.getElementsByClassName("vbtn");
for (var i = 0; i < vbtns.length; i++){
    vbtns[i].addEventListener("click", function(){
        var current = document.getElementsByClassName("active");
        console.log(current)
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
      });
}

var ebtns = document.getElementsByClassName("ebtn");
for (var i = 0; i < ebtns.length; i++){
    ebtns[i].addEventListener("click", function(){
        var current = document.getElementsByClassName("active");
        console.log(current)
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
      });
}


var dbtns = document.getElementsByClassName("dbtn");
for (var i = 0; i < dbtns.length; i++){
    dbtns[i].addEventListener("click", function(){
        var current = document.getElementsByClassName("active");
        console.log(current)
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
      });
}

// multiple filter done





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
                    GenerateList(finalData)
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







