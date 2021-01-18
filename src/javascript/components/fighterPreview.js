import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  function createFighterPreviewImage(fighter) {
    const attributes = {
      src: fighter.source,
      title: fighter.name,
      alt: fighter.name,
    };

    return createElement({
      tagName: 'img',
      className: 'fighter-preview___fighter',
      attributes,
    });
  }

  function createFighterPreviewInfo(fighter) {
    const element = createElement({
      tagName: 'div',
      className: 'fighter-preview___stats',
    });

    for (let key in fighter) {
      const text = createElement({
        tagName: 'p',
        className: 'fighter-preview___text',
      });

      if (key !== 'source' && key !== '_id') {
        text.innerText = `${key} - ${fighter[key]}`;
        element.append(text);
      }
    }

    return element;
  }

  if (fighter) {
    fighterElement.append(createFighterPreviewImage(fighter));
    fighterElement.append(createFighterPreviewInfo(fighter));
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name,
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
