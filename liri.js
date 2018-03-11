
// dotenv is a core Node package for reading .env file
require("dotenv").config();
// import Objects in keys.js file
var keys = require('./keys.js');
// Load the fs package to read and write
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var logStr = [] ;

// Store all of the arguments in an array
var nodeArgs = process.argv;

var command = nodeArgs[2];
var name = nodeArgs[3];

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


//var params = { screen_name: 'xbucketlist' };

var params = {
  q: 'xbucketlist',
  count: 20
} // this is the param variable which will have key and value 

function makeTheName() {

  // Capture all the words in the song (again ignoring the first three Node arguments)
  for (var i = 4; i < nodeArgs.length; i++) {
    // Build a string with the songName.
    name = name + " " + nodeArgs[i];
  }
}

function showLast20Tweets() {

  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (error) {
      console.log('Error occurred: ' + error);
      return;
    }
    // console.log("These are my tweets=" + JSON.stringify(tweets, null, 2));

    console.log("My last 20 Tweets =");

    for (i = 0; i < 20; i++) {
      console.log(JSON.stringify(tweets[i].text));
    }
  });
}

function searchSpotifySongInfo() {

  //If user has not specified a song , default to "The Sign" imagine dragons
  if (name == null) {
    songName = "The Sign";
  } else {
    makeTheName();
    songName = name;
  }

//  console.log("songName = "+ songName);

  spotify.search({ type: 'track', query: songName }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var song = data.tracks.items[0];
    console.log("------Artists-----");
    for (i = 0; i < song.artists.length; i++) {
      console.log(song.artists[i].name);
    }
    console.log("------Song Name-----");
    console.log(song.name);

    console.log("-------Preview Link-----");
    console.log(song.preview_url);

    console.log("-------Album-----");
    console.log(song.album.name);
  });
}

function findTheMovie(){

  if (name == null) {
    movieName = "Mr. Nobody";
  } else {
    makeTheName();
    movieName = name;
  }
//  console.log("Movie Name =" + movieName);

  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  // This line is just to help us debug against the actual URL.
//  console.log(queryUrl);

  request(queryUrl, function (error, response, movieObj) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover the following information

      console.log("--------Title-----------");
      console.log(JSON.parse(movieObj).Title);

      console.log("---Year The Movie Came Out---");
      console.log(JSON.parse(movieObj).Released);

       console.log("----IMDB Rating-----------");
      console.log(JSON.parse(movieObj).imdbRating);
       
      console.log("----Rotten Tomatoes Rating-----------");
       console.log(JSON.parse(movieObj).Ratings[1]);

       console.log("--------Country Where the movie was Produced-----------");
       console.log(JSON.parse(movieObj).Country);
       
       console.log("--------Language of the Movie-----------");
       console.log(JSON.parse(movieObj).Language);
       
       console.log("--------Plot----------------");
       console.log(JSON.parse(movieObj).Plot);

       console.log("--------Actors-----------");
       console.log(JSON.parse(movieObj).Actors);
     
    }
  });
}

function checkTheCommand(command){

  switch (command) {
    case `my-tweets`:
     // console.log("my-tweets");
      showLast20Tweets();
      log();
      break;
  
    case `spotify-this-song`:
    //  console.log("spotify-this-song"); 
    //  makeTheName();  // Call the Song Name function  
      searchSpotifySongInfo();
      log();
      break;
  
    case `movie-this`:
    //  console.log("movie-this");
      findTheMovie();
      log();
      break;
  
    case `do-what-it-says`:
    //  console.log("do-what-it-says");
      readRandomTXTFile();
      log(); 
      break
  }
  
  }

function readRandomTXTFile() {

  // We will read the existing bank file
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    //console.log(data);
    // Break down all the numbers inside
    data = data.split(",");
    //console.log(data);

    command = data[0];
    name = data[1];

    //console.log("command = " + command);
    //console.log("name = " + name);
    checkTheCommand(command);

  });
}

function log() {

  fs.appendFile('./log.txt', command + " " + name + ", ", function(err) {
      // If an error was experienced we say it.
      if (err) {
          console.log(err);
      }
      // If no error is experienced, we'll log the phrase "Content Added" to our node console.
      else {
          // console.log("Content Added!");
      }
  });
};

checkTheCommand(command);  //Trigger an event based on the command


