export function isInteger(x) {
  x = "" + x;

  for (const c of x) {
    if (c < "0" || c > "9") {
      return false;
    }
  }

  return true;
}
