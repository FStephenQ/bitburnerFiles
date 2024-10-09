/*
Sanitize Parentheses in Expression

Given the following string:

))(())a)

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> ["()()()", "(())()"]
"(a)())()" -> ["(a)()()", "(a())()"]
")(" -> [""]


If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.*/


export function main(ns) {
    ns.print("triangle_min_sum");
    var result = sanitize_parens(ns, '))(())a)');
    ns.print(result);
}

export function sanitize_parens(ns, s) {
    function isValid(str) {
        let open = 0;
        for (let char of str) {
            if (char === '(') {
                open += 1;
            } else if (char === ')') {
                open -= 1;
            }
            if (open < 0) return false;
        }
        return open === 0;
    }

    function dfs(s, index, leftCount, rightCount, leftRem, rightRem, expr, results) {
        if (index === s.length) {
            if (leftRem === 0 && rightRem === 0 && isValid(expr.join(''))) {
                results.add(expr.join(''));
            }
            return;
        }

        let currentChar = s[index];

        if (currentChar !== '(' && currentChar !== ')') {
            expr.push(currentChar);
            dfs(s, index + 1, leftCount, rightCount, leftRem, rightRem, expr, results);
            expr.pop();
        } else {
            if (currentChar === '(') {
                if (leftRem > 0) {
                    dfs(s, index + 1, leftCount, rightCount, leftRem - 1, rightRem, expr, results);
                }
                expr.push(currentChar);
                dfs(s, index + 1, leftCount + 1, rightCount, leftRem, rightRem, expr, results);
                expr.pop();
            } else if (currentChar === ')') {
                if (rightRem > 0) {
                    dfs(s, index + 1, leftCount, rightCount, leftRem, rightRem - 1, expr, results);
                }
                if (leftCount > rightCount) {
                    expr.push(currentChar);
                    dfs(s, index + 1, leftCount, rightCount + 1, leftRem, rightRem, expr, results);
                    expr.pop();
                }
            }
        }
    }

    let leftRem = 0, rightRem = 0;
    for (let char of s) {
        if (char === '(') {
            leftRem++;
        } else if (char === ')') {
            if (leftRem === 0) {
                rightRem++;
            } else {
                leftRem--;
            }
        }
    }

    let results = new Set();
    dfs(s, 0, 0, 0, leftRem, rightRem, [], results);

    return [...results].length ? [...results] : [""];
}
