/**
 * @swagger
 * resourcePath: /ranks
 * description: Express API for player stats in Get5 matches.
 */
import { Router } from "express";

const router = Router();

import db from "../db.js";
import Utils from "../utility/utils.js";

router.get("/", async (req, res, next) => {
  try {
    let sql = `SELECT steam, round(avg(score)) as score, sum(kills) as kills, sum(deaths) as deaths, 
    sum(assists) as assists, sum(suicides) as suicides, sum(tk) as tk, 
    sum(shots) as shots, sum(hits) as hits, sum(headshots) as headshots, 
    sum(connected) as connected, sum(rounds_tr) as rounds_tr, sum(rounds_ct) as rounds_ct, 
    sum(knife) as knife, sum(glock) as glock, sum(hkp2000) as hkp2000, 
    sum(usp_silencer) as usp_silencer, sum(p250) as p250, sum(deagle) as deagle, 
    sum(elite) as elite, sum(fiveseven) as fiveseven, 
    sum(tec9) as tec9, sum(cz75a) as cz75a, sum(revolver) as revolver, sum(nova) as nova, 
    sum(xm1014) as xm1014, sum(mag7) as mag7, sum(sawedoff) as sawedoff, sum(bizon) as bizon, 
    sum(mac10) as mac10, sum(mp9) as mp9, sum(mp7) as mp7, sum(ump45) as ump45, 
    sum(p90) as p90, sum(galilar) as galilar, sum(ak47) as ak47, sum(scar20) as scar20, 
    sum(famas) as famas, sum(m4a1) as m4a1, sum(m4a1_silencer) as m4a1_silencer, sum(aug) as aug, 
    sum(ssg08) as ssg08, sum(sg556) as sg556, sum(awp) as awp, sum(g3sg1) as g3sg1, 
    sum(m249) as m249, sum(negev) as negev, sum(hegrenade) as hegrenade, sum(flashbang) as flashbang, 
    sum(smokegrenade) as smokegrenade, sum(inferno) as inferno, sum(decoy) as decoy, sum(taser) as taser, 
    sum(mp5sd) as mp5sd, sum(breachcharge) as breachcharge, sum(head) as head, sum(chest) as chest, 
    sum(stomach) as stomach, sum(left_arm) as left_arm, sum(right_arm) as right_arm, sum(left_leg) as left_leg, 
    sum(right_leg) as right_leg, sum(c4_planted) as c4_planted, sum(c4_exploded) as c4_exploded, sum(c4_defused) as c4_defused, 
    sum(ct_win) as ct_win, sum(tr_win) as tr_win, sum(hostages_rescued) as hostages_rescued, sum(vip_killed) as vip_killed, 
    sum(vip_escaped) as vip_escaped, sum(vip_played) as vip_played, sum(mvp) as mvp, sum(damage) as damage, 
    sum(match_win) as match_win, sum(match_draw) as match_draw, sum(match_lose) as match_lose, sum(first_blood) as first_blood, 
    sum(no_scope) as no_scope, sum(no_scope_dis) as no_scope_dis, sum(match_lose) as match_lose, sum(first_blood) as first_blood 
    FROM ranks 
    GROUP BY steam`;
    let result = await db.query(sql);
    if (!result.length)
      return res.status(404).json({ message: "No stats found" });

    let ranks = [];
    for (let [i, obj] of result.entries()) {
      let player = {};
      for (let key in obj) {
        if (key == "steam") player[key] = result[i][key];
        else if (result[i][key] === null) player[key] = 0;
        else player[key] = parseFloat(result[i][key]);
      }
      ranks.push(player);
    }

    res.json(ranks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.toString() });
  }
});

router.get("/season/:season_id", async (req, res, next) => {
  try {
    let seasonID = req.params.season_id;
    let sql = `SELECT * FROM ranks WHERE season_id = ?`;
    let result = await db.query(sql, seasonID);
    if (!result.length)
      return res.status(404).json({ message: "No stats found" });

    let ranks = [];
    for (let [i, obj] of result.entries()) {
      let player = {};
      for (let key in obj) {
        if (key == "steam") player[key] = result[i][key];
        else if (result[i][key] === null) player[key] = 0;
        else player[key] = parseFloat(result[i][key]);
      }
      ranks.push(player);
    }

    res.json(ranks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.toString() });
  }
});

