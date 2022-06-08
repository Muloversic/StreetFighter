import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  runOnKeys(
    (pressed) => {
      if (pressed.has(controls.PlayerOneAttack) && !pressed.has(controls.PlayerOneBlock)) {
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
      if (pressed.has(controls.PlayerTwoAttack) && !pressed.has(controls.PlayerTwoBlock)) {
        // second player attacks
        const playerNameElements = document.querySelectorAll('.arena___fighter-name');
        [...playerNameElements].forEach((playerNameElement) => {
          if (playerNameElement.textContent === firstFighter.name) {
            const healtBarElement = playerNameElement.nextElementSibling.children[0];
            firstFighter.health -= getDamage(secondFighter, null);
            healtBarElement.style.width = firstFighter.health + '%';
            if (firstFighter.health <= 0) {
              healtBarElement.style.width = 0 + '%';
              firstFighter.health = 0;
              return;
            }
          }
        });
      }
    },
    controls.PlayerOneAttack,
    controls.PlayerTwoAttack,
    controls.PlayerOneBlock,
    controls.PlayerTwoBlock
  );

  window.addEventListener('keydown', (e) => {
    // if (e.code === controls.PlayerOneAttack && e.code !== controls.PlayerOneBlock) {
    //   // first player attacks
    //   const playerNameElements = document.querySelectorAll('.arena___fighter-name');
    //   [...playerNameElements].forEach((playerNameElement) => {
    //     if (playerNameElement.textContent === secondFighter.name) {
    //       const healtBarElement = playerNameElement.nextElementSibling.children[0];
    //       secondFighter.health -= getDamage(firstFighter, null);
    //       healtBarElement.style.width = secondFighter.health + '%';
    //       if (secondFighter.health <= 0) {
    //         healtBarElement.style.width = 0 + '%';
    //         secondFighter.health = 0;
    //         return;
    //       }
    //     }
    //   });
    // }

    if (e.code === controls.PlayerOneBlock && e.code === controls.PlayerTwoAttack) {
      // first player defends
      //   console.log(e.code);
      //   getDamage(null, firstFighter);
    }

    if (e.code === controls.PlayerTwoAttack) {
      //  second attacks
      //   const playerNameElements = document.querySelectorAll('.arena___fighter-name');
      //   [...playerNameElements].forEach((playerNameElement) => {
      //     if (playerNameElement.textContent === firstFighter.name) {
      //       const healtBarElement = playerNameElement.nextElementSibling.children[0];
      //       firstFighter.health -= getDamage(secondFighter, null);
      //       healtBarElement.style.width = firstFighter.health + '%';
      //       if (firstFighter.health <= 0) {
      //         healtBarElement.style.width = 0 + '%';
      //         firstFighter.health = 0;
      //         return;
      //       }
      //     }
      //   });
    }

    if (e.code === controls.PlayerTwoBlock && e.code === controls.PlayerOneAttack) {
      // second defends
      //   getDamage(null, secondFighter);
      console.log('player one attack, second block');
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

function runOnKeys(func, ...codes) {
  let pressed = new Set();

  document.addEventListener('keydown', function (event) {
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
    // pressed.clear();
    func(pressed);
  });

  document.addEventListener('keyup', function (event) {
    pressed.delete(event.code);
  });
}
