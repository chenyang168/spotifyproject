var token = '';
var CLIENT_ID = '99502aa428d041faaa173a5302ad498b';
var REDIRECT_URI = 'https://chenyang168.github.io/spotifyproject/main.html';

function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
              '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
}

function getData() {
    var url = getLoginURL([
            'playlist-read-private',
            'user-library-read',
            'user-read-private',
        ]);
    window.location.href = url;
    // $.ajax({
    //     url: url,
    //     success: function(data) {
    //         console.log(data);
    //     }
    // })
}

// function login() {
// 	var CLIENT_ID = '66a659fca95d435ab9d1ff1b8a7fb182';
//     var REDIRECT_URI = 'https://yinyinumsi.github.io/649GroupProject/main.html';
    
//     var url = getLoginURL([
//             'playlist-modify-public',
//             'user-library-read',
//         ]);
    
//     window.addEventListener("message", function(event) {
//         var hash = JSON.parse(event.data);
//         if (hash.type == 'access_token') {
//             callback(hash.access_token);
//         }
//     }, false);
    
//     // var w = window.open(url,
//     //                     'Spotify',
//     //                     'menubar=no,location=no,resizable=no,scrollbars=no,status=no' 
//     //                    );
//     window.location.href=url;
//     console.log(url);      
// }

// function getData() {
//     login(function(accessToken) {  
//         getAllTracks(accessToken);
//     });
// }

// function getAllTracks(accessToken) {
//     // console.log('hello');
//     // var url = "https://api.spotify.com/v1/me/tracks";
//     // var headers= {"Authorization":"Bearer "+ accessToken};
//     localStorage.setItem("DishName", '11111');
//     // alert(localStorage.getItem('DishName'));
//     // $.get(url, headers).done(function(data) {
//     //     
//     // });
// }

$(function() {
    var loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', getData);
});
// $(function() {
//     var searchButton = document.getElementById('test');
//     searchButton.addEventListener('click', getData());
// });