router.get("/:steam_id", async (req, res, next) => {
  try {
    let steamID = req.params.steam_id;
    let sql = `SELECT steam, round(avg(score)) as score, sum(kills) as kills, sum(deaths) as deaths, 
    sum(assists) as assists, sum(suicides) as suicides, sum(tk) as tk, 
    sum(shots) as shots, sum(hits) as hits, sum(headshots) as headshots, 
    sum(connected) as connected, sum(rounds_tr) as rounds_tr, sum(rounds_ct) as rounds_ct, 
    sum(knife) as knife, sum(glock) as glock, sum(hkp2000) as hkp2000, 
    sum(usp_silencer) as usp_silencer, sum(p250) as p250, sum(deagle) as deagle, 
    sum(elite) as elite, sum(fiveseven) as fiveseven, 
    sum(tec9) as tec9, sum(cz75a) as cz75a, sum(revolver) as revolver, sum(nova) as nova, 
    sum(xm1014) as xm1014, sum(mag7) as mag7, sum(sawedoff) as sawedoff, sum(bizon) as bizon, 
    sum(mac10) as mac10, sum(mp9) as mp9, sum(mp7) as mp7, sum(ump45) as ump45, 
    sum(p90) as p90, sum(galilar) as galilar, sum(ak47) as ak47, sum(scar20) as scar20, 
    sum(famas) as famas, sum(m4a1) as m4a1, sum(m4a1_silencer) as m4a1_silencer, sum(aug) as aug, 
    sum(ssg08) as ssg08, sum(sg556) as sg556, sum(awp) as awp, sum(g3sg1) as g3sg1, 
    sum(m249) as m249, sum(negev) as negev, sum(hegrenade) as hegrenade, sum(flashbang) as flashbang, 
    sum(smokegrenade) as smokegrenade, sum(inferno) as inferno, sum(decoy) as decoy, sum(taser) as taser, 
    sum(mp5sd) as mp5sd, sum(breachcharge) as breachcharge, sum(head) as head, sum(chest) as chest, 
    sum(stomach) as stomach, sum(left_arm) as left_arm, sum(right_arm) as right_arm, sum(left_leg) as left_leg, 
    sum(right_leg) as right_leg, sum(c4_planted) as c4_planted, sum(c4_exploded) as c4_exploded, sum(c4_defused) as c4_defused, 
    sum(ct_win) as ct_win, sum(tr_win) as tr_win, sum(hostages_rescued) as hostages_rescued, sum(vip_killed) as vip_killed, 
    sum(vip_escaped) as vip_escaped, sum(vip_played) as vip_played, sum(mvp) as mvp, sum(damage) as damage, 
    sum(match_win) as match_win, sum(match_draw) as match_draw, sum(match_lose) as match_lose, sum(first_blood) as first_blood, 
    sum(no_scope) as no_scope, sum(no_scope_dis) as no_scope_dis, sum(match_lose) as match_lose, sum(first_blood) as first_blood 
    FROM rankme_2023 
    WHERE steam = ? 
    GROUP BY steam`;
    let result = await db.query(sql, steamID);
    if (!result.length)
      return res
        .status(404)
        .json({ message: "No stats found for player " + steamID });

    let ranks = {};
    for (const key in result[0]) {
      if (key == "steam") ranks[key] = result[0][key];
      else if (result[0][key] === null) ranks[key] = 0;
      else ranks[key] = parseFloat(result[0][key]);
    }

    res.json(ranks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.toString() });
  }
});

router.get("/:steam_id/seasons", async (req, res, next) => {
  try {
    let steamID = req.params.steam_id;
    let sql = `SELECT * FROM ranks WHERE steam = ?`;
    let result = await db.query(sql, steamID);
    if (!result.length)
      return res
        .status(404)
        .json({ message: "No stats found for player " + steamID });

    let ranks = [];
    for (let [i, obj] of result.entries()) {
      let seasonRank = {};
      for (let key in obj) {
        if (key == "steam") seasonRank[key] = result[i][key];
        else if (result[i][key] === null) seasonRank[key] = 0;
        else seasonRank[key] = parseFloat(result[i][key]);
      }
      ranks.push(seasonRank);
    }

    res.json(ranks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.toString() });
  }
});

router.get("/:steam_id/season/:season_id", async (req, res, next) => {
  try {
    let steamID = req.params.steam_id;
    let seasonID = req.params.season_id;
    let sql = `SELECT * FROM ranks WHERE steam = ? AND season_id = ?`;
    let result = await db.query(sql, [steamID, seasonID]);
    if (!result.length)
      return res
        .status(404)
        .json({ message: "No stats found for player " + steamID });

    let ranks = {};
    for (const key in result[0]) {
      if (key == "steam") ranks[key] = result[0][key];
      else if (result[0][key] === null) ranks[key] = 0;
      else ranks[key] = parseFloat(result[0][key]);
    }

    res.json(ranks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.toString() });
  }
});

router.put("/:steam_id/season/:season_id", async (req, res, next) => {
  try {
    let steamID = req.params.steam_id;
    let seasonID = req.params.season_id;
    let season = await db.query("SELECT * FROM season WHERE id = ?", seasonID);
    if (!season.length)
      return res.status(400).json({ message: "Invalid season id" });

    let sql = `SELECT * FROM ranks WHERE steam = ? AND season_id = ?`;
    let result = await db.query(sql, [steamID, seasonID]);
    if (!result.length) {
      await db.query(
        "INSERT INTO ranks (steam, season_id, score) VALUES (?,?,?)",
        [steamID, seasonID, 1000]
      );
      result = await db.query(sql, steamID);
    }

    let updateStmt = {};
    for (const key in req.body) {
      if (key == "score" || key == "lastconnect")
        updateStmt[key] = parseFloat(req.body[key]);
      else if (result[0][key] === null)
        updateStmt[key] = parseFloat(req.body[key]);
      else
        updateStmt[key] =
          parseFloat(result[0][key]) + parseFloat(req.body[key]);
    }

    updateStmt = await db.buildUpdateStatement(updateStmt);
    if (!Object.keys(updateStmt)) {
      res.status(412).json({ message: "No update data has been provided." });
      return;
    }

    await db.query("UPDATE ranks SET ? WHERE steam = ? AND season_id = ?", [
      updateStmt,
      steamID,
      seasonID,
    ]);
    res.json({
      message: "Rank stats for player " + steamID + " successfully updated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.toString() });
  }
});

router.delete(
  "/:steam_id",
  Utils.ensureAuthenticated,
  async (req, res, next) => {
    try {
      let steamID = req.params.steam_id;
      let sql = `DELETE FROM ranks WHERE steam = ?`;
      await db.query(sql, steamID);

      res.json({ message: "Rank stats reseted for player " + steamID });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.toString() });
    }
  }
);

export default router;