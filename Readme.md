[![Travis](https://img.shields.io/travis/RobertWHurst/relign.svg)](https://travis-ci.org/RobertWHurst/relign)
[![Coveralls](https://img.shields.io/coveralls/jekyll/jekyll.svg)](https://coveralls.io/github/RobertWHurst/relign)
[![npm](https://img.shields.io/npm/v/relign.svg)](https://www.npmjs.com/package/relign)

# Intro to relign

relign is a highly functional control flow library. It's heavily inspired by [async](https://github.com/caolan/async) but goes a bit further. relign treats all functions as values, and thus wherever you can pass a function to relign, it's also fine to pass a value. relign refers to both functions, functions that return promises, promises, and any other value as tasks.

relign's utilities are greatly inspired by. Async is one of the most loved libraries on NPM, and there are many very good reasons for this. Async provides a lot of very powerful functions for taking unruly asynchronous code and making it both readable and reasonable. Async does this with the classic error first callback pattern popular in node. relign attempts to achieve a similar set of goals to async, but for promises. It provides a large collection of methods for processing collections of data, and controlling the execution of asynchronous code.

If you're starting a new project and want a good foundation for your control flow patterns, or you're planning on moving a project from node style callbacks, to the newer 'async await' style of control flow, relign may be just what you need.

## Installing relign

relign can be installed from NPM.

```shell
npm i relign --save
```

To use relign you may simply require the function you need:

```javascript
const parallel = require('relign/parallel');

const server   = require('./server');
const database = require('./database');

parallel([
  () => server.listen(),
  () => database.connect()
]).then(() => console.log('ready'));
```

or require the whole library:

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

The following will cover the relign API and how to use it.

### Control Flow

#### Auto

```javascript
relign.auto(autoTasks) -> promise(results)
```

Auto will execute tasks without dependencies first, as these dependencies resolve, any tasks dependent on them will be executed. The result is that a complex collection of dependencies can be resolved as fast as possible without complex control flow code.

Auto executes an object containing arrays. These arrays each contain a task, proceeded by dependencies of the task, if any. Note that the dependencies are strings that match the key of another task within the given object. For reference see the example below. Tasks are any function or value that can be passed to [exec](#exec).

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

Parallel is a great way to concurrently execute a collection of tasks then wait for all of them to complete.

Parallel accepts an array or object containing tasks. A task is a function or value accepted by [exec](#exec). Parallel will execute all of the tasks and return a promise. This promise will resolve once all of the tasks have resolved. The resolved results will be an array or object matching the keys/indexes of each task. Each task result will be present in the same key/index as the task that produced it.

Below is two examples of how you might start a server and connect to a database concurrently. The first example uses a task object, and the second uses a task array. These examples are functionally equivalent.

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

Similar to [parallel](#parallel), parallel limit is a great way to concurrently execute a collection of tasks, but with an added ability to limit the maximum task concurrency.

Parallel limit accepts an array or object containing tasks, and a limit. A task is a function or value that can be accepted by [exec](#exec). The limit is the maximum number of tasks that can be executed simultaneously. Like parallel, parallel limit returns a promise that resolves once all of the tasks have resolved. The resolved results will be an array or object matching the keys/indexes of each task. Each task result will be present in the same key/index as the task that produced it.

Below is two examples of how parallel limit might be used to load a collection of files into memory then parse their contents. Note that only two files can be loaded concurrency as instructed by the second argument passed to parallel limit.

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

#### Series

```javascript
relign.series(tasks) -> promise(results)
```

Series provides a way for executing tasks in order. If all of your tasks happen to be promise returning functions then you could do this with an async function, but relign tasks can be any value [exec](#exec) accepts. This makes relign series much more flexible.

Series accepts an array or object of tasks. It will execute each of the tasks in the key/index order they are defined in. It returns a promise that will resolve once all of the tasks have resolved.

#### Parallel Map

```javascript
relign.parallelMap(items, worker(item) -> promise(result)) -> promise(results)
relign.parallelMap(items, worker(item) -> result) -> promise(results)
```

If you've needed to process data concurrently you know how hard it can be. Parallel map makes the job of concurrently processing data much easier.

Parallel map accepts an array or object and a worker function. The worker function is executed once for each value within the array/object. The item is passed as the first argument of the worker function. The worker can return a promise, or a value. Parallel map returns a promise which once all of the worker has been executed upon all of the items, and any promises it returned have resolved the returned promise will resolve.

```javascript
relign.parallelMap(resourceUrls, url => download(url))
  .then(resources => store(resources));
```


#### Parallel Map Limit

```javascript
relign.parallelMapLimit(items, worker(item) -> promise(result), limit) -> promise(results)
```

Parallel map limit is just like parallel map, but it limits the maximum concurrency. When working with larger data sets you want to limit your maximum concurrently. parallel map is great for working with smaller data sets, but for larger ones the sensible thing to do is limit the maximum concurrency.

Parallel map limit accepts an array or object and a worker function. The worker function is executed once for each value within the array/object. The item is passed as the first argument of the worker function. The worker can return a promise, or a value. Parallel map limit returns a promise which once all of the worker has been executed upon all of the items, and any promises it returned have resolved the returned promise will resolve.

```javascript
relign.parallelMap(resourceUrls, url => download(url), 6)
  .then(resources => store(resources));
```

#### Series Map

```javascript
relign.series(items, worker(item) -> promise(result)) -> promise(results)
```

Series map takes a array or object of items and executes an asynchronous worker upon each item in series. Once the worker has resolved a result for all of the items parallel map resolves the results. The results object will match the same structure as the items object or array.

#### Parallel Concat

```javascript
relign.parallelConcat(items, worker(item) -> promise(result)) -> promise(results)
```


#### Series Concat

```javascript
relign.seriesConcat(items, worker(item) -> promise(result)) -> promise(results)
```

#### Parallel Find

```javascript
relign.parallelFind(items, tester) -> promise(item)
```


#### Series Find

```javascript
relign.seriesFind(items, tester) -> promise(item)
```


### Utilities

#### Exec

```javascript
relign.exec(fn() => promise(result)) -> promise(result)
relign.exec(fn() => result) -> promise(result)
relign.exec(value) -> promise(value)
```

Exec is used to convert any value to a promise. It's used extensively by relign internally for normalizing tasks. Exec makes relign a breeze to use because with it you can treat all functions as values. If given a function exec will execute it. Should the function return a promise then exec will return it. If the function instead returns a value, then relign will return a promise that resolves the value immediately. If exec is passed a promise, then it will return the promise. If exec is passed any other type of value other than a function, it will return a promise that resolves the value immediately.

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
