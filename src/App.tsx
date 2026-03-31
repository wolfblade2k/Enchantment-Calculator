import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Swords,
  Shield,
  Pickaxe,
  Fish,
  Crosshair,
  Wrench,
  Zap,
  Search,
  CheckCircle2,
  AlertTriangle,
  Hammer,
  BookOpen,
  Plus,
  ChevronRight,
} from "lucide-react";

type ItemKey =
  | "helmet"
  | "chestplate"
  | "leggings"
  | "boots"
  | "elytra"
  | "sword"
  | "axe"
  | "pickaxe"
  | "shovel"
  | "hoe"
  | "bow"
  | "crossbow"
  | "trident"
  | "fishing_rod"
  | "mace"
  | "shears"
  | "shield";

type Enchant = {
  name: string;
  max: number;
  source: "Vanilla" | "ExcellentEnchants";
  appliesTo: ItemKey[];
  incompatible?: string[];
  kind: "damage" | "utility" | "protection" | "loot" | "mobility" | "curse";
};

type Picked = { name: string; level: number };

type MergeNode = {
  label: string;
  enchants: string[];
  weight: number;
};

type MergeStep = {
  step: number;
  left: string;
  right: string;
  result: string;
  cost: number;
};

const ITEMS: { key: ItemKey; label: string; icon: JSX.Element }[] = [
  { key: "sword", label: "Sword", icon: <Swords size={18} /> },
  { key: "axe", label: "Axe", icon: <Wrench size={18} /> },
  { key: "pickaxe", label: "Pickaxe", icon: <Pickaxe size={18} /> },
  { key: "bow", label: "Bow", icon: <Crosshair size={18} /> },
  { key: "crossbow", label: "Crossbow", icon: <Crosshair size={18} /> },
  { key: "trident", label: "Trident", icon: <Wrench size={18} /> },
  { key: "mace", label: "Mace", icon: <Zap size={18} /> },
  { key: "helmet", label: "Helmet", icon: <Shield size={18} /> },
  { key: "chestplate", label: "Chestplate", icon: <Shield size={18} /> },
  { key: "leggings", label: "Leggings", icon: <Shield size={18} /> },
  { key: "boots", label: "Boots", icon: <Zap size={18} /> },
  { key: "elytra", label: "Elytra", icon: <Sparkles size={18} /> },
  { key: "fishing_rod", label: "Fishing Rod", icon: <Fish size={18} /> },
  { key: "shovel", label: "Shovel", icon: <Pickaxe size={18} /> },
  { key: "hoe", label: "Hoe", icon: <Pickaxe size={18} /> },
  { key: "shears", label: "Shears", icon: <Wrench size={18} /> },
  { key: "shield", label: "Shield", icon: <Shield size={18} /> },
];

