<p align="center">
  <a href="https://www.npmjs.com/package/relign">
    <img src="https://img.shields.io/npm/v/relign">
  </a>
  <a href="https://www.npmjs.com/package/relign">
    <img src="https://img.shields.io/npm/dm/relign">
  </a>
  <a href="https://github.com/RobertWHurst/Keystrokes/actions/workflows/ci.yml">
    <img src="https://github.com/RobertWHurst/Keystrokes/actions/workflows/ci.yml/badge.svg">
  </a>
  <a href="https://github.com/sponsors/RobertWHurst">
    <img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86">
  </a>
  <a href="https://openbase.com/js/relign?utm_source=embedded&amp;utm_medium=badge&amp;utm_campaign=rate-badge">
    <img src="https://badges.openbase.com/js/featured/relign.svg?token=2wanGBvFibIfrdpnvnSioqIgoC7lJt3ztNNcKsRw+Pg=">
  </a>
</p>

__If you encounter a bug please [report it][bug-report].__

Relign is a little utility library for processing data and tasks in concurrent
or serial patterns. It's heavily inspired by the wonderful library [async][async]
which was widly used back in the bad old days of callback patterns popular in
node programs at the time. Relign is for modern TypeScript and JavaScript programs
that use async functions and promises.

Relign is a collection of functions that take tasks or data and process them in
various ways. These functions are all designed to be simple and easy to use
without confusion.

## Installation

Relign is published on [NPM][npm]. It can be used in any TypeScript or JavaScript
project, and is esm or cjs compatible.

```shell
npm i relign
```

```ts
import { parallelMapLimit } from 'relign';

const urlsToFetch: string[] = [
  'https://coolsite.com/path/one',
  'https://coolsite.com/path/two',
  'https://coolsite.com/path/three',
  //...
  'https://coolsite.com/path/oneThousand',
]

const resultJson = await parallelMapLimit(urlsToFetch, async url => {
  const response = await fetch(url);
  return response.json();
}, 10);
```

## A Note on Execution

One of the main things that make relign special is how it handles data or tasks.

Relign will happily accept any value as a task. If the value is a function it
will be executed. If the value is a promise it will be awaited. If the value is
a function that returns a promise, the promise will be awaited. If the value is
anything else it will be returned as is. This means that you can pass a mix of
functions, promises, and values to any relign function accepting tasks and it
will do the right thing.

Item functions work in a similar way, but instead these
functions take a worker function that is called for each item in the collection.
This function is executed in the same way as tasks. That means if the worker
returns a promise, the promise will be awaited. If the worker returns a value
that value will be returned as is.

## Function Index

__Tasks Functions__

