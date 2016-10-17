# Relign

Relign is a control flow library for promises heavily inspired by
[async](https://github.com/caolan/async). Async is one of the most loved
libraries on NPM, and there are very good reasons to feel this way. Async
provides a lot of very powerful functions for taking unruly asynchronous code
and making it both readable and reasonable. Async does this with the classic
error first call back pattern popular in node. Relign attempts to achieve the
a similar set of goals to async, but for promises.

## Installing Relign

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

## Docs

### Control Flow

#### Auto

```
relign.auto(tasks) -> promise(results)
```

```javascript
relign.auto({
  mixingBowl: [() => getMixingBowl()],
  cakeMix   : ['mixingBowl', r => addCakeMix(r.mixingBowl)],
  milk      : ['mixingBowl', r => addMilk(r.mixingBowl)],
  mix       : ['cakeMix', 'milk', r => mixContents(r.mixingBowl)],
  hotOven   : [() => preheatOven()],
  cake      : ['mix', 'hotOven', r => r.hotOven.bakeContents(r.mixingBowl)],
}).then(results => eat(results.cake));
```

#### Parallel

```
relign.parallel(tasks) -> promise(results)
```

```javascript
relign.parallel({
  server  : () => server.listen(),
  database: () => database.connect()
}).then(results => console.log(`Server listening on port ${results.server.port}`));
```

```javascript
relign.parallel([
  server.listen(),
  database.connect()
]).then(results => console.log(`Server listening on port ${results[0].port}`));
```

#### Parallel Limit

```
relign.parallelLimit(tasks, limit) -> promise(results)
```

```javascript
relign.parallelLimit({
  fileOne  : () => loadFileOne(),
  fileTwo  : () => loadFileTwo(),
  fileThree: () => loadFileThree(),
  fileFour : () => loadFileFour()
}, 2).then(files => parse(files));
```

```javascript
relign.parallelLimit([
  () => loadFileOne(),
  () => loadFileTwo(),
  () => loadFileThree(),
  () => loadFileFour()
], 2).then(files => parse(files));
```

#### Parallel Map

```
relign.parallelMap(items, worker) -> promise(results)
```

```javascript
relign.parallelMap(resourceUrls, url => download(url))
  .then(resources => store(resources));
```


#### Parallel Map Limit

```
relign.parallelMap(items, worker, limit) -> promise(results)
```

```javascript
relign.parallelMap(resourceUrls, url => download(url), 6)
  .then(resources => store(resources));
```

#### Series

#### Series Map

### Utilities

#### Exec

#### Next Tick

#### Set Interval

#### Set Timeout
