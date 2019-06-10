export const purge = <T>(a: T) => {
  Object.keys(a).forEach(v => a[v] !== 0 && !a[v] && delete a[v]);
  return a;
};
