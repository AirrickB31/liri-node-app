//module that loads environment variables from .env into processs.env
require("dotenv").config();

//npm packages that are required for app
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var dotenv = require('dotenv');
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js');
//variables for api keys 
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//node variabls
var command = process.argv[2];
var selection = process.argv[3];

if(command === 'spotify-this-song'){
    spotifySong();
}else  if (command === 'my-tweets'){
    myTweets();

} else if (command === 'movie-this'){
    movieThis();

}else if(command === 'do-what-it-says') {
    console.log("do what it says");
    something();


}else{
    console.log('Please enter a valid command. Your options are my-tweets, spotify-this-song, or do-what-it-says')
}

//fucntion for spotify-this-song 
function spotifySong(){
    if (selection === undefined){
        selection = 'The Sign';
    }

    
    //call to spotify to search for song info. Copied this call from spotify docs
    spotify.search({ type: 'track', query: selection }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

else{
    //will log all info about track to console
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("Song: " + data.tracks.items[0].name);
    console.log("Preview Here: " + data.tracks.items[0].preview_url);
    console.log("Album: " + data.tracks.items[0].album.name);

    };
 });
};

//function for movie-this 
function movieThis(){
    if (selection === undefined){
        selection = 'Mr.Nobody';
    };
    request("http://www.omdbapi.com/?t=" + selection + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

    //If request returns status code of 200 

    if(!error && response.statusCode === 200 ){
        //I need to parse body of JSON to retrieve all info 
        console.log("Title: " + JSON.parse(body).Title +"\n Year: " + JSON.parse(body).Year + "\n IMDB Rating: " + JSON.parse(body).imdbRating + "\n Rotten Tomato Rating: " + JSON.parse(body).Ratings[1].Value +  "\n Country: " + JSON.parse(body).Country + "\n Language: " + JSON.parse(body).Language + "\n Plot: " + JSON.parse(body).Plot + "\n Actors: "+ JSON.parse(body).Actors);
    }

    });


    }
    function myTweets(){
        var parameters = {
            count: 20
        };
        client.get('statuses/user_timeline', parameters, function(error, tweets, response){
            if (!error) {
                for (i=0; i<tweets.length; i++) {
                    var response = ((i+1) + ". " + tweets[i].created_at + ' : ' + tweets[i].text );
                    console.log(response);
                    console.log("-------------------------");
                    
                    fs.appendFile("log.txt", response, function(err) {
        
                       
                        if (err) {
                          return console.log(err);
                        }
                      
                        
                      });
    
                };
            };
        });
    };

    //fucntion for do-what-it-says 
    function something(){
        {   //Call back function takes data from random.txt
            fs.readFile('random.txt', 'utf8', function(error, data){
                if (error){  
                    return console.log(error);
                } else {
                    var dataArr = data.split(",");
                    getSpotify();

                    function getSpotify(){
                        var findSong = dataArr[1]; 

                        spotify.search({ type: 'track', query: findSong }, function(error, data){
                            if(err){
                                return console.log('Hey there, theres and error in there' + error);
                            }else {
                                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                                console.log("Song: " + data.tracks.items[0].name);
                                console.log("Preview Here: " + data.tracks.items[0].preview_url);
                                console.log("Album: " + data.tracks.items[0].album.name);
                                 //Object will store all info about track so that we can append info to txt file
                                    var writeResponse = {
                                        Artits: data.tracks.items[0].artists[0].name,
                                        Song: data.tracks.items[0].name,
                                        PreviewHere: data.tracks.items[0].preview_url,
                                        Album: data.tracks.items[0].album.name,
                                    };
                                     //function to append info from track to file

                                    fs.appendFile('log.txt', JSON.stringify(writeResponse, null, '/t'), function(error){
                                        if(error){
                                            return console.log("There was an Error"+ error);
                                        }
                                        //log.txt has been updated
                                        console.log('Your file, log.txt, was successfully updated');
                                });
                            };
                        });
                    };
                
                }
            });
        }
    }

   
   
    