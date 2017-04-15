
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

        q: '#lotr filter:media',
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
            var retweetId = data.statuses[0].id_str;
            // Tell TWITTER to retweet
            //using the Twitter post method, to post the API endpoint (the URL).
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('You have retweeted this post!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('There was an error that happened while retweeting! Please try again!');
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
// retweet in every 20 minutes
setInterval(retweet, 1500000);



