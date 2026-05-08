/*
Proper 2-Coloring of a Graph

You are given data that represents a graph with n nodes and a list of undirected
edges: [numNodes, [[a, b], [c, d], ...]]

Attempt to properly 2-color the graph, assigning each node either 0 or 1 such
that no two adjacent nodes share the same color. Return the coloring as an array
of 0s and 1s indexed by node. If no valid 2-coloring exists (graph contains an
odd cycle), return an empty array [].

Example:
  [4, [[0,2],[0,3],[1,2],[1,3]]] → [0, 0, 1, 1]  (or any valid coloring)
  [3, [[0,1],[1,2],[2,0]]]       → []             (triangle — not bipartite)
*/

/** @param {NS} ns */
export async function main(ns) {
    ns.ui.openTail();
    const cases = [
        { input: [4, [[0,2],[0,3],[1,2],[1,3]]], bipartite: true },
        { input: [3, [[0,1],[1,2],[2,0]]],       bipartite: false },
        { input: [1, []],                         bipartite: true },
        { input: [4, [[0,1],[2,3]]],              bipartite: true },
        { input: [5, [[0,1],[1,2],[2,3],[3,4],[4,0]]], bipartite: false },
    ];
    for (const { input, bipartite } of cases) {
        const result = two_coloring(ns, input);
        const ok = bipartite ? (result.length === input[0] && verify_coloring(input, result)) : result.length === 0;
        ns.print(`${ok ? 'PASS' : 'FAIL'}: [${result}]`);
    }
}

function verify_coloring([n, edges], coloring) {
    for (const [a, b] of edges) {
        if (coloring[a] === coloring[b]) return false;
    }
    return true;
}

/** @param {NS} ns */
export function two_coloring(ns, data) {
    const [n, edges] = data;
    const adj = Array.from({ length: n }, () => []);
    for (const [a, b] of edges) {
        adj[a].push(b);
        adj[b].push(a);
    }

    const color = new Array(n).fill(-1);

    for (let start = 0; start < n; start++) {
        if (color[start] !== -1) continue;
        const queue = [start];
        color[start] = 0;

        while (queue.length) {
            const node = queue.shift();
            for (const neighbor of adj[node]) {
                if (color[neighbor] === -1) {
                    color[neighbor] = 1 - color[node];
                    queue.push(neighbor);
                } else if (color[neighbor] === color[node]) {
                    return [];
                }
            }
        }
    }

    return color;
}
