[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://travis-ci.org/RobertWHurst/relign)
[![Coveralls](https://img.shields.io/coveralls/jekyll/jekyll.svg)](https://coveralls.io/github/RobertWHurst/relign)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/relign)

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

```javascript
relign.auto(tasks) -> promise(results)
```

Auto provides a way to organize a set of interdependent tasks and execute them
in the most efficient way possible. Biased on the the dependencies associated
with each task, auto will figure out which tasks will run first, and start
ones that depend upon tasks completed. Once all of the tasks are complete auto
will resolve the results.

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

```javascript
relign.parallel(tasks) -> promise(results)
```

Parallel accepts an array or object of tasks. It will then execute each of those
tasks in within the same tick. Once all of the tasks resolve parallel will
resolve the results. The results object will match the same structure as the
tasks object or array.

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

```javascript
relign.parallelLimit(tasks, limit) -> promise(results)
```

Parallel limit behaves almost identical to [parallel](#parallel), but will
not execute more than a fixed limit of tasks at a time. Once a task resolves and
there are additional tasks to execute, another task will be executed. Once all
of the tasks have been resolved parallelLimit resolves the results.

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

```javascript
relign.parallelMap(items, worker(item) -> promise(result)) -> promise(results)
relign.parallelMap(items, worker(item) -> result) -> promise(results)
```

Parallel map takes a array or object of items and executes an asynchronous
worker upon each item at once. Once the worker has resolved a result for all
of the items parallel map resolves the results. The results object will match
the same structure as the items object or array.

```javascript
relign.parallelMap(resourceUrls, url => download(url))
  .then(resources => store(resources));
```


#### Parallel Map Limit

```javascript
relign.parallelMap(items, worker, limit) -> promise(results)
```

Parallel Map Limit behaves nearly identically to [parallel map](#parallel-map)
with the exception that it takes a limit and restricts the amount of items
the worker can process at the same time by that limit.

```javascript
relign.parallelMap(resourceUrls, url => download(url), 6)
  .then(resources => store(resources));
```

#### Series

```javascript
relign.series(tasks) -> promise(results)
```

#### Series Map

```javascript
relign.series(items, worker) -> promise(results)
```

### Utilities

#### Exec

```javascript
relign.exec(fn() => promise(result)) -> promise(result)
relign.exec(fn() => result) -> promise(result)
relign.exec(value) -> promise(value)
```

Exec is a utility for executing functions or wrapping values with a promise.
It's used extensively by relign internally for normalizing arguments.

If exec is given a function that returns a promise then exec will resolve the
value resolved by that promise.

If exec is given a function that returns a value then exec will resolve that
value.

If exec is given a value then it will resolve that value.

#### Next Tick

```javascript
relign.nextTick(fn() -> promise(result)) -> promise(result)
relign.nextTick(fn() -> result) -> promise(result)
relign.nextTick(value) -> promise(value)
relign.nextTick() -> promise()
```

Next tick is a wrapper for node's built in next tick. It executes a given
function in the following tick, and resolves in the value returned or resolved
by the function. If a value is given instead of a function, then the value will
be resolved the following tick.

#### Set Interval

```javascript
relign.setInterval(fn() -> promise(), duration) -> intervalPromise()
relign.setInterval(fn(), duration) -> intervalPromise()
```

#### Set Timeout

```javascript
relign.setTimeout(fn() -> promise(result), duration) -> timeoutPromise(result)
relign.setTimeout(fn() -> result, duration) -> timeoutPromise(result)
relign.setTimeout(value, duration) -> timeoutPromise(value)
relign.setTimeout(duration) -> timeoutPromise()
```
