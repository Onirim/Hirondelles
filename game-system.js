// ══════════════════════════════════════════════════════════════
// Knave 2e Édition — Système de jeu
// ══════════════════════════════════════════════════════════════

const GAME_NAME     = 'Knave';
const GAME_SUBTITLE = '2e Édition';

// ── Caractéristiques ──────────────────────────────────────────
const ABILITY_KEYS   = ['FOR', 'DEX', 'CON', 'INT', 'SAG', 'CHA'];
const ABILITY_LABELS = () => [
  t('ability_for'), t('ability_dex'), t('ability_con'),
  t('ability_int'), t('ability_sag'), t('ability_cha'),
];

// ── État initial d'un personnage ──────────────────────────────
function freshState() {
  const abilities = {};
  ABILITY_KEYS.forEach(k => { abilities[k] = 0; });
  return {
    name:                  '',
    subtitle:              '',
    level:                 1,
    abilities,
    jobs:                  [],   // Métiers
    blessings:             [],   // Bénédictions
    recipes:               [],   // Recettes
    is_public:             false,
    illustration_url:      '',
    illustration_position: 0,
    tags:                  [],
    background:            '',
  };
}

// ── Calculs ───────────────────────────────────────────────────
function abilityBudget(state) {
  return Math.max(0, (state.level || 1) * 3);
}

function abilitySpent(state) {
  return ABILITY_KEYS.reduce((sum, k) => sum + (Number(state.abilities?.[k]) || 0), 0);
}


// ── Rendu carte roster ────────────────────────────────────────
function renderCharCardBody(c) {
  const level = c.level || 1;
  const abilities = c.abilities || {};

  const abilitiesHtml = ABILITY_KEYS.map((k, i) => {
    const val = Number(abilities[k]) || 0;
    return `<div class="card-attr">
      <div class="val">${val}</div>
      <div class="lbl">${ABILITY_LABELS()[i]}</div>
    </div>`;
  }).join('');

  return `
    <div class="card-name">${esc(c.name) || '—'}</div>
    ${c.subtitle ? `<div class="card-sub">${esc(c.subtitle)}</div>` : ''}
    <div class="card-rank">${t('card_level_label')} ${level}</div>
    <div class="card-attrs" style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin-top:12px">
      ${abilitiesHtml}
    </div>
  `;
}

// ── Rendu fiche complète ──────────────────────────────────────
function renderCharSheet(data) {
  const level     = data.level || 1;
  const abilities = data.abilities || {};

  // Caractéristiques
  const attrsHtml = ABILITY_KEYS.map((k, i) => {
    const val = Number(abilities[k]) || 0;
    return `<div class="preview-attr" style="text-align:center">
      <div class="lbl" style="font-family:var(--font-display);font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:6px">${ABILITY_LABELS()[i]}</div>
      <div class="val" style="font-family:var(--font-mono);font-size:28px;font-weight:700;line-height:1;color:var(--accent)">${val}</div>
    </div>`;
  }).join('');

  // Section générique (métiers / bénédictions / recettes)
  function renderItems(items, sectionKey) {
    const filtered = (items || []).filter(p => p.name);
    if (!filtered.length) return '';
    return `
      <div class="preview-section-title">${t(sectionKey)}</div>
      ${filtered.map(p => `
        <div class="preview-power">
          <div class="pow-body">
            <div class="pow-name">${esc(p.name)}</div>
            ${p.desc ? `<div class="pow-desc">${esc(p.desc)}</div>` : ''}
          </div>
          ${p.score ? `<div class="pow-cost" style="font-family:var(--font-mono);font-size:12px;color:var(--text3)">${p.score}</div>` : ''}
        </div>`).join('')}`;
  }

  const bgText = (data.background || '').trim();

  return `
    ${data.illustration_url
      ? `<img class="preview-illus" src="${esc(data.illustration_url)}" style="object-position:center ${data.illustration_position || 0}%" onclick="openLightbox('${esc(data.illustration_url)}')" alt="">`
      : ''}

    <div class="preview-header">
      <div class="preview-name">${esc(data.name) || '—'}</div>
      ${data.subtitle ? `<div class="preview-sub">${esc(data.subtitle)}</div>` : ''}
      <div class="preview-rank-badge">${t('card_level_label')} ${level}</div>
    </div>

    <div class="preview-section-title">${t('preview_section_abilities')}</div>
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:4px">
      ${attrsHtml}
    </div>
    <div style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3);margin-bottom:16px">
      ${t('abilities_budget_label')} : ${abilitySpent(data)} / ${abilityBudget(data)}
    </div>

    ${renderItems(data.jobs,      'preview_section_jobs')}
    ${renderItems(data.blessings, 'preview_section_blessings')}
    ${renderItems(data.recipes,   'preview_section_recipes')}

    ${bgText ? `
      <div class="preview-section-title">${t('preview_section_background')}</div>
      <div class="background-preview">${esc(bgText)}</div>` : ''}
  `;
}

