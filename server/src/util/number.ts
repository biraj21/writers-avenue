export function isInteger(x: unknown) {
  if (typeof x === "number" || typeof x === "string") {
    for (const c of x.toString()) {
      if (c < "0" || c > "9") {
        return false;
      }
    }

    return true;
  }

  return false;
}
