
// list of different parameters through twitter https://dev.twitter.com/rest/reference/get/search/tweets
//https://dev.twitter.com/rest/public/search
//I found out how to query the api and the operators on this site. EXTREMELY helpful!

var twit = require('twit');
var config = require('./config.js');
//code that requires the RapidAPI SDK for giphy pictures
//const RapidAPI = require('rapidapi-connect');
//const rapid = new RapidAPI("TheLOTRBot", "b6753275-e2d9-4431-9348-e31671f87303");
//var Giphy = require('giphy-api');
var TwitterAPI = require('twitter');
var request = require('request');
var fs = require('fs');   // File system

var Twitter = new twit(config);

TWITTER_CONSUMER_KEY='Qf7vVTlrOzQozykpwYT1GCl4h';
TWITTER_CONSUMER_SECRET='l1R07K8BBGA04LImrr4VSPgEbwZ1w3SD4Px65OgGFDwvzvuRFL';
TWITTER_ACCESS_TOKEN_KEY='852622538219954176-zEAEj6o4pH0rdffWjcRaCL09EX1D2Mo';
TWITTER_ACCESS_TOKEN_SECRET='h5W8G6gAVXJmCysbmQq0bEpgJUV3uV5H0pZADk2y907QU';

var client = new TwitterAPI({
    consumer_key:TWITTER_CONSUMER_KEY,
    consumer_secret:TWITTER_CONSUMER_SECRET,
    access_token_key:TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret:TWITTER_ACCESS_TOKEN_SECRET
});


//the retweet function retweets certain parameters that i set in the q(query)
var retweet = function() {
    var params = {
       //if i want to do just pictures q: '#lotr filter:media',
        //taking multiple arguments, to switch up what is displayed
        //@LOTRReactss OR #lotr filter:media OR #LordOfTheRingsMeme OR #lordoftheringsmeme
        q: 'lotr OR @LOTRReactss OR #lotr filter:media OR #LordOfTheRingsMeme OR #lordoftheringsmeme',
       //searches for recent and popular tweets
        //could have result_type be popular
        //could have result type be recent
        result_type: 'mixed',
        //what the language i'm querying for
        lang: 'en'
    };
    // function to generate a random tweet
    function randomize (arr) {
        var index = Math.floor(Math.random()*arr.length);
        return arr[index];
    }
    Twitter.get('search/tweets', params, function(err,data){

        // find tweets
        var tweet = data.statuses;
        var randomTweet = randomize(tweet);   // pick a random tweet

        // if random tweet exists
        if(typeof randomTweet != 'undefined'){
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {id: randomTweet.id_str}, function(err, response){
                // if there was an error while 'favorite'
                if(err){
                    console.log('You have already retweeted this post! #facePalm');
                }
                else{
                    console.log('You have retweeted a tweet! #goYou!');
                }
            });
        }
    });
};


// grab & 'favorite' as soon as program is running...
retweet();
// 'favorite' a tweet once every hour
setInterval(retweet, 3600000);


// find a random tweet and 'favorite' it
var favoriteTweet = function(){
    var params = {
        q: 'lotr OR @LOTRReactss OR #lotr filter:media OR #LordOfTheRingsMeme OR #lordoftheringsmeme',  // REQUIRED
        result_type: 'mixed',
        lang: 'en'
    };
    // find the tweet


    // function to generate a random tweet
    function randomize (arr) {
        var index = Math.floor(Math.random()*arr.length);
        return arr[index];
    }
    Twitter.get('search/tweets', params, function(err,data){

        // find tweets
        var tweet = data.statuses;
        var randomTweet = randomize(tweet);   // pick a random tweet

        // if random tweet exists
        if(typeof randomTweet != 'undefined'){
            // Tell TWITTER to 'favorite'
            Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
                // if there was an error while 'favorite'
                if(err){
                    console.log('You have already favorited this post! #facePalm');
                }
                else{
                    console.log('You have favorited a tweet! # goYou!');
                }
            });
        }
    });
};
// grab & 'favorite' as soon as program is running...
favoriteTweet();
// 'favorite' a tweet once every hour
setInterval(favoriteTweet, 3600000);

//this will tweet a gif to a user
getGif('lotr');  // Change to another subject of your choice

function getGif(subject){

    var filename = subject + '.gif';   // Todo error handling. Make sure subject text is a valid filename.
    //had to add the tag into the end of the url, for someone reason it wasnt working when I was concatenating
    // it at the end
    var url = 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=lotr' ;

    request(url, q = { 'tag' : subject },  function(error, response, body){
        if (!error && response.statusCode == 200) {

            var resp = JSON.parse(body);
            var gifUrl = resp.data.image_url;

            //Download picture, save
            var filestream = request.get(gifUrl);
            filestream.pipe(fs.createWriteStream(filename));

            // And once saved, use to create tweet.
            filestream.on('end', function(){
                tweet_gif(filename, subject);
            });

        } else {
            console.log('Error getting gif', error, response.statusCode);
        }
    });
}

function tweet_gif(filename, subject) {

    var gif = fs.readFileSync(filename);
    var status_text = 'Lord of the Rings >> Everything Else';

    client.post('media/upload', { media:gif }, function(err, media, response){
        if (err) {
            console.log('Error uploading media', err);
        }
        else {

            var tweet = { status : status_text, media_ids : media.media_id_string };

            console.log(media);
            client.post('statuses/update', tweet, function(error, tweet, response){
                if (error) {
                    console.log('Error posting tweet' , error);
                }
                else {
                    console.log("Posted this tweet", status_text);
                }
            });
        }
    });}
// grab tweet as soon as program is running...
//tweet_gif();
// tweet a gif every hour!
setInterval(tweet_gif, 360000);

