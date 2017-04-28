'use strict';

const http = require('http');
const Router = require('router');
const finalhandler = require('finalhandler');
const view = require('consolidate');
const path = require('path');
const serveStatic = require('serve-static');
const got = require('got');
const Rx = require('rx');

const app = new Router();

app.use(
	serveStatic(
		path.join(__dirname,'public'),
		{
			maxAge: '1d'
		}
	)
);


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
	var user_data;
	let requestStream = Rx.Observable.just('https://api.github.com/users');
	let responseStream = requestStream.flatMap(function(url) {
		return Rx.Observable.fromPromise(got(url));
	});
	responseStream.subscribe(function(x) {
		user_data = JSON.parse(x.body);
		user_data = user_data.slice(0, 3);
		//console.log(user_data);
		res.render('home.html',{
			userData : user_data
		});
	});
});

app.post('/',(req,res) => {

});

const server = http.createServer();
server.on('request', (req,res) => {
	app(req,res,finalhandler(req,res));
});
server.listen(process.env.PORT || 3000);