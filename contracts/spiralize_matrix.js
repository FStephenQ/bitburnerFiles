/*Spiralize Matrix
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Given the following array of arrays of numbers representing a 2D matrix, return the elements of the matrix as an array in spiral order:

    [
        [37,27, 6,39]
        [19,17,39,47]
        [37,21,27,30]
        [50,38,22,35]
        [ 3,37,44,41]
    ]

Here is an example of what spiral order should be:

     [
         [1, 2, 3]
         [4, 5, 6]
         [7, 8, 9]
     ]

 Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]

 Note that the matrix will not always be square:

     [
         [1,  2,  3,  4]
         [5,  6,  7,  8]
         [9, 10, 11, 12]
     ]

 Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]


If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.
*/

/** @param {NS} ns */
export async function main(ns) {
    var input = [[37,27,6,39],[19,17,39,47],[37,21,27,30],[50,38,22,35],[3,37,44,41]];
    ns.ui.openTail();
    ns.print(JSON.stringify(spiralize_matrix(ns, input)));
}

/** @param {NS} ns */
export function spiralize_matrix(ns, matrix) {
    const result = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        for (let i = left; i <= right; i++) result.push(matrix[top][i]);
        top++;
        for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
            bottom--;
        }
        if (left <= right) {
            for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
            left++;
        }
    }

    return result;
}
