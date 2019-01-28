$(document).ready(function () {
    var locations = [];

    

    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBBF766S6q_4st_Kwu7KjX0GUL5WPJsvFQ",
    authDomain: "homemovies-1aeca.firebaseapp.com",
    databaseURL: "https://homemovies-1aeca.firebaseio.com",
    projectId: "homemovies-1aeca",
    storageBucket: "homemovies-1aeca.appspot.com",
    messagingSenderId: "105060290496"
  };
  firebase.initializeApp(config);

    data = firebase.database();

    //event listener to grab input fields and push them to the database
    $("#watchIt").on("click", function (event) {
        event.preventDefault();


        //grabbing input
        movieName = $("#whatmovie").val().trim();
        movieWhere = $("#wheremovie").val().trim();
        movieWhen = $("#whenmovie").val().trim();
        movieWho = $("#whomovie").val().trim();
        movieDate = $("#datemovie").val().trim();

        correctTime = moment(movieWhen, "HH:mm").format("hh:mm a");

        //pushing to the database
        data.ref().push({
            name: movieName,
            where: movieWhere,
            when: correctTime,
            date: movieDate,
            who: movieWho
        });
        //clears out input fields when clicked
        $("#datemovie").val("");
        $("#whatmovie").val("");
        $("#wheremovie").val("");
        $("#whenmovie").val("");
        $("#whomovie").val("");
    });

    // when a child is added to the page, this function grabs it from the data base and appends it to the DOM
    data.ref().on("child_added", function (snapshot) {

        $("#nowplaying").prepend(`<div><button class='doStuff' id='moviecard' style='width:100%'
        data-search='${snapshot.val().name}'>
        <p class='infoheader'><u>We're watching:</u></p><p id='movielogs'>${snapshot.val().name}</p>
        <p class='infoheader'><u>Right here:</u></p><p id='movielogs'>${snapshot.val().where}</p>
        <p class='infoheader'><u>Show starts at:</u><p id='movielogs'>${snapshot.val().when}</br>${snapshot.val().date}</p>
        <p class='infoheader'><u>Your host is:</u></p><p id='movielogs'>${snapshot.val().who}</p>
        </button></div>`);
        //this sends an ajax requst to google for the location that the user entered and turns it into lat/lng to push to the array later
        var where = snapshot.val().where;

        var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + where + "&key=AIzaSyCHGt8eFg_UB3LsbjtWbsjk-7wyBychILQ"

        $.get(googleURL).then(function (thing) {
            // "locations" is the array where the lat/lng is being pushed
            locations.push(thing.results[0].geometry.location);
            //calling function to append pins to the map
            initMap();

        })


    })


    //this function will grab the movie data via ajax request from OMDB
    $(document).on('click', '.doStuff', function (event) {
        event.preventDefault();
        //grabs movie name from the button that the movie is on the DOM
        var movie = $(this).data('search');
        var omdbURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

        // Creating an AJAX call for the specific movie being clicked on by the user
        $.get(omdbURL).then(function (response) {
            //this empties out the div so the movie info doesn't "stack" up on the page
            $('#moviedata').text("");
            //grabs the poster
            $('#moviedata').prepend(`<img src="${response.Poster}"></br>`);
            //grabs the plot (short version)
            $('#moviedata').append(`${response.Plot}</br>`);
            //grabs the websit and adds an anchor to the page.  When clicked opens in new tab
            $('#moviedata').append(`<a href='${response.Website}' target='_blank'>Click Here: Link To Website With Trailer</a>`);


        });

    });

    //Menu Movement
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });



    //Definining Variable: map

    var map, infoWindow;

    function initMap() {
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: {
                lat: 30.27,
                lng: -97.74
            }
        });
        // Create an array of alphabetical characters used to label the markers.
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.

        locations.map(function (location, i) {

            return new google.maps.Marker({
                position: location,
                map,
                title: labels[i % labels.length]
            });
        });

        // Add a marker clusterer to manage the markers.
        // var markerCluster = new MarkerClusterer(map, markers, {
        //     imagePath: 'js/markerimages/m'
        // });
    }

    infoWindow = new google.maps.InfoWindow;



    //Attempting Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                zoom: 14,
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            // map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
    initMap();
});
