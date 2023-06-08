/// <reference path="NetscriptDefinitions.d.ts"/>

const INFILTRATION_FILE = 'infiltrations.txt';

/** @param {NS} ns */
export async function main(ns) {
  var infiltrations = []
  for(var l of ns.infiltration.getPossibleLocations()){
      var infil = ns.infiltration.getInfiltration(l.name);
      infiltrations.push(infil);  
  }
  infiltrations = infiltrations.sort((a, b) => a.difficulty - b.difficulty);
  infiltrations = infiltrations.map((infil) => "Location: "+infil.location.city+"."+infil.location.name+", Difficulty: "+infil.difficulty+", Reward: "+Math.floor(infil.reward.tradeRep));
  ns.write(INFILTRATION_FILE, infiltrations.join('\n'), 'w');
}