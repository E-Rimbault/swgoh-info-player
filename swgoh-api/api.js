// api.js

/**
 * Récupère les infos joueur depuis SWGOH.gg
 * @param {string} allyCode - Code allié du joueur (peut contenir ou non des "-")
 * @returns {Promise<Object>} - Données formatées (player, characters, ships)
 */
export async function fetchPlayerData(allyCode) {
  if (!allyCode) {
    throw new Error("Code allié manquant");
  }

  const cleanAllyCode = allyCode.replace(/-/g, "");
  const apiUrl = `https://swgoh.gg/api/player/${cleanAllyCode}/`;

  let response;
  try {
    response = await fetch(apiUrl); // 🔹 sans headers
  } catch (err) {
    throw new Error("Erreur réseau lors de l'appel à SWGOH.gg");
  }

  if (!response.ok) {
    throw new Error("Impossible de récupérer les données de l'API SWGOH.gg");
  }

  const data = await response.json();
  const playerData = data.data ?? null;

  if (!playerData || !data.units) {
    throw new Error("Aucune donnée de joueur trouvée");
  }

  // --- Arena
  const arena = data.arena ?? {};
  const fleetArena = data.fleet_arena ?? {};

  const arenaInfo = {
    rank: arena.rank ?? null,
    leader: arena.leader ?? null,
    team: arena.members ?? []
  };

  const fleetArenaInfo = {
    rank: fleetArena.rank ?? null,
    leader: fleetArena.leader ?? null,
    team: fleetArena.members ?? [],
    reinforcements: fleetArena.reinforcements ?? []
  };

  // --- Characters & Ships
  const characters = [];
  const ships = [];

  for (const unit of data.units) {
    const u = unit.data;

    let nameFormatted = u.name.toLowerCase()
      .replace(/ /g, "_")
      .replace(/[()]/g, "")
      .replace(/'/g, "-")
      .replace(/"(.*?)"/g, "_$1") + ".png";

    const unitInfo = {
      base_id: u.base_id,
      name: u.name,
      level: u.level,
      rarity: u.rarity,
      power: u.power,
      image: `https://e-rimbault.github.io/swgoh-kit/image-api/${nameFormatted}`,
      gear_level: u.gear_level ?? "N/A",
      relic_tier: u.relic_tier ?? null,
      health: u.stats?.["1"] ?? 0,
      protection: u.stats?.["28"] ?? 0,
      speed: u.stats?.["5"] ?? 0
    };

    if (u.combat_type === 1) characters.push(unitInfo);
    else if (u.combat_type === 2) ships.push(unitInfo);
  }

  characters.sort((a, b) => a.name.localeCompare(b.name));
  ships.sort((a, b) => a.name.localeCompare(b.name));

  const playerInfo = {
    name: playerData.name ?? "Inconnu",
    level: playerData.level ?? "N/A",
    ally_code: playerData.ally_code ?? cleanAllyCode,
    guild: playerData.guild_name ?? "Sans guilde",
    gp: playerData.galactic_power ?? 0,
    character_gp: playerData.character_galactic_power ?? 0,
    ship_gp: playerData.ship_galactic_power ?? 0,
    portrait_image: playerData.portrait_image ?? null,
    title: playerData.title ?? null,
    arena: arenaInfo,
    fleet_arena: fleetArenaInfo,
    gac: {
      skill_rating: playerData.skill_rating ?? 0,
      league_name: playerData.league_name ?? "",
      league_image: playerData.league_image ?? "",
      division_number: playerData.division_number ?? "",
      division_image: playerData.division_image ?? ""
    }
  };

  return {
    player: playerInfo,
    characters,
    ships
  };
}
