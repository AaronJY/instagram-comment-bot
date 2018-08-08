const config = require('./config');
const Client = require('instagram-private-api').V1;
const device = new Client.Device(config.username);
const storage = new Client.CookieFileStorage(__dirname + '/cookies/cookies.json');

Client.Session.create(device, storage, config.username, config.password)
    .then((session) => {
        return [session, Client.Account.searchForUser(session, 'instagram')];
    })
    .spread(function(session, account) {
		return Client.Relationship.create(session, account.id);
	})
	.then(function(relationship) {
        config.tags.forEach(tag => {
            const feed = new Client.Feed.TaggedMedia(relationship.session, tag, 5);

            feed.get().then(res => {
                const mediaId = res[Math.floor(Math.random() * res.length)].id;
                const comment = generateComment();

                console.log(comment);
                console.log(mediaId);
                Client.Comment.create(relationship.session, mediaId, comment);
                console.log(`Successfully left comment on ${mediaId}`)
            });
        });
    });
    
function generateComment() {
    const score = Math.floor(Math.random() * 6); // 0 - 5
    const record = config.phrases[Math.floor(Math.random() * config.phrases.length)];
    return `${record} - ${score}/10`;
}