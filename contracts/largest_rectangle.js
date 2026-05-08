/*
Largest Rectangle in a Matrix

Given a 2D binary matrix of 0s and 1s, find the largest rectangle containing
only 1s and return its area.

Example:
  [[1, 0, 1],
   [1, 1, 1],
   [1, 1, 1]]
  → 6  (the bottom two rows form a 2×3 rectangle)
*/

/** @param {NS} ns */
export async function main(ns) {
    ns.ui.openTail();
    const cases = [
        { input: [[1,0,1],[1,1,1],[1,1,1]], expected: 6 },
        { input: [[0]], expected: 0 },
        { input: [[1]], expected: 1 },
        { input: [[1,1],[1,1]], expected: 4 },
        { input: [[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]], expected: 6 },
    ];
    for (const { input, expected } of cases) {
        const result = largest_rectangle(ns, input);
        ns.print(`${result === expected ? 'PASS' : 'FAIL'}: got ${result}, expected ${expected}`);
    }
}

/** @param {NS} ns */
export function largest_rectangle(ns, matrix) {
    if (!matrix.length || !matrix[0].length) return 0;
    const cols = matrix[0].length;
    const heights = new Array(cols).fill(0);
    let max_area = 0;

    for (const row of matrix) {
        for (let j = 0; j < cols; j++) {
            heights[j] = row[j] === 0 ? 0 : heights[j] + 1;
        }
        max_area = Math.max(max_area, max_rect_in_histogram(heights));
    }

    return max_area;
}

function max_rect_in_histogram(heights) {
    const stack = [];
    let max_area = 0;

    for (let i = 0; i <= heights.length; i++) {
        const h = i === heights.length ? 0 : heights[i];
        while (stack.length && heights[stack[stack.length - 1]] > h) {
            const height = heights[stack.pop()];
            const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
            max_area = Math.max(max_area, height * width);
        }
        stack.push(i);
    }

    return max_area;
}
