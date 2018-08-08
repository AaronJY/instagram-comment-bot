const config = require('./config');
const Client = require('instagram-private-api').V1;
const device = new Client.Device(config.username);
const storage = new Client.CookieFileStorage(__dirname + '/cookies/cookies.json');

var loggedIn = false;
var feed;
var session;

Client.Session.create(device, storage, config.username, config.password)
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

    // postRandomComment();

    console.log('Running!');
}

function generateComment() {
    const score = Math.floor(Math.random() * 11); // 0 - 10
    const record = config.phrases[Math.floor(Math.random() * config.phrases.length)];
    return `${record} - ${score}/10`;
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