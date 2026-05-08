/** @param {NS} ns */

export async function main(ns) {
  while (true) {
    // Get a list of all darknet hostnames directly connected to the current server
    const nearbyServers = ns.dnet.probe();

    // Attempt to authenticate with each of the nearby servers, and spread this script to them
    for (const hostname of nearbyServers) {
      const authenticationSuccessful = await serverSolver(ns, hostname);
      if (!authenticationSuccessful) {
        continue; // If we failed to auth, just move on to the next server
      }

      // If we have successfully authenticated, we can now copy and run this script on the target server
      ns.scp(ns.getScriptName(), hostname);
      ns.exec(ns.getScriptName(), hostname, {
        preventDuplicates: true, // This prevents running multiple copies of this script
      });
    }
    if (ns.dnet.isDarknetServer()) {
      if (ns.dnet.getBlockedRam() > 0) {
        await ns.dnet.memoryReallocation();
      }

      const files = ns.ls();

      for (const other in files) {
        if (files[other].includes(".cache")) {
          ns.dnet.openCache(files[other]);
        } else if (!files[other].includes(".cache") && !files[other].includes(".js") && !files[other].includes(".exe") && !files[other].includes(".cct")) {
          //TODO: We should figure out how to prevent these files from overwritting each other
          ns.scp(files[other], "home");
        } else if (files[other].includes(".exe")) {
          ns.dnet.unleashStormSeed();
        }
      }

      await ns.dnet.labradar();
      await ns.dnet.labreport();

      // TODO: take advantage of the extra ram on darknet servers to run ns.dnet.phishingAttack calls for money
      await ns.dnet.phishingAttack();
    }
    await ns.sleep(5000);
  }
}

/** Attempts to authenticate with the specified server using the Darknet API.
 * @param  NS} ns
 * @param  string} hostname - the name of the server to attempt to authorize on
 */
export const serverSolver = async (ns, hostname) => {
  // Get key info about the server, so we know what kind it is and how to authenticate with it
  const details = ns.dnet.getServerAuthDetails(hostname);
  if (!details.isConnectedToCurrentServer || !details.isOnline) {
    // If the server isn't connected or is offline, we can't authenticate
    return false;
  }

  // If you are already authenticated to that server with this script, you don't need to do it again
  if (details.hasSession) {
    return true;
  }

  switch (details.modelId) {
    case "ZeroLogon":
      return authenticateWithNoPassword(ns, hostname);

    case "DeskMemo_3.1":
      return authenticateWithPassword(ns, hostname, details.passwordHint.slice(details.passwordHint.length - details.passwordLength))

    case "FreshInstall_1.0": // defaults
      if (details.passwordLength === 4) {
        return authenticateWithPassword(ns, hostname, "0000");
      }
      else if (details.passwordLength === 5) {
        if (details.passwordFormat == "numeric") {
          return authenticateWithPassword(ns, hostname, "12345");
        }
        return authenticateWithPassword(ns, hostname, "admin");
      }
      return authenticateWithPassword(ns, hostname, "password");

    case "CloudBlare(tm)": // numbers to prove you're human
      return authenticateWithPassword(ns, hostname, details.data.replace(/\D/g, ''))

    case "AccountsManager_4.2": {
      // Password is a number in [0, 10^length - 1], zero-padded to passwordLength digits.
      // result.data on failure indicates direction ("Higher", "Lower") to guide our binary search.
      const max = Math.pow(10, details.passwordLength) - 1;
      let low = 0, high = max;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const guess = String(mid).padStart(details.passwordLength, '0');
        const result = await ns.dnet.authenticate(hostname, guess);
        if (result.success) return true;
        const hint = String(result.data).toLowerCase();
        if (hint.includes("high")) {
          high = mid - 1;
        } else if (hint.includes("low")) {
          low = mid + 1;
        } else {
          return false; // unrecognized hint, bail
        }
      }
      return false;
    }

    case "Laika4": {
      // Password is a dog name chosen by length. fido and spot are both 4 chars, so try both.
      const by_length = { 3: ["max"], 4: ["fido", "spot"], 5: ["rover"] };
      for (const password of by_length[details.passwordLength] ?? []) {
        if (await authenticateWithPassword(ns, hostname, password)) return true;
      }
      return false;
    }

    case "BellaCuore":
      // Password is provided as Roman numerals in details.data; convert to Arabic digits.
      return authenticateWithPassword(ns, hostname, String(roman_to_arabic(details.data)));

    case "Pr0verFl0":
      //We just need to overflow the password buffer, so just send a string of As at least 2xdetails.data
      const guess = "A".repeat(details.passwordLength * 2);
      return authenticateWithPassword(ns, hostname, guess);

    case "OctantVoxel": {
      // data is "base,value" e.g. "16,FF" → parseInt("FF", 16) = 255
      const [base, value] = details.data.split(",");
      return authenticateWithPassword(ns, hostname, String(parseInt(value.trim(), parseInt(base.trim(), 10))));
    }

    // TODO: handle other models of darknet servers here

    // TODO: get recent server logs with `await ns.dnet.heartbleed(hostname)` for more detailed logging on failed auth attempts

    default:
    // We could try common passwords; robert, thomas, hockey, ranger, daniel, starwars, 112233, george, computer, michelle, jessica, pepper, 1111, zxcvbn, 555555
      console.log(`Unrecognized modelId: ${details.modelId}`);
      return false;
  }
};

/** Authenticates on 'ZeroLogon' type servers, which always have an empty password.
 *  @para  {NS} ns
 * @param {string} hostname - the name of the server to attempt to authorize on
 */
const authenticateWithNoPassword = async (ns, hostname) => {
  const result = await ns.dnet.authenticate(hostname, "");
  // TODO: store discovered passwords somewhere safe, in case we need them later
  return result.success;
};

const authenticateWithPassword = async (ns, hostname, password) => {
  const result = await ns.dnet.authenticate(hostname, password);
  return result.success;
}

function roman_to_arabic(roman) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const curr = values[roman[i]];
    const next = values[roman[i + 1]];
    result += (next && curr < next) ? -curr : curr;
  }
  return result;
}