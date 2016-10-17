# Relign

Relign is a control flow library for promises heavily inspired by
[async](https://github.com/caolan/async). Async is one of the most loved
libraries on NPM, and there are very good reasons to feel this way. Async
provides a lot of very powerful functions for taking unruly asynchronous code
and making it both readable and reasonable. Async does this with the classic
error first call back pattern popular in node. Relign attempts to achieve the
a similar set of goals to async, but for promises.

# Installing Relign

Relign can be installed from NPM.

```shell
npm i relign --save
```

To use relign simply require the function you need.

```javascript
const parallel = require('relign/parallel');

const server   = require('./server');
const database = require('./database');

parallel([
  () => server.listen(),
  () => database.connect()
]).then(() => console.log('ready'));
```

Or require the whole library.

```javascript
const relign = require('relign');

const server   = require('./server');
const database = require('./database');

relign.parallel([
  () => server.listen(),
  () => database.connect()
]).then(() => console.log('ready'));
```
