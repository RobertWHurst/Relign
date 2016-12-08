const assert = require('assert');
const auto   = require('../auto');


describe('auto(tasks) -> promise(results)', () => {

  it('executes the tasks in the correct order then resolves the results', () => {
    const execOrder = [];
    return auto({
      a: ['d',      () => { execOrder.push('a'); return 3; }],
      b: [          () => { execOrder.push('b'); return 1; }],
      c: ['a', 'b', () => { execOrder.push('c'); return 4; }],
      d: [          () => { execOrder.push('d'); return 2; }]
    }).then((d) => {
      assert.deepEqual(d, { b: 1, d: 2, a: 3, c: 4 });
      assert.deepEqual(execOrder, ['b', 'd', 'a', 'c' ]);
    });
  });

  it('can handle empty sets', () =>
    auto({}).then(d =>
      assert.deepEqual(d, {})));

  it('throws error on circular dependencies', () =>
    auto({
      a: ['b', () => {}],
      b: ['a', () => {}]
    })
      .then(v => { throw new Error('should have been rejected'); })
      .catch(err => assert.ok(err)));
});
