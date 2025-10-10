import type { Foot, Position } from "@domain/player/types";
import type { ClubTemplate, LeagueData, PlayerTemplate } from "./premierLeague";
import { premierLeagueData } from "./premierLeague";

type Strength = "elite" | "contender" | "challenger" | "solid" | "rising" | "developing";

interface SyntheticLeagueConfig {
  id: string;
  name: string;
  nation: string;
  level: number;
  nationCode: string;
  clubs: SyntheticClubConfig[];
}

interface SyntheticClubConfig {
  id: string;
  name: string;
  shortName: string;
  colors: string[];
  strength: Strength;
  formation?: string;
  mentality?: ClubTemplate["mentality"];
  tempo?: number;
  press?: number;
  transferBudget?: number;
  wageBudget?: number;
  rep?: number;
  marketValue?: number;
  nationality?: string;
  qualityDelta?: number;
}

interface NamePool {
  first: string[];
  last: string[];
}

const strengthPresets: Record<Strength, { baseAbility: number; rep: number; transferBudget: number; wageBudget: number; tempo: number; press: number }> = {
  elite: { baseAbility: 162, rep: 9050, transferBudget: 120_000_000, wageBudget: 2_600_000, tempo: 66, press: 68 },
  contender: { baseAbility: 152, rep: 8600, transferBudget: 80_000_000, wageBudget: 1_900_000, tempo: 64, press: 66 },
  challenger: { baseAbility: 144, rep: 8100, transferBudget: 55_000_000, wageBudget: 1_300_000, tempo: 62, press: 64 },
  solid: { baseAbility: 136, rep: 7600, transferBudget: 34_000_000, wageBudget: 950_000, tempo: 60, press: 62 },
  rising: { baseAbility: 128, rep: 7000, transferBudget: 22_000_000, wageBudget: 700_000, tempo: 58, press: 60 },
  developing: { baseAbility: 120, rep: 6400, transferBudget: 12_000_000, wageBudget: 480_000, tempo: 56, press: 58 }
};

const abilityOffsets = [8, 4, -4, 0, 6, -2, -6, 3, 5, -5, 7, -3, 2, -1, 4, -4, 6, -6, 1, -2];

const squadBlueprint: { positions: Position[]; preferredFoot?: Foot }[] = [
  { positions: ["GK"], preferredFoot: "Right" },
  { positions: ["RB"], preferredFoot: "Right" },
  { positions: ["CB"], preferredFoot: "Right" },
  { positions: ["CB"], preferredFoot: "Left" },
  { positions: ["LB"], preferredFoot: "Left" },
  { positions: ["DM"], preferredFoot: "Right" },
  { positions: ["CM"], preferredFoot: "Right" },
  { positions: ["CM"], preferredFoot: "Left" },
  { positions: ["AM"], preferredFoot: "Right" },
  { positions: ["RW"], preferredFoot: "Left" },
  { positions: ["LW"], preferredFoot: "Right" },
  { positions: ["ST"], preferredFoot: "Right" },
  { positions: ["GK"], preferredFoot: "Left" },
  { positions: ["CB"], preferredFoot: "Right" },
  { positions: ["RB", "LB"], preferredFoot: "Both" },
  { positions: ["DM", "CM"], preferredFoot: "Right" },
  { positions: ["CM"], preferredFoot: "Left" },
  { positions: ["AM", "RW"], preferredFoot: "Left" },
  { positions: ["ST"], preferredFoot: "Left" },
  { positions: ["LW", "ST"], preferredFoot: "Right" }
];

const namesByNation: Record<string, NamePool> = {
  ENG: { first: ["James", "Harry", "Declan", "Marcus", "Bukayo", "Phil"], last: ["Walker", "Smith", "Johnson", "Brown", "Wilson", "Taylor"] },
  ESP: { first: ["Pedro", "Sergio", "Iker", "Marco", "Unai", "Andrés"], last: ["García", "Hernández", "Alonso", "Martínez", "Ruiz", "Santos"] },
  ITA: { first: ["Marco", "Federico", "Lorenzo", "Nicolo", "Sandro", "Gianluca"], last: ["Rossi", "Bianchi", "Esposito", "Ferrari", "Mancini", "Romano"] },
  GER: { first: ["Jonas", "Lukas", "Leon", "Julian", "Timo", "Florian"], last: ["Müller", "Schmidt", "Schneider", "Fischer", "Becker", "Wagner"] },
  FRA: { first: ["Kylian", "Antoine", "Benjamin", "Theo", "Loïc", "Adrien"], last: ["Dupont", "Bernard", "Moreau", "Lefevre", "Roux", "Fontaine"] },
  NED: { first: ["Davy", "Memphis", "Stefan", "Jurrien", "Cody", "Xavi"], last: ["de Jong", "van Dijk", "Klaassen", "Bergkamp", "Koopmeiners", "Blind"] },
  PRT: { first: ["Rui", "João", "Gonçalo", "Pedro", "Nuno", "Tiago"], last: ["Silva", "Costa", "Pereira", "Ferreira", "Carvalho", "Santos"] },
  USA: { first: ["Tyler", "Christian", "Weston", "Brenden", "Giovanni", "Miles"], last: ["Adams", "Pulisic", "McKennie", "Aaronson", "Dest", "Zimmerman"] },
  BRA: { first: ["Gabriel", "Lucas", "Raphinha", "Danilo", "João", "Pedro"], last: ["Silva", "Souza", "Oliveira", "Costa", "Ferreira", "Alves"] },
  JPN: { first: ["Daichi", "Takumi", "Ritsu", "Wataru", "Takehiro", "Kaoru"], last: ["Tanaka", "Minamino", "Doan", "Endo", "Tomiyasu", "Mitoma"] }
};

