import { useMemo, useState } from 'react'

type ItemType =
  | 'helmet'
  | 'chestplate'
  | 'leggings'
  | 'boots'
  | 'elytra'
  | 'sword'
  | 'axe'
  | 'pickaxe'
  | 'shovel'
  | 'hoe'
  | 'bow'
  | 'crossbow'
  | 'trident'
  | 'fishing_rod'
  | 'mace'
  | 'shears'
  | 'shield'

interface Enchant {
  name: string
  source: 'Vanilla' | 'ExcellentEnchants'
  category: 'Armor' | 'Weapon' | 'Tool' | 'Bow' | 'Fishing' | 'Universal'
  maxLevel: number
  items: ItemType[]
  incompatible: string[]
  weight: number
  summary: string
}

interface SelectedEnchant {
  name: string
  level: number
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
const toRoman = (value: number) => ROMAN[value] || String(value)

const VANILLA: Enchant[] = [
  { name: 'Protection', source: 'Vanilla', category: 'Armor', maxLevel: 4, items: ['helmet', 'chestplate', 'leggings', 'boots'], incompatible: ['Fire Protection', 'Blast Protection', 'Projectile Protection'], weight: 1, summary: 'General damage reduction.' },
  { name: 'Fire Protection', source: 'Vanilla', category: 'Armor', maxLevel: 4, items: ['helmet', 'chestplate', 'leggings', 'boots'], incompatible: ['Protection', 'Blast Protection', 'Projectile Protection'], weight: 2, summary: 'Extra fire damage reduction.' },
  { name: 'Blast Protection', source: 'Vanilla', category: 'Armor', maxLevel: 4, items: ['helmet', 'chestplate', 'leggings', 'boots'], incompatible: ['Protection', 'Fire Protection', 'Projectile Protection'], weight: 4, summary: 'Extra explosion protection.' },
  { name: 'Projectile Protection', source: 'Vanilla', category: 'Armor', maxLevel: 4, items: ['helmet', 'chestplate', 'leggings', 'boots'], incompatible: ['Protection', 'Fire Protection', 'Blast Protection'], weight: 2, summary: 'Extra projectile protection.' },
  { name: 'Respiration', source: 'Vanilla', category: 'Armor', maxLevel: 3, items: ['helmet'], incompatible: [], weight: 4, summary: 'Breathe underwater longer.' },
  { name: 'Aqua Affinity', source: 'Vanilla', category: 'Armor', maxLevel: 1, items: ['helmet'], incompatible: [], weight: 4, summary: 'Mine faster underwater.' },
  { name: 'Thorns', source: 'Vanilla', category: 'Armor', maxLevel: 3, items: ['helmet', 'chestplate', 'leggings', 'boots'], incompatible: [], weight: 4, summary: 'Damages attackers.' },
  { name: 'Depth Strider', source: 'Vanilla', category: 'Armor', maxLevel: 3, items: ['boots'], incompatible: ['Frost Walker'], weight: 2, summary: 'Move faster underwater.' },
  { name: 'Frost Walker', source: 'Vanilla', category: 'Armor', maxLevel: 2, items: ['boots'], incompatible: ['Depth Strider', 'Flame Walker'], weight: 4, summary: 'Freeze water underfoot.' },
  { name: 'Feather Falling', source: 'Vanilla', category: 'Armor', maxLevel: 4, items: ['boots'], incompatible: ['Rebound'], weight: 1, summary: 'Reduces fall damage.' },
  { name: 'Soul Speed', source: 'Vanilla', category: 'Armor', maxLevel: 3, items: ['boots'], incompatible: [], weight: 4, summary: 'Move faster on soul blocks.' },
  { name: 'Swift Sneak', source: 'Vanilla', category: 'Armor', maxLevel: 3, items: ['leggings'], incompatible: [], weight: 4, summary: 'Sneak faster.' },
  { name: 'Density', source: 'Vanilla', category: 'Weapon', maxLevel: 5, items: ['mace'], incompatible: ['Breach'], weight: 4, summary: 'More smash damage from height.' },
  { name: 'Breach', source: 'Vanilla', category: 'Weapon', maxLevel: 4, items: ['mace'], incompatible: ['Density'], weight: 4, summary: 'Reduces armor effectiveness on smash attacks.' },
  { name: 'Wind Burst', source: 'Vanilla', category: 'Weapon', maxLevel: 3, items: ['mace'], incompatible: [], weight: 4, summary: 'Launch upward after smash attack.' },
  { name: 'Sharpness', source: 'Vanilla', category: 'Weapon', maxLevel: 5, items: ['sword', 'axe'], incompatible: ['Smite', 'Bane of Arthropods'], weight: 1, summary: 'Extra melee damage.' },
  { name: 'Smite', source: 'Vanilla', category: 'Weapon', maxLevel: 5, items: ['sword', 'axe'], incompatible: ['Sharpness', 'Bane of Arthropods'], weight: 2, summary: 'Extra damage to undead.' },
  { name: 'Bane of Arthropods', source: 'Vanilla', category: 'Weapon', maxLevel: 5, items: ['sword', 'axe'], incompatible: ['Sharpness', 'Smite'], weight: 2, summary: 'Extra damage to arthropods.' },
  { name: 'Knockback', source: 'Vanilla', category: 'Weapon', maxLevel: 2, items: ['sword'], incompatible: [], weight: 2, summary: 'Knocks targets back.' },
  { name: 'Fire Aspect', source: 'Vanilla', category: 'Weapon', maxLevel: 2, items: ['sword'], incompatible: ['Ice Aspect'], weight: 4, summary: 'Sets targets on fire.' },
  { name: 'Looting', source: 'Vanilla', category: 'Weapon', maxLevel: 3, items: ['sword'], incompatible: ['Curse of Misfortune'], weight: 2, summary: 'More mob drops.' },
  { name: 'Sweeping Edge', source: 'Vanilla', category: 'Weapon', maxLevel: 3, items: ['sword'], incompatible: [], weight: 2, summary: 'Stronger sweeping attacks.' },
  { name: 'Efficiency', source: 'Vanilla', category: 'Tool', maxLevel: 5, items: ['pickaxe', 'axe', 'shovel', 'hoe', 'shears'], incompatible: [], weight: 1, summary: 'Mine or use faster.' },
  { name: 'Silk Touch', source: 'Vanilla', category: 'Tool', maxLevel: 1, items: ['pickaxe', 'axe', 'shovel', 'hoe', 'shears'], incompatible: ['Fortune', 'Smelter', 'Silk Spawner'], weight: 4, summary: 'Drops blocks themselves.' },
  { name: 'Fortune', source: 'Vanilla', category: 'Tool', maxLevel: 3, items: ['pickaxe', 'axe', 'shovel', 'hoe'], incompatible: ['Silk Touch', 'Curse of Misfortune'], weight: 2, summary: 'More block drops.' },
  { name: 'Power', source: 'Vanilla', category: 'Bow', maxLevel: 5, items: ['bow'], incompatible: [], weight: 1, summary: 'More arrow damage.' },
  { name: 'Punch', source: 'Vanilla', category: 'Bow', maxLevel: 2, items: ['bow'], incompatible: [], weight: 4, summary: 'More bow knockback.' },
  { name: 'Flame', source: 'Vanilla', category: 'Bow', maxLevel: 1, items: ['bow'], incompatible: [], weight: 4, summary: 'Sets arrows on fire.' },
  { name: 'Infinity', source: 'Vanilla', category: 'Bow', maxLevel: 1, items: ['bow'], incompatible: ['Mending'], weight: 4, summary: 'One arrow is enough.' },
  { name: 'Multishot', source: 'Vanilla', category: 'Bow', maxLevel: 1, items: ['crossbow'], incompatible: ['Piercing'], weight: 4, summary: 'Shoots 3 projectiles.' },
  { name: 'Quick Charge', source: 'Vanilla', category: 'Bow', maxLevel: 3, items: ['crossbow'], incompatible: [], weight: 2, summary: 'Reload faster.' },
  { name: 'Piercing', source: 'Vanilla', category: 'Bow', maxLevel: 4, items: ['crossbow'], incompatible: ['Multishot'], weight: 1, summary: 'Arrows pass through entities.' },
  { name: 'Impaling', source: 'Vanilla', category: 'Weapon', maxLevel: 5, items: ['trident'], incompatible: [], weight: 2, summary: 'More trident damage.' },
  { name: 'Loyalty', source: 'Vanilla', category: 'Weapon', maxLevel: 3, items: ['trident'], incompatible: ['Riptide'], weight: 1, summary: 'Trident returns.' },
  { name: 'Riptide', source: 'Vanilla', category: 'Weapon', maxLevel: 3, items: ['trident'], incompatible: ['Loyalty', 'Channeling'], weight: 2, summary: 'Launches the player in water or rain.' },
  { name: 'Channeling', source: 'Vanilla', category: 'Weapon', maxLevel: 1, items: ['trident'], incompatible: ['Riptide'], weight: 4, summary: 'Summons lightning in storms.' },
  { name: 'Luck of the Sea', source: 'Vanilla', category: 'Fishing', maxLevel: 3, items: ['fishing_rod'], incompatible: [], weight: 2, summary: 'Better fishing loot.' },
  { name: 'Lure', source: 'Vanilla', category: 'Fishing', maxLevel: 3, items: ['fishing_rod'], incompatible: [], weight: 2, summary: 'Fish bite faster.' },
  { name: 'Unbreaking', source: 'Vanilla', category: 'Universal', maxLevel: 3, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra', 'sword', 'axe', 'pickaxe', 'shovel', 'hoe', 'bow', 'crossbow', 'trident', 'fishing_rod', 'mace', 'shears', 'shield'], incompatible: ['Curse of Breaking'], weight: 1, summary: 'Items lose durability less often.' },
  { name: 'Mending', source: 'Vanilla', category: 'Universal', maxLevel: 1, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra', 'sword', 'axe', 'pickaxe', 'shovel', 'hoe', 'bow', 'crossbow', 'trident', 'fishing_rod', 'mace', 'shears', 'shield'], incompatible: ['Infinity'], weight: 2, summary: 'Repairs with XP.' },
  { name: 'Curse of Binding', source: 'Vanilla', category: 'Universal', maxLevel: 1, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra'], incompatible: [], weight: 8, summary: 'Armor cannot be removed.' },
  { name: 'Curse of Vanishing', source: 'Vanilla', category: 'Universal', maxLevel: 1, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra', 'sword', 'axe', 'pickaxe', 'shovel', 'hoe', 'bow', 'crossbow', 'trident', 'fishing_rod', 'mace', 'shears', 'shield'], incompatible: ['Soulbound'], weight: 8, summary: 'Item disappears on death.' },
]

const EXCELLENT: Enchant[] = [
  { name: 'Cold Steel', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 3, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra'], incompatible: [], weight: 1, summary: 'Applies Mining Fatigue to the attacker.' },
  { name: 'Darkness Cloak', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 3, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra'], incompatible: [], weight: 1, summary: 'Applies Darkness to the attacker.' },
  { name: 'Dragon Heart', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 5, items: ['chestplate', 'elytra'], incompatible: [], weight: 1, summary: 'Passive Health Boost.' },
  { name: 'Elemental Protection', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 4, items: ['helmet', 'chestplate', 'leggings', 'boots'], incompatible: [], weight: 1, summary: 'Reduces potion and elemental damage.' },
  { name: 'Fire Shield', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 4, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra'], incompatible: [], weight: 1, summary: 'Ignites the attacker.' },
  { name: 'Flame Walker', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 2, items: ['boots'], incompatible: ['Frost Walker'], weight: 1, summary: 'Walk on lava, ignore magma damage.' },
  { name: 'Hardened', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 2, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra'], incompatible: [], weight: 1, summary: 'Resistance when hit.' },
  { name: 'Ice Shield', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 3, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra'], incompatible: [], weight: 1, summary: 'Freezes and slows the attacker.' },
  { name: 'Jumping', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 2, items: ['boots'], incompatible: [], weight: 1, summary: 'Jump Boost.' },
  { name: 'Kamikadze', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 3, items: ['chestplate', 'elytra'], incompatible: [], weight: 1, summary: 'Explodes on death.' },
  { name: 'Lightweight', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 1, items: ['boots'], incompatible: [], weight: 1, summary: 'Protects turtle eggs, farmland, and dripleaf.' },
  { name: 'Night Vision', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 1, items: ['helmet'], incompatible: [], weight: 1, summary: 'Night Vision.' },
  { name: 'Rebound', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 1, items: ['boots'], incompatible: ['Feather Falling'], weight: 1, summary: 'Bounce like a slime block.' },
  { name: 'Regrowth', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 4, items: ['chestplate', 'elytra'], incompatible: [], weight: 1, summary: 'Regenerates hearts over time.' },
  { name: 'Saturation', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 2, items: ['helmet'], incompatible: [], weight: 1, summary: 'Restores food over time.' },
  { name: 'Speed', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 2, items: ['boots'], incompatible: [], weight: 1, summary: 'Speed effect.' },
  { name: 'Stopping Force', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 3, items: ['chestplate', 'elytra'], incompatible: [], weight: 1, summary: 'Reduces knockback taken.' },
  { name: 'Water Breathing', source: 'ExcellentEnchants', category: 'Armor', maxLevel: 1, items: ['helmet'], incompatible: [], weight: 1, summary: 'Water Breathing.' },
  { name: 'Bomber', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Ender Bow', 'Ghast', 'Confusing Arrows', 'Darkness Arrows', 'Dragonfire Arrows', 'Electrified Arrows', 'Explosive Arrows', 'Flare', 'Hover', 'Lingering', 'Poisoned Arrows', 'Vampiric Arrows', 'Withered Arrows'], weight: 1, summary: 'Shoots TNT.' },
  { name: 'Confusing Arrows', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Applies Nausea.' },
  { name: 'Darkness Arrows', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Applies Darkness.' },
  { name: 'Dragonfire Arrows', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Applies Dragon\'s Breath.' },
  { name: 'Electrified Arrows', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Summons lightning.' },
  { name: 'Ender Bow', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 1, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ghast'], weight: 1, summary: 'Shoots Ender Pearls.' },
  { name: 'Explosive Arrows', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Explodes on hit.' },
  { name: 'Flare', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 1, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Places a torch.' },
  { name: 'Ghast', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 1, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow'], weight: 1, summary: 'Shoots fireballs.' },
  { name: 'Hover', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Applies Levitation.' },
  { name: 'Lingering', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Lingering cloud on hit.' },
  { name: 'Poisoned Arrows', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Applies Poison.' },
  { name: 'Sniper', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 2, items: ['bow', 'crossbow'], incompatible: [], weight: 1, summary: 'Faster projectiles.' },
  { name: 'Vampiric Arrows', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Heals on hit.' },
  { name: 'Withered Arrows', source: 'ExcellentEnchants', category: 'Bow', maxLevel: 3, items: ['bow', 'crossbow'], incompatible: ['Bomber', 'Ender Bow', 'Ghast'], weight: 1, summary: 'Applies Wither.' },
  { name: 'Blast Mining', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 5, items: ['pickaxe'], incompatible: ['Tunnel', 'Veinminer'], weight: 1, summary: 'Mines with explosions.' },
  { name: 'Glass Breaker', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 1, items: ['pickaxe', 'axe', 'shovel', 'hoe', 'shears'], incompatible: [], weight: 1, summary: 'Breaks glass instantly.' },
  { name: 'Haste', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 3, items: ['pickaxe', 'axe', 'shovel', 'hoe', 'shears'], incompatible: [], weight: 1, summary: 'Haste while mining.' },
  { name: 'Lucky Miner', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 3, items: ['pickaxe'], incompatible: [], weight: 1, summary: 'More XP from blocks.' },
  { name: 'Replanter', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 1, items: ['hoe'], incompatible: [], weight: 1, summary: 'Replants crops.' },
  { name: 'Silk Chest', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 1, items: ['pickaxe', 'axe', 'shovel', 'hoe'], incompatible: [], weight: 1, summary: 'Drops loaded chests.' },
  { name: 'Silk Spawner', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 1, items: ['pickaxe'], incompatible: ['Smelter', 'Silk Touch'], weight: 1, summary: 'Chance to drop spawners.' },
  { name: 'Smelter', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 5, items: ['pickaxe', 'axe', 'shovel', 'hoe', 'shears'], incompatible: ['Silk Touch', 'Silk Spawner'], weight: 1, summary: 'Auto-smelts drops.' },
  { name: 'Telekinesis', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 1, items: ['pickaxe', 'axe', 'shovel', 'hoe', 'shears'], incompatible: [], weight: 1, summary: 'Drops go to inventory.' },
  { name: 'Treefeller', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 1, items: ['axe'], incompatible: [], weight: 1, summary: 'Cuts whole trees.' },
  { name: 'Tunnel', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 3, items: ['pickaxe', 'axe', 'shovel', 'hoe'], incompatible: ['Veinminer', 'Blast Mining'], weight: 1, summary: 'Mines an area.' },
  { name: 'Veinminer', source: 'ExcellentEnchants', category: 'Tool', maxLevel: 3, items: ['pickaxe'], incompatible: ['Tunnel', 'Blast Mining'], weight: 1, summary: 'Mines whole veins.' },
  { name: 'Auto Reel', source: 'ExcellentEnchants', category: 'Fishing', maxLevel: 1, items: ['fishing_rod'], incompatible: [], weight: 1, summary: 'Auto-reels fish.' },
  { name: 'Curse of Drowned', source: 'ExcellentEnchants', category: 'Fishing', maxLevel: 3, items: ['fishing_rod'], incompatible: [], weight: 1, summary: 'Chance to fish a drowned.' },
  { name: 'Double Catch', source: 'ExcellentEnchants', category: 'Fishing', maxLevel: 3, items: ['fishing_rod'], incompatible: [], weight: 1, summary: 'Double fishing catch.' },
  { name: 'River Master', source: 'ExcellentEnchants', category: 'Fishing', maxLevel: 5, items: ['fishing_rod'], incompatible: [], weight: 1, summary: 'Longer casts.' },
  { name: 'Seasoned Angler', source: 'ExcellentEnchants', category: 'Fishing', maxLevel: 3, items: ['fishing_rod'], incompatible: [], weight: 1, summary: 'More fishing XP.' },
  { name: 'Survivalist', source: 'ExcellentEnchants', category: 'Fishing', maxLevel: 1, items: ['fishing_rod'], incompatible: [], weight: 1, summary: 'Auto-cooks fish.' },
  { name: 'Bane of Netherspawn', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 5, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'More damage to nether mobs.' },
  { name: 'Blindness', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 2, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'Applies Blindness.' },
  { name: 'Confusion', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 2, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'Applies Nausea.' },
  { name: 'Cure', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 3, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'Cures zombified piglins and villagers.' },
  { name: 'Curse of Death', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 3, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'You may die after a player kill.' },
  { name: 'Cutter', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 3, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'Damages armor.' },
  { name: 'Decapitator', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 2, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'Drops heads.' },
  { name: 'Double Strike', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 2, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'Chance to deal double damage.' },
  { name: 'Exhaust', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 4, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'Applies Hunger.' },
  { name: 'Ice Aspect', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 3, items: ['sword', 'axe'], incompatible: ['Fire Aspect'], weight: 1, summary: 'Freezes and slows targets.' },
  { name: 'Infernus', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 3, items: ['trident'], incompatible: [], weight: 1, summary: 'Tridents set targets on fire.' },
  { name: 'Nimble', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 1, items: ['sword', 'axe', 'trident'], incompatible: [], weight: 1, summary: 'Drops go to inventory.' },
  { name: 'Paralyze', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 5, items: ['sword', 'axe', 'trident'], incompatible: [], weight: 1, summary: 'Applies Mining Fatigue.' },
  { name: 'Rage', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 2, items: ['sword', 'axe', 'trident'], incompatible: [], weight: 1, summary: 'Strength in combat.' },
  { name: 'Rocket', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 3, items: ['sword', 'axe', 'trident'], incompatible: [], weight: 1, summary: 'Launches targets upward.' },
  { name: 'Swiper', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 3, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'Steals XP.' },
  { name: 'Temper', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 5, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'More damage on low HP.' },
  { name: 'Thrifty', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 3, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'Drops spawn eggs.' },
  { name: 'Thunder', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 5, items: ['sword', 'axe', 'trident'], incompatible: [], weight: 1, summary: 'Summons lightning.' },
  { name: 'Vampire', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 3, items: ['sword', 'axe', 'trident'], incompatible: [], weight: 1, summary: 'Steals health.' },
  { name: 'Venom', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 2, items: ['sword', 'axe', 'trident'], incompatible: [], weight: 1, summary: 'Applies Poison.' },
  { name: 'Village Defender', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 5, items: ['sword', 'axe'], incompatible: [], weight: 1, summary: 'More damage to illagers.' },
  { name: 'Wisdom', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 5, items: ['sword', 'axe', 'trident'], incompatible: [], weight: 1, summary: 'More XP from mobs.' },
  { name: 'Wither', source: 'ExcellentEnchants', category: 'Weapon', maxLevel: 2, items: ['sword', 'axe', 'trident'], incompatible: [], weight: 1, summary: 'Applies Wither.' },
  { name: 'Curse of Breaking', source: 'ExcellentEnchants', category: 'Universal', maxLevel: 3, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra', 'sword', 'axe', 'pickaxe', 'shovel', 'hoe', 'bow', 'crossbow', 'trident', 'fishing_rod', 'mace', 'shears', 'shield'], incompatible: ['Unbreaking'], weight: 1, summary: 'Uses more durability.' },
  { name: 'Curse of Fragility', source: 'ExcellentEnchants', category: 'Universal', maxLevel: 1, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra', 'sword', 'axe', 'pickaxe', 'shovel', 'hoe', 'bow', 'crossbow', 'trident', 'fishing_rod', 'mace', 'shears', 'shield'], incompatible: [], weight: 1, summary: 'Cannot be grindstoned or anviled.' },
  { name: 'Curse of Mediocrity', source: 'ExcellentEnchants', category: 'Universal', maxLevel: 3, items: ['sword', 'axe', 'pickaxe', 'shovel', 'hoe', 'bow', 'crossbow', 'trident', 'fishing_rod', 'mace'], incompatible: [], weight: 1, summary: 'Disenchants loot.' },
  { name: 'Curse of Misfortune', source: 'ExcellentEnchants', category: 'Universal', maxLevel: 3, items: ['sword', 'axe', 'pickaxe', 'shovel', 'hoe'], incompatible: ['Fortune', 'Looting'], weight: 1, summary: 'Zeroes block and mob loot.' },
  { name: 'Restore', source: 'ExcellentEnchants', category: 'Universal', maxLevel: 3, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra', 'sword', 'axe', 'pickaxe', 'shovel', 'hoe', 'bow', 'crossbow', 'trident', 'fishing_rod', 'mace', 'shears', 'shield'], incompatible: [], weight: 1, summary: 'Saves an item from breaking once.' },
  { name: 'Soulbound', source: 'ExcellentEnchants', category: 'Universal', maxLevel: 1, items: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra', 'sword', 'axe', 'pickaxe', 'shovel', 'hoe', 'bow', 'crossbow', 'trident', 'fishing_rod', 'mace', 'shears', 'shield'], incompatible: ['Curse of Vanishing'], weight: 1, summary: 'Keeps item on death.' },
]

const ENCHANTS = [...VANILLA, ...EXCELLENT].sort((a, b) => a.name.localeCompare(b.name))
const ENCHANT_BY_NAME = Object.fromEntries(ENCHANTS.map((enchant) => [enchant.name, enchant])) as Record<string, Enchant>
const TARGET_ITEMS: { value: ItemType; label: string }[] = [
  { value: 'sword', label: 'Sword' },
  { value: 'axe', label: 'Axe' },
  { value: 'pickaxe', label: 'Pickaxe' },
  { value: 'shovel', label: 'Shovel' },
  { value: 'hoe', label: 'Hoe' },
  { value: 'bow', label: 'Bow' },
  { value: 'crossbow', label: 'Crossbow' },
  { value: 'trident', label: 'Trident' },
  { value: 'mace', label: 'Mace' },
  { value: 'helmet', label: 'Helmet' },
  { value: 'chestplate', label: 'Chestplate' },
  { value: 'leggings', label: 'Leggings' },
  { value: 'boots', label: 'Boots' },
  { value: 'elytra', label: 'Elytra' },
  { value: 'fishing_rod', label: 'Fishing Rod' },
  { value: 'shield', label: 'Shield' },
  { value: 'shears', label: 'Shears' },
]

interface MergeNode {
  key: string
  name: string
  enchants: Array<Enchant & { level: number }>
  uses: number
  totalCostWeight: number
  steps: string[]
  combineCost?: number
}

function canApplyToItem(enchant: Enchant, item: ItemType) {
  return enchant.items.includes(item)
}

function hasConflict(a: Enchant, b: Enchant) {
  return a.incompatible.includes(b.name) || b.incompatible.includes(a.name)
}

function priorPenalty(uses: number) {
  return uses <= 0 ? 0 : 2 ** uses - 1
}

function buildBookNode(entry: SelectedEnchant): MergeNode {
  const enchant = ENCHANT_BY_NAME[entry.name]
  return {
    key: entry.name,
    name: `${entry.name} ${toRoman(entry.level)}`,
    enchants: [{ ...enchant, level: entry.level }],
    uses: 0,
    totalCostWeight: (enchant.weight || 1) * entry.level,
    steps: [],
  }
}

function mergeNodes(target: MergeNode, sacrifice: MergeNode): MergeNode {
  const mergedEnchants = [...target.enchants]
  sacrifice.enchants.forEach((enchant) => {
    const existingIndex = mergedEnchants.findIndex((entry) => entry.name === enchant.name)
    if (existingIndex >= 0) {
      const existing = mergedEnchants[existingIndex]
      const newLevel = existing.level === enchant.level
        ? Math.min(existing.level + 1, existing.maxLevel)
        : Math.max(existing.level, enchant.level)
      mergedEnchants[existingIndex] = { ...existing, level: newLevel }
    } else {
      mergedEnchants.push(enchant)
    }
  })

  const transferCost = sacrifice.enchants.reduce((sum, enchant) => {
    const targetMatch = target.enchants.find((entry) => entry.name === enchant.name)
    const resultingLevel = targetMatch && targetMatch.level === enchant.level
      ? Math.min(enchant.level + 1, enchant.maxLevel)
      : enchant.level
    return sum + (enchant.weight || 1) * resultingLevel
  }, 0)

  const combineCost = priorPenalty(target.uses) + priorPenalty(sacrifice.uses) + transferCost

  return {
    key: `${target.key}+${sacrifice.key}`,
    name: `${target.name} + ${sacrifice.name}`,
    enchants: mergedEnchants,
    uses: Math.max(target.uses, sacrifice.uses) + 1,
    totalCostWeight: mergedEnchants.reduce((sum, enchant) => sum + (enchant.weight || 1) * enchant.level, 0),
    steps: [...target.steps, ...sacrifice.steps, `Combine ${target.name} with ${sacrifice.name} -> ${combineCost} levels`],
    combineCost,
  }
}

function optimizeBookMerge(selectedBooks: SelectedEnchant[]) {
  if (!selectedBooks.length) return null
  if (selectedBooks.length === 1) return { finalBook: buildBookNode(selectedBooks[0]), internalCost: 0 }

  const nodes = selectedBooks.map(buildBookNode)
  const memo = new Map<number, { cost: number; node: MergeNode }>()

  function solve(mask: number): { cost: number; node: MergeNode } {
    if (memo.has(mask)) return memo.get(mask)!

    const indexes = nodes.map((_, index) => index).filter((index) => mask & (1 << index))
    if (indexes.length === 1) {
      const result = { cost: 0, node: nodes[indexes[0]] }
      memo.set(mask, result)
      return result
    }

    let best: { cost: number; node: MergeNode } | null = null
    let subset = (mask - 1) & mask

    while (subset) {
      const other = mask ^ subset
      if (subset < other) {
        const left = solve(subset)
        const right = solve(other)
        const options = [mergeNodes(left.node, right.node), mergeNodes(right.node, left.node)]
        options.forEach((option) => {
          const total = left.cost + right.cost + (option.combineCost || 0)
          if (!best || total < best.cost) best = { cost: total, node: option }
        })
      }
      subset = (subset - 1) & mask
    }

    memo.set(mask, best!)
    return best!
  }

  return solve((1 << nodes.length) - 1)
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export default function App() {
  const [tab, setTab] = useState<'planner' | 'anvil' | 'charges' | 'chance'>('planner')
  const [targetItem, setTargetItem] = useState<ItemType>('sword')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [selected, setSelected] = useState<SelectedEnchant[]>([])
  const [chargesToRestore, setChargesToRestore] = useState(1)
  const [existingUses, setExistingUses] = useState(0)
  const [renameCost, setRenameCost] = useState(false)
  const [successChance, setSuccessChance] = useState(100)
  const [destroyChance, setDestroyChance] = useState(0)
  const [protectScroll, setProtectScroll] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return ENCHANTS.filter((enchant) => {
      const categoryOk = category === 'All' || enchant.category === category
      const sourceOk = sourceFilter === 'All' || enchant.source === sourceFilter
      const textOk = !query || enchant.name.toLowerCase().includes(query) || enchant.summary.toLowerCase().includes(query)
      return categoryOk && sourceOk && textOk
    })
  }, [search, category, sourceFilter])

  const selectedEnchants = useMemo(() => selected.map((entry) => ({ ...ENCHANT_BY_NAME[entry.name], level: entry.level })), [selected])

  const conflicts = useMemo(() => {
    const issues: string[] = []
    for (let i = 0; i < selectedEnchants.length; i += 1) {
      for (let j = i + 1; j < selectedEnchants.length; j += 1) {
        if (hasConflict(selectedEnchants[i], selectedEnchants[j])) {
          issues.push(`${selectedEnchants[i].name} conflicts with ${selectedEnchants[j].name}`)
        }
      }
    }
    return issues
  }, [selectedEnchants])

  const itemProblems = useMemo(() => {
    return selectedEnchants
      .filter((enchant) => !canApplyToItem(enchant, targetItem))
      .map((enchant) => `${enchant.name} cannot be applied to ${targetItem.replace('_', ' ')}.`)
  }, [selectedEnchants, targetItem])

  const mergePlan = useMemo(() => optimizeBookMerge(selected), [selected])
  const finalApplyCost = mergePlan
    ? priorPenalty(existingUses) + priorPenalty(mergePlan.node.uses) + mergePlan.node.totalCostWeight + (renameCost ? 1 : 0)
    : 0
  const totalAnvilCost = (mergePlan?.cost || 0) + finalApplyCost
  const tooExpensive = finalApplyCost > 39

  const totalLevels = selectedEnchants.reduce((sum, enchant) => sum + enchant.level, 0)
  const rechargeCost = selected.length * Math.max(0, chargesToRestore)
  const successRate = clamp(successChance, 0, 100)
  const failRate = 100 - successRate
  const destroyRate = protectScroll ? 0 : clamp(Math.min(failRate, destroyChance), 0, 100)
  const safeFailRate = Math.max(0, failRate - destroyRate)

  const categories = ['All', ...Array.from(new Set(ENCHANTS.map((enchant) => enchant.category)))]
  const sources = ['All', 'Vanilla', 'ExcellentEnchants']

  function addEnchant(enchant: Enchant) {
    setSelected((current) => {
      if (current.some((entry) => entry.name === enchant.name)) return current
      return [...current, { name: enchant.name, level: enchant.maxLevel }]
    })
  }

  function removeEnchant(name: string) {
    setSelected((current) => current.filter((entry) => entry.name !== name))
  }

  function updateLevel(name: string, level: number) {
    setSelected((current) => current.map((entry) => (entry.name === name ? { ...entry, level } : entry)))
  }

  function randomizeValidBuild() {
    const pool = ENCHANTS.filter((enchant) => canApplyToItem(enchant, targetItem))
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const next: SelectedEnchant[] = []

    for (const enchant of shuffled) {
      const candidate = [...next, { name: enchant.name, level: enchant.maxLevel }]
      const full = candidate.map((entry) => ({ ...ENCHANT_BY_NAME[entry.name], level: entry.level }))
      let valid = true
      for (let i = 0; i < full.length; i += 1) {
        for (let j = i + 1; j < full.length; j += 1) {
          if (hasConflict(full[i], full[j])) valid = false
        }
      }
      if (valid) next.push({ name: enchant.name, level: enchant.maxLevel })
      if (next.length >= 7) break
    }

    setSelected(next)
  }

  return (
    <div className="app-shell">
      <header className="hero card">
        <div>
          <div className="badge-row">
            <span className="badge badge-green">Vanilla + ExcellentEnchants</span>
            <span className="badge badge-purple">GitHub-ready project</span>
          </div>
          <h1>ExcellentEnchants Calculator</h1>
          <p>
            Build full gear sets, validate incompatible enchants, estimate Java-style anvil cost,
            plan the cheapest book merge order, calculate charges, and model custom success systems.
          </p>
        </div>
        <div className="stats-grid">
          <div className="stat"><span>Enchants</span><strong>{ENCHANTS.length}</strong></div>
          <div className="stat"><span>Selected</span><strong>{selected.length}</strong></div>
          <div className="stat"><span>Levels</span><strong>{totalLevels}</strong></div>
          <div className="stat"><span>Target</span><strong>{targetItem.replace('_', ' ')}</strong></div>
        </div>
      </header>

      <nav className="tabs">
        {['planner', 'anvil', 'charges', 'chance'].map((value) => (
          <button
            key={value}
            className={tab === value ? 'tab active' : 'tab'}
            onClick={() => setTab(value as typeof tab)}
          >
            {value}
          </button>
        ))}
      </nav>

      {tab === 'planner' && (
        <section className="grid-two">
          <div className="card">
            <div className="section-head">
              <div>
                <h2>Enchantment library</h2>
                <p>Search stock vanilla and ExcellentEnchants data, then add entries to your target item.</p>
              </div>
            </div>

            <div className="controls-grid">
              <label>
                <span>Target item</span>
                <select value={targetItem} onChange={(e) => setTargetItem(e.target.value as ItemType)}>
                  {TARGET_ITEMS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Search</span>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search enchantments" />
              </label>

              <label>
                <span>Category</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((entry) => <option key={entry}>{entry}</option>)}
                </select>
              </label>

              <label>
                <span>Source</span>
                <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                  {sources.map((entry) => <option key={entry}>{entry}</option>)}
                </select>
              </label>
            </div>

            <div className="library-grid">
              {filtered.map((enchant) => {
                const added = selected.some((entry) => entry.name === enchant.name)
                const compatible = canApplyToItem(enchant, targetItem)
                return (
                  <article key={enchant.name} className="library-card">
                    <div className="library-top">
                      <div>
                        <h3>{enchant.name}</h3>
                        <div className="inline-badges">
                          <span className={enchant.source === 'Vanilla' ? 'badge badge-green' : 'badge badge-purple'}>{enchant.source}</span>
                          <span className="badge">{enchant.category}</span>
                          <span className="badge">Max {toRoman(enchant.maxLevel)}</span>
                        </div>
                      </div>
                      <button disabled={added} onClick={() => addEnchant(enchant)}>{added ? 'Added' : 'Add'}</button>
                    </div>
                    <p>{enchant.summary}</p>
                    <div className="inline-badges">
                      <span className={compatible ? 'badge badge-green' : 'badge badge-red'}>{compatible ? 'Applies to target' : 'Wrong item type'}</span>
                      <span className="badge">Weight {enchant.weight}</span>
                    </div>
                    {enchant.incompatible.length > 0 && (
                      <div className="conflict-list">
                        <strong>Incompatible with</strong>
                        <div className="inline-badges">
                          {enchant.incompatible.map((item) => <span key={item} className="badge badge-gold">{item}</span>)}
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </div>

          <div className="stack">
            <div className="card">
              <div className="section-head split">
                <div>
                  <h2>Current build</h2>
                  <p>Edit levels on the right.</p>
                </div>
                <div className="button-row">
                  <button onClick={randomizeValidBuild}>Random valid</button>
                  <button onClick={() => setSelected([])}>Clear</button>
                </div>
              </div>

              <div className="stack compact">
                {selectedEnchants.length === 0 && <div className="empty-box">Pick enchantments from the library to start building your item.</div>}
                {selectedEnchants.map((enchant) => (
                  <div key={enchant.name} className="selected-card">
                    <div className="section-head split tight">
                      <div>
                        <h3>{enchant.name}</h3>
                        <p>{enchant.category} • {enchant.source}</p>
                      </div>
                      <button onClick={() => removeEnchant(enchant.name)}>Remove</button>
                    </div>
                    <label className="inline-form">
                      <span>Level</span>
                      <select value={enchant.level} onChange={(e) => updateLevel(enchant.name, Number(e.target.value))}>
                        {Array.from({ length: enchant.maxLevel }, (_, index) => index + 1).map((level) => (
                          <option key={level} value={level}>{toRoman(level)}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2>Validation</h2>
              <div className="stats-grid validation-grid">
                <div className="stat"><span>Conflicts</span><strong>{conflicts.length}</strong></div>
                <div className="stat"><span>Item issues</span><strong>{itemProblems.length}</strong></div>
              </div>
              {conflicts.length === 0 && itemProblems.length === 0 ? (
                <div className="good-box">This build is internally valid for the selected item.</div>
              ) : (
                <div className="stack compact">
                  {itemProblems.map((issue) => <div key={issue} className="warn-box red">{issue}</div>)}
                  {conflicts.map((issue) => <div key={issue} className="warn-box gold">{issue}</div>)}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {tab === 'anvil' && (
        <section className="grid-two wide-right">
          <div className="card stack compact">
            <h2>Anvil combine calculator</h2>
            <label>
              <span>Existing prior work on the base item</span>
              <input type="number" min={0} max={10} value={existingUses} onChange={(e) => setExistingUses(clamp(Number(e.target.value) || 0, 0, 10))} />
            </label>
            <button onClick={() => setRenameCost((current) => !current)}>{renameCost ? 'Rename cost included' : 'No rename cost'}</button>
            <div className="stats-grid validation-grid three-cols">
              <div className="stat"><span>Merge books cost</span><strong>{mergePlan?.cost || 0}</strong></div>
              <div className="stat"><span>Final apply cost</span><strong>{finalApplyCost}</strong></div>
              <div className="stat"><span>Total estimated levels</span><strong>{totalAnvilCost}</strong></div>
            </div>
            {tooExpensive && <div className="warn-box red">The final anvil operation is estimated above 39 levels, so Java survival would show Too Expensive.</div>}
          </div>

          <div className="card">
            <h2>Cheapest book merge order</h2>
            <div className="stack compact">
              {!mergePlan && <div className="empty-box">Add enchantments in Planner first to generate a merge order.</div>}
              {mergePlan?.node.steps.length === 0 && <div className="empty-box">Single book selected. No internal merging needed.</div>}
              {mergePlan?.node.steps.map((step, index) => (
                <div key={`${step}-${index}`} className="selected-card">{index + 1}. {step}</div>
              ))}
              {mergePlan && <div className="good-box">Final step: apply the merged book stack to your {targetItem.replace('_', ' ')} for an estimated {finalApplyCost} levels.</div>}
            </div>
          </div>
        </section>
      )}

      {tab === 'charges' && (
        <section className="grid-two wide-right">
          <div className="card stack compact">
            <h2>Charges refill</h2>
            <p>ExcellentEnchants charges cost 1 XP level per charge, per enchantment when recharged in an anvil.</p>
            <label>
              <span>Charges to restore</span>
              <input type="number" min={0} value={chargesToRestore} onChange={(e) => setChargesToRestore(Math.max(0, Number(e.target.value) || 0))} />
            </label>
            <div className="good-box">Estimated refill cost: {rechargeCost} XP levels</div>
          </div>

          <div className="card">
            <h2>Refill summary</h2>
            <div className="stack compact">
              {selectedEnchants.length === 0 && <div className="empty-box">Add enchantments in Planner to see which ones count toward a refill.</div>}
              {selectedEnchants.map((enchant) => (
                <div key={enchant.name} className="selected-card split-center">
                  <div>
                    <h3>{enchant.name} {toRoman(enchant.level)}</h3>
                    <p>{enchant.source}</p>
                  </div>
                  <span className="badge badge-green">+{chargesToRestore} charges</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === 'chance' && (
        <section className="grid-two wide-right">
          <div className="card stack compact">
            <h2>Optional success calculator</h2>
            <div className="warn-box gold">Use this only if your server adds custom success and destroy rates. Stock ExcellentEnchants does not require this for normal enchanting.</div>
            <label>
              <span>Success chance %</span>
              <input type="number" min={0} max={100} value={successChance} onChange={(e) => setSuccessChance(clamp(Number(e.target.value) || 0, 0, 100))} />
            </label>
            <label>
              <span>Destroy chance on failure %</span>
              <input type="number" min={0} max={100} value={destroyChance} onChange={(e) => setDestroyChance(clamp(Number(e.target.value) || 0, 0, 100))} />
            </label>
            <button onClick={() => setProtectScroll((current) => !current)}>{protectScroll ? 'Protection enabled' : 'No protection item enabled'}</button>
          </div>

          <div className="card">
            <h2>Outcome breakdown</h2>
            <div className="stats-grid validation-grid three-cols">
              <div className="stat"><span>Success</span><strong>{successRate}%</strong></div>
              <div className="stat"><span>Fail but survives</span><strong>{safeFailRate}%</strong></div>
              <div className="stat"><span>Destroyed</span><strong>{destroyRate}%</strong></div>
            </div>
            <div className="selected-card">
              For one attempt, your expected failure rate is {failRate}%. With protection {protectScroll ? 'enabled' : 'disabled'}, the item destruction risk is {destroyRate}%.
            </div>
          </div>
        </section>
      )}

      <footer className="card footer-note">
        <h2>Notes</h2>
        <p>This project includes stock vanilla enchantments and the stock ExcellentEnchants list.</p>
        <p>The anvil planner is a Java-style estimate for prior work penalties and book merge ordering. It is a planner, not a perfect server-side simulator.</p>
        <p>Server owners can override ExcellentEnchants behavior in config files, so custom servers may differ.</p>
      </footer>
    </div>
  )
}