const ALL: Enchant[] = [
  { name: "Protection", source: "Vanilla", max: 4, appliesTo: ["helmet","chestplate","leggings","boots"], incompatible: ["Fire Protection","Blast Protection","Projectile Protection"], kind: "protection" },
  { name: "Fire Protection", source: "Vanilla", max: 4, appliesTo: ["helmet","chestplate","leggings","boots"], incompatible: ["Protection","Blast Protection","Projectile Protection"], kind: "protection" },
  { name: "Blast Protection", source: "Vanilla", max: 4, appliesTo: ["helmet","chestplate","leggings","boots"], incompatible: ["Protection","Fire Protection","Projectile Protection"], kind: "protection" },
  { name: "Projectile Protection", source: "Vanilla", max: 4, appliesTo: ["helmet","chestplate","leggings","boots"], incompatible: ["Protection","Fire Protection","Blast Protection"], kind: "protection" },
  { name: "Respiration", source: "Vanilla", max: 3, appliesTo: ["helmet"], kind: "utility" },
  { name: "Aqua Affinity", source: "Vanilla", max: 1, appliesTo: ["helmet"], kind: "utility" },
  { name: "Thorns", source: "Vanilla", max: 3, appliesTo: ["helmet","chestplate","leggings","boots"], kind: "protection" },
  { name: "Depth Strider", source: "Vanilla", max: 3, appliesTo: ["boots"], incompatible: ["Frost Walker"], kind: "mobility" },
  { name: "Frost Walker", source: "Vanilla", max: 2, appliesTo: ["boots"], incompatible: ["Depth Strider","Flame Walker"], kind: "mobility" },
  { name: "Feather Falling", source: "Vanilla", max: 4, appliesTo: ["boots"], incompatible: ["Rebound"], kind: "mobility" },
  { name: "Soul Speed", source: "Vanilla", max: 3, appliesTo: ["boots"], kind: "mobility" },
  { name: "Swift Sneak", source: "Vanilla", max: 3, appliesTo: ["leggings"], kind: "mobility" },
  { name: "Density", source: "Vanilla", max: 5, appliesTo: ["mace"], incompatible: ["Breach"], kind: "damage" },
  { name: "Breach", source: "Vanilla", max: 4, appliesTo: ["mace"], incompatible: ["Density"], kind: "damage" },
  { name: "Wind Burst", source: "Vanilla", max: 3, appliesTo: ["mace"], kind: "mobility" },
  { name: "Sharpness", source: "Vanilla", max: 5, appliesTo: ["sword","axe"], incompatible: ["Smite","Bane of Arthropods"], kind: "damage" },
  { name: "Smite", source: "Vanilla", max: 5, appliesTo: ["sword","axe"], incompatible: ["Sharpness","Bane of Arthropods"], kind: "damage" },
  { name: "Bane of Arthropods", source: "Vanilla", max: 5, appliesTo: ["sword","axe"], incompatible: ["Sharpness","Smite"], kind: "damage" },
  { name: "Knockback", source: "Vanilla", max: 2, appliesTo: ["sword"], kind: "damage" },
  { name: "Fire Aspect", source: "Vanilla", max: 2, appliesTo: ["sword"], incompatible: ["Ice Aspect"], kind: "damage" },
  { name: "Looting", source: "Vanilla", max: 3, appliesTo: ["sword"], incompatible: ["Curse of Misfortune"], kind: "loot" },
  { name: "Sweeping Edge", source: "Vanilla", max: 3, appliesTo: ["sword"], kind: "damage" },
  { name: "Efficiency", source: "Vanilla", max: 5, appliesTo: ["pickaxe","axe","shovel","hoe","shears"], kind: "utility" },
  { name: "Silk Touch", source: "Vanilla", max: 1, appliesTo: ["pickaxe","axe","shovel","hoe","shears"], incompatible: ["Fortune","Smelter","Silk Spawner"], kind: "utility" },
  { name: "Fortune", source: "Vanilla", max: 3, appliesTo: ["pickaxe","axe","shovel","hoe"], incompatible: ["Silk Touch","Curse of Misfortune"], kind: "loot" },
  { name: "Power", source: "Vanilla", max: 5, appliesTo: ["bow"], kind: "damage" },
  { name: "Punch", source: "Vanilla", max: 2, appliesTo: ["bow"], kind: "damage" },
  { name: "Flame", source: "Vanilla", max: 1, appliesTo: ["bow"], kind: "damage" },
  { name: "Infinity", source: "Vanilla", max: 1, appliesTo: ["bow"], incompatible: ["Mending"], kind: "utility" },
  { name: "Multishot", source: "Vanilla", max: 1, appliesTo: ["crossbow"], incompatible: ["Piercing"], kind: "damage" },
  { name: "Quick Charge", source: "Vanilla", max: 3, appliesTo: ["crossbow"], kind: "utility" },
  { name: "Piercing", source: "Vanilla", max: 4, appliesTo: ["crossbow"], incompatible: ["Multishot"], kind: "damage" },
  { name: "Impaling", source: "Vanilla", max: 5, appliesTo: ["trident"], kind: "damage" },
  { name: "Loyalty", source: "Vanilla", max: 3, appliesTo: ["trident"], incompatible: ["Riptide"], kind: "utility" },
  { name: "Riptide", source: "Vanilla", max: 3, appliesTo: ["trident"], incompatible: ["Loyalty","Channeling"], kind: "mobility" },
  { name: "Channeling", source: "Vanilla", max: 1, appliesTo: ["trident"], incompatible: ["Riptide"], kind: "damage" },
  { name: "Luck of the Sea", source: "Vanilla", max: 3, appliesTo: ["fishing_rod"], kind: "loot" },
  { name: "Lure", source: "Vanilla", max: 3, appliesTo: ["fishing_rod"], kind: "utility" },
  { name: "Unbreaking", source: "Vanilla", max: 3, appliesTo: ["helmet","chestplate","leggings","boots","elytra","sword","axe","pickaxe","shovel","hoe","bow","crossbow","trident","fishing_rod","mace","shears","shield"], incompatible: ["Curse of Breaking"], kind: "utility" },
  { name: "Mending", source: "Vanilla", max: 1, appliesTo: ["helmet","chestplate","leggings","boots","elytra","sword","axe","pickaxe","shovel","hoe","bow","crossbow","trident","fishing_rod","mace","shears","shield"], incompatible: ["Infinity"], kind: "utility" },
  { name: "Curse of Binding", source: "Vanilla", max: 1, appliesTo: ["helmet","chestplate","leggings","boots","elytra"], kind: "curse" },
  { name: "Curse of Vanishing", source: "Vanilla", max: 1, appliesTo: ["helmet","chestplate","leggings","boots","elytra","sword","axe","pickaxe","shovel","hoe","bow","crossbow","trident","fishing_rod","mace","shears","shield"], incompatible: ["Soulbound"], kind: "curse" },

  { name: "Cold Steel", source: "ExcellentEnchants", max: 3, appliesTo: ["helmet","chestplate","leggings","boots","elytra"], kind: "protection" },
  { name: "Darkness Cloak", source: "ExcellentEnchants", max: 3, appliesTo: ["helmet","chestplate","leggings","boots","elytra"], kind: "protection" },
  { name: "Dragon Heart", source: "ExcellentEnchants", max: 5, appliesTo: ["chestplate","elytra"], kind: "protection" },
  { name: "Elemental Protection", source: "ExcellentEnchants", max: 4, appliesTo: ["helmet","chestplate","leggings","boots"], kind: "protection" },
  { name: "Fire Shield", source: "ExcellentEnchants", max: 4, appliesTo: ["helmet","chestplate","leggings","boots","elytra"], kind: "protection" },
  { name: "Flame Walker", source: "ExcellentEnchants", max: 2, appliesTo: ["boots"], incompatible: ["Frost Walker"], kind: "mobility" },
  { name: "Hardened", source: "ExcellentEnchants", max: 2, appliesTo: ["helmet","chestplate","leggings","boots","elytra"], kind: "protection" },
  { name: "Ice Shield", source: "ExcellentEnchants", max: 3, appliesTo: ["helmet","chestplate","leggings","boots","elytra"], kind: "protection" },
  { name: "Jumping", source: "ExcellentEnchants", max: 2, appliesTo: ["boots"], kind: "mobility" },
  { name: "Kamikadze", source: "ExcellentEnchants", max: 3, appliesTo: ["chestplate","elytra"], kind: "curse" },
  { name: "Lightweight", source: "ExcellentEnchants", max: 1, appliesTo: ["boots"], kind: "utility" },
  { name: "Night Vision", source: "ExcellentEnchants", max: 1, appliesTo: ["helmet"], kind: "utility" },
  { name: "Rebound", source: "ExcellentEnchants", max: 1, appliesTo: ["boots"], incompatible: ["Feather Falling"], kind: "mobility" },
  { name: "Regrowth", source: "ExcellentEnchants", max: 4, appliesTo: ["chestplate","elytra"], kind: "protection" },
  { name: "Saturation", source: "ExcellentEnchants", max: 2, appliesTo: ["helmet"], kind: "utility" },
  { name: "Speed", source: "ExcellentEnchants", max: 2, appliesTo: ["boots"], kind: "mobility" },
  { name: "Stopping Force", source: "ExcellentEnchants", max: 3, appliesTo: ["chestplate","elytra"], kind: "protection" },
  { name: "Water Breathing", source: "ExcellentEnchants", max: 1, appliesTo: ["helmet"], kind: "utility" },

  { name: "Bomber", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Ender Bow","Ghast","Confusing Arrows","Darkness Arrows","Dragonfire Arrows","Electrified Arrows","Explosive Arrows","Flare","Hover","Lingering","Poisoned Arrows","Vampiric Arrows","Withered Arrows"], kind: "damage" },
  { name: "Confusing Arrows", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "damage" },
  { name: "Darkness Arrows", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "damage" },
  { name: "Dragonfire Arrows", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "damage" },
  { name: "Electrified Arrows", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "damage" },
  { name: "Ender Bow", source: "ExcellentEnchants", max: 1, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ghast"], kind: "utility" },
  { name: "Explosive Arrows", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "damage" },
  { name: "Flare", source: "ExcellentEnchants", max: 1, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "utility" },
  { name: "Ghast", source: "ExcellentEnchants", max: 1, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow"], kind: "damage" },
  { name: "Hover", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "damage" },
  { name: "Lingering", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "damage" },
  { name: "Poisoned Arrows", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "damage" },
  { name: "Sniper", source: "ExcellentEnchants", max: 2, appliesTo: ["bow","crossbow"], kind: "damage" },
  { name: "Vampiric Arrows", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "damage" },
  { name: "Withered Arrows", source: "ExcellentEnchants", max: 3, appliesTo: ["bow","crossbow"], incompatible: ["Bomber","Ender Bow","Ghast"], kind: "damage" },

  { name: "Blast Mining", source: "ExcellentEnchants", max: 5, appliesTo: ["pickaxe"], incompatible: ["Tunnel","Veinminer"], kind: "utility" },
  { name: "Glass Breaker", source: "ExcellentEnchants", max: 1, appliesTo: ["pickaxe","axe","shovel","hoe","shears"], kind: "utility" },
  { name: "Haste", source: "ExcellentEnchants", max: 3, appliesTo: ["pickaxe","axe","shovel","hoe","shears"], kind: "utility" },
  { name: "Lucky Miner", source: "ExcellentEnchants", max: 3, appliesTo: ["pickaxe"], kind: "loot" },
  { name: "Replanter", source: "ExcellentEnchants", max: 1, appliesTo: ["hoe"], kind: "utility" },
  { name: "Silk Chest", source: "ExcellentEnchants", max: 1, appliesTo: ["pickaxe","axe","shovel","hoe"], kind: "utility" },
  { name: "Silk Spawner", source: "ExcellentEnchants", max: 1, appliesTo: ["pickaxe"], incompatible: ["Smelter","Silk Touch"], kind: "utility" },
  { name: "Smelter", source: "ExcellentEnchants", max: 5, appliesTo: ["pickaxe","axe","shovel","hoe","shears"], incompatible: ["Silk Touch","Silk Spawner"], kind: "utility" },
  { name: "Telekinesis", source: "ExcellentEnchants", max: 1, appliesTo: ["pickaxe","axe","shovel","hoe","shears"], kind: "utility" },
  { name: "Treefeller", source: "ExcellentEnchants", max: 1, appliesTo: ["axe"], kind: "utility" },
  { name: "Tunnel", source: "ExcellentEnchants", max: 3, appliesTo: ["pickaxe","axe","shovel","hoe"], incompatible: ["Veinminer","Blast Mining"], kind: "utility" },
  { name: "Veinminer", source: "ExcellentEnchants", max: 3, appliesTo: ["pickaxe"], incompatible: ["Tunnel","Blast Mining"], kind: "utility" },

  { name: "Auto Reel", source: "ExcellentEnchants", max: 1, appliesTo: ["fishing_rod"], kind: "utility" },
  { name: "Curse of Drowned", source: "ExcellentEnchants", max: 3, appliesTo: ["fishing_rod"], kind: "curse" },
  { name: "Double Catch", source: "ExcellentEnchants", max: 3, appliesTo: ["fishing_rod"], kind: "loot" },
  { name: "River Master", source: "ExcellentEnchants", max: 5, appliesTo: ["fishing_rod"], kind: "utility" },
  { name: "Seasoned Angler", source: "ExcellentEnchants", max: 3, appliesTo: ["fishing_rod"], kind: "loot" },
  { name: "Survivalist", source: "ExcellentEnchants", max: 1, appliesTo: ["fishing_rod"], kind: "utility" },

  { name: "Bane of Netherspawn", source: "ExcellentEnchants", max: 5, appliesTo: ["sword","axe"], kind: "damage" },
  { name: "Blindness", source: "ExcellentEnchants", max: 2, appliesTo: ["sword","axe"], kind: "damage" },
  { name: "Confusion", source: "ExcellentEnchants", max: 2, appliesTo: ["sword","axe"], kind: "damage" },
  { name: "Cure", source: "ExcellentEnchants", max: 3, appliesTo: ["sword","axe"], kind: "utility" },
  { name: "Curse of Death", source: "ExcellentEnchants", max: 3, appliesTo: ["sword","axe"], kind: "curse" },
  { name: "Cutter", source: "ExcellentEnchants", max: 3, appliesTo: ["sword","axe"], kind: "damage" },
  { name: "Decapitator", source: "ExcellentEnchants", max: 2, appliesTo: ["sword","axe"], kind: "loot" },
  { name: "Double Strike", source: "ExcellentEnchants", max: 2, appliesTo: ["sword","axe"], kind: "damage" },
  { name: "Exhaust", source: "ExcellentEnchants", max: 4, appliesTo: ["sword","axe"], kind: "damage" },
  { name: "Ice Aspect", source: "ExcellentEnchants", max: 3, appliesTo: ["sword","axe"], incompatible: ["Fire Aspect"], kind: "damage" },
  { name: "Infernus", source: "ExcellentEnchants", max: 3, appliesTo: ["trident"], kind: "damage" },
  { name: "Nimble", source: "ExcellentEnchants", max: 1, appliesTo: ["sword","axe","trident"], kind: "loot" },
  { name: "Paralyze", source: "ExcellentEnchants", max: 5, appliesTo: ["sword","axe","trident"], kind: "damage" },
  { name: "Rage", source: "ExcellentEnchants", max: 2, appliesTo: ["sword","axe","trident"], kind: "damage" },
  { name: "Rocket", source: "ExcellentEnchants", max: 3, appliesTo: ["sword","axe","trident"], kind: "damage" },
  { name: "Swiper", source: "ExcellentEnchants", max: 3, appliesTo: ["sword","axe"], kind: "loot" },
  { name: "Temper", source: "ExcellentEnchants", max: 5, appliesTo: ["sword","axe"], kind: "damage" },
  { name: "Thrifty", source: "ExcellentEnchants", max: 3, appliesTo: ["sword","axe"], kind: "loot" },
  { name: "Thunder", source: "ExcellentEnchants", max: 5, appliesTo: ["sword","axe","trident"], kind: "damage" },
  { name: "Vampire", source: "ExcellentEnchants", max: 3, appliesTo: ["sword","axe","trident"], kind: "damage" },
  { name: "Venom", source: "ExcellentEnchants", max: 2, appliesTo: ["sword","axe","trident"], kind: "damage" },
  { name: "Village Defender", source: "ExcellentEnchants", max: 5, appliesTo: ["sword","axe"], kind: "damage" },
  { name: "Wisdom", source: "ExcellentEnchants", max: 5, appliesTo: ["sword","axe","trident"], kind: "loot" },
  { name: "Wither", source: "ExcellentEnchants", max: 2, appliesTo: ["sword","axe","trident"], kind: "damage" },

  { name: "Curse of Breaking", source: "ExcellentEnchants", max: 3, appliesTo: ["helmet","chestplate","leggings","boots","elytra","sword","axe","pickaxe","shovel","hoe","bow","crossbow","trident","fishing_rod","mace","shears","shield"], incompatible: ["Unbreaking"], kind: "curse" },
  { name: "Curse of Fragility", source: "ExcellentEnchants", max: 1, appliesTo: ["helmet","chestplate","leggings","boots","elytra","sword","axe","pickaxe","shovel","hoe","bow","crossbow","trident","fishing_rod","mace","shears","shield"], kind: "curse" },
  { name: "Curse of Mediocrity", source: "ExcellentEnchants", max: 3, appliesTo: ["sword","axe","pickaxe","shovel","hoe","bow","crossbow","trident","fishing_rod","mace"], kind: "curse" },
  { name: "Curse of Misfortune", source: "ExcellentEnchants", max: 3, appliesTo: ["sword","axe","pickaxe","shovel","hoe"], incompatible: ["Fortune","Looting"], kind: "curse" },
  { name: "Restore", source: "ExcellentEnchants", max: 3, appliesTo: ["helmet","chestplate","leggings","boots","elytra","sword","axe","pickaxe","shovel","hoe","bow","crossbow","trident","fishing_rod","mace","shears","shield"], kind: "utility" },
  { name: "Soulbound", source: "ExcellentEnchants", max: 1, appliesTo: ["helmet","chestplate","leggings","boots","elytra","sword","axe","pickaxe","shovel","hoe","bow","crossbow","trident","fishing_rod","mace","shears","shield"], incompatible: ["Curse of Vanishing"], kind: "utility" },
];


function roman(value: number) {
  const map = ["", "I", "II", "III", "IV", "V", "VI"];
  return map[value] ?? String(value);
}

const CUSTOM_ANVIL_COST: Record<string, number> = {
  "Auto Reel": 1,
  "Bane of Netherspawn": 5,
  "Blast Mining": 2,
  "Blindness": 3,
  "Bomber": 2,
  "Cold Steel": 5,
  "Confusing Arrows": 1,
  "Confusion": 6,
  "Cure": 2,
  "Curse of Breaking": 6,
  "Curse of Death": 7,
  "Curse of Drowned": 7,
  "Curse of Fragility": 2,
  "Curse of Mediocrity": 6,
  "Curse of Misfortune": 1,
  "Cutter": 7,
  "Darkness Arrows": 6,
  "Darkness Cloak": 2,
  "Decapitator": 3,
  "Double Catch": 3,
  "Double Strike": 6,
  "Dragon Heart": 0,
  "Dragonfire Arrows": 7,
  "Electrified Arrows": 7,
  "Elemental Protection": 7,
  "Ender Bow": 1,
  "Exhaust": 4,
  "Explosive Arrows": 3,
  "Fire Shield": 1,
  "Flame Walker": 1,
  "Flare": 1,
  "Ghast": 2,
  "Glass Breaker": 1,
  "Hardened": 1,
  "Haste": 3,
  "Hover": 6,
  "Ice Aspect": 4,
  "Ice Shield": 3,
  "Infernus": 6,
  "Jumping": 1,
  "Kamikadze": 4,
  "Lightweight": 1,
  "Lingering": 7,
  "Lucky Miner": 4,
  "Night Vision": 4,
  "Nimble": 5,
  "Paralyze": 3,
  "Poisoned Arrows": 3,
  "Rage": 4,
  "Rebound": 0,
  "Regrowth": 0,
  "Replanter": 2,
  "Restore": 6,
  "River Master": 3,
  "Rocket": 5,
  "Saturation": 5,
  "Seasoned Angler": 5,
  "Silk Chest": 5,
  "Silk Spawner": 1,
  "Smelter": 1,
  "Sniper": 6,
  "Soulbound": 2,
  "Speed": 3,
  "Stopping Force": 6,
  "Survivalist": 5,
  "Swiper": 7,
  "Telekinesis": 0,
  "Temper": 1,
  "Thrifty": 5,
  "Thunder": 4,
  "Treefeller": 0,
  "Tunnel": 0,
  "Vampire": 2,
  "Vampiric Arrows": 6,
  "Veinminer": 0,
  "Venom": 7,
  "Village Defender": 6,
  "Water Breathing": 6,
  "Wisdom": 5,
  "Wither": 0,
  "Withered Arrows": 6
};
const VANILLA_BOOK_MULTIPLIER: Record<string, number> = {
  "Protection": 1,
  "Fire Protection": 1,
  "Blast Protection": 2,
  "Projectile Protection": 1,
  "Respiration": 2,
  "Aqua Affinity": 2,
  "Thorns": 4,
  "Depth Strider": 2,
  "Frost Walker": 2,
  "Feather Falling": 1,
  "Soul Speed": 4,
  "Swift Sneak": 4,
  "Density": 2,
  "Breach": 2,
  "Wind Burst": 4,
  "Sharpness": 1,
  "Smite": 1,
  "Bane of Arthropods": 1,
  "Knockback": 1,
  "Fire Aspect": 2,
  "Looting": 2,
  "Sweeping Edge": 2,
  "Efficiency": 1,
  "Silk Touch": 4,
  "Fortune": 2,
  "Power": 1,
  "Punch": 2,
  "Flame": 2,
  "Infinity": 4,
  "Multishot": 2,
  "Quick Charge": 1,
  "Piercing": 1,
  "Impaling": 2,
  "Loyalty": 1,
  "Riptide": 2,
  "Channeling": 4,
  "Luck of the Sea": 2,
  "Lure": 2,
  "Unbreaking": 1,
  "Mending": 2,
  "Curse of Binding": 4,
  "Curse of Vanishing": 4,
};

function getBookMultiplier(enchant: Enchant) {
  if (enchant.source === "Vanilla") {
    return VANILLA_BOOK_MULTIPLIER[enchant.name] ?? 2;
  }
  const configuredAnvilCost = CUSTOM_ANVIL_COST[enchant.name] ?? 1;
  return Math.max(1, Math.ceil(configuredAnvilCost / 2));
}

type EnchantState = Record<string, number>;

type SimNode = {
  key: string;
  label: string;
  enchants: EnchantState;
  uses: number;
  isBook: boolean;
  steps: MergeStep[];
};

function canApplyToItem(enchant: Enchant, item: ItemKey) {
  return enchant.appliesTo.includes(item);
}

function hasConflictByName(aName: string, bName: string) {
  const a = ALL.find((e) => e.name === aName);
  const b = ALL.find((e) => e.name === bName);
  if (!a || !b) return false;
  return (a.incompatible ?? []).includes(b.name) || (b.incompatible ?? []).includes(a.name);
}

function priorPenalty(uses: number) {
  return uses <= 0 ? 0 : 2 ** uses - 1;
}

function formatEnchantMap(map: EnchantState) {
  const names = Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, level]) => `${name} ${roman(level)}`);
  return names.length ? names.join(" • ") : "Empty";
}

