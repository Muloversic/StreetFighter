import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`
  });

  for (let info in fighter) {
    if (info !== '_id' && info !== 'source') {
      const fighterInfoElement = createElement({
        tagName: 'p',
        className: `fighter-preview__text ${positionClassName}`
      });
	  
      fighterInfoElement.textContent = `${fighter[info]}:  ${info}`;
      fighterElement.append(fighterInfoElement);
    }

    if (info === 'source') {
      const attributes = {
        src: fighter[info],
        alt: 'fighter'
      };

      const fighterInfoElement = createElement({
        tagName: 'img',
        className: `fighter-preview__image ${positionClassName}`,
        attributes
      });

      fighterElement.append(fighterInfoElement);
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
