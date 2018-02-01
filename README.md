<a href="https://majorna-fire.firebaseapp.com"><img src="/src/res/majorna.png" width="256"></a>

[![Build Status](https://travis-ci.org/majorna/majorna.svg?branch=master)](https://travis-ci.org/majorna/majorna)

Majorna source code repo contains:
* Majorna wallet.
* Majorna server.
* Majorna miner.

## Heroku Push

```bash
git subtree push --prefix server heroku master

# in case --force is needed
git push heroku `git subtree split --prefix server master`:master --force
```

## License

MIT