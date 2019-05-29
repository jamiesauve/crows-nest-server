require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 4205;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4204");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/hello', (req, res) => {
	res.send({ serverSays: 'Hello from the back end!' });
});

app.post('/api/hi', (req, res) => {

	res.send(`POST request received: ${req.body.message}`);
});

app.get('/api/getWeather', (req, res) => {
	const {
		lat,
		lng,
	} = req.query;

	// hit up darksky
	axios.get(
		`https://api.darksky.net/forecast/${process.env.REACT_APP_DARK_SKY_API_KEY}/` +
		`${lat},${lng}?exclude=minutely,daily&time=${Date.now()}`,
	).then((payload) => {
		res.send({
			data: payload.data,
			error: false,
		});
	}).catch((e) => {
		console.log('there was an error in the DarkSky call :( - most likely you are offline. ');
		res.send({
			data: null,
			error: true
		})
	});
});

app.listen(port, () => console.log(`Listening on port ${port}`));