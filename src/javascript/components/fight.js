import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  let isAllowedPlayerOneToCrit = true;
  let isAllowedPlayerTwoToCrit = true;
  let pressed = new Set();
  document.addEventListener('keydown', function (event) {
    pressed.add(event.code);
    doDamage(pressed);
  });

  document.addEventListener('keyup', function (event) {
    pressed.delete(event.code);
  });

  function doDamage(pressed) {
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
      pressed.clear();
    }

    if (pressed.has(controls.PlayerOneAttack) && pressed.has(controls.PlayerTwoBlock)) {
      // first player attacks
      const playerNameElements = document.querySelectorAll('.arena___fighter-name');
      [...playerNameElements].forEach((playerNameElement) => {
        if (playerNameElement.textContent === secondFighter.name) {
          const healtBarElement = playerNameElement.nextElementSibling.children[0];
          const damageFromEnemy = getDamage(firstFighter, null) - getDamage(null, secondFighter);
          const blockedDamage = damageFromEnemy <= 0 ? 0 : damageFromEnemy;
          secondFighter.health -= blockedDamage;
          healtBarElement.style.width = secondFighter.health + '%';
          if (secondFighter.health <= 0) {
            healtBarElement.style.width = 0 + '%';
            secondFighter.health = 0;
            return;
          }
        }
      });
      pressed.clear();
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
          healtBarElement.style.width = firstFighter.health + '%';
          if (firstFighter.health <= 0) {
            healtBarElement.style.width = 0 + '%';
            firstFighter.health = 0;
            return;
          }
        }
      });
      pressed.clear();
    }

    if (pressed.has(controls.PlayerTwoAttack) && pressed.has(controls.PlayerOneBlock)) {
      // second player attacks
      const playerNameElements = document.querySelectorAll('.arena___fighter-name');
      [...playerNameElements].forEach((playerNameElement) => {
        if (playerNameElement.textContent === firstFighter.name) {
          const healtBarElement = playerNameElement.nextElementSibling.children[0];
          const damageFromEnemy = getDamage(secondFighter, null) - getDamage(null, firstFighter);
          const blockedDamage = damageFromEnemy < 0 ? 0 : damageFromEnemy;
          firstFighter.health -= blockedDamage;
          healtBarElement.style.width = firstFighter.health + '%';
          if (firstFighter.health <= 0) {
            healtBarElement.style.width = 0 + '%';
            firstFighter.health = 0;
            return;
          }
        }
      });
      pressed.clear();
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

    if (firstFighter.health === 0 || secondFighter.health === 0) {
      fight(firstFighter, secondFighter);
      return;
    }
  }

  return new Promise((resolve) => {
    if (firstFighter.health === 0) resolve(secondFighter);
    if (secondFighter.health === 0) {
      console.log('shold be resolve');
      resolve(firstFighter);
    }
  });
}

export function getDamage(attacker, defender) {
  if (attacker) {
    return getHitPower(attacker);
  }

  if (defender) {
    return getBlockPower(defender);
  }
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() * (3 - 1) + 1; // chance from 1 to 2
  const power = fighter.attack * criticalHitChance;
  // return hit power
  return power;
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() * (3 - 1) + 1; // chance from 1 to 2
  const power = fighter.defense * dodgeChance;
  // return block power
  return power;
}
