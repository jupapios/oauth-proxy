# oauth proxy [![CircleCI](https://circleci.com/gh/gotik/oauth-proxy.svg?style=shield)](https://circleci.com/gh/gotik/oauth-proxy)

Simple proxy for the oauth service to keep the `client_secret` and `client_id` secret

## Usage

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Custom app

```bash
npm install https://github.com/gotik/oauth-proxy.git --save
```

```js
const proxy = require('oauth-proxy');
const port = process.env.PORT || 3000;
proxy.listen(port, function() {
  console.log(`oauth proxy server listening on port ${this.address().port}`);
});

```

Remember to define the [env variables](.env.example).

## Development

### Setup

#### 1. Install the project

```bash
git clone https://github.com/gotik/oauth-proxy.git && cd oauth-proxy
npm install
cp .env.example .env
```

#### 2. Set the env variables

Change the variables `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET` and `API_URL` in the file `.env`

#### 3. Run the proxy

```bash
npm start
```

#### 4. Use the proxy in your clients

Change your client apps to hit the oauth proxy `http://localhost:3000`

### Running Tests

```
npm test
```
