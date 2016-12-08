const assert = require('assert');
const exec   = require('../exec');


describe('exec(fn) -> promise(val)', () => {

  it('runs a function and resolves it\'s value', () =>
    exec(() => 'val').then(v => assert.equal(v, 'val')));

  it('if given a value it simply resolves it', () =>
    exec('val').then(v => assert.equal(v, 'val')));

  it('if given no arguement it returns a resolved promise', () =>
    exec().then(v => assert.equal(v, undefined)));

  it('captures a thrown error', () =>
    exec(() => { throw new Error('error'); })
      .catch(err => assert.equal(err.message, 'error')));
});
