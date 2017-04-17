
// list of different parameters through twitter https://dev.twitter.com/rest/reference/get/search/tweets
//https://dev.twitter.com/rest/public/search
//I found out how to query the api and the operators on this site. EXTREMELY helpful!

var twit = require('twit');
var config = require('./config.js');

var Twitter = new twit(config);

//the retweet function retweets certain parameters that i set in the q(query)
var retweet = function() {
    var params = {
       //if i want to do just pictures q: '#lotr filter:media',
        //taking multiple arguments, to switch up what is displayed
        //@LOTRReactss OR #lotr filter:media OR #LordOfTheRingsMeme OR #lordoftheringsmeme
        q: 'lotr OR @LOTRReactss OR lotr filter:media OR #LordOfTheRingsMeme OR #lordoftheringsmeme',
       //searches for recent and popular tweets
        //could have result_type be popular
        //could have result type be recent
        result_type: 'mixed',
        //what the language i'm querying for
        lang: 'en'
    };


    //using the Twitter get
    Twitter.get('search/tweets', params, function(err, data) {
        // if there no errors
        if (!err) {
            // grab ID of tweet to retweet
            var retweetId = data.statuses[1].id_str;
            // Tell TWITTER to retweet
            //using the Twitter post method, to post the API endpoint (the URL).
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('You have retweeted a tweet! # goYou!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('For some reason you can not retweet this tweet #facePalm');
                }
            });
        }
        // if unable to Search a tweet
        else {
            console.log('There was an error while searching');
        }
    });
};
// grab & retweet as soon as program is running...
retweet();
// retweet every hour to ensure there is enough content
setInterval(retweet, 3600000);

// this next section will run the favorite part of the bot, where the bot wil go
//through and favorite random tweets to whatever query I want.


// find a random tweet and 'favorite' it
var favoriteTweet = function(){
    var params = {
        q: 'lotr OR @LOTRReactss OR lotr filter:media OR #LordOfTheRingsMeme OR #lordoftheringsmeme',  // REQUIRED
        result_type: 'mixed',
        lang: 'en'
    }
    // find the tweet
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
                    console.log('For some reason you can not favorite this tweet #facePalm');
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

// function to generate a random tweet tweet
function randomize (arr) {
    var index = Math.floor(Math.random()*arr.length);
    return arr[index];
}