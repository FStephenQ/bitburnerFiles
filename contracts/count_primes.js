/*
Total Number of Primes

Given a number n, return the count of all prime numbers less than or equal to n.

Example:
  10 → 4  (primes: 2, 3, 5, 7)
  1  → 0
  2  → 1
*/

/** @param {NS} ns */
export async function main(ns) {
    ns.ui.openTail();
    const cases = [
        { input: 1,   expected: 0 },
        { input: 2,   expected: 1 },
        { input: 10,  expected: 4 },
        { input: 20,  expected: 8 },
        { input: 100, expected: 25 },
    ];
    for (const { input, expected } of cases) {
        const result = count_primes(ns, input);
        ns.print(`${result === expected ? 'PASS' : 'FAIL'}: count_primes(${input}) = ${result}, expected ${expected}`);
    }
}

/** @param {NS} ns */
export function count_primes(ns, n) {
    if (n < 2) return 0;
    const sieve = new Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;
    for (let i = 2; i * i <= n; i++) {
        if (sieve[i]) {
            for (let j = i * i; j <= n; j += i) {
                sieve[j] = false;
            }
        }
    }
    return sieve.filter(Boolean).length;
}
