const app = require('express')();
const request = require('request');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.all('*', proxy);

const oauthRequest = request.defaults({
  body: {
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
  }
});

const apiUrl = process.env.API_URL;

function proxy({method, originalUrl, body}, clientResponse, next) {
  const url = apiUrl + originalUrl;
  console.log(`Proxing request: ${method} to ${url}; body: ${JSON.stringify(body)}`);

  oauthRequest({
    body,
    json: true,
    method,
    url,
  }, function(error, apiResponse, apiBody) {
    if (error) {
      next(error);
    } else {
      clientResponse.status(apiResponse.statusCode);
      clientResponse.set('Content-Type', apiResponse.headers['content-type']);
      clientResponse.send(apiBody);
    }
  });
}

module.exports = app;
