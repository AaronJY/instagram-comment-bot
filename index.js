const config = require('./config');
const helpers = require('./helpers');
const Client = require('instagram-private-api').V1;
const device = new Client.Device(config.username);
const storage = new Client.CookieFileStorage(__dirname + '/cookies/cookies.json');

var loggedIn = false;
var feed;
var session;

console.log(`Version: ${config.version}`);
console.log(`Username: ${process.env.USERNAME}`);
console.log(`Tag: ${process.env.TAG}`);

Client.Session.create(device, storage, process.env.USERNAME, process.env.PASSWORD)
    .then((sesh) => {
        console.log('Logged in...');
        loggedIn = true;
        init(sesh);
    });

function init(session) {
    this.session = session;
    feed = new Client.Feed.TaggedMedia(session, config.tag, 5);

    setInterval(() => {
        postRandomComment();
    }, config.commentInterval);

    console.log('Running!');
}

function generateComment() {
    const score = helpers.getRandomInt(6, 10); // 0 - 10
    const phrase = config.phrases[Math.floor(Math.random() * config.phrases.length)];
    return `${phrase} ${score}/10 🤖`;
}

function postRandomComment() {
    console.log('Posting comment...');
    feed.get().then(res => {
        const media = res[Math.floor(Math.random() * res.length)];
        const comment = generateComment();

        Client.Comment.create(this.session, media.id, comment);
        console.log(`Successfully left comment on ${media.id} (${media.params.code})`);
    });
}