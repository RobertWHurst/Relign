const parallelMap = require('./parallel-map');
const exec        = require('./exec');


const parallelFindLimit = (items, tester, limit) => {
  return new Promise((resolve, reject) => {
    let   resolved   = false;
    const props      = Object.keys(items);
    const firstProps = props.splice(0, limit);

    if (firstProps.length < 1) { return resolve(); }

    const testItemByProp = (prop) => exec(() => tester(items[prop], prop, items));

    const handleTestResult = (prop) => (ok) => {
      if (resolved) { return; }
      if (ok) {
        resolved = true;
        resolve(items[prop]);
      }
      const nextProp = props.shift();
      if (nextProp) {
        testItemByProp(nextProp).then(handleTestResult(nextProp), reject);
      } else {
        resolve();
      }
    };

    firstProps.map((prop) =>
      testItemByProp(prop).then(handleTestResult(prop), reject));
  });
};


module.exports = parallelFindLimit;