function buildLeafNode(pick: Picked): SimNode {
  return {
    key: pick.name,
    label: `${pick.name} ${roman(pick.level)}`,
    enchants: { [pick.name]: pick.level },
    uses: 0,
    isBook: true,
    steps: [],
  };
}

function simulateCombine(
  target: SimNode,
  sacrifice: SimNode,
  targetItem: ItemKey,
  forceBookResult = true
): { valid: boolean; cost: number; node?: SimNode; reason?: string } {
  let enchantCost = 0;
  let transferred = 0;
  const result: EnchantState = { ...target.enchants };

  for (const [name, sacrificeLevel] of Object.entries(sacrifice.enchants)) {
    const enchant = ALL.find((e) => e.name === name);
    if (!enchant) continue;

    if (!canApplyToItem(enchant, targetItem)) {
      continue;
    }

    const incompatibleOnTarget = Object.keys(result).filter(
      (other) => other !== name && hasConflictByName(name, other)
    );

    if (incompatibleOnTarget.length > 0) {
      enchantCost += incompatibleOnTarget.length;
      continue;
    }

    const currentLevel = result[name] ?? 0;
    const finalLevel =
      currentLevel === sacrificeLevel
        ? Math.min(enchant.max, currentLevel + 1)
        : Math.max(currentLevel, sacrificeLevel);

    result[name] = finalLevel;
    enchantCost += finalLevel * getBookMultiplier(enchant);
    transferred += 1;
  }

  if (transferred === 0) {
    return { valid: false, cost: Infinity, reason: "No transferable enchantments." };
  }

  const cost = priorPenalty(target.uses) + priorPenalty(sacrifice.uses) + enchantCost;
  const resultUses = Math.max(target.uses, sacrifice.uses) + 1;
  const resultLabel = formatEnchantMap(result);

  return {
    valid: true,
    cost,
    node: {
      key: `${target.key}+${sacrifice.key}`,
      label: resultLabel,
      enchants: result,
      uses: resultUses,
      isBook: forceBookResult,
      steps: [
        ...target.steps,
        ...sacrifice.steps,
        {
          step: 0,
          left: target.label,
          right: sacrifice.label,
          result: resultLabel,
          cost,
        },
      ],
    },
  };
}

