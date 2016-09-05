const expect = require('chai').expect;
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const url = require('url');
const oauthProxy = require('../lib/oauth-proxy');

describe('oauth-proxy (e2e)', function() {
  const { port: apiPort } = url.parse(process.env.API_URL);
  const oauthProxyPort = 3000;
  const oauthProxyUrl = `http://127.0.0.1:${oauthProxyPort}`;
  const fakeClientRequest = request.defaults({
    url: `${oauthProxyUrl}/foo`,
    json: true,
  });
  let fakeApi;

  before('start oauth proxy', function() {
    oauthProxy.listen(oauthProxyPort);
  });

  beforeEach('start fake api', function() {
    fakeApi = express();
    fakeApi.use(bodyParser.json());
    fakeApi.server = fakeApi.listen(apiPort);
  });

  afterEach('close fake api', function() {
    fakeApi.server.close();
  });

  it('adds the client_id and client_secret', function(done) {
    const clientRequestBody = { foo: 1 };

    fakeApi.post('/foo', function({ body }, response) {
      expect(body).to.deep.equal({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        foo: 1,
      });
      response.json({});
    });

    fakeClientRequest.post({
      body: clientRequestBody
    }, function(error, response, body) {
      done();
    });
  });

  it('proxies the response back to clients', function(done) {
    const apiResponseBody = { bar: 1 };

    fakeApi.patch('/foo', function({ body }, response) {
      response.json(apiResponseBody);
    });

    fakeClientRequest.patch({}, function(error, response, body) {
      expect(body).to.deep.equal(apiResponseBody);
      done();
    });
  });

  it('proxies errors back to clients', function(done) {
    fakeApi.server.close();
    fakeClientRequest.post({}, function(error, response, body) {
      expect(body).to.match(/ECONNREFUSED/);
      expect(response.statusCode).to.equal(500);
      done();
    });
  });
});
