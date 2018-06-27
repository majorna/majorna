<a href="https://getmajorna.com"><img src="/ui/src/res/majorna.png" width="256"></a>

[![Build Status](https://travis-ci.org/majorna/majorna.svg?branch=master)](https://travis-ci.org/majorna/majorna)

Majorna is an in-browser cryptocurrency utilizing web technologies including [WebRTC](https://en.wikipedia.org/wiki/WebRTC) (work in progress) and [Web Crypto API](https://en.wikipedia.org/wiki/Web_cryptography_API).
This repo contains source code for all of Majorna components.

## Blockchain
Blockchain (ledger of all transactions) is kept in its [own repo](https://github.com/majorna/blockchain).

## Community
* [/r/majorna](https://www.reddit.com/r/majorna/)

## License
MIT

## Development
Following information is for Majorna developers and contributors:

### Deployment
Server requires following environment variables in production mode:

```
MAJORNA_FIREBASE_JSON
MAJORNA_FIREBASE_JSON_PATH # alternative

MAJORNA_GITHUB_TOKEN

MAJORNA_TX_SIGN_PRIVATE_KEY
MAJORNA_TX_SIGN_PRIVATE_KEY_PATH # alternative
MAJORNA_TX_SIGN_PUBLIC_KEY
MAJORNA_TX_SIGN_PUBLIC_KEY_PATH # alternative

MAJORNA_COINBASE_COMMERCE_API_KEY
MAJORNA_COINBASE_COMMERCE_WEBHOOK_SHARED_SECRET
```

Following environment variables are required to run the tests:

```
MAJORNA_FIREBASE_TEST_JSON
MAJORNA_FIREBASE_TEST_JSON_PATH # alternative

MAJORNA_GITHUB_TOKEN

MAJORNA_COINBASE_COMMERCE_API_KEY
MAJORNA_COINBASE_COMMERCE_WEBHOOK_SHARED_SECRET
```

### Heroku Push
```bash
git subtree push --prefix server heroku master

# in case --force is needed
git push heroku `git subtree split --prefix server master`:master --force
```

### Upgrading Packages
UI:
* Firebase: https://firebase.google.com/support/release-notes/js
* Firebase React: https://github.com/firebase/firebaseui-web-react/releases
* Firebase UI: https://github.com/firebase/firebaseui-web/releases
* Bulma: https://github.com/jgthms/bulma/releases
* React-scripts: https://github.com/facebook/create-react-app/releases (see `Migrating from x.x.x to x.x.x` section)

Server:
* Node.js: https://nodejs.org/en/download/releases/
* See relevant module docs in /config

### Hardcoded URLs
* This readme
* public/index.html
* Client/server config files
* Firebase Hosting
* Firebase Auth: sign-in methods: authorized domains
* console.developers.google.com/apis/credentials/oauthclient/ -> allowed redirect urls (test with new user registration)
* Coinbase Commerce webhooks, company email/website/support configurations, whitelisted hosted widget domains
* GitHub organization description/majorna repo description
* Reddit
* Blog
