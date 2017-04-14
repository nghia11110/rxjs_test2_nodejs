'use strict';

const http = require('http');
const Router = require('router');
const finalhandler = require('finalhandler');
const view = require('consolidate');
const path = require('path');

const app = new Router();

app.use((req,res,next) => {
	res.render = function render(filename,params) {
		let file = path.resolve(__dirname + '/views',filename);
		view.mustache(file, params || {})
			.then(function (html) {
				res.setHeader('Content-Type','text/html');
		    	res.end(html);
		    	//console.log(html);
		  	})
		  	.catch(function (err) {
		    	return next(err);
		  	});
		}
	next();	
});

app.get('/',(req,res) => {
	let user_data = [
						{
					    "name": "mojombo",
					    "id": 1,
					    "avatar_url": "https://avatars3.githubusercontent.com/u/1?v=3",
					  	},
					 	{
					    "name": "defunkt",
					    "id": 2,
					    "avatar_url": "https://avatars3.githubusercontent.com/u/2?v=3",
					  	},
					];
	res.render('home.html',{
		userData : user_data
	});
});

app.post('/',(req,res) => {

});

const server = http.createServer();
server.on('request', (req,res) => {
	app(req,res,finalhandler(req,res));
});
server.listen(process.env.PORT || 3000);