import type { Foot, Position } from "@domain/player/types";

export interface PlayerTemplate {
  id: string;
  name: string;
  age: number;
  nationality: string;
  foot: Foot;
  positions: Position[];
  currentAbility: number;
  potentialAbility: number;
  value: number;
  wage: number;
  contractYears: number;
}

export interface ClubTemplate {
  id: string;
  name: string;
  shortName: string;
  colors: string[];
  formation: string;
  mentality: "Balanced" | "Positive" | "Cautious";
  tempo: number;
  press: number;
  rep: number;
  marketValue?: number;
  transferBudget: number;
  wageBudget: number;
  players: PlayerTemplate[];
}

export interface LeagueData {
  id: string;
  name: string;
  nation: string;
  level: number;
  clubs: ClubTemplate[];
}

export const premierLeagueData: LeagueData = {
  id: "premier-league",
  name: "Premier League",
  nation: "England",
  level: 1,
  clubs: [
    {
      id: "arsenal",
      name: "Arsenal",
      shortName: "ARS",
      colors: ["#EF0107", "#063672"],
      formation: "4-3-3",
      mentality: "Positive",
      tempo: 68,
      press: 70,
      rep: 8600,
      marketValue: 1_010_000_000,
      transferBudget: 70000000,
      wageBudget: 2200000,
      players: [
        player("arsenal", "Aaron Ramsdale", 25, "ENG", "Right", ["GK"], 152, 158, 38000000, 120000, 4),
        player("arsenal", "David Raya", 28, "ESP", "Right", ["GK"], 148, 150, 32000000, 110000, 3),
        player("arsenal", "William Saliba", 23, "FRA", "Right", ["CB"], 165, 175, 70000000, 180000, 5),
        player("arsenal", "Gabriel", 26, "BRA", "Left", ["CB"], 158, 162, 52000000, 150000, 4),
        player("arsenal", "Ben White", 26, "ENG", "Right", ["RB", "CB"], 156, 160, 50000000, 160000, 4),
        player("arsenal", "Oleksandr Zinchenko", 27, "UKR", "Left", ["LB", "CM"], 152, 156, 42000000, 140000, 4),
        player("arsenal", "Declan Rice", 25, "ENG", "Right", ["DM", "CM"], 170, 178, 95000000, 240000, 6),
        player("arsenal", "Martin Ødegaard", 25, "NOR", "Left", ["AM", "CM"], 168, 175, 85000000, 230000, 5),
        player("arsenal", "Bukayo Saka", 22, "ENG", "Left", ["RW", "LW"], 172, 185, 110000000, 250000, 6),
        player("arsenal", "Gabriel Martinelli", 22, "BRA", "Right", ["LW", "ST"], 160, 172, 76000000, 190000, 5),
        player("arsenal", "Gabriel Jesus", 27, "BRA", "Right", ["ST", "RW"], 160, 164, 65000000, 200000, 4),
        player("arsenal", "Kai Havertz", 24, "GER", "Left", ["AM", "ST"], 158, 165, 60000000, 210000, 4),
        player("arsenal", "Jorginho", 32, "ITA", "Right", ["DM", "CM"], 150, 150, 22000000, 180000, 2),
        player("arsenal", "Takehiro Tomiyasu", 25, "JPN", "Right", ["RB", "CB", "LB"], 150, 154, 28000000, 110000, 3),
        player("arsenal", "Leandro Trossard", 29, "BEL", "Right", ["LW", "AM"], 154, 156, 36000000, 160000, 3)
      ]
    },
    {
      id: "man-city",
      name: "Manchester City",
      shortName: "MCI",
      colors: ["#6CABDD", "#1C2C5B"],
      formation: "4-3-3",
      mentality: "Positive",
      tempo: 64,
      press: 72,
      rep: 9300,
      marketValue: 1_200_000_000,
      transferBudget: 90000000,
      wageBudget: 2600000,
      players: [
        player("man-city", "Ederson", 30, "BRA", "Left", ["GK"], 162, 166, 65000000, 220000, 4),
        player("man-city", "Stefan Ortega", 31, "GER", "Right", ["GK"], 148, 150, 18000000, 90000, 3),
        player("man-city", "Kyle Walker", 34, "ENG", "Right", ["RB"], 158, 158, 18000000, 175000, 2),
        player("man-city", "Rúben Dias", 27, "POR", "Right", ["CB"], 168, 170, 78000000, 230000, 5),
        player("man-city", "John Stones", 29, "ENG", "Right", ["CB"], 162, 164, 52000000, 210000, 4),
        player("man-city", "Josko Gvardiol", 22, "CRO", "Left", ["CB", "LB"], 165, 180, 82000000, 190000, 6),
        player("man-city", "Rodri", 27, "ESP", "Right", ["DM"], 176, 180, 105000000, 260000, 6),
        player("man-city", "Kevin De Bruyne", 32, "BEL", "Right", ["CM", "AM"], 180, 180, 90000000, 350000, 3),
        player("man-city", "Phil Foden", 23, "ENG", "Left", ["AM", "RW"], 170, 182, 110000000, 250000, 5),
        player("man-city", "Bernardo Silva", 29, "POR", "Left", ["RW", "AM", "CM"], 170, 170, 78000000, 300000, 4),
        player("man-city", "Jack Grealish", 28, "ENG", "Right", ["LW"], 160, 162, 62000000, 300000, 4),
        player("man-city", "Erling Haaland", 23, "NOR", "Left", ["ST"], 185, 195, 180000000, 400000, 5),
        player("man-city", "Julián Álvarez", 24, "ARG", "Right", ["ST", "AM"], 164, 176, 82000000, 190000, 5),
        player("man-city", "Matheus Nunes", 25, "POR", "Right", ["CM"], 156, 162, 42000000, 160000, 4),
        player("man-city", "Manuel Akanji", 28, "SUI", "Right", ["CB", "RB"], 160, 162, 40000000, 180000, 4)
      ]
    },
    {
      id: "liverpool",
      name: "Liverpool",
      shortName: "LIV",
      colors: ["#C8102E", "#00B2A9"],
      formation: "4-3-3",
      mentality: "Positive",
      tempo: 70,
      press: 74,
      rep: 9000,
      marketValue: 960_000_000,
      transferBudget: 65000000,
      wageBudget: 2300000,
      players: [
        player("liverpool", "Alisson Becker", 31, "BRA", "Right", ["GK"], 170, 172, 78000000, 250000, 4),
        player("liverpool", "Caoimhín Kelleher", 25, "IRL", "Right", ["GK"], 148, 154, 16000000, 60000, 4),
        player("liverpool", "Virgil van Dijk", 32, "NED", "Right", ["CB"], 175, 175, 65000000, 220000, 3),
        player("liverpool", "Ibrahima Konaté", 24, "FRA", "Right", ["CB"], 162, 172, 52000000, 170000, 4),
        player("liverpool", "Trent Alexander-Arnold", 25, "ENG", "Right", ["RB", "CM"], 168, 176, 82000000, 220000, 4),
        player("liverpool", "Andy Robertson", 29, "SCO", "Left", ["LB"], 160, 162, 45000000, 180000, 4),
        player("liverpool", "Alexis Mac Allister", 25, "ARG", "Right", ["CM", "DM"], 160, 168, 52000000, 160000, 5),
        player("liverpool", "Dominik Szoboszlai", 23, "HUN", "Right", ["AM", "CM"], 164, 176, 72000000, 200000, 5),
        player("liverpool", "Curtis Jones", 23, "ENG", "Right", ["CM", "AM"], 150, 164, 26000000, 90000, 4),
        player("liverpool", "Mohamed Salah", 31, "EGY", "Left", ["RW"], 178, 178, 100000000, 350000, 3),
        player("liverpool", "Luis Díaz", 27, "COL", "Right", ["LW"], 162, 168, 62000000, 190000, 4),
        player("liverpool", "Diogo Jota", 27, "POR", "Right", ["ST", "LW"], 160, 164, 55000000, 180000, 4),
        player("liverpool", "Darwin Núñez", 24, "URU", "Right", ["ST"], 158, 172, 60000000, 210000, 5),
        player("liverpool", "Wataru Endo", 31, "JPN", "Right", ["DM"], 150, 152, 15000000, 90000, 2),
        player("liverpool", "Joe Gomez", 26, "ENG", "Right", ["CB", "RB"], 154, 158, 30000000, 120000, 4)
      ]
    },
    {
      id: "man-united",
      name: "Manchester United",
      shortName: "MUN",
      colors: ["#DA291C", "#000000"],
      formation: "4-2-3-1",
      mentality: "Balanced",
      tempo: 66,
      press: 68,
      rep: 9100,
      marketValue: 870_000_000,
      transferBudget: 75000000,
      wageBudget: 2500000,
      players: [
        player("man-united", "Andre Onana", 28, "CMR", "Right", ["GK"], 160, 164, 52000000, 210000, 5),
        player("man-united", "Altay Bayındır", 26, "TUR", "Right", ["GK"], 145, 150, 12000000, 60000, 3),
        player("man-united", "Lisandro Martínez", 26, "ARG", "Left", ["CB"], 160, 166, 52000000, 190000, 5),
        player("man-united", "Raphaël Varane", 31, "FRA", "Right", ["CB"], 165, 165, 42000000, 300000, 2),
        player("man-united", "Harry Maguire", 31, "ENG", "Right", ["CB"], 148, 148, 20000000, 190000, 3),
        player("man-united", "Luke Shaw", 28, "ENG", "Left", ["LB"], 158, 160, 34000000, 200000, 4),
        player("man-united", "Diogo Dalot", 25, "POR", "Right", ["RB", "LB"], 152, 158, 28000000, 140000, 4),
        player("man-united", "Casemiro", 32, "BRA", "Right", ["DM"], 162, 162, 35000000, 300000, 3),
        player("man-united", "Kobbie Mainoo", 19, "ENG", "Right", ["CM"], 148, 170, 26000000, 45000, 6),
        player("man-united", "Bruno Fernandes", 29, "POR", "Right", ["AM"], 170, 170, 85000000, 270000, 5),
        player("man-united", "Marcus Rashford", 26, "ENG", "Right", ["LW", "ST"], 166, 170, 92000000, 300000, 5),
        player("man-united", "Alejandro Garnacho", 19, "ARG", "Right", ["LW"], 154, 176, 52000000, 90000, 6),
        player("man-united", "Antony", 24, "BRA", "Left", ["RW"], 152, 160, 42000000, 200000, 5),
        player("man-united", "Rasmus Højlund", 21, "DEN", "Left", ["ST"], 158, 178, 65000000, 180000, 6),
        player("man-united", "Christian Eriksen", 32, "DEN", "Right", ["CM", "AM"], 156, 156, 26000000, 210000, 3)
      ]
    },
    {
      id: "chelsea",
      name: "Chelsea",
      shortName: "CHE",
      colors: ["#034694", "#DBA111"],
      formation: "4-2-3-1",
      mentality: "Balanced",
      tempo: 64,
      press: 70,
      rep: 8800,
      marketValue: 860_000_000,
      transferBudget: 80000000,
      wageBudget: 2400000,
      players: [
        player("chelsea", "Djordje Petrović", 24, "SRB", "Right", ["GK"], 150, 162, 24000000, 65000, 5),
        player("chelsea", "Robert Sánchez", 26, "ESP", "Right", ["GK"], 150, 154, 25000000, 120000, 5),
        player("chelsea", "Reece James", 24, "ENG", "Right", ["RB"], 162, 170, 70000000, 220000, 5),
        player("chelsea", "Ben Chilwell", 27, "ENG", "Left", ["LB"], 156, 160, 45000000, 190000, 4),
        player("chelsea", "Axel Disasi", 26, "FRA", "Right", ["CB"], 154, 158, 36000000, 160000, 5),
        player("chelsea", "Levi Colwill", 21, "ENG", "Left", ["CB", "LB"], 156, 174, 55000000, 140000, 6),
        player("chelsea", "Thiago Silva", 39, "BRA", "Right", ["CB"], 160, 160, 10000000, 160000, 1),
        player("chelsea", "Moisés Caicedo", 22, "ECU", "Right", ["DM"], 162, 176, 90000000, 220000, 8),
        player("chelsea", "Enzo Fernández", 23, "ARG", "Right", ["CM"], 162, 178, 85000000, 230000, 7),
        player("chelsea", "Conor Gallagher", 24, "ENG", "Right", ["CM"], 154, 164, 42000000, 150000, 3),
        player("chelsea", "Cole Palmer", 21, "ENG", "Left", ["RW", "AM"], 156, 174, 52000000, 160000, 6),
        player("chelsea", "Raheem Sterling", 29, "ENG", "Right", ["LW", "RW"], 160, 160, 46000000, 300000, 4),
        player("chelsea", "Mykhailo Mudryk", 23, "UKR", "Right", ["LW"], 152, 170, 42000000, 210000, 7),
        player("chelsea", "Christopher Nkunku", 26, "FRA", "Right", ["ST", "AM"], 164, 170, 70000000, 250000, 5),
        player("chelsea", "Nicolas Jackson", 22, "SEN", "Right", ["ST"], 154, 170, 42000000, 140000, 8)
      ]
    },
    {
      id: "tottenham",
      name: "Tottenham Hotspur",
      shortName: "TOT",
      colors: ["#132257", "#FFFFFF"],
      formation: "4-3-3",
      mentality: "Positive",
      tempo: 68,
      press: 72,
      rep: 8700,
      marketValue: 780_000_000,
      transferBudget: 60000000,
      wageBudget: 2100000,
      players: [
        player("tottenham", "Guglielmo Vicario", 27, "ITA", "Right", ["GK"], 156, 162, 32000000, 120000, 5),
        player("tottenham", "Fraser Forster", 36, "ENG", "Right", ["GK"], 140, 140, 5000000, 70000, 2),
        player("tottenham", "Cristian Romero", 26, "ARG", "Right", ["CB"], 164, 168, 62000000, 180000, 5),
        player("tottenham", "Micky van de Ven", 23, "NED", "Left", ["CB"], 158, 176, 55000000, 160000, 6),
        player("tottenham", "Pedro Porro", 24, "POR", "Right", ["RB"], 156, 166, 42000000, 140000, 5),
        player("tottenham", "Destiny Udogie", 21, "ITA", "Left", ["LB"], 154, 172, 38000000, 120000, 6),
        player("tottenham", "Yves Bissouma", 27, "MLI", "Right", ["DM", "CM"], 156, 160, 42000000, 150000, 4),
        player("tottenham", "Pape Matar Sarr", 21, "SEN", "Right", ["CM"], 152, 170, 36000000, 90000, 6),
        player("tottenham", "James Maddison", 27, "ENG", "Right", ["AM"], 166, 168, 65000000, 220000, 5),
        player("tottenham", "Dejan Kulusevski", 24, "SWE", "Left", ["RW", "AM"], 160, 168, 58000000, 180000, 5),
        player("tottenham", "Heung-min Son", 31, "KOR", "Both", ["LW", "ST"], 170, 170, 82000000, 290000, 4),
        player("tottenham", "Richarlison", 26, "BRA", "Right", ["ST", "LW"], 158, 160, 52000000, 190000, 4),
        player("tottenham", "Brennan Johnson", 22, "WAL", "Right", ["RW", "ST"], 152, 168, 36000000, 120000, 6),
        player("tottenham", "Giovani Lo Celso", 27, "ARG", "Left", ["CM", "AM"], 154, 156, 28000000, 150000, 3),
        player("tottenham", "Rodrigo Bentancur", 26, "URU", "Right", ["CM", "DM"], 158, 164, 42000000, 180000, 4)
      ]
    },
    {
      id: "newcastle",
      name: "Newcastle United",
      shortName: "NEW",
      colors: ["#241F20", "#FFFFFF"],
      formation: "4-3-3",
      mentality: "Positive",
      tempo: 66,
      press: 70,
      rep: 8400,
      marketValue: 720_000_000,
      transferBudget: 55000000,
      wageBudget: 2000000,
      players: [
        player("newcastle", "Nick Pope", 31, "ENG", "Right", ["GK"], 158, 160, 38000000, 130000, 4),
        player("newcastle", "Martin Dúbravka", 35, "SVK", "Right", ["GK"], 148, 148, 9000000, 75000, 2),
        player("newcastle", "Kieran Trippier", 33, "ENG", "Right", ["RB"], 158, 158, 26000000, 170000, 2),
        player("newcastle", "Sven Botman", 24, "NED", "Left", ["CB"], 160, 170, 52000000, 140000, 5),
        player("newcastle", "Fabian Schär", 32, "SUI", "Right", ["CB"], 154, 154, 18000000, 90000, 3),
        player("newcastle", "Dan Burn", 31, "ENG", "Left", ["LB", "CB"], 152, 152, 16000000, 85000, 3),
        player("newcastle", "Bruno Guimarães", 26, "BRA", "Right", ["CM", "DM"], 166, 174, 72000000, 200000, 5),
        player("newcastle", "Sandro Tonali", 23, "ITA", "Right", ["CM", "DM"], 162, 178, 70000000, 220000, 6),
        player("newcastle", "Joelinton", 27, "BRA", "Right", ["CM", "AM"], 156, 160, 42000000, 160000, 4),
        player("newcastle", "Miguel Almirón", 30, "PAR", "Left", ["RW"], 154, 156, 28000000, 120000, 4),
        player("newcastle", "Anthony Gordon", 23, "ENG", "Right", ["LW"], 156, 168, 48000000, 150000, 5),
        player("newcastle", "Alexander Isak", 24, "SWE", "Right", ["ST"], 166, 176, 82000000, 200000, 5),
        player("newcastle", "Callum Wilson", 32, "ENG", "Right", ["ST"], 158, 158, 26000000, 150000, 2),
        player("newcastle", "Harvey Barnes", 26, "ENG", "Right", ["LW"], 156, 160, 42000000, 150000, 4),
        player("newcastle", "Tino Livramento", 21, "ENG", "Right", ["RB"], 150, 168, 28000000, 90000, 6)
      ]
    },
    {
      id: "aston-villa",
      name: "Aston Villa",
      shortName: "AVL",
      colors: ["#670E36", "#95BFE5"],
      formation: "4-2-3-1",
      mentality: "Positive",
      tempo: 64,
      press: 66,
      rep: 8200,
      marketValue: 620_000_000,
      transferBudget: 45000000,
      wageBudget: 1700000,
      players: [
        player("aston-villa", "Emiliano Martínez", 31, "ARG", "Right", ["GK"], 166, 166, 60000000, 180000, 4),
        player("aston-villa", "Robin Olsen", 34, "SWE", "Right", ["GK"], 142, 142, 5000000, 60000, 2),
        player("aston-villa", "Ezri Konsa", 26, "ENG", "Right", ["CB"], 156, 160, 32000000, 120000, 4),
        player("aston-villa", "Pau Torres", 27, "ESP", "Left", ["CB"], 158, 164, 42000000, 160000, 5),
        player("aston-villa", "Lucas Digne", 30, "FRA", "Left", ["LB"], 154, 154, 22000000, 150000, 3),
        player("aston-villa", "Matty Cash", 26, "POL", "Right", ["RB"], 152, 154, 22000000, 120000, 4),
        player("aston-villa", "Douglas Luiz", 25, "BRA", "Right", ["DM", "CM"], 160, 168, 52000000, 150000, 4),
        player("aston-villa", "Boubacar Kamara", 24, "FRA", "Right", ["DM", "CB"], 158, 170, 48000000, 160000, 5),
        player("aston-villa", "John McGinn", 29, "SCO", "Left", ["CM", "AM"], 156, 156, 32000000, 130000, 4),
        player("aston-villa", "Moussa Diaby", 24, "FRA", "Left", ["RW", "LW"], 160, 170, 60000000, 180000, 5),
        player("aston-villa", "Leon Bailey", 26, "JAM", "Left", ["RW", "LW"], 156, 160, 38000000, 140000, 4),
        player("aston-villa", "Ollie Watkins", 28, "ENG", "Right", ["ST"], 164, 166, 62000000, 200000, 5),
        player("aston-villa", "Youri Tielemans", 27, "BEL", "Right", ["CM"], 156, 160, 30000000, 160000, 4),
        player("aston-villa", "Jacob Ramsey", 22, "ENG", "Right", ["AM", "CM"], 152, 170, 32000000, 90000, 6),
        player("aston-villa", "Matheus Luiz", 23, "BRA", "Right", ["CM"], 148, 164, 22000000, 80000, 5)
      ]
    },
    {
      id: "brighton",
      name: "Brighton & Hove Albion",
      shortName: "BHA",
      colors: ["#0057B8", "#FFFFFF"],
      formation: "4-2-3-1",
      mentality: "Positive",
      tempo: 68,
      press: 70,
      rep: 7800,
      marketValue: 520_000_000,
      transferBudget: 42000000,
      wageBudget: 1600000,
      players: [
        player("brighton", "Bart Verbruggen", 21, "NED", "Right", ["GK"], 150, 168, 28000000, 65000, 6),
        player("brighton", "Jason Steele", 33, "ENG", "Right", ["GK"], 145, 145, 4000000, 60000, 2),
        player("brighton", "Lewis Dunk", 32, "ENG", "Right", ["CB"], 156, 156, 20000000, 90000, 3),
        player("brighton", "Jan Paul van Hecke", 23, "NED", "Right", ["CB"], 150, 162, 20000000, 70000, 5),
        player("brighton", "Pervis Estupiñán", 26, "ECU", "Left", ["LB"], 156, 164, 36000000, 120000, 4),
        player("brighton", "Tariq Lamptey", 23, "GHA", "Right", ["RB"], 150, 162, 22000000, 90000, 4),
        player("brighton", "Billy Gilmour", 22, "SCO", "Right", ["CM"], 150, 168, 24000000, 90000, 5),
        player("brighton", "Pascal Groß", 32, "GER", "Right", ["AM", "CM"], 160, 160, 26000000, 110000, 3),
        player("brighton", "João Pedro", 22, "BRA", "Right", ["ST", "AM"], 156, 172, 42000000, 140000, 6),
        player("brighton", "Solly March", 29, "ENG", "Left", ["RW", "LW"], 156, 156, 26000000, 110000, 4),
        player("brighton", "Kaoru Mitoma", 26, "JPN", "Right", ["LW"], 160, 166, 52000000, 170000, 4),
        player("brighton", "Evan Ferguson", 19, "IRL", "Right", ["ST"], 156, 180, 48000000, 90000, 6),
        player("brighton", "Adam Lallana", 35, "ENG", "Right", ["AM"], 148, 148, 6000000, 70000, 2),
        player("brighton", "Simon Adingra", 22, "CIV", "Right", ["RW", "LW"], 152, 168, 32000000, 85000, 5),
        player("brighton", "Facundo Buonanotte", 19, "ARG", "Left", ["AM", "RW"], 148, 170, 26000000, 60000, 6)
      ]
    },
    {
      id: "west-ham",
      name: "West Ham United",
      shortName: "WHU",
      colors: ["#7A263A", "#1BB1E7"],
      formation: "4-2-3-1",
      mentality: "Balanced",
      tempo: 62,
      press: 64,
      rep: 7800,
      marketValue: 480_000_000,
      transferBudget: 38000000,
      wageBudget: 1500000,
      players: [
        player("west-ham", "Alphonse Areola", 31, "FRA", "Right", ["GK"], 156, 158, 28000000, 140000, 4),
        player("west-ham", "Lukasz Fabianski", 38, "POL", "Right", ["GK"], 148, 148, 3000000, 80000, 1),
        player("west-ham", "Kurt Zouma", 29, "FRA", "Right", ["CB"], 154, 154, 26000000, 150000, 3),
        player("west-ham", "Nayef Aguerd", 28, "MAR", "Left", ["CB"], 154, 160, 32000000, 140000, 4),
        player("west-ham", "Vladimir Coufal", 31, "CZE", "Right", ["RB"], 150, 150, 14000000, 90000, 2),
        player("west-ham", "Emerson Palmieri", 29, "ITA", "Left", ["LB"], 150, 150, 16000000, 85000, 3),
        player("west-ham", "Edson Álvarez", 26, "MEX", "Right", ["DM", "CB"], 156, 162, 42000000, 150000, 5),
        player("west-ham", "James Ward-Prowse", 29, "ENG", "Right", ["CM", "AM"], 156, 156, 32000000, 160000, 4),
        player("west-ham", "Lucas Paquetá", 26, "BRA", "Right", ["AM", "CM"], 164, 170, 72000000, 220000, 5),
        player("west-ham", "Jarrod Bowen", 27, "ENG", "Left", ["RW", "ST"], 160, 162, 56000000, 190000, 4),
        player("west-ham", "Michail Antonio", 34, "JAM", "Right", ["ST"], 150, 150, 8000000, 110000, 2),
        player("west-ham", "Mohammed Kudus", 23, "GHA", "Left", ["AM", "RW"], 160, 174, 60000000, 180000, 5),
        player("west-ham", "Saïd Benrahma", 28, "ALG", "Right", ["LW", "AM"], 154, 156, 28000000, 140000, 3),
        player("west-ham", "Tomáš Souček", 29, "CZE", "Right", ["CM", "DM"], 154, 154, 26000000, 120000, 4),
        player("west-ham", "Pablo Fornals", 28, "ESP", "Right", ["AM", "CM"], 152, 152, 22000000, 130000, 3)
      ]
    }
  ]
};

function player(
  club: string,
  name: string,
  age: number,
  nationality: string,
  foot: Foot,
  positions: Position[],
  currentAbility: number,
  potentialAbility: number,
  value: number,
  wage: number,
  contractYears: number
): PlayerTemplate {
  return {
    id: `${club}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    name,
    age,
    nationality,
    foot,
    positions,
    currentAbility,
    potentialAbility,
    value,
    wage,
    contractYears
  };
}
