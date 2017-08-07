module.exports = function classed(el, cl, b) {
  let has = el.className.split(' ').some(c => c.trim() === cl);

  if (b === undefined) return has;

  if (b) {
    if (has) return;
    let names = el.className.split(' ');
    names.push(cl);
    el.className = names.join(' ');
  }

  if (!b) {
    if (!has) return;
    el.className = el.className
      .split(' ')
      .filter(c => c.trim() !== cl)
      .join(' ');
  }
};
