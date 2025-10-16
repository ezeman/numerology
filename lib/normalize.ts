export function normalizeDigits(input: string): string {
  return (input || '').replace(/\D+/g, '');
}

export function digitalRoot(n: number): number {
  let s = Math.abs(n);
  while (s > 9) {
    s = s
      .toString()
      .split('')
      .reduce((acc, d) => acc + Number(d), 0);
  }
  return s;
}

