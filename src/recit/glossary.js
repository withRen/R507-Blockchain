// Glossaire consultable a tout moment : on tape un mot (« nonce », « pow »...) et sa definition
// s'affiche. Les cinq termes du glossaire commun du sujet gardent leur definition mot pour mot ;
// les autres viennent des encarts du recit, pour qu'il n'y ait qu'une seule definition a tenir.
const unaccent = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae').replace(/[’']/g, ' ');
const keyOf = (title) => unaccent(title.replace(/\(.*?\)/g, '')).trim();

// Glossaire commun du sujet (MMI-R507), recopie a l'identique
const SUBJECT = [
  { title: 'Hash', def: 'Résultat de l’application d’une fonction de hachage à des données ; il sert notamment à produire une représentation de longueur fixe et à relier des blocs.', seq: 1 },
  { title: 'Empreinte cryptographique', def: 'Hash utilisé comme identifiant vérifiable de données. Elle est très sensible à une modification et ne permet pas, en pratique, de retrouver les données originales.', seq: 1, aliases: ['empreinte'] },
  { title: 'Immutabilité', def: 'Propriété pratique selon laquelle une donnée validée est très difficile à modifier sans rendre la falsification détectable et sans refaire accepter la modification par le réseau ; cela ne signifie pas qu’elle est physiquement impossible à changer.', seq: 3, aliases: ['immuable', 'falsification'] },
  { title: 'Nonce', def: 'Valeur, souvent numérique, modifiée pendant une recherche de preuve de travail afin d’obtenir un hash respectant une difficulté donnée.', seq: 1 },
  { title: 'Consensus', def: 'Mécanisme par lequel les participants d’un réseau décentralisé s’accordent sur les transactions et les blocs retenus comme valides.', seq: 6 }
];

// Quelques termes employes dans le recit sans encart propre
const EXTRA = [
  { title: 'Bloc', def: 'Un lot de transactions, accompagné du hash du bloc parent, d’un nonce et de son propre hash. Les blocs s’ajoutent les uns après les autres et forment la chaîne.', seq: 1 },
  { title: 'Hash du bloc parent', def: 'L’empreinte du bloc précédent, recopiée dans le bloc suivant. Si le passé change, ce lien ne correspond plus.', seq: 2, aliases: ['parent', 'bloc parent'] },
  { title: 'Fonction de hachage', def: 'Une fonction qui transforme n’importe quelles données en une empreinte de longueur fixe. Le récit utilise SHA-256, celle de Bitcoin : 64 caractères hexadécimaux.', seq: 1, aliases: ['sha-256', 'sha256', 'hachage'] },
  { title: 'Transaction', def: 'Un ordre de transfert signé, par exemple « Léa → Julien : 5 jetons ». Elle est créée, propagée aux nœuds, validée, incluse dans un bloc, puis confirmée.', seq: 7, aliases: ['tx'] },
  { title: 'Propagation', def: 'La diffusion d’une transaction ou d’un bloc de nœud en nœud, jusqu’à ce que tout le réseau l’ait reçu.', seq: 4 },
  { title: 'Mempool', def: 'La file d’attente des transactions valides qui ne sont pas encore incluses dans un bloc.', seq: 7 },
  { title: 'Minage', def: 'La recherche, par essais successifs, d’un nonce qui donne au bloc un hash respectant la difficulté. Le premier mineur qui le trouve propose son bloc au réseau.', seq: 5, aliases: ['mineur', 'miner'] }
];

const ALIASES = {
  'preuve de travail': ['pow', 'proof of work'],
  'preuve d enjeu': ['pos', 'proof of stake', 'enjeu', 'mise'],
  'preuve d autorite': ['poa', 'proof of authority', 'autorite'],
  'cle privee et signature': ['cle privee', 'signature', 'cle'],
  'noeud': ['noeuds', 'node'],
  'double depense': ['double spending', 'attaque'],
  'registre centralise': ['registre', 'centralise']
};
const FROM_STORY = new Set(['Glossaire', 'Notion', 'Le mot', 'Point de départ', 'PoW', 'PoS', 'PoA']);

