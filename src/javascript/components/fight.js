import { controls } from '../../constants/controls';

import { createElement } from '../helpers/domHelper';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const {
      PlayerOneAttack,
      PlayerOneBlock,
      PlayerTwoAttack,
      PlayerTwoBlock,
      PlayerOneCriticalHitCombination,
      PlayerTwoCriticalHitCombination,
    } = controls;
    const indicatorBars = document.querySelectorAll('.arena___fighter-indicator');
    const firstHealthIndicator = document.getElementById('left-fighter-indicator');
    const secondHealthIndicator = document.getElementById('right-fighter-indicator');

    let pressed = new Set();
    let firstHealth = firstFighter.health;
    let secondHealth = secondFighter.health;

    let criticalFirstTime = Date.now();
    let criticalFirstOnStart = true;
    let criticalSecondTime = Date.now();
    let criticalSecondOnStart = true;

    document.addEventListener('keydown', (e) => {
      const now = Date.now();
      pressed.add(e.code);

      // first fighter block && atack
      if (pressed.has(PlayerOneAttack) && pressed.has(PlayerOneBlock)) {
        indicatorBars[0].append(createTextBar('Why are you blocking yourself?'));

        return;
      }

      // critical first fighter
      if (now - criticalFirstTime > 10000 || criticalFirstOnStart) {
        if (
          pressed.has(PlayerOneCriticalHitCombination[0]) &&
          pressed.has(PlayerOneCriticalHitCombination[1]) &&
          pressed.has(PlayerOneCriticalHitCombination[2])
        ) {
          let damage = secondHealth;
          criticalFirstTime = Date.now();
          criticalFirstOnStart = false;
          secondHealth -= getDamage(firstFighter, { defense: 0 }, true);
          damage -= secondHealth;

          if (secondHealth / secondFighter.health < 0) {
            secondHealthIndicator.style.width = '0%';
          } else {
            secondHealthIndicator.style.width = (secondHealth / secondFighter.health) * 100 + '%';
          }

          indicatorBars[1].append(createTextBar(`Critical!!! ${Math.round(damage)}`));
          getStrike(1);
        }
      }

      // first fighter without block
      if (pressed.has(PlayerOneAttack) && !pressed.has(PlayerTwoBlock)) {
        let damage = secondHealth;
        secondHealth -= getDamage(firstFighter, secondFighter);
        damage -= secondHealth;

        if (secondHealth / secondFighter.health < 0) {
          secondHealthIndicator.style.width = '0%';
        } else {
          secondHealthIndicator.style.width = (secondHealth / secondFighter.health) * 100 + '%';
        }

        indicatorBars[1].append(createTextBar(`${Math.round(damage)}`));
        getStrike(1);
      }

      // fist fighter with block
      if (pressed.has(PlayerOneAttack) && pressed.has(PlayerTwoBlock)) {
        let damage = secondHealth;
        secondHealth -= getDamage({ attack: 0 }, secondFighter);
        damage -= secondHealth;

        if (secondHealth / secondFighter.health < 0) {
          secondHealthIndicator.style.width = '0%';
        } else {
          secondHealthIndicator.style.width = (secondHealth / secondFighter.health) * 100 + '%';
        }

        indicatorBars[1].append(createTextBar(`Blocked! ${Math.round(damage)}`));
        getStrike(1);
      }

      // second fighter block && atack
      if (pressed.has(PlayerTwoAttack) && pressed.has(PlayerTwoBlock)) {
        indicatorBars[1].append(createTextBar('Why are you blocking yourself?'));

        return;
      }

      // critical second fighter
      if (now - criticalSecondTime > 10000 || criticalSecondOnStart) {
        if (
          pressed.has(PlayerTwoCriticalHitCombination[0]) &&
          pressed.has(PlayerTwoCriticalHitCombination[1]) &&
          pressed.has(PlayerTwoCriticalHitCombination[2])
        ) {
          let damage = firstHealth;
          criticalSecondTime = Date.now();
          criticalSecondOnStart = false;
          firstHealth -= getDamage(secondFighter, { defense: 0 }, true);
          damage -= firstHealth;

          if (firstHealth / firstFighter.health < 0) {
            firstHealthIndicator.style.width = '0%';
          } else {
            firstHealthIndicator.style.width = (firstHealth / firstFighter.health) * 100 + '%';
          }

          indicatorBars[0].append(createTextBar(`Critical!!! ${Math.round(damage)}`));
          getStrike(0);
        }
      }

      // second fighter without block
      if (pressed.has(PlayerTwoAttack) && !pressed.has(PlayerOneBlock)) {
        let damage = firstHealth;
        firstHealth -= getDamage(secondFighter, firstFighter);
        damage -= firstHealth;

        if (firstHealth / firstFighter.health < 0) {
          firstHealthIndicator.style.width = '0%';
        } else {
          firstHealthIndicator.style.width = (firstHealth / firstFighter.health) * 100 + '%';
        }

        indicatorBars[0].append(createTextBar(`${Math.round(damage)}`));
        getStrike(0);
      }

      // second fighter with block
      if (pressed.has(PlayerTwoAttack) && pressed.has(PlayerOneBlock)) {
        let damage = firstHealth;
        firstHealth -= getDamage({ attack: 0 }, firstFighter);
        damage -= firstHealth;

        if (firstHealth / firstFighter.health < 0) {
          firstHealthIndicator.style.width = '0%';
        } else {
          firstHealthIndicator.style.width = (firstHealth / firstFighter.health) * 100 + '%';
        }

        indicatorBars[0].append(createTextBar(`Blocked! ${Math.round(damage)}`));
        getStrike(0);
      }

      if (secondHealth <= 0) {
        resolve(firstFighter);
      }

      if (firstHealth <= 0) {
        resolve(secondFighter);
      }
    });

    document.addEventListener('keyup', function (event) {
      pressed.delete(event.code);
    });
  });
}

function getStrike(num) {
  const fighterPic = document.querySelectorAll('.fighter-preview___img');
  fighterPic[num].style.opacity = '0.6';

  setTimeout(() => {
    fighterPic[num].style.opacity = '1';
  }, 100);
}

function randomNum() {
  return 1 + Math.random();
}

function createTextBar(text) {
  const arg = { tagName: 'span', className: 'arena___fighter-text text' };
  const element = createElement(arg);

  element.innerText = text;

  setTimeout(() => {
    element.remove();
  }, 500);
  return element;
}

export function getDamage(attacker, defender, crit = false) {
  const damage = getHitPower(attacker, crit) - getBlockPower(defender);
  if (damage < 0) {
    return 0;
  } else {
    return damage;
  }
}

export function getHitPower(fighter, crit) {
  if (crit) {
    return fighter.attack * 2;
  } else {
    return fighter.attack * randomNum();
  }
}

export function getBlockPower(fighter) {
  return fighter.defense * randomNum();
}