- [parallel](#parallel)
- [parallelLimit](#parallel-limit)
- [series](#series)
- [auto](#auto)

__Items__

- [parallelMap](#parallel-map)
- [parallelMapLimit](#parallel-map-limit)
- [seriesMap](#series-map)

- [parallelFilter](#parallel-filter)
- [parallelFilterLimit](#parallel-filter-limit)
- [seriesFilter](#series-filter)

- [parallelFind](#parallel-find)
- [parallelFindLimit](#parallel-find-limit)
- [seriesFind](#series-find)

- [parallelFlatMap](#parallel-flat-map)
- [parallelFlatMapLimit](#parallel-flat-map-limit)
- [seriesFlatMap](#series-flat-map)

- [seriesReduce](#series-reduce)

__Timing__

- [nextTick](#next-tick)
- [setTimeout](#set-timeout)
- [setInterval](#set-interval)

__Promises__

- [cbToPromise](#callback-to-promise)
- [exec](#execute)

## Parallel

The `parallel` function takes a collection of tasks and executes them concurrently.
It returns a promise that resolves to an array of the results of each task. It
will happily accept an array or object of tasks. Tasks can be functions, promises,
functions that return a promise, or any other value.

__With an Array__

```ts
import { parallel } from 'relign';

const results = await parallel([
  1,
  Promise.resolve(2),
  async () => 3,
  async () => Promise.resolve(4),
])

console.log(results); // [1, 2, 3, 4]
```

__With an Object__

```ts
import { parallel } from 'relign';

const results = await parallel({
  one: 1,
  two: Promise.resolve(2),
  three: async () => 3,
  four: async () => Promise.resolve(4),
})

console.log(results); // { one: 1, two: 2, three: 3, four: 4 }
```

## Parallel Limit

The `parallelLimit` function takes a collection of tasks and executes them
concurrently with a limit on the number of tasks that can be executed at once.
It returns a promise that resolves to an array of the results of each task. It
will happily accept an array or object of tasks. Tasks can be functions, promises,
functions that return a promise, or any other value.

__With an Array__

```ts
import { parallelLimit } from 'relign';

const results = await parallelLimit([
  1,
  Promise.resolve(2),
  async () => 3,
  async () => Promise.resolve(4),
], 2)

console.log(results); // [1, 2, 3, 4]
```

__With an Object__

```ts
import { parallelLimit } from 'relign';

const results = await parallelLimit({
  one: 1,
  two: Promise.resolve(2),
  three: async () => 3,
  four: async () => Promise.resolve(4),
}, 2)

console.log(results); // { one: 1, two: 2, three: 3, four: 4 }
```

## Series

The `series` function takes a collection of tasks and executes them in series.
It returns a promise that resolves to an array of the results of each task. It
will happily accept an array or object of tasks. Tasks can be functions, promises,
functions that return a promise, or any other value.

__With an Array__

```ts
import { series } from 'relign';

const results = await series([
  1,
  Promise.resolve(2),
  async () => 3,
  async () => Promise.resolve(4),
])

console.log(results); // [1, 2, 3, 4]
```

__With an Object__

```ts
import { series } from 'relign';

const results = await series({
  one: 1,
  two: Promise.resolve(2),
  three: async () => 3,
  four: async () => Promise.resolve(4),
})

console.log(results); // { one: 1, two: 2, three: 3, four: 4 }
```

## Auto

The `auto` function is great when you want tasks to be executed in a specific
order based on dependencies on one another, but still want to run non interdependent
tasks concurrently. It takes an object with a key for each task and a array value
of dependencies and a task. It returns a promise that resolves to an object with
the results of each task. Tasks can be functions, promises, functions that return
promises, or any other value.

```ts
import { auto } from 'relign';

const results = await auto({
  one: [1],
  two: [Promise.resolve(2)],
  three: ['one', 'two', async ({ one, two }) => one + two],
  four: ['two', async ({ two }) => two * 2],
})

console.log(results); // { one: 1, two: 2, three: 3, four: 4 }
```

## Parallel Map

The `parallelMap` function takes a collection of items and a map function. It
will then concurrently process each item in the collection with the map function.
Note that the map function can return a promise or any other value. If a promise
is returned, the result of the promise will be used as the value for the item in
the results array. If any other value is returned, that value will be used as is.

__With an Array__

```ts
import { parallelMap } from 'relign';

const results = await parallelMap([1, 2, 3, 4], async (item) => {
  return item * 2;
})

console.log(results); // [2, 4, 6, 8]
```

__With an Object__

```ts
import { parallelMap } from 'relign';

const results = await parallelMap({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return item * 2;
})

console.log(results); // { one: 2, two: 4, three: 6, four: 8 }
```

## Parallel Map Limit

The `parallelMapLimit` function takes a collection of items, a map function, and
a limit. It will then concurrently process each item in the collection with the
map function with a limit on the number of items that can be processed at once.
Note that the map function can return a promise or any other value. If a promise
is returned, the result of the promise will be used as the value for the item in
the results array. If any other value is returned, that value will be used as is.

__With an Array__

```ts
import { parallelMapLimit } from 'relign';

const results = await parallelMapLimit([1, 2, 3, 4], async (item) => {
  return item * 2;
}, 2)

console.log(results); // [2, 4, 6, 8]
```

__With an Object__

```ts
import { parallelMapLimit } from 'relign';

const results = await parallelMapLimit({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return item * 2;
}, 2)

console.log(results); // { one: 2, two: 4, three: 6, four: 8 }
```

## Series Map

The `seriesMap` function takes a collection of items and a map function. It
will then process each item in the collection with the map function in series.
Note that the map function can return a promise or any other value. If a promise
is returned, the result of the promise will be used as the value for the item in
the results array. If any other value is returned, that value will be used as is.

__With an Array__

```ts
import { seriesMap } from 'relign';

const results = await seriesMap([1, 2, 3, 4], async (item) => {
  return item * 2;
})

console.log(results); // [2, 4, 6, 8]
```

__With an Object__

```ts
import { seriesMap } from 'relign';

const results = await seriesMap({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return item * 2;
})

console.log(results); // { one: 2, two: 4, three: 6, four: 8 }
```

## Parallel Filter

The `parallelFilter` function takes a collection of items and a filter function.
It will then concurrently process each item in the collection with the filter
function. Note that the filter function can return a promise that resolves to a
boolean or a boolean. The boolean will be used to determine if the item should
be included in the results.

__With an Array__

```ts
import { parallelFilter } from 'relign';

const results = await parallelFilter([1, 2, 3, 4], async (item) => {
  return item % 2 === 0;
})

console.log(results); // [2, 4]
```

__With an Object__

```ts
import { parallelFilter } from 'relign';

const results = await parallelFilter({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return item % 2 === 0;
})

console.log(results); // { two: 2, four: 4 }
```

## Parallel Filter Limit

The `parallelFilterLimit` function takes a collection of items, a filter
function, and a limit. It will then concurrently process each item in the
collection with the filter function with a limit on the number of items that can
be processed at once. Note that the filter function can return a promise that
resolves to a boolean or a boolean. The boolean will be used to determine if the
item should be included in the results.

__With an Array__

```ts
import { parallelFilterLimit } from 'relign';

const results = await parallelFilterLimit([1, 2, 3, 4], async (item) => {
  return item % 2 === 0;
}, 2)

console.log(results); // [2, 4]
```

__With an Object__

```ts
import { parallelFilterLimit } from 'relign';

const results = await parallelFilterLimit({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return item % 2 === 0;
}, 2)

console.log(results); // { two: 2, four: 4 }
```

## Series Filter

The `seriesFilter` function takes a collection of items and a filter function.
It will then process each item in the collection with the filter function in
series. Note that the filter function can return a promise that resolves to a
boolean or a boolean. The boolean will be used to determine if the item should
be included in the results.

__With an Array__

```ts
import { seriesFilter } from 'relign';

const results = await seriesFilter([1, 2, 3, 4], async (item) => {
  return item % 2 === 0;
})

console.log(results); // [2, 4]
```

__With an Object__

```ts
import { seriesFilter } from 'relign';

const results = await seriesFilter({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return item % 2 === 0;
})

console.log(results); // { two: 2, four: 4 }
```

## Parallel Find

The `parallelFind` function takes a collection of items and a find function. It
will then concurrently execute the find function on each item in the collection
until the find function returns a promise that resolves to true, or true. The
first item to result in true being returned or resolved will be returned as the
result. If no item results in true, undefined will be returned.

__With an Array__

```ts
import { parallelFind } from 'relign';

const result = await parallelFind([1, 2, 3, 4], async (item) => {
  return item === 3;
})

console.log(result); // 3
```

__With an Object__

```ts
import { parallelFind } from 'relign';

const result = await parallelFind({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return item === 3;
})

console.log(result); // 3
```

## Parallel Find Limit

The `parallelFindLimit` function takes a collection of items, a find function,
and a limit. It will then concurrently execute the find function on each item in
the collection with a limit on the number of items that can be processed at
once. The find function will be executed on each item in the collection until
the find function returns a promise that resolves to true, or true. The first
item to result in true being returned or resolved will be returned as the
result. If no item results in true, undefined will be returned.

__With an Array__

```ts
import { parallelFindLimit } from 'relign';

const result = await parallelFindLimit([1, 2, 3, 4], async (item) => {
  return item === 3;
}, 2)

console.log(result); // 3
```

__With an Object__

```ts
import { parallelFindLimit } from 'relign';

const result = await parallelFindLimit({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return item === 3;
}, 2)

console.log(result); // 3
```

## Series Find

The `seriesFind` function takes a collection of items and a find function. It
will then execute the find function on each item in the collection in series
until the find function returns a promise that resolves to true, or true. The
first item to result in true being returned or resolved will be returned as the
result. If no item results in true, undefined will be returned.

__With an Array__

```ts
import { seriesFind } from 'relign';

const result = await seriesFind([1, 2, 3, 4], async (item) => {
  return item === 3;
})

console.log(result); // 3
```

__With an Object__

```ts
import { seriesFind } from 'relign';

const result = await seriesFind({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return item === 3;
})

console.log(result); // 3
```

## Parallel Flat Map

The `parallelFlatMap` function takes a collection of items and a flat map function.
It will then concurrently execute the flat map function on each item in the
collection. Note that the flat map function can return a promise that resolves
to an array or an array. The array will be flattened into the result.

__With an Array__

```ts
import { parallelFlatMap } from 'relign';

const results = await parallelFlatMap([1, 2, 3, 4], async (item) => {
  return [item, item];
})

console.log(results); // [1, 1, 2, 2, 3, 3, 4, 4]
```

__With an Object__

```ts
import { parallelFlatMap } from 'relign';

const results = await parallelFlatMap({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return [item, item];
})

console.log(results); // [1, 1, 2, 2, 3, 3, 4, 4]
```

## Parallel Flat Map Limit

The `parallelFlatMapLimit` function takes a collection of items, a flat map
function, and a limit. It will then concurrently execute the flat map function
on each item in the collection with a limit on the number of items that can be
processed at once. Note that the flat map function can return a promise that
resolves to an array or an array. The array will be flattened into the result.

__With an Array__

```ts
import { parallelFlatMapLimit } from 'relign';

const results = await parallelFlatMapLimit([1, 2, 3, 4], async (item) => {
  return [item, item];
}, 2)

console.log(results); // [1, 1, 2, 2, 3, 3, 4, 4]
```

__With an Object__

```ts
import { parallelFlatMapLimit } from 'relign';

const results = await parallelFlatMapLimit({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return [item, item];
}, 2)

console.log(results); // [1, 1, 2, 2, 3, 3, 4, 4]
```

## Series Flat Map

The `seriesFlatMap` function takes a collection of items and a flat map
function. It will then execute the flat map function on each item in the
collection in series. Note that the flat map function can return a promise that
resolves to an array or an array. The array will be flattened into the result.

__With an Array__

```ts
import { seriesFlatMap } from 'relign';

const results = await seriesFlatMap([1, 2, 3, 4], async (item) => {
  return [item, item];
})

console.log(results); // [1, 1, 2, 2, 3, 3, 4, 4]
```

__With an Object__

```ts
import { seriesFlatMap } from 'relign';

const results = await seriesFlatMap({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (item) => {
  return [item, item];
})

console.log(results); // [1, 1, 2, 2, 3, 3, 4, 4]
```

## Series Reduce

The `seriesReduce` function takes a collection of items, a reducer function,
and an initial value. It will then execute the reducer function on each item in
the collection in series. The result of the reducer function can be a promise
or any value. If the reducer function returns a promise, the result of the
promise will be used as the memo for the next iteration, otherwise
the return value will be used as the memo. After all items have been processed,
the memo will be returned as the result.

__With an Array__

```ts
import { seriesReduce } from 'relign';

const result = await seriesReduce([1, 2, 3, 4], async (memo, item) => {
  return memo + item;
}, 0)

console.log(result); // 10
```

__With an Object__

```ts
import { seriesReduce } from 'relign';

const result = await seriesReduce({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}, async (memo, item) => {
  return memo + item;
}, 0)

console.log(result); // 10
```

## Next Tick

The `nextTick` function returns a promise that resolves on the next tick of the
event loop. If used in a browser, requestAnimationFrame under the hood instead
of node's process.nextTick.

```ts
import { nextTick } from 'relign';

await nextTick();
```

Next tick can also take a task or value as an argument. If a task is passed,
the task will be executed on the next tick of the event loop and the promise
will resolve to the result of the task. If a value is passed, the promise will
resolve to the value on the next tick of the event loop.

```ts
import { nextTick } from 'relign';

const result = await nextTick(() => {
  return 'hello world';
});

console.log(result); // 'hello world'
```

## Set Timeout

The `setTimeout` takes a delay and returns a promise that resolves after the
delay has elapsed.

```ts
import { setTimeout } from 'relign';

await setTimeout(1000);
```

Set timeout can also take a task or value as an argument. If a task is passed,
the task will be executed after the delay has elapsed and the promise will
resolve to the result of the task. If a value is passed, the promise will
resolve to the value after the delay has elapsed.

```ts
import { setTimeout } from 'relign';

const result = await setTimeout(1000, () => {
  return 'hello world';
});

console.log(result); // 'hello world'
```

## Set Interval

The `setInterval` takes a task and a interval duration. It will call the task
every interval period until the task throws, or executes the resolve function
passed to it. The promise returned by setInterval will not resolve until the
task throws or executes the resolve function passed to it. If the task calls
the resolve function and passes a value, the promise will resolve to that
value.

```ts
import { setInterval } from 'relign';

let count = 0;

const result = await setInterval(1000, (resolve) => {
  count += 1;

  if (count === 5) {
    resolve(count);
  }
});

console.log(result); // 5
```

## Callback to Promise

The `cbToPromise` function takes a function that uses the error first callback
pattern and returns a function that returns a promise. The returned function
will call the original function and resolve or reject the promise based on the
error first callback.

```ts
import { cbToPromise } from 'relign';

const readFile = cbToPromise(fs.readFile);

const result = await readFile('./package.json', 'utf8');

console.log(result); // package.json contents
```

## Execute

The `exec` function is the heart of relign and is used by a majority of the
functions above. The execute function takes a task or value and executes it.
If the task is a function, it will be called and the result will be returned.
If the task is a promise, the promise will be awaited and the result will be
returned. If the task is any other value, the value will be returned.

```ts
import { exec } from 'relign';

const result = exec(() => {
  return 'hello world';
});

console.log(result); // 'hello world'
```

## Help Welcome

If you want to support this project by throwing be some coffee money It's
greatly appreciated.

[![sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/RobertWHurst)

If your interested in providing feedback or would like to contribute please feel
free to do so. I recommend first [opening an issue][feature-request] expressing
your feedback or intent to contribute a change, from there we can consider your
feedback or guide your contribution efforts. Any and all help is greatly
appreciated since this is an open source effort after all.

Thank you!

[npm]: https://www.npmjs.com
[async]: https://github.com/caolan/async
[bug-report]: https://github.com/RobertWHurst/Relign/issues/new?template=bug_report.md
[feature-request]: https://github.com/RobertWHurst/Relign/issues/new?template=feature_request.md
