$(document).ready(function () {


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCe7HEqry2cnAfJli6gk2qJKg6eV_mFIUE",
        authDomain: "home-movies-d9cd4.firebaseapp.com",
        databaseURL: "https://home-movies-d9cd4.firebaseio.com",
        projectId: "home-movies-d9cd4",
        storageBucket: "home-movies-d9cd4.appspot.com",
        messagingSenderId: "246177851940"
    };
    firebase.initializeApp(config);

    data = firebase.database();

    //event listener to grab input fields and push them to the database
    $("#watchIt").on("click", function (event) {
        event.preventDefault();

        //grabbing input
        userName = $("#whoname").val().trim();
        movieName = $("#whatmovie").val().trim();
        movieWhere = $("#wheremovie").val().trim();
        movieWhen = $("#whenmovie").val().trim();
        movieWho = $("#whomovie").val().trim();
        console.log(movieName);

        //pushing to the database
        data.ref().push({
            user: userName,
            name: movieName,
            where: movieWhere,
            when: movieWhen,
            who: movieWho
        });
        //clears out input fields when clicked
        $("#whoname").val("");
        $("#whatmovie").val("");
        $("#wheremovie").val("");
        $("#whenmovie").val("");
        $("#whomovie").val("");
    });

    data.ref().on("child_added", function (snapshot) {

        $("#nowplaying").prepend(`<div><button class='doStuff' data-search='${snapshot.val().name}'><p>${snapshot.val().name}</p><p>${snapshot.val().where}</p>
        <p>${snapshot.val().when}</p><p>${snapshot.val().who}</p></button></div>`);
    })

    //this function will grab the movie data via ajax request from OMDB
    $(document).on('click', '.doStuff', function (event) {
        event.preventDefault();
        //grabs movie name from the button that the movie is on the DOM
        var movie = $(this).data('search');
        var omdbURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=full&apikey=trilogy";

        // Creating an AJAX call for the specific movie being clicked on by the user
        $.get(omdbURL).then(function (response) {
            $('#moviedata').text(response.Plot);
            console.log(response);


        });
    });
    //Definining Variable: map

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 30.267153,
                lng: -97.7430608
            },
            zoom: 11
        });
    }
    initMap();

});