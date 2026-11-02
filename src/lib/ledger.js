import { createMiner } from './blockchain.js';

// Le site applique lui-meme ce qu'il explique : chaque chapitre est un bloc.
// Son empreinte depend de son titre ET de l'empreinte du chapitre precedent,
// et on cherche un nonce pour qu'elle commence par "00" (minage miniature).
export function writeLedgerHeads() {
  let parent = '0'.repeat(64);
  document.querySelectorAll('.entry-head[data-block]').forEach((head) => {
    const n = Number(head.dataset.block);
    const title = head.closest('.chapter')?.dataset.title || '';
    const block = { index: n, parent, data: title, nonce: 0 };
    const miner = createMiner(block, 2);
    while (!miner.step(5000));
    const cut = (h) => `${h.slice(0, 6)}…${h.slice(-4)}`;
    head.innerHTML = `
      <p class="head-id"><span>Bloc ${String(n).padStart(2, '0')}</span><span>nonce ${block.nonce}</span></p>
      <p class="head-hashes">
        <span title="${parent}">lien <code>${cut(parent)}</code></span>
        <span title="${block.hash}">empreinte <code>${cut(block.hash)}</code></span>
      </p>`;
    parent = block.hash;
  });
}
