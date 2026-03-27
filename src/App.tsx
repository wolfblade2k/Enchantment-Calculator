import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Trash2, ShieldAlert, Sparkles, BookOpen, Zap, Anvil, Sword, Calculator, Wand2, AlertTriangle, Gem, Shuffle } from "lucide-react";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const toRoman = (value) => ROMAN[value] || String(value);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const ITEM_GROUPS = [
  "helmet",
  "chestplate",
  "leggings",
  "boots",
  "elytra",
  "sword",
  "axe",
  "pickaxe",
  "shovel",
  "hoe",
  "bow",
  "crossbow",
  "trident",
  "fishing_rod",
  "mace",
  "shears",
  "shield",
  "book",
  "any",
];

const VANILLA = [
  { name: "Protection", source: "Vanilla", category: "Armor", maxLevel: 4, items: ["helmet", "chestplate", "leggings", "boots"], incompatible: ["Fire Protection", "Blast Protection", "Projectile Protection"], weight: 1, summary: "General damage reduction." },
  { name: "Fire Protection", source: "Vanilla", category: "Armor", maxLevel: 4, items: ["helmet", "chestplate", "leggings", "boots"], incompatible: ["Protection", "Blast Protection", "Projectile Protection"], weight: 2, summary: "Extra fire damage reduction." },
  { name: "Blast Protection", source: "Vanilla", category: "Armor", maxLevel: 4, items: ["helmet", "chestplate", "leggings", "boots"], incompatible: ["Protection", "Fire Protection", "Projectile Protection"], weight: 4, summary: "Extra explosion protection." },
  { name: "Projectile Protection", source: "Vanilla", category: "Armor", maxLevel: 4, items: ["helmet", "chestplate", "leggings", "boots"], incompatible: ["Protection", "Fire Protection", "Blast Protection"], weight: 2, summary: "Extra projectile protection." },
  { name: "Respiration", source: "Vanilla", category: "Armor", maxLevel: 3, items: ["helmet"], incompatible: [], weight: 4, summary: "Breathe underwater longer." },
  { name: "Aqua Affinity", source: "Vanilla", category: "Armor", maxLevel: 1, items: ["helmet"], incompatible: [], weight: 4, summary: "Mine faster underwater." },
  { name: "Thorns", source: "Vanilla", category: "Armor", maxLevel: 3, items: ["helmet", "chestplate", "leggings", "boots"], incompatible: [], weight: 4, summary: "Damages attackers." },
  { name: "Depth Strider", source: "Vanilla", category: "Armor", maxLevel: 3, items: ["boots"], incompatible: ["Frost Walker"], weight: 2, summary: "Move faster underwater." },
  { name: "Frost Walker", source: "Vanilla", category: "Armor", maxLevel: 2, items: ["boots"], incompatible: ["Depth Strider", "Flame Walker"], weight: 4, summary: "Freeze water underfoot." },
  { name: "Feather Falling", source: "Vanilla", category: "Armor", maxLevel: 4, items: ["boots"], incompatible: ["Rebound"], weight: 1, summary: "Reduces fall damage." },
  { name: "Soul Speed", source: "Vanilla", category: "Armor", maxLevel: 3, items: ["boots"], incompatible: [], weight: 4, summary: "Move faster on soul blocks." },
  { name: "Swift Sneak", source: "Vanilla", category: "Armor", maxLevel: 3, items: ["leggings"], incompatible: [], weight: 4, summary: "Sneak faster." },
  { name: "Density", source: "Vanilla", category: "Weapon", maxLevel: 5, items: ["mace"], incompatible: ["Breach"], weight: 4, summary: "More smash damage from height." },
  { name: "Breach", source: "Vanilla", category: "Weapon", maxLevel: 4, items: ["mace"], incompatible: ["Density"], weight: 4, summary: "Reduces armor effectiveness on smash attacks." },
  { name: "Wind Burst", source: "Vanilla", category: "Weapon", maxLevel: 3, items: ["mace"], incompatible: [], weight: 4, summary: "Launch upward after smash attack." },
  { name: "Sharpness", source: "Vanilla", category: "Weapon", maxLevel: 5, items: ["sword", "axe"], incompatible: ["Smite", "Bane of Arthropods"], weight: 1, summary: "Extra melee damage." },
  { name: "Smite", source: "Vanilla", category: "Weapon", maxLevel: 5, items: ["sword", "axe"], incompatible: ["Sharpness", "Bane of Arthropods"], weight: 2, summary: "Extra damage to undead." },
  { name: "Bane of Arthropods", source: "Vanilla", category: "Weapon", maxLevel: 5, items: ["sword", "axe"], incompatible: ["Sharpness", "Smite"], weight: 2, summary: "Extra damage to arthropods." },
  { name: "Knockback", source: "Vanilla", category: "Weapon", maxLevel: 2, items: ["sword"], incompatible: [], weight: 2, summary: "Knocks targets back." },
  { name: "Fire Aspect", source: "Vanilla", category: "Weapon", maxLevel: 2, items: ["sword"], incompatible: ["Ice Aspect"], weight: 4, summary: "Sets targets on fire." },
  { name: "Looting", source: "Vanilla", category: "Weapon", maxLevel: 3, items: ["sword"], incompatible: ["Curse of Misfortune"], weight: 2, summary: "More mob drops." },
  { name: "Sweeping Edge", source: "Vanilla", category: "Weapon", maxLevel: 3, items: ["sword"], incompatible: [], weight: 2, summary: "Stronger sweeping attacks." },
  { name: "Efficiency", source: "Vanilla", category: "Tool", maxLevel: 5, items: ["pickaxe", "axe", "shovel", "hoe", "shears"], incompatible: [], weight: 1, summary: "Mine or use faster." },
  { name: "Silk Touch", source: "Vanilla", category: "Tool", maxLevel: 1, items: ["pickaxe", "axe", "shovel", "hoe", "shears"], incompatible: ["Fortune", "Smelter", "Silk Spawner"], weight: 4, summary: "Drops blocks themselves." },
  { name: "Fortune", source: "Vanilla", category: "Tool", maxLevel: 3, items: ["pickaxe", "axe", "shovel", "hoe"], incompatible: ["Silk Touch", "Curse of Misfortune"], weight: 2, summary: "More block drops." },
  { name: "Power", source: "Vanilla", category: "Bow", maxLevel: 5, items: ["bow"], incompatible: [], weight: 1, summary: "More arrow damage." },
  { name: "Punch", source: "Vanilla", category: "Bow", maxLevel: 2, items: ["bow"], incompatible: [], weight: 4, summary: "More bow knockback." },
  { name: "Flame", source: "Vanilla", category: "Bow", maxLevel: 1, items: ["bow"], incompatible: [], weight: 4, summary: "Sets arrows on fire." },
  { name: "Infinity", source: "Vanilla", category: "Bow", maxLevel: 1, items: ["bow"], incompatible: ["Mending"], weight: 4, summary: "One arrow is enough." },
  { name: "Multishot", source: "Vanilla", category: "Bow", maxLevel: 1, items: ["crossbow"], incompatible: ["Piercing"], weight: 4, summary: "Shoots 3 projectiles." },
  { name: "Quick Charge", source: "Vanilla", category: "Bow", maxLevel: 3, items: ["crossbow"], incompatible: [], weight: 2, summary: "Reload faster." },
  { name: "Piercing", source: "Vanilla", category: "Bow", maxLevel: 4, items: ["crossbow"], incompatible: ["Multishot"], weight: 1, summary: "Arrows pass through entities." },
  { name: "Impaling", source: "Vanilla", category: "Weapon", maxLevel: 5, items: ["trident"], incompatible: [], weight: 2, summary: "More trident damage." },
  { name: "Loyalty", source: "Vanilla", category: "Weapon", maxLevel: 3, items: ["trident"], incompatible: ["Riptide"], weight: 1, summary: "Trident returns." },
  { name: "Riptide", source: "Vanilla", category: "Weapon", maxLevel: 3, items: ["trident"], incompatible: ["Loyalty", "Channeling"], weight: 2, summary: "Launches the player in water or rain." },
  { name: "Channeling", source: "Vanilla", category: "Weapon", maxLevel: 1, items: ["trident"], incompatible: ["Riptide"], weight: 4, summary: "Summons lightning in storms." },
  { name: "Luck of the Sea", source: "Vanilla", category: "Fishing", maxLevel: 3, items: ["fishing_rod"], incompatible: [], weight: 2, summary: "Better fishing loot." },
  { name: "Lure", source: "Vanilla", category: "Fishing", maxLevel: 3, items: ["fishing_rod"], incompatible: [], weight: 2, summary: "Fish bite faster." },
  { name: "Unbreaking", source: "Vanilla", category: "Universal", maxLevel: 3, items: ["helmet", "chestplate", "leggings", "boots", "elytra", "sword", "axe", "pickaxe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "mace", "shears", "shield"], incompatible: ["Curse of Breaking"], weight: 1, summary: "Items lose durability less often." },
  { name: "Mending", source: "Vanilla", category: "Universal", maxLevel: 1, items: ["helmet", "chestplate", "leggings", "boots", "elytra", "sword", "axe", "pickaxe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "mace", "shears", "shield"], incompatible: ["Infinity"], weight: 2, summary: "Repairs with XP." },
  { name: "Curse of Binding", source: "Vanilla", category: "Universal", maxLevel: 1, items: ["helmet", "chestplate", "leggings", "boots", "elytra"], incompatible: [], weight: 8, summary: "Armor cannot be removed." },
  { name: "Curse of Vanishing", source: "Vanilla", category: "Universal", maxLevel: 1, items: ["helmet", "chestplate", "leggings", "boots", "elytra", "sword", "axe", "pickaxe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "mace", "shears", "shield"], incompatible: ["Soulbound"], weight: 8, summary: "Item disappears on death." },
];

const EXCELLENT = [
  { name: "Cold Steel", source: "ExcellentEnchants", category: "Armor", maxLevel: 3, items: ["helmet", "chestplate", "leggings", "boots", "elytra"], incompatible: [], weight: 1, summary: "Applies Mining Fatigue to the attacker." },
  { name: "Darkness Cloak", source: "ExcellentEnchants", category: "Armor", maxLevel: 3, items: ["helmet", "chestplate", "leggings", "boots", "elytra"], incompatible: [], weight: 1, summary: "Applies Darkness to the attacker." },
  { name: "Dragon Heart", source: "ExcellentEnchants", category: "Armor", maxLevel: 5, items: ["chestplate", "elytra"], incompatible: [], weight: 1, summary: "Passive Health Boost." },
  { name: "Elemental Protection", source: "ExcellentEnchants", category: "Armor", maxLevel: 4, items: ["helmet", "chestplate", "leggings", "boots"], incompatible: [], weight: 1, summary: "Reduces potion and elemental damage." },
  { name: "Fire Shield", source: "ExcellentEnchants", category: "Armor", maxLevel: 4, items: ["helmet", "chestplate", "leggings", "boots", "elytra"], incompatible: [], weight: 1, summary: "Ignites the attacker." },
  { name: "Flame Walker", source: "ExcellentEnchants", category: "Armor", maxLevel: 2, items: ["boots"], incompatible: ["Frost Walker"], weight: 1, summary: "Walk on lava, ignore magma damage." },
  { name: "Hardened", source: "ExcellentEnchants", category: "Armor", maxLevel: 2, items: ["helmet", "chestplate", "leggings", "boots", "elytra"], incompatible: [], weight: 1, summary: "Resistance when hit." },
  { name: "Ice Shield", source: "ExcellentEnchants", category: "Armor", maxLevel: 3, items: ["helmet", "chestplate", "leggings", "boots", "elytra"], incompatible: [], weight: 1, summary: "Freezes and slows the attacker." },
  { name: "Jumping", source: "ExcellentEnchants", category: "Armor", maxLevel: 2, items: ["boots"], incompatible: [], weight: 1, summary: "Jump Boost." },
  { name: "Kamikadze", source: "ExcellentEnchants", category: "Armor", maxLevel: 3, items: ["chestplate", "elytra"], incompatible: [], weight: 1, summary: "Explodes on death." },
  { name: "Lightweight", source: "ExcellentEnchants", category: "Armor", maxLevel: 1, items: ["boots"], incompatible: [], weight: 1, summary: "Protects turtle eggs, farmland, and dripleaf." },
  { name: "Night Vision", source: "ExcellentEnchants", category: "Armor", maxLevel: 1, items: ["helmet"], incompatible: [], weight: 1, summary: "Night Vision." },
  { name: "Rebound", source: "ExcellentEnchants", category: "Armor", maxLevel: 1, items: ["boots"], incompatible: ["Feather Falling"], weight: 1, summary: "Bounce like a slime block." },
  { name: "Regrowth", source: "ExcellentEnchants", category: "Armor", maxLevel: 4, items: ["chestplate", "elytra"], incompatible: [], weight: 1, summary: "Regenerates hearts over time." },
  { name: "Saturation", source: "ExcellentEnchants", category: "Armor", maxLevel: 2, items: ["helmet"], incompatible: [], weight: 1, summary: "Restores food over time." },
  { name: "Speed", source: "ExcellentEnchants", category: "Armor", maxLevel: 2, items: ["boots"], incompatible: [], weight: 1, summary: "Speed effect." },
  { name: "Stopping Force", source: "ExcellentEnchants", category: "Armor", maxLevel: 3, items: ["chestplate", "elytra"], incompatible: [], weight: 1, summary: "Reduces knockback taken." },
  { name: "Water Breathing", source: "ExcellentEnchants", category: "Armor", maxLevel: 1, items: ["helmet"], incompatible: [], weight: 1, summary: "Water Breathing." },
  { name: "Bomber", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Ender Bow", "Ghast", "Confusing Arrows", "Darkness Arrows", "Dragonfire Arrows", "Electrified Arrows", "Explosive Arrows", "Flare", "Hover", "Lingering", "Poisoned Arrows", "Vampiric Arrows", "Withered Arrows"], weight: 1, summary: "Shoots TNT." },
  { name: "Confusing Arrows", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Applies Nausea." },
  { name: "Darkness Arrows", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Applies Darkness." },
  { name: "Dragonfire Arrows", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Applies Dragon's Breath." },
  { name: "Electrified Arrows", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Summons lightning." },
  { name: "Ender Bow", source: "ExcellentEnchants", category: "Bow", maxLevel: 1, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ghast"], weight: 1, summary: "Shoots Ender Pearls." },
  { name: "Explosive Arrows", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Explodes on hit." },
  { name: "Flare", source: "ExcellentEnchants", category: "Bow", maxLevel: 1, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Places a torch." },
  { name: "Ghast", source: "ExcellentEnchants", category: "Bow", maxLevel: 1, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow"], weight: 1, summary: "Shoots fireballs." },
  { name: "Hover", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Applies Levitation." },
  { name: "Lingering", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Lingering cloud on hit." },
  { name: "Poisoned Arrows", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Applies Poison." },
  { name: "Sniper", source: "ExcellentEnchants", category: "Bow", maxLevel: 2, items: ["bow", "crossbow"], incompatible: [], weight: 1, summary: "Faster projectiles." },
  { name: "Vampiric Arrows", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Heals on hit." },
  { name: "Withered Arrows", source: "ExcellentEnchants", category: "Bow", maxLevel: 3, items: ["bow", "crossbow"], incompatible: ["Bomber", "Ender Bow", "Ghast"], weight: 1, summary: "Applies Wither." },
  { name: "Blast Mining", source: "ExcellentEnchants", category: "Tool", maxLevel: 5, items: ["pickaxe"], incompatible: ["Tunnel", "Veinminer"], weight: 1, summary: "Mines with explosions." },
  { name: "Glass Breaker", source: "ExcellentEnchants", category: "Tool", maxLevel: 1, items: ["pickaxe", "axe", "shovel", "hoe", "shears"], incompatible: [], weight: 1, summary: "Breaks glass instantly." },
  { name: "Haste", source: "ExcellentEnchants", category: "Tool", maxLevel: 3, items: ["pickaxe", "axe", "shovel", "hoe", "shears"], incompatible: [], weight: 1, summary: "Haste while mining." },
  { name: "Lucky Miner", source: "ExcellentEnchants", category: "Tool", maxLevel: 3, items: ["pickaxe"], incompatible: [], weight: 1, summary: "More XP from blocks." },
  { name: "Replanter", source: "ExcellentEnchants", category: "Tool", maxLevel: 1, items: ["hoe"], incompatible: [], weight: 1, summary: "Replants crops." },
  { name: "Silk Chest", source: "ExcellentEnchants", category: "Tool", maxLevel: 1, items: ["pickaxe", "axe", "shovel", "hoe"], incompatible: [], weight: 1, summary: "Drops loaded chests." },
  { name: "Silk Spawner", source: "ExcellentEnchants", category: "Tool", maxLevel: 1, items: ["pickaxe"], incompatible: ["Smelter", "Silk Touch"], weight: 1, summary: "Chance to drop spawners." },
  { name: "Smelter", source: "ExcellentEnchants", category: "Tool", maxLevel: 5, items: ["pickaxe", "axe", "shovel", "hoe", "shears"], incompatible: ["Silk Touch", "Silk Spawner"], weight: 1, summary: "Auto-smelts drops." },
  { name: "Telekinesis", source: "ExcellentEnchants", category: "Tool", maxLevel: 1, items: ["pickaxe", "axe", "shovel", "hoe", "shears"], incompatible: [], weight: 1, summary: "Drops go to inventory." },
  { name: "Treefeller", source: "ExcellentEnchants", category: "Tool", maxLevel: 1, items: ["axe"], incompatible: [], weight: 1, summary: "Cuts whole trees." },
  { name: "Tunnel", source: "ExcellentEnchants", category: "Tool", maxLevel: 3, items: ["pickaxe", "axe", "shovel", "hoe"], incompatible: ["Veinminer", "Blast Mining"], weight: 1, summary: "Mines an area." },
  { name: "Veinminer", source: "ExcellentEnchants", category: "Tool", maxLevel: 3, items: ["pickaxe"], incompatible: ["Tunnel", "Blast Mining"], weight: 1, summary: "Mines whole veins." },
  { name: "Auto Reel", source: "ExcellentEnchants", category: "Fishing", maxLevel: 1, items: ["fishing_rod"], incompatible: [], weight: 1, summary: "Auto-reels fish." },
  { name: "Curse of Drowned", source: "ExcellentEnchants", category: "Fishing", maxLevel: 3, items: ["fishing_rod"], incompatible: [], weight: 1, summary: "Chance to fish a drowned." },
  { name: "Double Catch", source: "ExcellentEnchants", category: "Fishing", maxLevel: 3, items: ["fishing_rod"], incompatible: [], weight: 1, summary: "Double fishing catch." },
  { name: "River Master", source: "ExcellentEnchants", category: "Fishing", maxLevel: 5, items: ["fishing_rod"], incompatible: [], weight: 1, summary: "Longer casts." },
  { name: "Seasoned Angler", source: "ExcellentEnchants", category: "Fishing", maxLevel: 3, items: ["fishing_rod"], incompatible: [], weight: 1, summary: "More fishing XP." },
  { name: "Survivalist", source: "ExcellentEnchants", category: "Fishing", maxLevel: 1, items: ["fishing_rod"], incompatible: [], weight: 1, summary: "Auto-cooks fish." },
  { name: "Bane of Netherspawn", source: "ExcellentEnchants", category: "Weapon", maxLevel: 5, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "More damage to nether mobs." },
  { name: "Blindness", source: "ExcellentEnchants", category: "Weapon", maxLevel: 2, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "Applies Blindness." },
  { name: "Confusion", source: "ExcellentEnchants", category: "Weapon", maxLevel: 2, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "Applies Nausea." },
  { name: "Cure", source: "ExcellentEnchants", category: "Weapon", maxLevel: 3, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "Cures zombified piglins and villagers." },
  { name: "Curse of Death", source: "ExcellentEnchants", category: "Weapon", maxLevel: 3, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "You may die after a player kill." },
  { name: "Cutter", source: "ExcellentEnchants", category: "Weapon", maxLevel: 3, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "Damages armor." },
  { name: "Decapitator", source: "ExcellentEnchants", category: "Weapon", maxLevel: 2, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "Drops heads." },
  { name: "Double Strike", source: "ExcellentEnchants", category: "Weapon", maxLevel: 2, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "Chance to deal double damage." },
  { name: "Exhaust", source: "ExcellentEnchants", category: "Weapon", maxLevel: 4, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "Applies Hunger." },
  { name: "Ice Aspect", source: "ExcellentEnchants", category: "Weapon", maxLevel: 3, items: ["sword", "axe"], incompatible: ["Fire Aspect"], weight: 1, summary: "Freezes and slows targets." },
  { name: "Infernus", source: "ExcellentEnchants", category: "Weapon", maxLevel: 3, items: ["trident"], incompatible: [], weight: 1, summary: "Tridents set targets on fire." },
  { name: "Nimble", source: "ExcellentEnchants", category: "Weapon", maxLevel: 1, items: ["sword", "axe", "trident"], incompatible: [], weight: 1, summary: "Drops go to inventory." },
  { name: "Paralyze", source: "ExcellentEnchants", category: "Weapon", maxLevel: 5, items: ["sword", "axe", "trident"], incompatible: [], weight: 1, summary: "Applies Mining Fatigue." },
  { name: "Rage", source: "ExcellentEnchants", category: "Weapon", maxLevel: 2, items: ["sword", "axe", "trident"], incompatible: [], weight: 1, summary: "Strength in combat." },
  { name: "Rocket", source: "ExcellentEnchants", category: "Weapon", maxLevel: 3, items: ["sword", "axe", "trident"], incompatible: [], weight: 1, summary: "Launches targets upward." },
  { name: "Swiper", source: "ExcellentEnchants", category: "Weapon", maxLevel: 3, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "Steals XP." },
  { name: "Temper", source: "ExcellentEnchants", category: "Weapon", maxLevel: 5, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "More damage on low HP." },
  { name: "Thrifty", source: "ExcellentEnchants", category: "Weapon", maxLevel: 3, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "Drops spawn eggs." },
  { name: "Thunder", source: "ExcellentEnchants", category: "Weapon", maxLevel: 5, items: ["sword", "axe", "trident"], incompatible: [], weight: 1, summary: "Summons lightning." },
  { name: "Vampire", source: "ExcellentEnchants", category: "Weapon", maxLevel: 3, items: ["sword", "axe", "trident"], incompatible: [], weight: 1, summary: "Steals health." },
  { name: "Venom", source: "ExcellentEnchants", category: "Weapon", maxLevel: 2, items: ["sword", "axe", "trident"], incompatible: [], weight: 1, summary: "Applies Poison." },
  { name: "Village Defender", source: "ExcellentEnchants", category: "Weapon", maxLevel: 5, items: ["sword", "axe"], incompatible: [], weight: 1, summary: "More damage to illagers." },
  { name: "Wisdom", source: "ExcellentEnchants", category: "Weapon", maxLevel: 5, items: ["sword", "axe", "trident"], incompatible: [], weight: 1, summary: "More XP from mobs." },
  { name: "Wither", source: "ExcellentEnchants", category: "Weapon", maxLevel: 2, items: ["sword", "axe", "trident"], incompatible: [], weight: 1, summary: "Applies Wither." },
  { name: "Curse of Breaking", source: "ExcellentEnchants", category: "Universal", maxLevel: 3, items: ["helmet", "chestplate", "leggings", "boots", "elytra", "sword", "axe", "pickaxe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "mace", "shears", "shield"], incompatible: ["Unbreaking"], weight: 1, summary: "Uses more durability." },
  { name: "Curse of Fragility", source: "ExcellentEnchants", category: "Universal", maxLevel: 1, items: ["helmet", "chestplate", "leggings", "boots", "elytra", "sword", "axe", "pickaxe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "mace", "shears", "shield"], incompatible: [], weight: 1, summary: "Cannot be grindstoned or anviled." },
  { name: "Curse of Mediocrity", source: "ExcellentEnchants", category: "Universal", maxLevel: 3, items: ["sword", "axe", "pickaxe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "mace"], incompatible: [], weight: 1, summary: "Disenchants loot." },
  { name: "Curse of Misfortune", source: "ExcellentEnchants", category: "Universal", maxLevel: 3, items: ["sword", "axe", "pickaxe", "shovel", "hoe"], incompatible: ["Fortune", "Looting"], weight: 1, summary: "Zeroes block and mob loot." },
  { name: "Restore", source: "ExcellentEnchants", category: "Universal", maxLevel: 3, items: ["helmet", "chestplate", "leggings", "boots", "elytra", "sword", "axe", "pickaxe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "mace", "shears", "shield"], incompatible: [], weight: 1, summary: "Saves an item from breaking once." },
  { name: "Soulbound", source: "ExcellentEnchants", category: "Universal", maxLevel: 1, items: ["helmet", "chestplate", "leggings", "boots", "elytra", "sword", "axe", "pickaxe", "shovel", "hoe", "bow", "crossbow", "trident", "fishing_rod", "mace", "shears", "shield"], incompatible: ["Curse of Vanishing"], weight: 1, summary: "Keeps item on death." },
];

const ENCHANTS = [...VANILLA, ...EXCELLENT].sort((a, b) => a.name.localeCompare(b.name));
const ENCHANT_BY_NAME = Object.fromEntries(ENCHANTS.map((e) => [e.name, e]));
const CATEGORIES = ["All", ...Array.from(new Set(ENCHANTS.map((e) => e.category)))];
const SOURCES = ["All", "Vanilla", "ExcellentEnchants"];
const TARGET_ITEMS = [
  { value: "sword", label: "Sword" },
  { value: "axe", label: "Axe" },
  { value: "pickaxe", label: "Pickaxe" },
  { value: "shovel", label: "Shovel" },
  { value: "hoe", label: "Hoe" },
  { value: "bow", label: "Bow" },
  { value: "crossbow", label: "Crossbow" },
  { value: "trident", label: "Trident" },
  { value: "mace", label: "Mace" },
  { value: "helmet", label: "Helmet" },
  { value: "chestplate", label: "Chestplate" },
  { value: "leggings", label: "Leggings" },
  { value: "boots", label: "Boots" },
  { value: "elytra", label: "Elytra" },
  { value: "fishing_rod", label: "Fishing Rod" },
  { value: "shield", label: "Shield" },
  { value: "shears", label: "Shears" },
];

function canApplyToItem(enchant, item) {
  return enchant.items.includes(item) || enchant.items.includes("any");
}

function hasConflict(a, b) {
  const aSet = new Set(a.incompatible);
  const bSet = new Set(b.incompatible);
  return aSet.has(b.name) || bSet.has(a.name);
}

function priorPenalty(uses) {
  return uses <= 0 ? 0 : 2 ** uses - 1;
}

function buildBookNode(entry) {
  const enchant = ENCHANT_BY_NAME[entry.name];
  return {
    key: entry.name,
    name: `${entry.name} ${toRoman(entry.level)}`,
    enchants: [{ ...enchant, level: entry.level }],
    uses: 0,
    totalCostWeight: (enchant.weight || 1) * entry.level,
    steps: [],
  };
}

function mergeNodes(target, sacrifice) {
  const targetNames = new Set(target.enchants.map((e) => e.name));
  const duplicateNames = target.enchants.filter((e) => targetNames.has(e.name));
  const mergedEnchants = [...target.enchants];
  sacrifice.enchants.forEach((e) => {
    const existingIndex = mergedEnchants.findIndex((x) => x.name === e.name);
    if (existingIndex >= 0) {
      const existing = mergedEnchants[existingIndex];
      const newLevel = existing.level === e.level ? Math.min(existing.level + 1, existing.maxLevel) : Math.max(existing.level, e.level);
      mergedEnchants[existingIndex] = { ...existing, level: newLevel };
    } else {
      mergedEnchants.push(e);
    }
  });
  const transferCost = sacrifice.enchants.reduce((sum, e) => {
    const targetMatch = target.enchants.find((x) => x.name === e.name);
    const level = targetMatch && targetMatch.level === e.level ? Math.min(e.level + 1, e.maxLevel) : e.level;
    return sum + (e.weight || 1) * level;
  }, 0);
  const combineCost = priorPenalty(target.uses) + priorPenalty(sacrifice.uses) + transferCost;
  return {
    key: `${target.key}+${sacrifice.key}`,
    name: `${target.name} + ${sacrifice.name}`,
    enchants: mergedEnchants,
    uses: Math.max(target.uses, sacrifice.uses) + 1,
    totalCostWeight: mergedEnchants.reduce((sum, e) => sum + (e.weight || 1) * e.level, 0),
    steps: [...target.steps, ...sacrifice.steps, `Combine ${target.name} with ${sacrifice.name} → ${combineCost} levels`],
    combineCost,
  };
}

function optimizeBookMerge(selectedBooks) {
  if (!selectedBooks.length) return null;
  if (selectedBooks.length === 1) return { finalBook: buildBookNode(selectedBooks[0]), internalCost: 0 };

  const nodes = selectedBooks.map(buildBookNode);
  const memo = new Map();

  function solve(mask) {
    if (memo.has(mask)) return memo.get(mask);
    const idxs = nodes.map((_, i) => i).filter((i) => mask & (1 << i));
    if (idxs.length === 1) {
      const result = { cost: 0, node: nodes[idxs[0]] };
      memo.set(mask, result);
      return result;
    }

    let best = null;
    let sub = (mask - 1) & mask;
    while (sub) {
      const other = mask ^ sub;
      if (sub < other) {
        const left = solve(sub);
        const right = solve(other);
        const candidates = [
          mergeNodes(left.node, right.node),
          mergeNodes(right.node, left.node),
        ];
        candidates.forEach((node) => {
          const totalCost = left.cost + right.cost + node.combineCost;
          if (!best || totalCost < best.cost) best = { cost: totalCost, node };
        });
      }
      sub = (sub - 1) & mask;
    }

    memo.set(mask, best);
    return best;
  }

  return { finalBook: solve((1 << nodes.length) - 1).node, internalCost: solve((1 << nodes.length) - 1).cost };
}

function evaluateBuild(entries, targetItem, existingUses, renameCost) {
  const selected = entries.map((entry) => ({ ...ENCHANT_BY_NAME[entry.name], level: entry.level }));
  const conflicts = [];
  const itemProblems = [];

  selected.forEach((enchant) => {
    if (!canApplyToItem(enchant, targetItem)) itemProblems.push(`${enchant.name} cannot be applied to ${targetItem.replace("_", " ")}.`);
  });

  for (let i = 0; i < selected.length; i += 1) {
    for (let j = i + 1; j < selected.length; j += 1) {
      if (hasConflict(selected[i], selected[j])) conflicts.push(`${selected[i].name} conflicts with ${selected[j].name}`);
    }
  }

  const mergePlan = optimizeBookMerge(entries);
  const finalApplyCost = mergePlan
    ? priorPenalty(existingUses) + priorPenalty(mergePlan.finalBook.uses) + mergePlan.finalBook.totalCostWeight + (renameCost ? 1 : 0)
    : 0;
  const totalAnvilCost = (mergePlan?.internalCost || 0) + finalApplyCost;
  const tooExpensive = finalApplyCost > 39;

  return {
    selected,
    conflicts,
    itemProblems,
    mergePlan,
    finalApplyCost,
    totalAnvilCost,
    tooExpensive,
  };
}

function pixelClass(source) {
  return source === "Vanilla"
    ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-200"
    : "border-violet-400/50 bg-violet-500/10 text-violet-200";
}

function numberClamp(value, min, max) {
  const n = Number(value);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export default function ExcellentEnchantsCalculator() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [targetItem, setTargetItem] = useState("sword");
  const [selected, setSelected] = useState([]);
  const [chargesToRestore, setChargesToRestore] = useState(1);
  const [existingUses, setExistingUses] = useState(0);
  const [renameCost, setRenameCost] = useState(false);
  const [successChance, setSuccessChance] = useState(100);
  const [destroyChance, setDestroyChance] = useState(0);
  const [protectScroll, setProtectScroll] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ENCHANTS.filter((enchant) => {
      const categoryOk = category === "All" || enchant.category === category;
      const sourceOk = sourceFilter === "All" || enchant.source === sourceFilter;
      const textOk = !q || enchant.name.toLowerCase().includes(q) || enchant.summary.toLowerCase().includes(q);
      return categoryOk && sourceOk && textOk;
    });
  }, [search, category, sourceFilter]);

  const evaluation = useMemo(() => evaluateBuild(selected, targetItem, existingUses, renameCost), [selected, targetItem, existingUses, renameCost]);

  const addEnchant = (enchant) => {
    setSelected((current) => {
      if (current.some((entry) => entry.name === enchant.name)) return current;
      return [...current, { name: enchant.name, level: enchant.maxLevel }];
    });
  };

  const randomizeValidBuild = () => {
    const applicable = ENCHANTS.filter((e) => canApplyToItem(e, targetItem));
    const shuffled = [...applicable].sort(() => Math.random() - 0.5);
    const next = [];
    for (const enchant of shuffled) {
      const candidate = [...next, { name: enchant.name, level: enchant.maxLevel }];
      const result = evaluateBuild(candidate, targetItem, 0, false);
      if (result.conflicts.length === 0 && result.itemProblems.length === 0) next.push({ name: enchant.name, level: enchant.maxLevel });
      if (next.length >= 7) break;
    }
    setSelected(next);
  };

  const updateLevel = (name, level) => {
    setSelected((current) => current.map((entry) => (entry.name === name ? { ...entry, level } : entry)));
  };

  const removeEnchant = (name) => {
    setSelected((current) => current.filter((entry) => entry.name !== name));
  };

  const clearBuild = () => setSelected([]);

  const totalSelectedLevels = evaluation.selected.reduce((sum, e) => sum + e.level, 0);
  const rechargeCost = selected.length * Math.max(0, Number(chargesToRestore) || 0);
  const successRate = numberClamp(successChance, 0, 100);
  const failRate = 100 - successRate;
  const destroyRate = protectScroll ? 0 : Math.min(failRate, numberClamp(destroyChance, 0, 100));
  const safeFailRate = Math.max(0, failRate - destroyRate);

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_40%),linear-gradient(180deg,#0f172a_0%,#020617_100%)] p-5 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-black/25 p-6 shadow-2xl backdrop-blur">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-200">Vanilla + ExcellentEnchants</Badge>
                <Badge className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-amber-100">Minecraft-styled planner</Badge>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">ExcellentEnchants Calculator</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                Plan full endgame gear, validate incompatibilities, estimate Java-style anvil cost, compute the cheapest book merge order, calculate charge refills, and optionally model success-rate systems some servers add on top.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-xs text-slate-400">Enchants loaded</div><div className="mt-1 text-2xl font-bold">{ENCHANTS.length}</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-xs text-slate-400">Selected</div><div className="mt-1 text-2xl font-bold">{selected.length}</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-xs text-slate-400">Levels</div><div className="mt-1 text-2xl font-bold">{totalSelectedLevels}</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-xs text-slate-400">Target</div><div className="mt-1 text-lg font-bold capitalize">{targetItem.replace("_", " ")}</div></div>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="planner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-black/30 p-1">
            <TabsTrigger value="planner" className="rounded-xl">Planner</TabsTrigger>
            <TabsTrigger value="anvil" className="rounded-xl">Anvil</TabsTrigger>
            <TabsTrigger value="charges" className="rounded-xl">Charges</TabsTrigger>
            <TabsTrigger value="chance" className="rounded-xl">Chance</TabsTrigger>
          </TabsList>

          <TabsContent value="planner" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="rounded-3xl border-white/10 bg-black/25 shadow-2xl backdrop-blur">
              <CardHeader>
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl"><BookOpen className="h-6 w-6" /> Enchantment library</CardTitle>
                    <p className="mt-2 text-sm text-slate-400">Search stock ExcellentEnchants plus vanilla enchantments, then add them to your target item build.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Select value={targetItem} onValueChange={setTargetItem}>
                      <SelectTrigger className="border-white/10 bg-white/5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TARGET_ITEMS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="relative min-w-[210px]">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search enchantments" className="border-white/10 bg-white/5 pl-9" />
                    </div>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="border-white/10 bg-white/5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                      <SelectTrigger className="border-white/10 bg-white/5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SOURCES.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[650px] rounded-3xl border border-white/10 bg-slate-950/50 p-3">
                  <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                    {filtered.map((enchant) => {
                      const added = selected.some((entry) => entry.name === enchant.name);
                      const compatible = canApplyToItem(enchant, targetItem);
                      return (
                        <motion.div key={enchant.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                          <Card className="h-full rounded-3xl border-white/10 bg-white/[0.03] shadow-none">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-lg font-bold leading-tight">{enchant.name}</div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge className={`rounded-full border ${pixelClass(enchant.source)}`}>{enchant.source}</Badge>
                                    <Badge variant="outline" className="rounded-full border-white/15 text-slate-300">{enchant.category}</Badge>
                                    <Badge variant="outline" className="rounded-full border-white/15 text-slate-300">Max {toRoman(enchant.maxLevel)}</Badge>
                                  </div>
                                </div>
                                <Button size="icon" onClick={() => addEnchant(enchant)} disabled={added} className="rounded-2xl">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="mt-3 text-sm leading-6 text-slate-300">{enchant.summary}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Badge variant="outline" className={compatible ? "rounded-full border-emerald-400/25 text-emerald-300" : "rounded-full border-red-400/25 text-red-300"}>
                                  {compatible ? "Applies to target" : "Wrong item type"}
                                </Badge>
                                <Badge variant="outline" className="rounded-full border-white/15 text-slate-300">Weight {enchant.weight}</Badge>
                              </div>
                              {enchant.incompatible.length > 0 && (
                                <div className="mt-4">
                                  <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Incompatible with</div>
                                  <div className="flex flex-wrap gap-2">
                                    {enchant.incompatible.map((item) => <Badge key={`${enchant.name}-${item}`} variant="outline" className="rounded-full border-amber-400/20 text-amber-200">{item}</Badge>)}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-3xl border-white/10 bg-black/25 shadow-2xl backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-2xl"><Sparkles className="h-6 w-6" /> Current build</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={randomizeValidBuild} className="rounded-2xl border-white/10 bg-white/5"><Shuffle className="mr-2 h-4 w-4" /> Random valid</Button>
                      <Button variant="outline" onClick={clearBuild} className="rounded-2xl border-white/10 bg-white/5">Clear</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {evaluation.selected.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm text-slate-400">Pick enchantments from the library to start building your gear.</div>
                  ) : (
                    evaluation.selected.map((enchant) => (
                      <div key={enchant.name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-bold">{enchant.name}</div>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
                              <span>{enchant.category}</span>
                              <span>•</span>
                              <span>{enchant.source}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeEnchant(enchant.name)} className="rounded-2xl"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="text-sm text-slate-400">Level</span>
                          <Select value={String(enchant.level)} onValueChange={(value) => updateLevel(enchant.name, Number(value))}>
                            <SelectTrigger className="w-28 border-white/10 bg-white/5"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: enchant.maxLevel }, (_, i) => i + 1).map((lvl) => <SelectItem key={lvl} value={String(lvl)}>{toRoman(lvl)}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Badge variant="outline" className="rounded-full border-white/15 text-slate-300">Max {toRoman(enchant.maxLevel)}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-white/10 bg-black/25 shadow-2xl backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl"><ShieldAlert className="h-6 w-6" /> Validation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-slate-500">Conflicts</div><div className="mt-1 text-3xl font-black">{evaluation.conflicts.length}</div></div>
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-slate-500">Item issues</div><div className="mt-1 text-3xl font-black">{evaluation.itemProblems.length}</div></div>
                  </div>
                  <Separator className="bg-white/10" />
                  {evaluation.conflicts.length === 0 && evaluation.itemProblems.length === 0 ? (
                    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">This build is internally valid for the chosen target item.</div>
                  ) : (
                    <div className="space-y-3">
                      {evaluation.itemProblems.map((issue) => <div key={issue} className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{issue}</div>)}
                      {evaluation.conflicts.map((issue) => <div key={issue} className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">{issue}</div>)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anvil" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-3xl border-white/10 bg-black/25 shadow-2xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><Anvil className="h-6 w-6" /> Anvil combine calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">Existing prior work on the base item</div>
                    <Input type="number" min={0} max={10} value={existingUses} onChange={(e) => setExistingUses(numberClamp(e.target.value, 0, 10))} className="border-white/10 bg-white/5" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">Rename in final step</div>
                    <Button onClick={() => setRenameCost((v) => !v)} variant="outline" className={`w-full rounded-2xl border-white/10 ${renameCost ? "bg-emerald-500/15 text-emerald-200" : "bg-white/5 text-slate-300"}`}>{renameCost ? "Rename cost included" : "No rename cost"}</Button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-slate-500">Merge books cost</div><div className="mt-1 text-3xl font-black">{evaluation.mergePlan ? evaluation.mergePlan.steps.filter((s) => s.startsWith("Combine")).reduce((sum, step) => sum + Number(step.match(/→ (\d+) levels/)?.[1] || 0), 0) : 0}</div></div>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-slate-500">Final apply cost</div><div className="mt-1 text-3xl font-black">{evaluation.finalApplyCost}</div></div>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-slate-500">Total estimated levels</div><div className="mt-1 text-3xl font-black">{evaluation.totalAnvilCost}</div></div>
                </div>
                {evaluation.tooExpensive && <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">The final anvil operation is estimated above 39 levels, so Java survival would show Too Expensive unless you reduce prior work or split the build differently.</div>}
                {!evaluation.mergePlan && <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-sm text-slate-400">Add enchantments in Planner first to generate a merge order.</div>}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/10 bg-black/25 shadow-2xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><Calculator className="h-6 w-6" /> Cheapest book merge order</CardTitle>
              </CardHeader>
              <CardContent>
                {evaluation.mergePlan ? (
                  <div className="space-y-3">
                    {evaluation.mergePlan.finalBook.steps.length > 0 ? evaluation.mergePlan.finalBook.steps.map((step, index) => (
                      <div key={`${step}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200">{index + 1}. {step}</div>
                    )) : <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">Single book selected. No internal merging needed.</div>}
                    <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-violet-200/80">Final step</div>
                      <div className="mt-2 text-sm leading-6 text-violet-100">Apply the merged book stack to your {targetItem.replace("_", " ")} for an estimated <span className="font-black">{evaluation.finalApplyCost}</span> levels.</div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm text-slate-400">Your merge order will appear here after you add enchantments.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charges" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <Card className="rounded-3xl border-white/10 bg-black/25 shadow-2xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><Zap className="h-6 w-6" /> Charges refill</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-slate-300">ExcellentEnchants charges cost 1 XP level per charge, per enchantment when you recharge an item in an anvil.</p>
                <div className="space-y-2">
                  <div className="text-sm text-slate-400">Charges to restore</div>
                  <Input type="number" min={0} value={chargesToRestore} onChange={(e) => setChargesToRestore(e.target.value)} className="border-white/10 bg-white/5" />
                </div>
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">Estimated refill cost</div>
                  <div className="mt-2 text-4xl font-black text-emerald-100">{rechargeCost}</div>
                  <div className="mt-2 text-sm text-emerald-200/80">Formula: selected enchantments × charges restored</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/10 bg-black/25 shadow-2xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><Gem className="h-6 w-6" /> Refill summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {evaluation.selected.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm text-slate-400">Add enchantments in Planner to see which ones would count toward a charge refill.</div>
                ) : (
                  evaluation.selected.map((enchant) => (
                    <div key={`charge-${enchant.name}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div>
                        <div className="font-semibold">{enchant.name} {toRoman(enchant.level)}</div>
                        <div className="text-xs text-slate-500">{enchant.source}</div>
                      </div>
                      <Badge variant="outline" className="rounded-full border-emerald-400/20 text-emerald-200">+{Math.max(0, Number(chargesToRestore) || 0)} charges</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chance" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-3xl border-white/10 bg-black/25 shadow-2xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><Wand2 className="h-6 w-6" /> Optional success calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                  This section is for servers that add custom success / destroy systems on top of vanilla or ExcellentEnchants. Stock ExcellentEnchants itself does not use success percentages for normal enchanting.
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">Success chance %</div>
                    <Input type="number" min={0} max={100} value={successChance} onChange={(e) => setSuccessChance(numberClamp(e.target.value, 0, 100))} className="border-white/10 bg-white/5" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">Destroy chance on failure %</div>
                    <Input type="number" min={0} max={100} value={destroyChance} onChange={(e) => setDestroyChance(numberClamp(e.target.value, 0, 100))} className="border-white/10 bg-white/5" />
                  </div>
                </div>
                <Button onClick={() => setProtectScroll((v) => !v)} variant="outline" className={`w-full rounded-2xl border-white/10 ${protectScroll ? "bg-sky-500/15 text-sky-100" : "bg-white/5 text-slate-300"}`}>
                  {protectScroll ? "Protection enabled: destroy chance becomes 0%" : "No protection item enabled"}
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/10 bg-black/25 shadow-2xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><Sword className="h-6 w-6" /> Outcome breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4"><div className="text-xs text-emerald-200/80">Success</div><div className="mt-1 text-3xl font-black text-emerald-100">{successRate}%</div></div>
                  <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-4"><div className="text-xs text-amber-200/80">Fail but item survives</div><div className="mt-1 text-3xl font-black text-amber-100">{safeFailRate}%</div></div>
                  <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4"><div className="text-xs text-red-200/80">Destroyed</div><div className="mt-1 text-3xl font-black text-red-100">{destroyRate}%</div></div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-300">
                  For one attempt, your expected failure rate is <span className="font-bold">{failRate}%</span>. With protection {protectScroll ? "enabled" : "disabled"}, the item destruction risk is <span className="font-bold">{destroyRate}%</span>.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="rounded-3xl border-white/10 bg-black/25 shadow-2xl backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl"><AlertTriangle className="h-6 w-6" /> Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
            <p>This calculator includes stock vanilla enchantments and the stock ExcellentEnchants list.</p>
            <p>The anvil planner uses a Java-style estimate for prior work penalties and book merge ordering. It is intended as a planning tool, not a perfect server-side simulator.</p>
            <p>Server owners can override ExcellentEnchants behavior in config files, including max levels, items, conflicts, charges, and distribution, so custom servers may differ.</p>
            <p>The optional success-rate tab is only for servers that layer extra custom mechanics on top of vanilla or ExcellentEnchants.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
