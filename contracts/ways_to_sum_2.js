/*

Total Ways to Sum II
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


How many different distinct ways can the number 57 be written as a sum of integers contained in the set:

[3,4,5,6,7,8,9,10,11]?

You may use each integer in the set zero or more times.


If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.*/


export function main(ns) {
    var result = ways_to_sum_2(ns, [57, [3,4,5,6,7,8,9,10,11]]);
    ns.print(result);
}

export function ways_to_sum_2(ns, input) {
    var target = input[0];
    var sum_array = input[1];
    var count = 0;
    function depthFirstSearch(standing_sum, index){
        if(index >= sum_array.length){
            if(standing_sum == target){
                count++;
            }
            return;
        }
        var multiplier = 0;
        while(true){
            var current = standing_sum+(sum_array[index]*multiplier);
            if(current > target){
                break
            }
            depthFirstSearch(current, index+1);
            multiplier++;
        }
    }
    depthFirstSearch(0, 0);
    return count;
}