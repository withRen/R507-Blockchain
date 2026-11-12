// Les sources de la sequence en cours, dans une fenetre : on ne quitte plus le recit.
// Le contenu vient de sources.html, qui reste la seule liste a tenir a jour.
export function createSourcesPopup({ onOpen } = {}) {
  const dialog = document.querySelector('#sources');
  const body = dialog.querySelector('.sources-body');
  const title = dialog.querySelector('h2');
  let page = null;
  const load = () => {
    page ??= fetch('./sources.html')
      .then((r) => r.text())
      .then((html) => new DOMParser().parseFromString(html, 'text/html'));
    return page;
  };

  async function open(idx, name) {
    onOpen?.();
    const one = idx >= 1 && idx <= 7; // une notion : seulement ses sources
    title.textContent = one ? `Sources · ${name}` : 'Sources du parcours';
    body.textContent = 'Chargement…';
    dialog.showModal();
    try {
      const doc = await load();
      const found = one ? [doc.querySelector(`#ch${idx}`)] : [...doc.querySelectorAll('section.chapter')];
      const nodes = found.filter(Boolean).map((s) => {
        const copy = document.importNode(s, true);
        copy.removeAttribute('id');
        if (one) copy.querySelector('h2')?.remove();
        else copy.querySelector('h2')?.replaceWith(Object.assign(document.createElement('h3'), { textContent: s.querySelector('h2').textContent }));
        return copy;
      });
      body.replaceChildren(...nodes);
    } catch {
      body.textContent = 'Impossible de charger les sources ici. La page complète reste accessible ci-dessous.';
    }
  }

  dialog.querySelector('.sources-close').addEventListener('click', () => dialog.close());
  // Un clic sur le fond sombre ferme la fenetre
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  return { open };
}
