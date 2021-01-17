import { showModal } from './modal';
import { createElement } from '../../helpers/domHelper';

export function showWinnerModal(fighter) {
  const bodyElement = createElement({ tagName: 'span', className: 'modal-text' });
  bodyElement.innerText = 'Close this modal window to start a new game!';

  const arg = {
    title: `The winner is ${fighter.name}`,
    bodyElement,
    onClose: () => {
      location.reload();
    },
  };

  showModal(arg);
}
