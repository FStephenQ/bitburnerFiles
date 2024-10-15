/*Find All Valid Math Expressions
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


You are given the following string which contains only digits between 0 and 9:

48098819378

You are also given a target number of 41. Return all possible ways you can add the +(add), -(subtract), and *(multiply) operators to the string such that it evaluates to the target number.
 (Normal order of operations applies.)

The provided answer should be an array of strings containing the valid expressions. 
The data provided by this problem is an array with two elements. The first element is the string of digits, while the second element is the target number:

["48098819378", 41]

NOTE: The order of evaluation expects script operator precedence NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression Examples:

Input: digits = "123", target = 6
Output: ["1+2+3", "1*2*3"]

Input: digits = "105", target = 5
Output: ["1*0+5", "10-5"]


If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.*/

export function main(ns) {
    var result = find_valid_expressions(ns, ["59593944", -39]);
    ns.print(result);
}

export function find_valid_expressions(ns, s) {
    var digs = s[0].split('');
    ns.print(s);
    ns.print(digs);
    var target = s[1]

    var recurse = function (index, expr){
        if(index >= expr.length){
            var result = 0;
            ns.print(expr.join(''));
            result = Function(`'use strict'; return (${expr.join('')})`)()
            ns.print(result);
            if (result == target){
                return [result];
            }
            return [];
        }

        for(var i = index; i < expr.length; i++){
            var before = expr.slice(0,i).join('');
            var after = expr.slice(i).join('');
            if (after[0] == '0'){
                continue
            }
            else{
                var multiplication = before + "*" + after;
                var addition = before + "+" + after;
                var subtraction = before + "-"+ after;
                var ret = []
                ret.concat(recurse(i + 2, multiplication.split('')));
                ret.concat(recurse(i + 2, addition.split('')));
                ret.concat(recurse(i + 2, subtraction.split('')));
            }
        }
        return ret;
    }
    var answer = recurse(1, digs);
    if(answer == []){
        return '';
    }
    return answer;
}