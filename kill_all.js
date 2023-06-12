import { get_hacked } from "./common";

export async function main(ns){
    var hacked = await get_hacked(ns, 'home', 'home');
    for(var h of hacked){
        ns.killall(h.hostname);
    }
}