require('dotenv').config()
const { TwitterClient } = require('twitter-api-client')
const axios = require('axios')
var cron = require('node-cron');

//* PROVIDE TWITTER CREDENTIALS FOR CONNECTION TO API
const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var tweet;

var options = {
    method: 'GET',
    url: 'https://random-stuff-api.p.rapidapi.com/ai',
    params: { message: 'quote ', server: 'main' },
    headers: {
        authorization: 'bB8rdME4yYAU',
        'x-rapidapi-host': 'random-stuff-api.p.rapidapi.com',
        'x-rapidapi-key': 'de54571622msh9e0fd4122b8b210p114fb5jsn244379bcd9e3'
    }
};

// get quote from api
function GetQuote() {
    axios.request(options).then(async function (response) {

        // tweet todays quote
        tweet = '✨QUOTE ~ ' + response.data[0].response;

        // call twitter client to tweet
        await Tweety(tweet)
        console.log("I Just tweeted ~ ", tweet)

    }).catch(function (error) {
        console.error(error);
    });
}

// tweet status 
async function Tweety(tweet) {
    await twitterClient.tweets.statusesUpdate({
        status: tweet
    }).then(response => {
        return response;
    }).catch(error => {
        console.error(error)
    })
}

// call for the first time the program starts
GetQuote()

// cron scheduler for every one minute past 5 hours 
cron.schedule('0 */5 * * *', () => {
    GetQuote()
    console.log('running a task every 5 Hours');
});