const defaultNames: NamePool = {
  first: ["Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey"],
  last: ["Andersen", "Lopez", "Ivanov", "Petrov", "Khan", "Singh"]
};

function createSyntheticLeague(config: SyntheticLeagueConfig): LeagueData {
  return {
    id: config.id,
    name: config.name,
    nation: config.nation,
    level: config.level,
    clubs: config.clubs.map((club) => createSyntheticClub(club, config))
  };
}

function createSyntheticClub(club: SyntheticClubConfig, league: SyntheticLeagueConfig): ClubTemplate {
  const preset = strengthPresets[club.strength];
  const qualityDelta = club.qualityDelta ?? 0;
  const nationality = club.nationality ?? league.nationCode;
  const baseAbility = preset.baseAbility + qualityDelta;
  const marketValue =
    club.marketValue ??
    Math.round(Math.max(28_000_000, (baseAbility - 90) * (baseAbility - 88) * 60_000));
  const transferBudget = club.transferBudget ?? Math.round(marketValue * 0.085);
  const wageBudget = club.wageBudget ?? Math.round(Math.max(preset.wageBudget, marketValue * 0.0022));
  const rep =
    club.rep ?? Math.round(Math.min(9300, preset.rep + Math.log10(marketValue / 1_000_000) * 460));

  return {
    id: club.id,
    name: club.name,
    shortName: club.shortName,
    colors: club.colors,
    formation: club.formation ?? "4-3-3",
    mentality: club.mentality ?? "Balanced",
    tempo: club.tempo ?? preset.tempo,
    press: club.press ?? preset.press,
    rep,
    marketValue,
    transferBudget,
    wageBudget,
    players: createSyntheticSquad(club.id, nationality, baseAbility)
  };
}

