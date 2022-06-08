import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  window.addEventListener('keydown', (e) => {
    if (e.code === controls.PlayerOneAttack) {
      // first player attacks
      getDamage(firstFighter, null);
    }

    if (e.code === controls.PlayerOneBlock) {
      // first player defends
      getDamage(null, firstFighter);
    }

    if (e.code === controls.PlayerTwoAttack) {
      //  second attacks
      getDamage(secondFighter, null);
    }

    if (e.code === controls.PlayerTwoBlock) {
      // second defends
      getDamage(null, secondFighter);
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
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() * (3 - 1) + 1; // chance from 1 to 2
  const power = fighter.attack * criticalHitChance;
  console.log('attac', fighter);
  // return hit power
  return power;
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() * (3 - 1) + 1; // chance from 1 to 2
  const power = fighter.defense * dodgeChance;
  console.log('defence', fighter);
  // return block power
  return power;
}
