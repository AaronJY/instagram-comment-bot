const config = require('./config');
const Client = require('instagram-private-api').V1;
const device = new Client.Device(config.username);
const storage = new Client.CookieFileStorage(__dirname + '/cookies/cookies.json');

const log4js = require('log4js');
log4js.configure({
    appenders: { tracelog: { type: 'file', filename: 'tracelog.log' } },
    categories: { default: { appenders: ['tracelog'], level: 'all' } }
});
  
const logger = log4js.getLogger('tracelog');

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
                const media = res[Math.floor(Math.random() * res.length)];
                const comment = generateComment();

                Client.Comment.create(relationship.session, media.id, comment);
                logger.debug(`Successfully left comment on ${media.id}`);
                logger.debug(media);
            });
        });
    });
    
function generateComment() {
    const score = Math.floor(Math.random() * 6); // 0 - 5
    const record = config.phrases[Math.floor(Math.random() * config.phrases.length)];
    return `${record} - ${score}/10`;
}