export function createSyntheticSquad(
  clubId: string,
  nationality: string,
  baseAbility: number
): PlayerTemplate[] {
  const pool = namesByNation[nationality] ?? defaultNames;
  const seed = hashString(clubId);
  return squadBlueprint.map((slot, index) => {
    const first = pool.first[(index + seed) % pool.first.length];
    const last = pool.last[(index * 2 + seed) % pool.last.length];
    const ca = clamp(baseAbility + abilityOffsets[index % abilityOffsets.length], 94, 178);
    const pa = clamp(ca + 8 + ((index + seed) % 4) * 3, ca + 5, 190);
    const value = Math.round(Math.max(500_000, (ca ** 2) * 750));
    const wage = Math.round(Math.max(6_000, ca * 800));
    const foot: Foot = slot.preferredFoot ?? (index % 3 === 0 ? "Right" : index % 3 === 1 ? "Left" : "Both");

    return {
      id: `${clubId}-p${index + 1}`,
      name: `${first} ${last}`,
      age: 19 + ((index + seed) % 12),
      nationality,
      foot,
      positions: slot.positions,
      currentAbility: ca,
      potentialAbility: pa,
      value,
      wage,
      contractYears: 3 + ((index + seed) % 3)
    };
  });
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 97;
  }
  return hash;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const syntheticLeagues: LeagueData[] = [
  createSyntheticLeague({
    id: "la-liga",
    name: "La Liga",
    nation: "Spain",
    level: 1,
    nationCode: "ESP",
    clubs: [
      { id: "real-madrid", name: "Real Madrid", shortName: "RMA", colors: ["#ffffff", "#3a296d"], strength: "elite", mentality: "Positive", qualityDelta: 6, marketValue: 1_050_000_000 },
      { id: "barcelona", name: "FC Barcelona", shortName: "BAR", colors: ["#004d98", "#a50044"], strength: "elite", mentality: "Positive", tempo: 68, press: 70, marketValue: 1_020_000_000 },
      { id: "atletico-madrid", name: "Atlético Madrid", shortName: "ATL", colors: ["#c8102e", "#041e42"], strength: "contender", mentality: "Cautious", marketValue: 620_000_000 },
      { id: "real-sociedad", name: "Real Sociedad", shortName: "RSO", colors: ["#005aa7", "#ffffff"], strength: "challenger", marketValue: 410_000_000 },
      { id: "villarreal", name: "Villarreal", shortName: "VIL", colors: ["#fbe106", "#0b1f8c"], strength: "challenger", mentality: "Positive", marketValue: 360_000_000 },
      { id: "sevilla", name: "Sevilla", shortName: "SEV", colors: ["#ffffff", "#ff0000"], strength: "challenger", marketValue: 280_000_000 },
      { id: "real-betis", name: "Real Betis", shortName: "BET", colors: ["#00965e", "#ffffff"], strength: "solid", marketValue: 250_000_000 },
      { id: "athletic-club", name: "Athletic Club", shortName: "ATH", colors: ["#da1212", "#ffffff"], strength: "solid", marketValue: 305_000_000 },
      { id: "valencia", name: "Valencia CF", shortName: "VAL", colors: ["#ff8200", "#000000"], strength: "solid", marketValue: 220_000_000 },
      { id: "girona", name: "Girona FC", shortName: "GIR", colors: ["#e5002b", "#ffffff"], strength: "rising", marketValue: 215_000_000 }
    ]
  }),
  createSyntheticLeague({
    id: "serie-a",
    name: "Serie A",
    nation: "Italy",
    level: 1,
    nationCode: "ITA",
    clubs: [
      { id: "inter", name: "Inter", shortName: "INT", colors: ["#1b65be", "#000000"], strength: "elite", mentality: "Positive", press: 69, marketValue: 700_000_000 },
      { id: "juventus", name: "Juventus", shortName: "JUV", colors: ["#000000", "#ffffff"], strength: "elite", mentality: "Balanced", marketValue: 650_000_000 },
      { id: "ac-milan", name: "AC Milan", shortName: "MIL", colors: ["#a50044", "#000000"], strength: "contender", mentality: "Positive", marketValue: 560_000_000 },
      { id: "napoli", name: "Napoli", shortName: "NAP", colors: ["#0078d7", "#002654"], strength: "contender", marketValue: 520_000_000 },
      { id: "roma", name: "AS Roma", shortName: "ROM", colors: ["#8e1f1f", "#f7a81b"], strength: "challenger", marketValue: 380_000_000 },
      { id: "lazio", name: "Lazio", shortName: "LAZ", colors: ["#65aadb", "#ffffff"], strength: "challenger", marketValue: 360_000_000 },
      { id: "atalanta", name: "Atalanta", shortName: "ATA", colors: ["#1f4e8c", "#000000"], strength: "challenger", marketValue: 350_000_000 },
      { id: "fiorentina", name: "Fiorentina", shortName: "FIO", colors: ["#592d82", "#ffffff"], strength: "solid", marketValue: 290_000_000 },
      { id: "bologna", name: "Bologna", shortName: "BOL", colors: ["#a6192e", "#132257"], strength: "solid", marketValue: 240_000_000 },
      { id: "torino", name: "Torino", shortName: "TOR", colors: ["#7f1d1d", "#ffffff"], strength: "solid", marketValue: 210_000_000 }
    ]
  }),
  createSyntheticLeague({
    id: "bundesliga",
    name: "Bundesliga",
    nation: "Germany",
    level: 1,
    nationCode: "GER",
    clubs: [
      { id: "bayern", name: "Bayern Munich", shortName: "FCB", colors: ["#dc052d", "#0066b2"], strength: "elite", mentality: "Positive", tempo: 70, marketValue: 970_000_000 },
      { id: "dortmund", name: "Borussia Dortmund", shortName: "BVB", colors: ["#fdd102", "#000000"], strength: "contender", mentality: "Positive", marketValue: 650_000_000 },
      { id: "rb-leipzig", name: "RB Leipzig", shortName: "RBL", colors: ["#d72027", "#ffffff"], strength: "contender", marketValue: 510_000_000 },
      { id: "leverkusen", name: "Bayer Leverkusen", shortName: "B04", colors: ["#e32219", "#000000"], strength: "challenger", marketValue: 610_000_000 },
      { id: "union-berlin", name: "Union Berlin", shortName: "FCU", colors: ["#e31b23", "#f4c300"], strength: "challenger", mentality: "Cautious", marketValue: 220_000_000 },
      { id: "freiburg", name: "SC Freiburg", shortName: "SCF", colors: ["#000000", "#ffffff"], strength: "solid", marketValue: 210_000_000 },
      { id: "stuttgart", name: "VfB Stuttgart", shortName: "VFB", colors: ["#ed2939", "#ffffff"], strength: "solid", marketValue: 270_000_000 },
      { id: "frankfurt", name: "Eintracht Frankfurt", shortName: "SGE", colors: ["#e60026", "#000000"], strength: "solid", marketValue: 250_000_000 },
      { id: "monchengladbach", name: "Borussia M'Gladbach", shortName: "BMG", colors: ["#0b5c0b", "#ffffff"], strength: "solid", marketValue: 220_000_000 },
      { id: "wolfsburg", name: "Wolfsburg", shortName: "WOB", colors: ["#14b53a", "#ffffff"], strength: "solid", marketValue: 200_000_000 }
    ]
  }),
  createSyntheticLeague({
    id: "ligue-1",
    name: "Ligue 1",
    nation: "France",
    level: 1,
    nationCode: "FRA",
    clubs: [
      { id: "psg", name: "Paris Saint-Germain", shortName: "PSG", colors: ["#004170", "#e30613"], strength: "elite", mentality: "Positive", press: 72, marketValue: 890_000_000 },
      { id: "marseille", name: "Marseille", shortName: "OM", colors: ["#00a3e0", "#ffffff"], strength: "contender", mentality: "Positive", marketValue: 330_000_000 },
      { id: "monaco", name: "AS Monaco", shortName: "ASM", colors: ["#e2001a", "#ffffff"], strength: "contender", marketValue: 350_000_000 },
      { id: "lyon", name: "Lyon", shortName: "OL", colors: ["#273e8c", "#e60012"], strength: "challenger", marketValue: 320_000_000 },
      { id: "lille", name: "Lille", shortName: "LIL", colors: ["#e2001a", "#1b3f8b"], strength: "challenger", marketValue: 320_000_000 },
      { id: "rennes", name: "Rennes", shortName: "REN", colors: ["#e41b17", "#1d1d1b"], strength: "challenger", marketValue: 310_000_000 },
      { id: "nice", name: "Nice", shortName: "NCE", colors: ["#a00000", "#000000"], strength: "solid", marketValue: 290_000_000 },
      { id: "lens", name: "Lens", shortName: "RCL", colors: ["#f4d130", "#c30404"], strength: "solid", marketValue: 280_000_000 },
      { id: "nantes", name: "Nantes", shortName: "NAN", colors: ["#ffe600", "#007a33"], strength: "rising", marketValue: 145_000_000 },
      { id: "reims", name: "Reims", shortName: "REI", colors: ["#d40000", "#ffffff"], strength: "rising", marketValue: 170_000_000 }
    ]
  }),
  createSyntheticLeague({
    id: "eredivisie",
    name: "Eredivisie",
    nation: "Netherlands",
    level: 1,
    nationCode: "NED",
    clubs: [
      { id: "ajax", name: "Ajax", shortName: "AJA", colors: ["#ffffff", "#d20a0a"], strength: "contender", mentality: "Positive", marketValue: 360_000_000 },
      { id: "psv", name: "PSV", shortName: "PSV", colors: ["#ff0000", "#ffffff"], strength: "contender", marketValue: 310_000_000 },
      { id: "feyenoord", name: "Feyenoord", shortName: "FEY", colors: ["#ff0000", "#ffffff"], strength: "contender", marketValue: 320_000_000 },
      { id: "az-alkmaar", name: "AZ Alkmaar", shortName: "AZ", colors: ["#e2001a", "#000000"], strength: "challenger", marketValue: 220_000_000 },
      { id: "twente", name: "FC Twente", shortName: "TWE", colors: ["#d71920", "#ffffff"], strength: "challenger", marketValue: 180_000_000 },
      { id: "utrecht", name: "FC Utrecht", shortName: "UTR", colors: ["#d71920", "#005ca7"], strength: "solid", marketValue: 120_000_000 },
      { id: "heerenveen", name: "Heerenveen", shortName: "HEE", colors: ["#0b4ea2", "#ffffff"], strength: "solid", marketValue: 95_000_000 },
      { id: "vitesse", name: "Vitesse", shortName: "VIT", colors: ["#f6c800", "#000000"], strength: "solid", marketValue: 85_000_000 },
      { id: "groningen", name: "Groningen", shortName: "GRO", colors: ["#009639", "#ffffff"], strength: "rising", marketValue: 75_000_000 },
      { id: "nec", name: "NEC Nijmegen", shortName: "NEC", colors: ["#009639", "#e03c31"], strength: "rising", marketValue: 70_000_000 }
    ]
  }),
  createSyntheticLeague({
    id: "primeira-liga",
    name: "Primeira Liga",
    nation: "Portugal",
    level: 1,
    nationCode: "PRT",
    clubs: [
      { id: "benfica", name: "Benfica", shortName: "BEN", colors: ["#ff0000", "#ffffff"], strength: "contender", mentality: "Positive" },
      { id: "porto", name: "FC Porto", shortName: "FCP", colors: ["#0033a0", "#ffffff"], strength: "contender" },
      { id: "sporting", name: "Sporting CP", shortName: "SCP", colors: ["#00874b", "#ffffff"], strength: "contender" },
      { id: "braga", name: "SC Braga", shortName: "BRA", colors: ["#c4171d", "#ffffff"], strength: "challenger" },
      { id: "guimaraes", name: "Vitória SC", shortName: "GUI", colors: ["#ffffff", "#000000"], strength: "challenger" },
      { id: "boavista", name: "Boavista", shortName: "BOA", colors: ["#000000", "#ffffff"], strength: "solid" },
      { id: "rio-ave", name: "Rio Ave", shortName: "RIO", colors: ["#009639", "#ff8200"], strength: "solid" },
      { id: "famalicao", name: "Famalicão", shortName: "FAM", colors: ["#003a70", "#fdda24"], strength: "solid" },
      { id: "estoril", name: "Estoril", shortName: "EST", colors: ["#fdda24", "#0033a0"], strength: "rising" },
      { id: "gil-vicente", name: "Gil Vicente", shortName: "GIL", colors: ["#e00034", "#001489"], strength: "rising" }
    ]
  }),
  createSyntheticLeague({
    id: "mls",
    name: "Major League Soccer",
    nation: "United States",
    level: 1,
    nationCode: "USA",
    clubs: [
      { id: "la-galaxy", name: "LA Galaxy", shortName: "LAG", colors: ["#00245d", "#ffd200"], strength: "solid", mentality: "Positive" },
      { id: "la-fc", name: "LAFC", shortName: "LAFC", colors: ["#000000", "#c59d5f"], strength: "solid" },
      { id: "seattle", name: "Seattle Sounders", shortName: "SEA", colors: ["#2c68b1", "#66b32e"], strength: "solid" },
      { id: "atlanta", name: "Atlanta United", shortName: "ATL", colors: ["#a4000f", "#000000"], strength: "solid" },
      { id: "nycfc", name: "NYCFC", shortName: "NYC", colors: ["#6cadde", "#00285e"], strength: "solid" },
      { id: "inter-miami", name: "Inter Miami", shortName: "MIA", colors: ["#ff82ad", "#000000"], strength: "rising" },
      { id: "philadelphia", name: "Philadelphia Union", shortName: "PHI", colors: ["#002d55", "#b4975a"], strength: "solid" },
      { id: "toronto", name: "Toronto FC", shortName: "TOR", colors: ["#e31837", "#4b9cd3"], strength: "solid" },
      { id: "new-england", name: "New England Revolution", shortName: "NER", colors: ["#0a2240", "#c8102e"], strength: "rising" },
      { id: "columbus", name: "Columbus Crew", shortName: "CLB", colors: ["#fedd00", "#000000"], strength: "rising" }
    ]
  }),
  createSyntheticLeague({
    id: "brasileirao",
    name: "Brasileirão Série A",
    nation: "Brazil",
    level: 1,
    nationCode: "BRA",
    clubs: [
      { id: "flamengo", name: "Flamengo", shortName: "FLA", colors: ["#c8102e", "#000000"], strength: "contender", mentality: "Positive" },
      { id: "palmeiras", name: "Palmeiras", shortName: "PAL", colors: ["#006437", "#ffffff"], strength: "contender" },
      { id: "corinthians", name: "Corinthians", shortName: "COR", colors: ["#000000", "#ffffff"], strength: "challenger" },
      { id: "sao-paulo", name: "São Paulo", shortName: "SAO", colors: ["#ff0000", "#000000"], strength: "challenger" },
      { id: "gremio", name: "Grêmio", shortName: "GRE", colors: ["#0094d4", "#000000"], strength: "challenger" },
      { id: "internacional", name: "Internacional", shortName: "INT", colors: ["#ff0000", "#ffffff"], strength: "challenger" },
      { id: "atletico-mg", name: "Atlético Mineiro", shortName: "CAM", colors: ["#000000", "#ffffff"], strength: "challenger" },
      { id: "fluminense", name: "Fluminense", shortName: "FLU", colors: ["#900021", "#006341"], strength: "solid" },
      { id: "botafogo", name: "Botafogo", shortName: "BOT", colors: ["#000000", "#ffffff"], strength: "solid" },
      { id: "santos", name: "Santos", shortName: "SAN", colors: ["#000000", "#ffffff"], strength: "solid" }
    ]
  }),
  createSyntheticLeague({
    id: "j1-league",
    name: "J1 League",
    nation: "Japan",
    level: 1,
    nationCode: "JPN",
    clubs: [
      { id: "kawasaki-frontale", name: "Kawasaki Frontale", shortName: "KAW", colors: ["#00a0e9", "#000000"], strength: "challenger", mentality: "Positive" },
      { id: "yokohama-f-marinos", name: "Yokohama F. Marinos", shortName: "YFM", colors: ["#00205b", "#d22f27"], strength: "challenger" },
      { id: "kashima-antlers", name: "Kashima Antlers", shortName: "KAS", colors: ["#c8102e", "#00205b"], strength: "challenger" },
      { id: "urawa-reds", name: "Urawa Reds", shortName: "URW", colors: ["#c8102e", "#000000"], strength: "challenger" },
      { id: "cerezo-osaka", name: "Cerezo Osaka", shortName: "CER", colors: ["#ff5fa2", "#002a5c"], strength: "solid" },
      { id: "gamba-osaka", name: "Gamba Osaka", shortName: "GAM", colors: ["#0c1b3a", "#0091d4"], strength: "solid" },
      { id: "hiroshima", name: "Sanfrecce Hiroshima", shortName: "SAN", colors: ["#4c2f91", "#ffffff"], strength: "solid" },
      { id: "vissel-kobe", name: "Vissel Kobe", shortName: "VIS", colors: ["#9c1830", "#ffffff"], strength: "solid" },
      { id: "fc-tokyo", name: "FC Tokyo", shortName: "FCT", colors: ["#003da5", "#d50032"], strength: "solid" },
      { id: "nagoya", name: "Nagoya Grampus", shortName: "NAG", colors: ["#e60012", "#f8b500"], strength: "solid" }
    ]
  }),
  // Second tiers for the top six leagues
  createSyntheticLeague({
    id: "championship",
    name: "EFL Championship",
    nation: "England",
    level: 2,
    nationCode: "ENG",
    clubs: [
      { id: "leicester", name: "Leicester City", shortName: "LEI", colors: ["#003090", "#fdb913"], strength: "challenger", marketValue: 270_000_000 },
      { id: "leeds", name: "Leeds United", shortName: "LEE", colors: ["#fff200", "#1d428a"], strength: "challenger", marketValue: 250_000_000 },
      { id: "southampton", name: "Southampton", shortName: "SOU", colors: ["#d71920", "#130c0e"], strength: "challenger", marketValue: 230_000_000 },
      { id: "ipswich", name: "Ipswich Town", shortName: "IPS", colors: ["#003399", "#ffffff"], strength: "solid", marketValue: 90_000_000 },
      { id: "watford", name: "Watford", shortName: "WAT", colors: ["#fbee23", "#ed2127"], strength: "solid", marketValue: 95_000_000 },
      { id: "norwich", name: "Norwich", shortName: "NOR", colors: ["#fff200", "#007f3a"], strength: "solid", marketValue: 110_000_000 },
      { id: "sunderland", name: "Sunderland", shortName: "SUN", colors: ["#ee2737", "#ffffff"], strength: "solid", marketValue: 80_000_000 },
      { id: "middlesbrough", name: "Middlesbrough", shortName: "MID", colors: ["#da2128", "#ffffff"], strength: "solid", marketValue: 85_000_000 },
      { id: "coventry", name: "Coventry City", shortName: "COV", colors: ["#8dc1e8", "#000000"], strength: "rising", marketValue: 75_000_000 },
      { id: "west-brom", name: "West Brom", shortName: "WBA", colors: ["#0d2340", "#ffffff"], strength: "rising", marketValue: 78_000_000 }
    ]
  }),
  createSyntheticLeague({
    id: "la-liga-2",
    name: "La Liga 2",
    nation: "Spain",
    level: 2,
    nationCode: "ESP",
    clubs: [
      { id: "leganes", name: "Leganés", shortName: "LEG", colors: ["#ffffff", "#005baa"], strength: "solid", marketValue: 45_000_000 },
      { id: "espanyol", name: "Espanyol", shortName: "ESP", colors: ["#007ac2", "#ffffff"], strength: "solid", marketValue: 110_000_000 },
      { id: "elche", name: "Elche", shortName: "ELC", colors: ["#0f7b3e", "#ffffff"], strength: "solid", marketValue: 60_000_000 },
      { id: "oviedo", name: "Real Oviedo", shortName: "OVI", colors: ["#0055a4", "#ffc400"], strength: "solid", marketValue: 55_000_000 },
      { id: "zaragoza", name: "Real Zaragoza", shortName: "ZAR", colors: ["#00529f", "#ffffff"], strength: "solid", marketValue: 58_000_000 },
      { id: "levante", name: "Levante", shortName: "LEV", colors: ["#041c2c", "#9e1b32"], strength: "solid", marketValue: 65_000_000 },
      { id: "malaga", name: "Málaga", shortName: "MAL", colors: ["#6bb3dd", "#ffffff"], strength: "rising", marketValue: 40_000_000 },
      { id: "tenerife", name: "Tenerife", shortName: "TEN", colors: ["#1c3f95", "#ffffff"], strength: "rising", marketValue: 32_000_000 },
      { id: "valladolid", name: "Valladolid", shortName: "VLL", colors: ["#4b0082", "#ffffff"], strength: "rising", marketValue: 85_000_000 },
      { id: "sporting-gijon", name: "Sporting Gijón", shortName: "SPG", colors: ["#d50032", "#ffffff"], strength: "rising", marketValue: 45_000_000 }
    ]
  }),
  createSyntheticLeague({
    id: "serie-b",
    name: "Serie B",
    nation: "Italy",
    level: 2,
    nationCode: "ITA",
    clubs: [
      { id: "parma", name: "Parma", shortName: "PAR", colors: ["#002f87", "#ffdd00"], strength: "solid", marketValue: 65_000_000 },
      { id: "palermo", name: "Palermo", shortName: "PAL", colors: ["#f5a8b8", "#000000"], strength: "solid", marketValue: 52_000_000 },
      { id: "cagliari", name: "Cagliari", shortName: "CAG", colors: ["#003366", "#a50034"], strength: "solid", marketValue: 95_000_000 },
      { id: "brescia", name: "Brescia", shortName: "BRE", colors: ["#0054a6", "#ffffff"], strength: "solid", marketValue: 45_000_000 },
      { id: "como", name: "Como", shortName: "COM", colors: ["#003399", "#ffffff"], strength: "solid", marketValue: 60_000_000 },
      { id: "pisa", name: "Pisa", shortName: "PIS", colors: ["#000000", "#0076bf"], strength: "rising", marketValue: 38_000_000 },
      { id: "frosinone", name: "Frosinone", shortName: "FRO", colors: ["#004aad", "#ffda44"], strength: "rising", marketValue: 70_000_000 },
      { id: "spezia", name: "Spezia", shortName: "SPE", colors: ["#000000", "#ffffff"], strength: "rising", marketValue: 75_000_000 },
      { id: "reggina", name: "Reggina", shortName: "REG", colors: ["#800000", "#ffffff"], strength: "rising", marketValue: 35_000_000 },
      { id: "lecce", name: "Lecce", shortName: "LEC", colors: ["#004aad", "#ffdd00"], strength: "rising", marketValue: 90_000_000 }
    ]
  }),
  createSyntheticLeague({
    id: "2-bundesliga",
    name: "2. Bundesliga",
    nation: "Germany",
    level: 2,
    nationCode: "GER",
    clubs: [
      { id: "hamburg", name: "Hamburg", shortName: "HSV", colors: ["#005ca9", "#ffffff"], strength: "solid", marketValue: 70_000_000 },
      { id: "schalke", name: "Schalke", shortName: "S04", colors: ["#0d47a1", "#ffffff"], strength: "solid", marketValue: 80_000_000 },
      { id: "hertha", name: "Hertha BSC", shortName: "BSC", colors: ["#0041ab", "#ffffff"], strength: "solid", marketValue: 85_000_000 },
      { id: "st-pauli", name: "St. Pauli", shortName: "STP", colors: ["#4b3621", "#ffffff"], strength: "solid", marketValue: 60_000_000 },
      { id: "dusseldorf", name: "Fortuna Düsseldorf", shortName: "F95", colors: ["#d11241", "#ffffff"], strength: "solid", marketValue: 55_000_000 },
      { id: "hannover", name: "Hannover 96", shortName: "H96", colors: ["#006633", "#000000"], strength: "solid", marketValue: 50_000_000 },
      { id: "nurnberg", name: "Nürnberg", shortName: "FCN", colors: ["#800000", "#ffffff"], strength: "solid", marketValue: 45_000_000 },
      { id: "paderborn", name: "Paderborn", shortName: "SCP", colors: ["#003399", "#ffffff"], strength: "rising", marketValue: 45_000_000 },
      { id: "karlsruhe", name: "Karlsruhe", shortName: "KSC", colors: ["#0054a6", "#ffffff"], strength: "rising", marketValue: 38_000_000 },
      { id: "holstein-kiel", name: "Holstein Kiel", shortName: "KIE", colors: ["#005ca9", "#ff0000"], strength: "rising", marketValue: 40_000_000 }
    ]
  }),
  createSyntheticLeague({
    id: "ligue-2",
    name: "Ligue 2",
    nation: "France",
    level: 2,
    nationCode: "FRA",
    clubs: [
      { id: "auxerre", name: "Auxerre", shortName: "AJA", colors: ["#0f5bb3", "#ffffff"], strength: "solid", marketValue: 35_000_000 },
      { id: "saint-etienne", name: "Saint-Étienne", shortName: "ASSE", colors: ["#00a55c", "#ffffff"], strength: "solid", marketValue: 50_000_000 },
      { id: "angers", name: "Angers SCO", shortName: "ANG", colors: ["#000000", "#ffffff"], strength: "solid", marketValue: 40_000_000 },
      { id: "caen", name: "Caen", shortName: "CAE", colors: ["#003087", "#e4002b"], strength: "solid", marketValue: 25_000_000 },
      { id: "guingamp", name: "Guingamp", shortName: "GUI", colors: ["#d40000", "#000000"], strength: "solid", marketValue: 24_000_000 },
      { id: "bastia", name: "Bastia", shortName: "BAS", colors: ["#0033a0", "#ffffff"], strength: "solid", marketValue: 22_000_000 },
      { id: "dijon", name: "Dijon", shortName: "DIJ", colors: ["#d50032", "#ffffff"], strength: "rising", marketValue: 20_000_000 },
      { id: "sochaux", name: "Sochaux", shortName: "SOC", colors: ["#f9d616", "#003a70"], strength: "rising", marketValue: 23_000_000 },
      { id: "grenoble", name: "Grenoble", shortName: "GRE", colors: ["#00539f", "#ffffff"], strength: "rising", marketValue: 18_000_000 },
      { id: "amiens", name: "Amiens", shortName: "AMI", colors: ["#6c757d", "#ffffff"], strength: "rising", marketValue: 30_000_000 }
    ]
  }),
  createSyntheticLeague({
    id: "eerste-divisie",
    name: "Eerste Divisie",
    nation: "Netherlands",
    level: 2,
    nationCode: "NED",
    clubs: [
      { id: "zwolle", name: "PEC Zwolle", shortName: "ZWO", colors: ["#007bc7", "#ffffff"], strength: "solid", marketValue: 25_000_000 },
      { id: "willem-ii", name: "Willem II", shortName: "WII", colors: ["#a50034", "#132257"], strength: "solid", marketValue: 22_000_000 },
      { id: "nac-breda", name: "NAC Breda", shortName: "NAC", colors: ["#ffcc00", "#000000"], strength: "solid", marketValue: 20_000_000 },
      { id: "de-graafschap", name: "De Graafschap", shortName: "GRA", colors: ["#0b4ea2", "#ffffff"], strength: "solid", marketValue: 15_000_000 },
      { id: "roda-jc", name: "Roda JC", shortName: "RJC", colors: ["#ffcd00", "#000000"], strength: "solid", marketValue: 14_000_000 },
      { id: "den-haag", name: "ADO Den Haag", shortName: "ADO", colors: ["#007f3b", "#ffdd00"], strength: "rising", marketValue: 18_000_000 },
      { id: "almere-city", name: "Almere City", shortName: "ALM", colors: ["#e32219", "#ffffff"], strength: "rising", marketValue: 16_000_000 },
      { id: "excelsior", name: "Excelsior", shortName: "EXC", colors: ["#000000", "#ffffff"], strength: "rising", marketValue: 17_000_000 },
      { id: "top-oss", name: "TOP Oss", shortName: "OSS", colors: ["#d50032", "#ffffff"], strength: "developing", marketValue: 8_000_000 },
      { id: "telstar", name: "Telstar", shortName: "TEL", colors: ["#ffffff", "#f9a602"], strength: "developing", marketValue: 7_000_000 }
    ]
  }),
  // Third tiers for the top three countries
  createSyntheticLeague({
    id: "league-one",
    name: "EFL League One",
    nation: "England",
    level: 3,
    nationCode: "ENG",
    clubs: [
      { id: "portsmouth", name: "Portsmouth", shortName: "POR", colors: ["#003399", "#ffffff"], strength: "rising", transferBudget: 12_000_000, wageBudget: 400_000 },
      { id: "derby", name: "Derby County", shortName: "DER", colors: ["#000000", "#ffffff"], strength: "rising", transferBudget: 11_000_000, wageBudget: 380_000 },
      { id: "bolton", name: "Bolton Wanderers", shortName: "BOL", colors: ["#001489", "#ffffff"], strength: "rising", transferBudget: 10_000_000, wageBudget: 360_000 },
      { id: "blackpool", name: "Blackpool", shortName: "BLA", colors: ["#ff5f00", "#ffffff"], strength: "developing", transferBudget: 9_000_000, wageBudget: 340_000 },
      { id: "charlton", name: "Charlton", shortName: "CHA", colors: ["#c60c30", "#ffffff"], strength: "developing", transferBudget: 8_000_000, wageBudget: 320_000 },
      { id: "wycombe", name: "Wycombe", shortName: "WYC", colors: ["#4f9ec4", "#0f1c2c"], strength: "developing", transferBudget: 7_500_000, wageBudget: 300_000 },
      { id: "peterborough", name: "Peterborough", shortName: "PET", colors: ["#0057b7", "#ffffff"], strength: "developing", transferBudget: 7_000_000, wageBudget: 280_000 },
      { id: "oxford", name: "Oxford United", shortName: "OXF", colors: ["#f4c800", "#001489"], strength: "developing", transferBudget: 6_500_000, wageBudget: 260_000 },
      { id: "barnsley", name: "Barnsley", shortName: "BAR", colors: ["#c8102e", "#ffffff"], strength: "developing", transferBudget: 6_000_000, wageBudget: 250_000 },
      { id: "lincoln", name: "Lincoln City", shortName: "LIN", colors: ["#d4021d", "#ffffff"], strength: "developing", transferBudget: 5_500_000, wageBudget: 230_000 }
    ]
  }),
  createSyntheticLeague({
    id: "primera-rfef",
    name: "Primera Federación",
    nation: "Spain",
    level: 3,
    nationCode: "ESP",
    clubs: [
      { id: "deportivo", name: "Deportivo La Coruña", shortName: "DEP", colors: ["#1d4ba0", "#ffffff"], strength: "rising", transferBudget: 8_500_000, wageBudget: 320_000 },
      { id: "cordoba", name: "Córdoba", shortName: "COR", colors: ["#007a33", "#ffffff"], strength: "rising", transferBudget: 7_800_000, wageBudget: 300_000 },
      { id: "cultural", name: "Cultural Leonesa", shortName: "CUL", colors: ["#ffffff", "#c8102e"], strength: "developing", transferBudget: 7_200_000, wageBudget: 280_000 },
      { id: "murcia", name: "Real Murcia", shortName: "MUR", colors: ["#c8102e", "#ffffff"], strength: "developing", transferBudget: 6_800_000, wageBudget: 260_000 },
      { id: "ponferradina", name: "Ponferradina", shortName: "PON", colors: ["#003399", "#ffffff"], strength: "developing", transferBudget: 6_500_000, wageBudget: 250_000 },
      { id: "alcorcon", name: "Alcorcón", shortName: "ALC", colors: ["#ffd100", "#0033a0"], strength: "developing", transferBudget: 6_000_000, wageBudget: 230_000 },
      { id: "sabadell", name: "Sabadell", shortName: "SAB", colors: ["#1b3f8b", "#ffffff"], strength: "developing", transferBudget: 5_800_000, wageBudget: 220_000 },
      { id: "castellon", name: "Castellón", shortName: "CAS", colors: ["#000000", "#ffffff"], strength: "developing", transferBudget: 5_500_000, wageBudget: 210_000 },
      { id: "ferrol", name: "Racing Ferrol", shortName: "FER", colors: ["#007f3a", "#ffffff"], strength: "developing", transferBudget: 5_200_000, wageBudget: 200_000 },
      { id: "barcelona-b", name: "Barcelona Atlètic", shortName: "BARB", colors: ["#004d98", "#a50044"], strength: "developing", transferBudget: 5_000_000, wageBudget: 190_000 }
    ]
  }),
  createSyntheticLeague({
    id: "serie-c",
    name: "Serie C",
    nation: "Italy",
    level: 3,
    nationCode: "ITA",
    clubs: [
      { id: "sudtirol", name: "Südtirol", shortName: "SUD", colors: ["#a50034", "#ffffff"], strength: "rising", transferBudget: 8_000_000, wageBudget: 320_000 },
      { id: "padova", name: "Padova", shortName: "PAD", colors: ["#c8102e", "#ffffff"], strength: "rising", transferBudget: 7_500_000, wageBudget: 300_000 },
      { id: "perugia", name: "Perugia", shortName: "PER", colors: ["#d50032", "#ffffff"], strength: "developing", transferBudget: 7_000_000, wageBudget: 280_000 },
      { id: "ternana", name: "Ternana", shortName: "TER", colors: ["#007a33", "#d50032"], strength: "developing", transferBudget: 6_500_000, wageBudget: 260_000 },
      { id: "modena", name: "Modena", shortName: "MOD", colors: ["#002d72", "#ffd200"], strength: "developing", transferBudget: 6_200_000, wageBudget: 240_000 },
      { id: "cesena", name: "Cesena", shortName: "CES", colors: ["#000000", "#ffffff"], strength: "developing", transferBudget: 6_000_000, wageBudget: 230_000 },
      { id: "catanzaro", name: "Catanzaro", shortName: "CAT", colors: ["#ff0000", "#ffff00"], strength: "developing", transferBudget: 5_800_000, wageBudget: 220_000 },
      { id: "avellino", name: "Avellino", shortName: "AVE", colors: ["#007a3d", "#ffffff"], strength: "developing", transferBudget: 5_600_000, wageBudget: 210_000 },
      { id: "monopoli", name: "Monopoli", shortName: "MON", colors: ["#00843d", "#ffffff"], strength: "developing", transferBudget: 5_400_000, wageBudget: 200_000 },
      { id: "trieste", name: "Triestina", shortName: "TRI", colors: ["#c8102e", "#ffffff"], strength: "developing", transferBudget: 5_200_000, wageBudget: 190_000 }
    ]
  })
];

export const leaguePacks: LeagueData[] = [premierLeagueData, ...syntheticLeagues];
