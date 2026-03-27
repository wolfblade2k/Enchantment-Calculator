import { useMemo, useState } from "react";
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

type Picked = { name: string; level: number };

function roman(value: number) {
  const map = ["", "I", "II", "III", "IV", "V", "VI"];
  return map[value] ?? String(value);
}

function levelsToCost(picks: Picked[]) {
  return picks.reduce((sum, pick) => sum + pick.level * 2, 0);
}

export default function App() {
  const [item, setItem] = useState<ItemKey>("sword");
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<Picked[]>([]);

  const available = useMemo(
    () =>
      ALL.filter(
        (e) =>
          e.appliesTo.includes(item) &&
          e.name.toLowerCase().includes(search.toLowerCase())
      ).sort((a, b) => a.name.localeCompare(b.name)),
    [item, search]
  );

  const pickedDetailed = picked
    .map((p) => {
      const enchant = ALL.find((e) => e.name === p.name);
      return enchant ? { ...enchant, level: p.level } : null;
    })
    .filter(Boolean) as (Enchant & { level: number })[];

  const conflicts = useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i < pickedDetailed.length; i++) {
      for (let j = i + 1; j < pickedDetailed.length; j++) {
        const a = pickedDetailed[i];
        const b = pickedDetailed[j];
        if (a.incompatible?.includes(b.name) || b.incompatible?.includes(a.name)) {
          list.push(`${a.name} conflicts with ${b.name}`);
        }
      }
    }
    return list;
  }, [pickedDetailed]);

  const totalCost = levelsToCost(picked);
  const totalBooks = picked.length;

  function toggleEnchant(name: string, max: number) {
    setPicked((current) => {
      const exists = current.find((entry) => entry.name === name);
      if (exists) return current.filter((entry) => entry.name !== name);
      return [...current, { name, level: max }];
    });
  }

  function updateLevel(name: string, level: number) {
    setPicked((current) =>
      current.map((entry) => (entry.name === name ? { ...entry, level } : entry))
    );
  }

  return (
    <div className="page-shell">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Minecraft Enchantment Calculator</span>
          <h1>WiseHosting-inspired UI with the full enchant list</h1>
          <p>
            This version restores the larger vanilla and ExcellentEnchants dataset
            while keeping the same dark hosting-style layout.
          </p>
          <div className="hero-badges">
            <span>{ALL.length} enchants loaded</span>
            <span>Vanilla + ExcellentEnchants</span>
            <span>Conflict Checker</span>
          </div>
        </div>
        <div className="hero-card">
          <div className="stat"><strong>{available.length}</strong><span>Available for item</span></div>
          <div className="stat"><strong>{picked.length}</strong><span>Selected enchants</span></div>
          <div className="stat"><strong>{totalCost}</strong><span>XP estimate</span></div>
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

          <label className="search-box">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search enchantments"
            />
          </label>

          <div className="enchant-list">
            {available.map((enchant) => {
              const active = picked.some((entry) => entry.name === enchant.name);
              return (
                <button
                  key={enchant.name}
                  className={active ? "enchant-card active" : "enchant-card"}
                  onClick={() => toggleEnchant(enchant.name, enchant.max)}
                >
                  <div className="enchant-top">
                    <span className="enchant-name">{enchant.name}</span>
                    <span className={enchant.source === "Vanilla" ? "tag vanilla" : "tag excellent"}>
                      {enchant.source}
                    </span>
                  </div>
                  <div className="enchant-meta">
                    <span>Max {roman(enchant.max)}</span>
                    <span>{enchant.kind}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="right-panel panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker">Selected build</div>
              <h2>{ITEMS.find((x) => x.key === item)?.label} setup</h2>
            </div>
            <Sparkles size={18} />
          </div>

          <div className="summary-grid">
            <div className="summary-card">
              <span>Enchantments</span>
              <strong>{totalBooks}</strong>
            </div>
            <div className="summary-card">
              <span>XP estimate</span>
              <strong>{totalCost}</strong>
            </div>
          </div>

          <div className="selection-list">
            {pickedDetailed.length === 0 ? (
              <div className="empty-state">Pick enchantments from the left to build your setup.</div>
            ) : (
              pickedDetailed.map((enchant) => (
                <div key={enchant.name} className="selection-row">
                  <div>
                    <div className="selection-title">{enchant.name}</div>
                    <div className="selection-subtitle">{enchant.source}</div>
                  </div>
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
                </div>
              ))
            )}
          </div>

          <div className="status-card">
            {conflicts.length === 0 ? (
              <div className="ok-line">
                <CheckCircle2 size={18} />
                No incompatibility conflicts found.
              </div>
            ) : (
              <div className="warn-wrap">
                <div className="warn-line">
                  <AlertTriangle size={18} />
                  Conflicts detected
                </div>
                <ul>
                  {conflicts.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="footer-note">
            Full enchant dataset restored. If your server has custom plugin config values,
            those can still differ from stock defaults.
          </div>
        </section>
      </div>
    </div>
  );
}
