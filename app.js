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
	let requestStream = Rx.Observable.just('https://api.github.com/users');
	requestStream.subscribe(function(url) {
		let responseStream = Rx.Observable.create(function(obserer) {
			got('todomvc.com')
			    .done(response => {
			        obserer.next(response.body);
			    })
			    .fail(error => {
			        obserer.error(error.response.body);
			    })
			    .always(function() {
					observer.complete();
			    });
		});
		responseStream.subscribe({
			function (x) {
				console.log('Next: %s', x);
			},
			function (err) {
				console.log('Error: %s', err);
			},
			function () {
				console.log('Completed');
			}
		});
	});
	let user_data = [];
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