function optimizeBookMerge(picks: Picked[], targetItem: ItemKey) {
  if (!picks.length) return null;

  const leaves = picks.map(buildLeafNode);
  const memo = new Map<number, { totalCost: number; node: SimNode } | null>();

  function solve(mask: number): { totalCost: number; node: SimNode } | null {
    if (memo.has(mask)) return memo.get(mask)!;
    const idxs = leaves.map((_, i) => i).filter((i) => mask & (1 << i));

    if (idxs.length === 1) {
      const out = { totalCost: 0, node: leaves[idxs[0]] };
      memo.set(mask, out);
      return out;
    }

    let best: { totalCost: number; node: SimNode } | null = null;
    let sub = (mask - 1) & mask;

    while (sub) {
      const other = mask ^ sub;
      if (sub < other) {
        const left = solve(sub);
        const right = solve(other);
        if (left && right) {
          for (const [a, b] of [
            [left.node, right.node],
            [right.node, left.node],
          ] as const) {
            const merged = simulateCombine(a, b, targetItem, true);
            if (!merged.valid || !merged.node) continue;
            const totalCost = left.totalCost + right.totalCost + merged.cost;
            if (!best || totalCost < best.totalCost) {
              best = { totalCost, node: merged.node };
            }
          }
        }
      }
      sub = (sub - 1) & mask;
    }

    memo.set(mask, best);
    return best;
  }

  return solve((1 << leaves.length) - 1);
}


