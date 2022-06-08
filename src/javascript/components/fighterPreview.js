import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`
  });

  let fighterName = '';
  let fighterHealth = 0;
  let fighterAttack = 0;
  let fighterDefense = 0;
  let fighterImage = '';

  if (fighter) {
    for (let info of fighter) {
      if (info[0] !== '_id' && info[0] !== 'source') {
        const fighterNameElement = createElement({
          tagName: 'p',
          className: `fighter-preview__text ${positionClassName}`
        });

        fighterNameElement.textContent = `${info[0]}:  ${info[1]}`;
        fighterElement.append(fighterNameElement);
      }

      if (info[0] === 'source') {
        const attributes = {
          src: info[1],
          alt: 'fighter'
        };

        const fighterNameElement = createElement({
          tagName: 'img',
          className: `fighter-preview__image ${positionClassName}`,
          attributes
        });

        fighterNameElement.textContent = info[1];
        fighterElement.append(fighterNameElement);
      }
    }
  }

  // todo: show fighter info (image, name, health, etc.)
  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes
  });

  return imgElement;
}
