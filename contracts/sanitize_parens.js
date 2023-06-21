/*
Given the following string:

(a)()(a

remove the minimum number of invalid parentheses in order to validate the string. 
If there are multiple minimal ways to validate the string, provide all of the possible results. 
The answer should be provided as an array of strings. 
If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> ["()()()", "(())()"]
"(a)())()" -> ["(a)()()", "(a())()"]
")(" -> [""]
*/

export async function main(ns){
    ns.print(sanitize_parens(ns, '(a)()(a'));
}

export function sanitize_parens(ns, input){
    var ret = [];
    var removed = 1;
    while(ret.length == 0 && removed < input.length){
        var remove = function(i, offset, rem){
            if(rem == removed)
                return;
            for(var q = offset; q < i.length; q++){
                var t = i.slice(0,q)+i.slice(q+1);
                if(balanced(t)){
                    ret.push(t);
                } else {
                    remove(t, q, removed+1);
                }
            }
        }
        removed++;
    }
    return ret.length == 0? ['']: ret;
}

function balanced(test){
    if(test.split('(').length != test.split(')').length)
        return false;
    
    var opened = 0;
    var closed = 0;
    for(var c of test){
        if(c == '(')
            opened++;
        if(c == ')')
            closed++;
        
        if(closed > opened)
            return false;
    }
    return opened == closed;
}