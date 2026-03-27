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
  | "sword"
  | "pickaxe"
  | "bow"
  | "boots"
  | "helmet"
  | "fishing_rod"
  | "trident";

type Enchant = {
  name: string;
  max: number;
  source: "Vanilla" | "ExcellentEnchants";
  appliesTo: ItemKey[];
  incompatible?: string[];
  kind: "damage" | "utility" | "protection" | "loot" | "mobility";
};

const ITEMS: { key: ItemKey; label: string; icon: JSX.Element }[] = [
  { key: "sword", label: "Sword", icon: <Swords size={18} /> },
  { key: "pickaxe", label: "Pickaxe", icon: <Pickaxe size={18} /> },
  { key: "bow", label: "Bow", icon: <Crosshair size={18} /> },
  { key: "boots", label: "Boots", icon: <Zap size={18} /> },
  { key: "helmet", label: "Helmet", icon: <Shield size={18} /> },
  { key: "fishing_rod", label: "Fishing Rod", icon: <Fish size={18} /> },
  { key: "trident", label: "Trident", icon: <Wrench size={18} /> },
];

const ENCHANTS: Enchant[] = [
  { name: "Sharpness", max: 5, source: "Vanilla", appliesTo: ["sword"], incompatible: ["Smite"], kind: "damage" },
  { name: "Smite", max: 5, source: "Vanilla", appliesTo: ["sword"], incompatible: ["Sharpness"], kind: "damage" },
  { name: "Looting", max: 3, source: "Vanilla", appliesTo: ["sword"], kind: "loot" },
  { name: "Mending", max: 1, source: "Vanilla", appliesTo: ["sword", "pickaxe", "bow", "boots", "helmet", "fishing_rod", "trident"], kind: "utility" },
  { name: "Efficiency", max: 5, source: "Vanilla", appliesTo: ["pickaxe"], kind: "utility" },
  { name: "Fortune", max: 3, source: "Vanilla", appliesTo: ["pickaxe"], incompatible: ["Silk Touch"], kind: "loot" },
  { name: "Silk Touch", max: 1, source: "Vanilla", appliesTo: ["pickaxe"], incompatible: ["Fortune", "Smelter"], kind: "utility" },
  { name: "Power", max: 5, source: "Vanilla", appliesTo: ["bow"], kind: "damage" },
  { name: "Infinity", max: 1, source: "Vanilla", appliesTo: ["bow"], incompatible: ["Mending"], kind: "utility" },
  { name: "Protection", max: 4, source: "Vanilla", appliesTo: ["boots", "helmet"], incompatible: ["Fire Protection"], kind: "protection" },
  { name: "Fire Protection", max: 4, source: "Vanilla", appliesTo: ["boots", "helmet"], incompatible: ["Protection"], kind: "protection" },
  { name: "Feather Falling", max: 4, source: "Vanilla", appliesTo: ["boots"], kind: "mobility" },
  { name: "Lure", max: 3, source: "Vanilla", appliesTo: ["fishing_rod"], kind: "utility" },
  { name: "Luck of the Sea", max: 3, source: "Vanilla", appliesTo: ["fishing_rod"], kind: "loot" },
  { name: "Loyalty", max: 3, source: "Vanilla", appliesTo: ["trident"], incompatible: ["Riptide"], kind: "utility" },
  { name: "Riptide", max: 3, source: "Vanilla", appliesTo: ["trident"], incompatible: ["Loyalty"], kind: "mobility" },

  { name: "Vampire", max: 3, source: "ExcellentEnchants", appliesTo: ["sword", "trident"], kind: "damage" },
  { name: "Thunder", max: 5, source: "ExcellentEnchants", appliesTo: ["sword", "trident"], kind: "damage" },
  { name: "Telekinesis", max: 1, source: "ExcellentEnchants", appliesTo: ["pickaxe"], kind: "utility" },
  { name: "Smelter", max: 5, source: "ExcellentEnchants", appliesTo: ["pickaxe"], incompatible: ["Silk Touch"], kind: "utility" },
  { name: "Veinminer", max: 3, source: "ExcellentEnchants", appliesTo: ["pickaxe"], incompatible: ["Tunnel"], kind: "utility" },
  { name: "Tunnel", max: 3, source: "ExcellentEnchants", appliesTo: ["pickaxe"], incompatible: ["Veinminer"], kind: "utility" },
  { name: "Sniper", max: 2, source: "ExcellentEnchants", appliesTo: ["bow"], kind: "damage" },
  { name: "Withered Arrows", max: 3, source: "ExcellentEnchants", appliesTo: ["bow"], kind: "damage" },
  { name: "Speed", max: 2, source: "ExcellentEnchants", appliesTo: ["boots"], kind: "mobility" },
  { name: "Jumping", max: 2, source: "ExcellentEnchants", appliesTo: ["boots"], kind: "mobility" },
  { name: "Night Vision", max: 1, source: "ExcellentEnchants", appliesTo: ["helmet"], kind: "utility" },
  { name: "Water Breathing", max: 1, source: "ExcellentEnchants", appliesTo: ["helmet"], kind: "utility" },
  { name: "Double Catch", max: 3, source: "ExcellentEnchants", appliesTo: ["fishing_rod"], kind: "loot" },
  { name: "Auto Reel", max: 1, source: "ExcellentEnchants", appliesTo: ["fishing_rod"], kind: "utility" },
  { name: "Infernus", max: 3, source: "ExcellentEnchants", appliesTo: ["trident"], kind: "damage" },
  { name: "Paralyze", max: 5, source: "ExcellentEnchants", appliesTo: ["trident"], kind: "damage" },
];

type Picked = { name: string; level: number };

function levelsToCost(picks: Picked[]) {
  return picks.reduce((sum, pick) => sum + pick.level * 2, 0);
}

function roman(value: number) {
  const map = ["", "I", "II", "III", "IV", "V"];
  return map[value] ?? String(value);
}

export default function App() {
  const [item, setItem] = useState<ItemKey>("sword");
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<Picked[]>([]);

  const available = useMemo(
    () =>
      ENCHANTS.filter(
        (e) =>
          e.appliesTo.includes(item) &&
          e.name.toLowerCase().includes(search.toLowerCase())
      ),
    [item, search]
  );

  const pickedDetailed = picked
    .map((p) => {
      const enchant = ENCHANTS.find((e) => e.name === p.name);
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
          <h1>WiseHosting-inspired dark UI for your enchant planner</h1>
          <p>
            A hosting-style layout with dark navy panels, blue/green glow accents,
            compact cards, and a cleaner two-column tool view.
          </p>
          <div className="hero-badges">
            <span>Vanilla + ExcellentEnchants</span>
            <span>Conflict Checker</span>
            <span>XP Estimate</span>
          </div>
        </div>
        <div className="hero-card">
          <div className="stat"><strong>{available.length}</strong><span>Available enchants</span></div>
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
            This is a visual redesign patch. It changes the layout toward a WiseHosting-style
            dark tool page while keeping the app easier to maintain.
          </div>
        </section>
      </div>
    </div>
  );
}