// ── Traductions ───────────────────────────────────────────────
const GAME_I18N = {
  fr: {
    // Caractéristiques
    ability_for: 'FOR', ability_dex: 'DEX', ability_con: 'CON',
    ability_int: 'INT', ability_sag: 'SAG', ability_cha: 'CHA',
    ability_for_full: 'Force',        ability_dex_full: 'Dextérité',
    ability_con_full: 'Constitution', ability_int_full: 'Intelligence',
    ability_sag_full: 'Sagesse',      ability_cha_full: 'Charisme',

    // Carte
    card_level_label: 'Niveau',

    // Preview sections
    preview_section_abilities:  'Caractéristiques',
    preview_section_jobs:       'Métiers',
    preview_section_blessings:  'Bénédictions',
    preview_section_recipes:    'Recettes',
    preview_section_background: 'Historique',

    // Budget
    abilities_budget_label: 'Points utilisés',

    // Éditeur
    editor_section_level:      'Niveau',
    editor_section_abilities:  'Caractéristiques',
    editor_abilities_info:     'La somme doit être égale à 3 × niveau du personnage.',
    editor_section_jobs:       'Métiers',
    editor_section_blessings:  'Bénédictions',
    editor_section_recipes:    'Recettes',
    editor_item_name_ph:       'Nom',
    editor_item_desc_ph:       'Description…',
    editor_item_score_lbl:     'Niveau',
    editor_add_job:            '+ Ajouter un métier',
    editor_add_blessing:       '+ Ajouter une bénédiction',
    editor_add_recipe:         '+ Ajouter une recette',
    editor_section_background: 'Historique',
    editor_background_ph:      'Histoire du personnage, origines, motivations…',

    // Alertes
    alert_char_no_name: 'Donnez un nom au personnage.',
  },
  en: {
    ability_for: 'STR', ability_dex: 'DEX', ability_con: 'CON',
    ability_int: 'INT', ability_sag: 'WIS', ability_cha: 'CHA',
    ability_for_full: 'Strength',     ability_dex_full: 'Dexterity',
    ability_con_full: 'Constitution', ability_int_full: 'Intelligence',
    ability_sag_full: 'Wisdom',       ability_cha_full: 'Charisma',

    card_level_label: 'Level',

    preview_section_abilities:  'Abilities',
    preview_section_jobs:       'Jobs',
    preview_section_blessings:  'Blessings',
    preview_section_recipes:    'Recipes',
    preview_section_background: 'Background',

    abilities_budget_label: 'Points spent',

    editor_section_level:      'Level',
    editor_section_abilities:  'Abilities',
    editor_abilities_info:     'The sum must equal 3 × character level.',
    editor_section_jobs:       'Jobs',
    editor_section_blessings:  'Blessings',
    editor_section_recipes:    'Recipes',
    editor_item_name_ph:       'Name',
    editor_item_desc_ph:       'Description…',
    editor_item_score_lbl:     'Level',
    editor_add_job:            '+ Add job',
    editor_add_blessing:       '+ Add blessing',
    editor_add_recipe:         '+ Add recipe',
    editor_section_background: 'Background',
    editor_background_ph:      'Character history, origins, motivations…',

    alert_char_no_name: 'Please name the character.',
  },
};

Object.keys(GAME_I18N).forEach(lang => {
  if (TRANSLATIONS[lang]) Object.assign(TRANSLATIONS[lang], GAME_I18N[lang]);
});
