const app = require('express')(),
			path = require('path'),
			http = require('http').Server(app),
			bodyParse = require('body-parser'),
			cors = require('cors'),
			passport = require('passport'),
			util = require('util'),
			mongoose = require('mongoose');

// ========= MongoDB Setup ==========
mongoose.connect("mongodb+srv://nizam:nizam@projectone.wyqkm.mongodb.net/projectone?retryWrites=true&w=majority", { 
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false,
	socketTimeoutMS: 45000,
  keepAlive: true,
});

mongoose.connection.on('connected', () => { console.log('database connected'); });
mongoose.connection.on('error', (err) => { console.log('database error ' + err); });

// ========== Server Main ===========
app.use(cors());
app.use(bodyParse.json());
app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport);

const auth = require('./api/auth');
app.use('/auth', auth);

const public = require('./api/public');
app.use('/api', public);

const private = require('./api/admin');
app.use('/api/admin', private);

app.get('/', function (req, res) { res.send('Hai.. \nPlease go to mfnizam.com') })
var server = http.listen(process.env.PORT || 3000, function () { 
 	console.log('App listening at port 3000');  
});

app.get('*', (req, res) => {
	res.redirect('/');
})