function collect(sequences) {
  const map = new Map();
  const add = ({ title, def, seq, aliases = [], subject = false }) => {
    const key = keyOf(title);
    const had = map.get(key);
    if (had) {
      // Meme terme vu deux fois (PoW : la notion, puis la comparaison) : on garde les deux phrases
      if (!had.subject && !had.defs.includes(def)) had.defs.push(def);
      return;
    }
    map.set(key, { key, title: title.replace(/\s*\(.*?\)/, ''), defs: [def], seq, subject, words: [key, ...aliases.map(unaccent), ...(ALIASES[key] ?? [])] });
  };
  SUBJECT.forEach((t) => add({ ...t, subject: true }));
  sequences.forEach((s, i) => (s.TERMS ?? []).forEach((t) => {
    if (FROM_STORY.has(t.label)) add({ title: t.title, def: t.def, seq: i });
  }));
  EXTRA.forEach(add);
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

export function createGlossary({ sequences, onOpen, goTo }) {
  const dialog = document.querySelector('#glossary');
  const input = dialog.querySelector('input');
  const list = dialog.querySelector('.glo-list');
  const count = dialog.querySelector('.glo-count');
  const entries = collect(sequences);

  const items = entries.map((e) => {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = e.title;
    if (e.subject) {
      const tag = document.createElement('span');
      tag.textContent = 'Glossaire du sujet';
      h.append(tag);
    }
    li.append(h, ...e.defs.map((d) => Object.assign(document.createElement('p'), { textContent: d })));
    const where = sequences[e.seq];
    if (where && goTo) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = `Revoir dans le récit : ${where.name} ▸`;
      b.addEventListener('click', () => { dialog.close(); goTo(e.seq); });
      li.append(b);
    }
    list.append(li);
    return { e, li };
  });

  function filter() {
    const q = unaccent(input.value).trim();
    let shown = 0;
    // Le mot exact passe en tete : taper « nonce » montre d'abord la fiche Nonce
    const rank = ({ e }) => {
      if (!q) return 1;
      if (e.words.some((w) => w === q)) return 0;
      if (e.words.some((w) => w.startsWith(q) || w.includes(` ${q}`))) return 1;
      if (e.words.some((w) => w.includes(q))) return 2;
      if (e.defs.some((d) => unaccent(d).includes(q))) return 3;
      return 9;
    };
    const ranked = items.map((it) => ({ it, r: rank(it) })).sort((a, b) => a.r - b.r || a.it.e.title.localeCompare(b.it.e.title, 'fr'));
    ranked.forEach(({ it, r }, i) => {
      it.li.hidden = r === 9;
      it.li.classList.toggle('best', !!q && i === 0 && r < 2);
      if (!it.li.hidden) shown++;
      list.append(it.li);
    });
    count.textContent = q
      ? (shown ? `${shown} résultat${shown > 1 ? 's' : ''}` : 'Aucun terme ne correspond. Essaie « hash », « nonce » ou « consensus ».')
      : `${entries.length} termes`;
  }
  input.addEventListener('input', filter);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') list.querySelector('li:not([hidden])')?.scrollIntoView({ block: 'nearest' });
  });

  function open(query = '') {
    onOpen?.();
    input.value = query;
    filter();
    if (!dialog.open) dialog.showModal();
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    list.scrollTop = 0;
  }

  dialog.querySelector('.glo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  // G ou / ouvre le glossaire depuis n'importe ou dans le recit
  window.addEventListener('keydown', (e) => {
    const inField = e.target instanceof Element && e.target.matches('input, textarea, select, [contenteditable]');
    if (inField || e.metaKey || e.ctrlKey || e.altKey || dialog.open || document.querySelector('dialog[open]')) return;
    if (e.code === 'KeyG' || e.key === '/') { e.preventDefault(); open(); }
  });
  return { open, entries };
}
