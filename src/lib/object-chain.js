module.exports = function ov(ob, key) {
  let keys = key.split('.');
  let rv = ob;
  let k;
  while ((k = keys.shift())) {
    rv = (rv || {})[k];
  }
  return rv;
};
