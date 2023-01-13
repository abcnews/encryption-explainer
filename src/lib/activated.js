export default function activated(list, key) {
  key = key || 'props';
  return list.some((d) => this[key].activated && this[key].activated.config.id === d);
}