function greedyBookMerge(picks: Picked[], targetItem: ItemKey) {
  if (!picks.length) return null;
  const nodes = picks.map(buildLeafNode);
  let totalCost = 0;

  while (nodes.length > 1) {
    let best: { i: number; j: number; total: number; node: SimNode } | null = null;

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = 0; j < nodes.length; j += 1) {
        if (i === j) continue;
        const merged = simulateCombine(nodes[i], nodes[j], targetItem, true);
        if (!merged.valid || !merged.node) continue;
        if (!best || merged.cost < best.total) {
          best = { i, j, total: merged.cost, node: merged.node };
        }
      }
    }

    if (!best) return null;

    const nextNodes = nodes.filter((_, idx) => idx !== best!.i && idx !== best!.j);
    nextNodes.push(best.node);
    nodes.splice(0, nodes.length, ...nextNodes);
    totalCost += best.total;
  }

  return { totalCost, node: nodes[0] };
}

function evaluateBuild(picks: Picked[], targetItem: ItemKey, existingUses: number, renameCost: boolean, optimizerMode: "auto" | "exact" | "fast") {
  const selected = picks
    .map((pick) => {
      const enchant = ALL.find((e) => e.name === pick.name);
      return enchant ? { ...enchant, level: pick.level } : null;
    })
    .filter(Boolean) as (Enchant & { level: number })[];

  const conflicts: string[] = [];
  for (let i = 0; i < selected.length; i += 1) {
    for (let j = i + 1; j < selected.length; j += 1) {
      if (hasConflictByName(selected[i].name, selected[j].name)) {
        conflicts.push(`${selected[i].name} conflicts with ${selected[j].name}`);
      }
    }
  }

  const invalidForItem = selected
    .filter((enchant) => !canApplyToItem(enchant, targetItem))
    .map((enchant) => `${enchant.name} cannot be applied to ${targetItem.replace("_", " ")}.`);

  if (conflicts.length || invalidForItem.length) {
    return {
      selected,
      conflicts,
      itemProblems: invalidForItem,
      mergePlan: null as null | { totalCost: number; node: SimNode },
      finalApplyCost: 0,
      totalAnvilCost: 0,
      tooExpensive: false,
      maxSingleStep: 0,
      mode: "exact" as "exact" | "fast",
    };
  }

  const useFastMode =
    optimizerMode === "fast" || (optimizerMode === "auto" && picks.length > 8);
  const mergePlan = useFastMode
    ? greedyBookMerge(picks, targetItem)
    : optimizeBookMerge(picks, targetItem);

  if (!mergePlan) {
    return {
      selected,
      conflicts,
      itemProblems: invalidForItem,
      mergePlan: null,
      finalApplyCost: 0,
      totalAnvilCost: 0,
      tooExpensive: false,
      maxSingleStep: 0,
      mode: useFastMode ? "fast" as const : "exact" as const,
    };
  }

  const baseNode: SimNode = {
    key: "base-item",
    label: TARGET_ITEMS.find((x) => x.value === targetItem)?.label ?? "Item",
    enchants: {},
    uses: existingUses,
    isBook: false,
    steps: [],
  };

  const finalResult = simulateCombine(baseNode, mergePlan.node, targetItem, false);
  const finalApplyCost = (finalResult.valid ? finalResult.cost : 0) + (renameCost ? 1 : 0);
  const allStepCosts = mergePlan.node.steps.map((s) => s.cost);
  const maxSingleStep = Math.max(finalApplyCost, ...allStepCosts, 0);

  const numberedSteps = mergePlan.node.steps.map((step, index) => ({
    ...step,
    step: index + 1,
  }));

  if (finalResult.valid) {
    numberedSteps.push({
      step: numberedSteps.length + 1,
      left: baseNode.label,
      right: mergePlan.node.label,
      result: finalResult.node?.label ?? `${baseNode.label} enchanted`,
      cost: finalApplyCost,
    });
  }

  return {
    selected,
    conflicts,
    itemProblems: invalidForItem,
    mergePlan: {
      totalCost: mergePlan.totalCost,
      node: { ...mergePlan.node, steps: numberedSteps },
    },
    finalApplyCost,
    totalAnvilCost: mergePlan.totalCost + finalApplyCost,
    tooExpensive: maxSingleStep > 39,
    maxSingleStep,
    mode: useFastMode ? "fast" as const : "exact" as const,
  };
}

