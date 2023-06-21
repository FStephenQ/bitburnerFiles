/*

You are located in the top-left corner of the following grid:

  [[0,0,0,0,0,1,1,0,0,0,0],
   [0,0,0,0,1,0,0,0,1,0,0],
   [0,0,0,1,0,0,1,1,0,0,1],
   [0,0,0,0,0,0,0,0,0,1,0],
   [0,0,1,0,0,0,0,0,0,1,0],
   [0,0,0,1,1,0,0,0,1,0,1],
   [0,1,0,0,0,1,0,0,1,0,1],
   [0,1,0,1,0,0,0,1,0,0,1],
   [0,1,0,0,1,1,0,0,0,0,0],
   [0,0,1,1,1,1,0,1,0,0,1],
   [1,0,1,1,1,1,1,0,1,0,0]]

You are trying to find the shortest path to the bottom-right corner of the grid, but there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

Determine the shortest path from start to finish, if one exists. The answer should be given as a string of UDLR characters, indicating the moves along the path

NOTE: If there are multiple equally short paths, any of them is accepted as answer. If there is no path, the answer should be an empty string.
NOTE: The data returned for this contract is an 2D array of numbers representing the grid.

Examples:

    [[0,1,0,0,0],
     [0,0,0,1,0]]

Answer: 'DRRURRD'

    [[0,1],
     [1,0]]

Answer: ''
*/
import { contains } from "/common";


/*
I'll be honest, I couldn't figure this one out past a horrific brute-force approach
That attempted solution is the shortest_path_grid function
Code actually used taken from https://github.com/zacstarfire/bitburner/blob/main/contracts/solvecontract.js
*/

export function stolen_shortest_path(ns, data) {
    //slightly adapted and simplified to get rid of MinHeap usage, and construct a valid path from potential candidates   
    //MinHeap replaced by simple array acting as queue (breadth first search)  z
    const width = data[0].length;
    const height = data.length;
    const dstY = height - 1;
    const dstX = width - 1;

    const distance = new Array(height);
    //const prev: [[number, number] | undefined][] = new Array(height);
    const queue = [];

    for (let y = 0; y < height; y++) {
        distance[y] = new Array(width).fill(Infinity);
        //prev[y] = new Array(width).fill(undefined) as [undefined];
    }

    function validPosition(y, x) {
        return y >= 0 && y < height && x >= 0 && x < width && data[y][x] == 0;
    }

    // List in-bounds and passable neighbors
    function* neighbors(y, x) {
        if (validPosition(y - 1, x)) yield [y - 1, x]; // Up
        if (validPosition(y + 1, x)) yield [y + 1, x]; // Down
        if (validPosition(y, x - 1)) yield [y, x - 1]; // Left
        if (validPosition(y, x + 1)) yield [y, x + 1]; // Right
    }

    // Prepare starting point
    distance[0][0] = 0;

    //## Original version
    // queue.push([0, 0], 0);
    // // Take next-nearest position and expand potential paths from there
    // while (queue.size > 0) {
    //   const [y, x] = queue.pop() as [number, number];
    //   for (const [yN, xN] of neighbors(y, x)) {
    //     const d = distance[y][x] + 1;
    //     if (d < distance[yN][xN]) {
    //       if (distance[yN][xN] == Infinity)
    //         // Not reached previously
    //         queue.push([yN, xN], d);
    //       // Found a shorter path
    //       else queue.changeWeight(([yQ, xQ]) => yQ == yN && xQ == xN, d);
    //       //prev[yN][xN] = [y, x];
    //       distance[yN][xN] = d;
    //     }
    //   }
    // }

    //Simplified version. d < distance[yN][xN] should never happen for BFS if d != infinity, so we skip changeweight and simplify implementation
    //algo always expands shortest path, distance != infinity means a <= lenght path reaches it, only remaining case to solve is infinity    
    queue.push([0, 0]);
    while (queue.length > 0) {
        const [y, x] = queue.shift()
        for (const [yN, xN] of neighbors(y, x)) {
            if (distance[yN][xN] == Infinity) {
                queue.push([yN, xN])
                distance[yN][xN] = distance[y][x] + 1
            }
        }
    }

    // No path at all?
    if (distance[dstY][dstX] == Infinity) return "";

    //trace a path back to start
    let path = ""
    let [yC, xC] = [dstY, dstX]
    while (xC != 0 || yC != 0) {
        const dist = distance[yC][xC];
        for (const [yF, xF] of neighbors(yC, xC)) {
            if (distance[yF][xF] == dist - 1) {
                path = (xC == xF ? (yC == yF + 1 ? "D" : "U") : (xC == xF + 1 ? "R" : "L")) + path;
                [yC, xC] = [yF, xF]
                break
            }
        }
    }

    return path;
}

function shortest_path_grid(ns, input){
    ns.print(input);
    var moves = {
        'D': (a) => {return [a[0]+1, a[1]];},
        'R': (a) => {return [a[0], a[1]+1];},
        'L': (a) => {return [a[0], a[1]-1];},
        'U': (a) => {return [a[0]-1, a[1]];}
    };
    
    /** @param {String[]} path */
    var get_node = function(path){
        var ret = [0, 0];
        for(var char of path){
            ret = moves[char](ret);
        }
        return ret;
    }
    var strings = ['D', 'R'];
    var length = (input.length + input[0].length);
    var tried = [];
    for(var v = 1; v < length; v++){
        var tmp = [];
        for(var s of strings){
            if(contains(tried, s)) continue;
            var start = get_node(s);
            for(var m of Object.keys(moves).filter((a) => {return a != s[s.length-1]})){
                if(is_valid_move(ns, start, moves[m](start), input)){
                    tmp.push(s+m);
                }
            }
            tried.push(s);
        }
        strings = tmp;
    }
    var filtered_paths = strings.filter((a) => {
        var n = get_node(a);
        return n[0] == input.length-1 && n[1] == input[0].length-1;
    }).sort((a, b) => (a.length - b.length));
    if(filtered_paths.length == 0){
        return '';
    }
    return filtered_paths[0];
}

/** @param {Number[]} start, @param {Number[]} end, @param {Number[][]} grid */
function is_valid_move(ns, start, end, grid){
    ns.print(start);
    ns.print(end);
    if(start[0] < 0 || start[1] < 0 || end[0] < 0 || end[1] < 0) return false;
    if(start[0] >= grid.length || start[1] >= grid[0].length) return false;
    if(end[0] >= grid.length || end[1] >= grid[0].length) return false;
    if(grid[end[0]][end[1]] != 0) return false;
    return true;
}