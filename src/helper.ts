export function lower_bound<T>(arr: T[], v: T): number {
  let s: number = 0;
  let e: number = arr.length;

  while (s < e) {
    let m: number = (s + e) >> 1;
    if (arr[m] < v) s = m + 1;
    else e = m;
  }

  return s;
}

export function upper_bound<T>(arr: T[], v: T): number {
  let s: number = 0;
  let e: number = arr.length;

  while (s < e) {
    let m: number = (s + e) >> 1;
    if (arr[m] <= v) s = m + 1;
    else e = m;
  }

  return s;
}