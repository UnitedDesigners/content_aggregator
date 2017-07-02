var parser = require('rss-parser');
var rp = require('request-promise');

exports.handler = function(evt, cxt, cb) {
	Promise.all([getMediumPosts(), getDribbbleShots()])
		.then( ([mediumPosts, dribbbleShots]) => {
			console.log(mediumPosts, dribbbleShots);
			cb(null, { mediumPosts, dribbbleShots });
		}).catch((err) => cb(true, err));
};

function getMediumPosts() {
	return new Promise(function(resolve, reject) {
		parser.parseURL('https://medium.com/feed/united-designers', function(err, parsed) {
			if (err) {
				reject(err);
			}
			resolve(parsed.feed.entries);
		});
	});
}

function getDribbbleShots() {
	const DRIBBBLE_AUTH = process.env.DRIBBBLE_AUTH;
	var options = {
	    uri: 'https://api.dribbble.com/v1/teams/uniteddesigners/shots',
	    qs: {
	        access_token: DRIBBBLE_AUTH
	    },
	    json: true
	};
	return rp(options);
}
