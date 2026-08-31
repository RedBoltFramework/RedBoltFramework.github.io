const moduleGrid = document.getElementById('module-grid');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search');
const filterButtons = Array.from(document.querySelectorAll('.filter'));
let modules = [];
let activeCategory = 'all';

document.getElementById('year').textContent = new Date().getFullYear();

function element(tag, className, text) {
  const result = document.createElement(tag);
  if (className)
    result.className = className;
  if (text !== undefined)
    result.textContent = text;
  return result;
}

function sampleLink(module, sample) {
  if (!module.available)
    return element('span', 'sample-link disabled', sample.name);

  const link = element('a', 'sample-link', sample.name);
  link.href = `samples/?sample=${encodeURIComponent(`${module.slug}:${sample.id}`)}`;
  link.setAttribute('aria-label', `Launch ${sample.name} from ${module.name}`);
  return link;
}

function moduleCard(module, index) {
  const card = element('article', 'module-card');
  card.dataset.category = module.category;
  card.dataset.module = module.slug;

  const meta = element('div', 'module-meta');
  meta.append(element('span', 'module-number', String(index + 1).padStart(2, '0')));
  meta.append(element('span', 'module-category', module.category));
  meta.append(element('span', `module-status${module.available ? ' live' : ''}`, module.available ? 'Web live' : 'Not deployed'));
  card.append(meta);

  const titleRow = element('div', 'module-title-row');
  titleRow.append(element('h3', '', module.name));
  const repositoryLink = element('a', 'repo-link', '↗');
  repositoryLink.href = module.repository;
  repositoryLink.setAttribute('aria-label', `Open ${module.name} on GitHub`);
  titleRow.append(repositoryLink);
  card.append(titleRow);
  card.append(element('p', 'module-description', module.description));

  const sampleLabel = element('p', 'sample-label', `${module.samples.length} ${module.samples.length === 1 ? 'sample' : 'samples'}`);
  card.append(sampleLabel);
  const samples = element('div', 'sample-list');
  if (module.samples.length === 0)
    samples.append(element('span', 'sample-link disabled', 'No web sample'));
  else
    module.samples.forEach(sample => samples.append(sampleLink(module, sample)));
  card.append(samples);
  return card;
}

function render() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const visible = modules.filter(module => {
    const categoryMatches = activeCategory === 'all' || module.category === activeCategory;
    const text = `${module.name} ${module.description} ${module.samples.map(sample => sample.name).join(' ')}`.toLocaleLowerCase();
    return categoryMatches && text.includes(query);
  });

  moduleGrid.replaceChildren(...visible.map(module => moduleCard(module, modules.indexOf(module))));
  emptyState.hidden = visible.length !== 0;
}

filterButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  filterButtons.forEach(candidate => {
    const active = candidate === button;
    candidate.classList.toggle('active', active);
    candidate.setAttribute('aria-pressed', String(active));
  });
  render();
}));
searchInput.addEventListener('input', render);

try {
  const response = await fetch('catalog.json');
  if (!response.ok)
    throw new Error(`Catalog request failed with ${response.status}.`);
  modules = await response.json();
  document.getElementById('module-count').textContent = modules.length;
  document.getElementById('sample-count').textContent = modules.reduce((total, module) => total + module.samples.length, 0);
  render();
} catch (error) {
  console.error(error);
  moduleGrid.replaceChildren(element('p', 'catalog-loading', 'The module catalog is unavailable. Please try again later.'));
}