export default function App() {
  const [item, setItem] = useState<ItemKey>("sword");
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<Picked[]>([]);
  const [tracked, setTracked] = useState<Record<string, boolean>>({});
  const [existingUses, setExistingUses] = useState(0);
  const [renameCost, setRenameCost] = useState(false);
  const [optimizerMode, setOptimizerMode] = useState<"auto" | "exact" | "fast">("auto");

  const itemLabel = ITEMS.find((x) => x.key === item)?.label ?? "Item";

  const available = useMemo(
    () =>
      ALL.filter(
        (e) =>
          e.appliesTo.includes(item) &&
          e.name.toLowerCase().includes(search.toLowerCase())
      ).sort((a, b) => a.name.localeCompare(b.name)),
    [item, search]
  );

  const evaluation = useMemo(
    () => evaluateBuild(picked, item, existingUses, renameCost, optimizerMode),
    [picked, item, existingUses, renameCost, optimizerMode]
  );

  useEffect(() => {
    setPicked([]);
    setTracked({});
  }, [item]);

  function toggleEnchant(name: string, max: number) {
    setPicked((current) => {
      const exists = current.find((entry) => entry.name === name);
      if (exists) return current;
      return [...current, { name, level: max }];
    });
    setTracked((current) => ({ ...current, [name]: true }));
  }

  function toggleTracked(name: string) {
    setTracked((current) => ({ ...current, [name]: !current[name] }));
  }

  function updateLevel(name: string, level: number) {
    setPicked((current) =>
      current.map((entry) => (entry.name === name ? { ...entry, level } : entry))
    );
  }

  function removeEnchant(name: string) {
    setPicked((current) => current.filter((entry) => entry.name !== name));
  }

  function clearAll() {
    setPicked([]);
    setTracked({});
  }

  return (
    <div className="page-shell">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Minecraft Enchantment Calculator</span>
          <h1>Advanced Enchantment Calculator for Vanilla & ExcellentEnchants</h1>
          <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>Inspired by WiseHosting</p>
          <p>
            This mode follows Java anvil mechanics much more closely: prior-work penalties apply to both
            inputs, the result keeps the higher anvil-use count plus one, and only sacrifice-side
            enchantments contribute transfer cost.
          </p>
          <div className="hero-badges">
            <span>{ALL.length} enchants loaded</span>
            <span>Java-style anvil mechanics</span>
            <span>Custom enchants retained</span>
            <span>
              {optimizerMode === "auto"
                ? (evaluation.mode === "fast" ? "Auto → Fast mode" : "Auto → Exact mode")
                : optimizerMode === "fast"
                  ? "Manual Fast mode"
                  : "Manual Exact mode"}
            </span>
          </div>
        </div>
        <div className="hero-card">
          <div className="stat"><strong>{available.length}</strong><span>Available for item</span></div>
          <div className="stat"><strong>{picked.length}</strong><span>Selected books</span></div>
          <div className="stat"><strong>{evaluation.totalAnvilCost}</strong><span>Total estimated cost</span></div>
        </div>
      </div>

      <div className="tool-grid">
        <section className="left-panel panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker">Tool setup</div>
              <h2>Select item and enchantments</h2>
            </div>
          </div>

          <div className="item-tabs">
            {ITEMS.map((entry) => (
              <button
                key={entry.key}
                className={entry.key === item ? "item-tab active" : "item-tab"}
                onClick={() => setItem(entry.key)}
              >
                {entry.icon}
                {entry.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
            <label className="search-box">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search enchantments"
              />
            </label>

            <div className="helper-note">
              Checkbox = visual tracker only. Use <strong>Add to build</strong> to add an enchant. Unchecking will not remove it from the build.
            </div>

            <div className="summary-card" style={{ marginBottom: 0 }}>
              <span>Base item prior work count</span>
              <input
                type="number"
                min={0}
                max={10}
                value={existingUses}
                onChange={(e) => setExistingUses(Math.max(0, Math.min(10, Number(e.target.value) || 0)))}
                style={{
                  width: "100%",
                  marginTop: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(128, 162, 255, 0.18)",
                  background: "#111533",
                  color: "white",
                  padding: "10px 12px",
                }}
              />
              <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, color: "#dbe2ff" }}>
                <input
                  type="checkbox"
                  checked={renameCost}
                  onChange={(e) => setRenameCost(e.target.checked)}
                />
                Add 1 level rename cost on final step
              </label>
            </div>

            <div className="summary-card" style={{ marginBottom: 0 }}>
              <span>Optimizer mode</span>
              <div className="mode-toggle">
                <button
                  type="button"
                  className={optimizerMode === "auto" ? "mode-pill active" : "mode-pill"}
                  onClick={() => setOptimizerMode("auto")}
                >
                  Auto
                </button>
                <button
                  type="button"
                  className={optimizerMode === "exact" ? "mode-pill active" : "mode-pill"}
                  onClick={() => setOptimizerMode("exact")}
                >
                  Exact
                </button>
                <button
                  type="button"
                  className={optimizerMode === "fast" ? "mode-pill active" : "mode-pill"}
                  onClick={() => setOptimizerMode("fast")}
                >
                  Fast
                </button>
              </div>
              <div style={{ marginTop: 12, color: "#b4bce3", lineHeight: 1.6, fontSize: "0.92rem" }}>
                Auto uses exact mode up to 8 enchants and switches to fast mode above that.
              </div>
            </div>
          </div>

          <div className="enchant-list">
            {available.map((enchant) => {
              const active = picked.some((entry) => entry.name === enchant.name);
              const checked = !!tracked[enchant.name];
              return (
                <div
                  key={enchant.name}
                  className={active || checked ? "enchant-card active" : "enchant-card"}
                >
                  <div className="enchant-top">
                    <label className="track-check">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTracked(enchant.name)}
                      />
                      <span className="fake-check">{checked ? "✓" : ""}</span>
                    </label>
                    <span className="enchant-name">{enchant.name}</span>
                    <span className={enchant.source === "Vanilla" ? "tag vanilla" : "tag excellent"}>
                      {enchant.source}
                    </span>
                  </div>
                  <div className="enchant-meta">
                    <span>Max {roman(enchant.max)}</span>
                    <span>Book mult. {getBookMultiplier(enchant)}</span>
                  </div>
                  <div className="enchant-actions">
                    <button
                      type="button"
                      className={active ? "mini-action added" : "mini-action"}
                      onClick={() => toggleEnchant(enchant.name, enchant.max)}
                      disabled={active}
                    >
                      {active ? "Added to build" : "Add to build"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="right-panel panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker">Selected build</div>
              <h2>{itemLabel} setup</h2>
            </div>
            <Sparkles size={18} />
          </div>

          <div className="summary-grid">
            <div className="summary-card">
              <span>Book merge cost</span>
              <strong>{evaluation.mergePlan?.totalCost ?? 0}</strong>
            </div>
            <div className="summary-card">
              <span>Final apply cost</span>
              <strong>{evaluation.finalApplyCost}</strong>
            </div>
          </div>

          <div className="selection-list">
            {evaluation.selected.length === 0 ? (
              <div className="empty-state">Pick enchanted books from the left to build your setup.</div>
            ) : (
              evaluation.selected.map((enchant) => (
                <div key={enchant.name} className="selection-row">
                  <div>
                    <div className="selection-title">{enchant.name}</div>
                    <div className="selection-subtitle">{enchant.source}</div>
                  </div>
                  <div className="selection-actions">
                    <select
                      value={enchant.level}
                      onChange={(e) => updateLevel(enchant.name, Number(e.target.value))}
                    >
                      {Array.from({ length: enchant.max }, (_, i) => i + 1).map((level) => (
                        <option key={level} value={level}>
                          {roman(level)}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="mini-action danger" onClick={() => removeEnchant(enchant.name)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="status-card">
            {evaluation.conflicts.length === 0 && evaluation.itemProblems.length === 0 ? (
              <div className="ok-line">
                <CheckCircle2 size={18} />
                No conflicts for this item.
              </div>
            ) : (
              <div className="warn-wrap">
                <div className="warn-line">
                  <AlertTriangle size={18} />
                  Build needs changes
                </div>
                <ul>
                  {[...evaluation.itemProblems, ...evaluation.conflicts].map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="summary-card" style={{ marginTop: 16 }}>
            <span>Notes about mechanics mode</span>
            <div style={{ color: "#dbe2ff", lineHeight: 1.7 }}>
              Vanilla enchant multipliers use Minecraft wiki values where available. Custom ExcellentEnchants
              costs now come from your uploaded plugin config AnvilCost values and are converted to book-side cost with a halved-cost rule.
            </div>
            {evaluation.mode === "fast" && (
              <div style={{ marginTop: 12, color: "#8cd8ff" }}>
                Fast mode is active. It uses a greedy merge order to keep the site responsive on larger builds.
              </div>
            )}
            {evaluation.mode === "exact" && (
              <div style={{ marginTop: 12, color: "#9ff3c4" }}>
                Exact mode is active. This checks all merge orders for the selected books.
              </div>
            )}
            {evaluation.tooExpensive && (
              <div style={{ marginTop: 12, color: "#ffd07f" }}>
                Warning: at least one step is above 39 levels, so Java survival would reject it as Too Expensive.
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button className="item-tab" onClick={clearAll}>Clear books</button>
          </div>
        </section>
      </div>

      <section className="anvil-panel panel">
        <div className="panel-header">
          <div>
            <div className="panel-kicker">Anvil order</div>
            <h2>Java-style lowest-cost merge flow</h2>
          </div>
          <Hammer size={18} />
        </div>

        {!evaluation.mergePlan ? (
          <div className="empty-state">
            Add valid enchantments first. The optimizer only runs when the selected books are compatible with the chosen item.
          </div>
        ) : (
          <div className="anvil-steps">
            {evaluation.mergePlan.node.steps.map((step) => {
              const finalApply = step.left === itemLabel;
              return (
                <div className="anvil-step" key={step.step}>
                  <div className="step-number">{step.step}</div>

                  <div className="merge-input">
                    <div className={`book-card ${finalApply ? "item-card" : ""}`}>
                      <div className="book-icon">{finalApply ? <Shield size={22} /> : <BookOpen size={22} />}</div>
                      <div className="book-label">{step.left}</div>
                    </div>

                    <div className="merge-mid">
                      <div className="merge-dot"><Plus size={14} /></div>
                    </div>

                    <div className="book-card">
                      <div className="book-icon"><BookOpen size={22} /></div>
                      <div className="book-label">{step.right}</div>
                    </div>
                  </div>

                  <div className="merge-arrow"><ChevronRight size={18} /></div>

                  <div className="merge-output-wrap">
                    <div className="cost-label">Cost: {step.cost}</div>
                    <div className="book-card output-card">
                      <div className="book-icon">{finalApply ? <Sparkles size={22} /> : <BookOpen size={22} />}</div>
                      <div className="book-label">{step.result}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="footer-note">
          For up to 8 enchants, the calculator uses exact Java-style merge-order optimization. Above 8 enchants,
          it switches to a fast greedy mode so the page stays responsive while still giving a strong low-cost order.
        </div>
      </section>
    </div>
  );
}
