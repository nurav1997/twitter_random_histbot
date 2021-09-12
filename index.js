require('dotenv').config()
const { TwitterClient } = require('twitter-api-client')
const axios = require('axios')
const random = require('random')

//* PROVIDE TWITTER CREDENTIALS FOR CONNECTION TO API
const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const TODAYS_DATE = new Date();

axios.get('https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/' + TODAYS_DATE.getMonth() + '/' + TODAYS_DATE.getDate())
    .then(response => {

        const data = response.data ? response.data : {}
        let tweet
        if (data.events && data.events.length) {
            //twee random event from the array
            let RANDOM_NUMBER = random.int(0, data.events.length - 1);
            tweet = '📅 Year ' + data.events[RANDOM_NUMBER].year + ' - ' + data.events[RANDOM_NUMBER].text;
        } else {
            tweet = 'Nothing happened today :)'
        }

        // using twitter client tweet to twitter account
        twitterClient.tweets.statusesUpdate({
            status: tweet
        }).then(response => {
            console.log("I have Just tweeted!! ==> ", tweet);
        }).catch(err => {
            console.error(err)
        })

    }).catch(err => {
        console.error(err)
    })


