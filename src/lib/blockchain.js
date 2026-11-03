import { sha256 } from './sha256.js';

// Modele simplifie d'un bloc. Un vrai en-tete Bitcoin contient aussi la version,
// la racine de Merkle des transactions, l'horodatage et la cible ("bits").
export function hashBlock(block) {
  return sha256(`${block.index}|${block.parent}|${block.data}|${block.nonce}`);
}

export function meetsDifficulty(hash, difficulty) {
  for (let i = 0; i < difficulty; i++) {
    if (hash.charCodeAt(i) !== 48) return false; // '0'
  }
  return true;
}

// Mineur incremental : step(n) teste n nonces puis rend la main, ce qui
// permet d'animer la recherche image par image sans bloquer le navigateur.
export function createMiner(block, difficulty) {
  block.nonce = 0;
  const miner = {
    attempts: 0,
    found: false,
    lastHash: '',
    step(n) {
      for (let i = 0; i < n && !miner.found; i++) {
        const hash = hashBlock(block);
        miner.attempts++;
        miner.lastHash = hash;
        if (meetsDifficulty(hash, difficulty)) {
          block.hash = hash;
          miner.found = true;
        } else {
          block.nonce++;
        }
      }
      return miner.found;
    }
  };
  return miner;
}

// Probabilite qu'un attaquant rattrape la chaine honnete (Nakamoto 2008, section 11).
export function attackerSuccessProbability(q, z) {
  const p = 1 - q;
  if (q >= p) return 1;
  const lambda = z * (q / p);
  let sum = 1;
  let poisson = Math.exp(-lambda);
  for (let k = 0; k <= z; k++) {
    if (k > 0) poisson *= lambda / k;
    sum -= poisson * (1 - Math.pow(q / p, z - k));
  }
  return Math.max(0, sum);
}
