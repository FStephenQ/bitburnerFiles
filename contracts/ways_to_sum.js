/*
It is possible write four as a sum in exactly four different ways:

    3 + 1
    2 + 2
    2 + 1 + 1
    1 + 1 + 1 + 1

How many different distinct ways can the number 17 be written as a sum of at least two positive integers?
*/

export function ways_to_sum(ns, input){
    var partition = function(left, right){
        if(right == 0)
            return 0;
        if(left == 0)
            return 1;
        if(left < 0)
            return 0;
        
        return partition(left, right-1) + partition(left-right, right);
    }
    return partition(input, input-1);
}

