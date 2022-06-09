import { doc } from 'prettier';
import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  let isAllowedPlayerOneToCrit = true;
  let isAllowedPlayerTwoToCrit = true;
  runOnKeys((pressed) => {
    if (
      pressed.has(controls.PlayerOneAttack) &&
      !pressed.has(controls.PlayerOneBlock) &&
      !pressed.has(controls.PlayerTwoBlock)
    ) {
      // first player attacks
      const playerNameElements = document.querySelectorAll('.arena___fighter-name');
      [...playerNameElements].forEach((playerNameElement) => {
        if (playerNameElement.textContent === secondFighter.name) {
          const healtBarElement = playerNameElement.nextElementSibling.children[0];
          secondFighter.health -= getDamage(firstFighter, null);
          healtBarElement.style.width = secondFighter.health + '%';
          if (secondFighter.health <= 0) {
            healtBarElement.style.width = 0 + '%';
            secondFighter.health = 0;
            return;
          }
        }
      });
    }

    if (pressed.has(controls.PlayerOneAttack) && pressed.has(controls.PlayerTwoBlock)) {
      // first player attacks
      const playerNameElements = document.querySelectorAll('.arena___fighter-name');
      [...playerNameElements].forEach((playerNameElement) => {
        if (playerNameElement.textContent === secondFighter.name) {
          const healtBarElement = playerNameElement.nextElementSibling.children[0];
          secondFighter.health -= getDamage(firstFighter, null) - getDamage(null, secondFighter);
          healtBarElement.style.width = secondFighter.health + '%';
          if (secondFighter.health <= 0) {
            healtBarElement.style.width = 0 + '%';
            secondFighter.health = 0;
            return;
          }
        }
      });
    }

    if (
      pressed.has(controls.PlayerTwoAttack) &&
      !pressed.has(controls.PlayerTwoBlock) &&
      !pressed.has(controls.PlayerOneBlock)
    ) {
      // second player attacks
      const playerNameElements = document.querySelectorAll('.arena___fighter-name');
      [...playerNameElements].forEach((playerNameElement) => {
        if (playerNameElement.textContent === firstFighter.name) {
          const healtBarElement = playerNameElement.nextElementSibling.children[0];
          firstFighter.health -= getDamage(secondFighter, null);
          console.log('clear damage', getDamage(secondFighter, null));
          healtBarElement.style.width = firstFighter.health + '%';
          if (firstFighter.health <= 0) {
            healtBarElement.style.width = 0 + '%';
            firstFighter.health = 0;
            return;
          }
        }
      });
    }

    if (pressed.has(controls.PlayerTwoAttack) && pressed.has(controls.PlayerOneBlock)) {
      // second player attacks
      const playerNameElements = document.querySelectorAll('.arena___fighter-name');
      [...playerNameElements].forEach((playerNameElement) => {
        if (playerNameElement.textContent === firstFighter.name) {
          const healtBarElement = playerNameElement.nextElementSibling.children[0];
          firstFighter.health -= getDamage(secondFighter, null) - getDamage(null, firstFighter);
          console.log('blocked damage', getDamage(secondFighter, null) - getDamage(null, firstFighter));

          healtBarElement.style.width = firstFighter.health + '%';
          if (firstFighter.health <= 0) {
            healtBarElement.style.width = 0 + '%';
            firstFighter.health = 0;
            return;
          }
        }
      });
    }

    const didPlayerOneCriticalCombination = controls.PlayerOneCriticalHitCombination.every((key) => pressed.has(key));
    const didPlayerTwoCriticalCombination = controls.PlayerTwoCriticalHitCombination.every((key) => pressed.has(key));

    if (isAllowedPlayerOneToCrit) {
      if (didPlayerOneCriticalCombination) {
        isAllowedPlayerOneToCrit = false;
        const playerNameElements = document.querySelectorAll('.arena___fighter-name');
        [...playerNameElements].forEach((playerNameElement) => {
          if (playerNameElement.textContent === secondFighter.name) {
            const healtBarElement = playerNameElement.nextElementSibling.children[0];
            secondFighter.health -= getDamage(firstFighter, null) * 2;
            healtBarElement.style.width = secondFighter.health + '%';
            if (secondFighter.health <= 0) {
              healtBarElement.style.width = 0 + '%';
              secondFighter.health = 0;
              return;
            }
          }
        });

        pressed.clear();
        setTimeout(() => {
          isAllowedPlayerOneToCrit = true;
        }, 10000);
      }
    }

    if (isAllowedPlayerTwoToCrit) {
      if (didPlayerTwoCriticalCombination) {
        isAllowedPlayerTwoToCrit = false;
        const playerNameElements = document.querySelectorAll('.arena___fighter-name');
        [...playerNameElements].forEach((playerNameElement) => {
          if (playerNameElement.textContent === firstFighter.name) {
            const healtBarElement = playerNameElement.nextElementSibling.children[0];
            firstFighter.health -= getDamage(secondFighter, null) * 2;
            healtBarElement.style.width = firstFighter.health + '%';
            if (firstFighter.health <= 0) {
              healtBarElement.style.width = 0 + '%';
              firstFighter.health = 0;
              return;
            }
          }
        });

        pressed.clear();
        setTimeout(() => {
          isAllowedPlayerTwoToCrit = true;
        }, 10000);
      }
    }
  });

  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
  });
}

export function getDamage(attacker, defender) {
  if (attacker) {
    return getHitPower(attacker);
  }

  if (defender) {
    return getBlockPower(defender);
  }

  if (getBlockPower(defender) > getHitPower(attacker)) {
    return 0;
  }
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() * (3 - 1) + 1; // chance from 1 to 2
  const power = fighter.attack * criticalHitChance;
  //   console.log('attac', fighter);
  // return hit power
  return power;
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() * (3 - 1) + 1; // chance from 1 to 2
  const power = fighter.defense * dodgeChance;
  //   console.log('defence', fighter);
  // return block power
  return power;
}

function runOnKeys(func) {
  let pressed = new Set();

  document.addEventListener('keydown', function (event) {
    event.preventDefault();
    pressed.add(event.code);
    // for (let code of codes) {
    //   // все ли клавиши из набора нажаты?
    //   if (!pressed.has(code)) {
    //     return;
    //   }
    // }

    // да, все
    // во время показа alert, если посетитель отпустит клавиши - не возникнет keyup
    // при этом JavaScript "пропустит" факт отпускания клавиш, а pressed[keyCode] останется true
    // чтобы избежать "залипания" клавиши -- обнуляем статус всех клавиш, пусть нажимает всё заново

    func(pressed);
  });

  document.addEventListener('keyup', function (event) {
    pressed.delete(event.code);
  });
}
