  /**
 * @swagger
 * resourcePath: /playerstats
 * description: Express API for player stats in Get5 matches.
 */
const express = require("express");


const router = express.Router();

const db = require("../db");

const Utils = require("../utility/utils");

/* Swagger shared definitions */
/**
 * @swagger
 *
 * components:
 *   schemas:
 *     NewStats:
 *       type: object
 *       required:
 *         - api_key
 *         - match_id
 *         - map_id
 *         - team_id
 *         - steam_id
 *         - name
 *       properties:
 *         api_key:
 *           type: string
 *           description: API key of the match being updated.
 *         match_id:
 *           type: integer
 *           description: Match identifier in the system.
 *         map_id:
 *           type: integer
 *           description: Integer determining the current map of the match.
 *         team_id:
 *           type: integer
 *           description: Integer determining the team a player is on.
 *         steam_id:
 *           type: string
 *           description: String that reprsents a players Steam64 ID.
 *         name:
 *           type: string
 *           description: String determining player's name.
 *         kills:
 *           type: integer
 *           description: Integer representing amount of kills.
 *         deaths:
 *           type: integer
 *           description: Integer representing amount of deaths.
 *         roundsplayed:
 *           type: integer
 *           description: Integer representing amount of roundsplayed.
 *         assists:
 *           type: integer
 *           description: Integer representing amount of assists.
 *         flashbang_assists:
 *           type: integer
 *           description: Integer representing amount of flashbang assists.
 *         teamkills:
 *           type: integer
 *           description: Integer representing amount of team kills.
 *         suicides:
 *           type: integer
 *           description: Integer representing amount of suicides.
 *         headshot_kills:
 *           type: integer
 *           description: Integer representing amount of headshot kills.
 *         damage:
 *           type: integer
 *           description: Integer representing amount of damage.
 *         bomb_plants:
 *           type: integer
 *           description: Integer representing amount of bomb plants.
 *         bomb_defuses:
 *           type: integer
 *           description: Integer representing amount of bomb defuses.
 *         v1:
 *           type: integer
 *           description: Integer representing amount of 1v1s.
 *         v2:
 *           type: integer
 *           description: Integer representing amount of 1v2s.
 *         v3:
 *           type: integer
 *           description: Integer representing amount of 1v3s.
 *         v4:
 *           type: integer
 *           description: Integer representing amount of 1v4s.
 *         v5:
 *           type: integer
 *           description: Integer representing amount of 1v5s.
 *         k1:
 *           type: integer
 *           description: Integer representing amount of 1 kill rounds.
 *         k2:
 *           type: integer
 *           description: Integer representing amount of 2 kill rounds.
 *         k3:
 *           type: integer
 *           description: Integer representing amount of 3 kill rounds.
 *         k4:
 *           type: integer
 *           description: Integer representing amount of 4 kill rounds.
 *         k5:
 *           type: integer
 *           description: Integer representing amount of 5 kill rounds.
 *         firstdeath_ct:
 *           type: integer
 *           description: Integer representing amount of times a player died as a CT first in a round.
 *         firstdeath_t:
 *           type: integer
 *           description: Integer representing amount of times a player died as a T first in a round.
 *         firstkill_ct:
 *           type: integer
 *           description: Integer representing amount of times a player killed as a CT first in a round.
 *         firstkill_t:
 *           type: integer
 *           description: Integer representing amount of times a player killed as a T first in a round.
 *     PlayerStat:
 *       allOf:
 *         - $ref: '#/components/schemas/NewStats'
 *         - type: object
 *           properties:
 *             steam_id:
 *               type: string
 *     SimpleResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *   responses:
 *     BadRequest:
 *       description: Steam ID not supplied.
 *     NotFound:
 *       description: The specified resource was not founds
 *     Unauthorized:
 *       description: Unauthorized
 *     StatsNotFound:
 *       description: Stats not Found.
 *     Error:
 *       description: Error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SimpleResponse'
 */


/**
 * @swagger
 *
 * /playerstats/:
 *   get:
 *     description: Route serving to get all player statistics.
 *     produces:
 *       - application/json
 *     tags:
 *       - playerstats
 *     responses:
 *       200:
 *         description: Player Stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleResponse'
 *       400:
 *         $ref: '#/components/responses/PlayerStatsNotFound'
 *       500:
 *         $ref: '#/components/responses/Error'
 */
router.get("/", async (req, res, next) => {
  try {
    // Check if admin, if they are use this query.
    let sql = "SELECT * FROM player_stats";
    const playerStats = await db.query(sql);
    if (playerStats.length === 0) {
      res.status(404).json({ message: "No stats found on the site!" });
      return;
    }
    res.json(playerStats);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

/**
 * @swagger
 *
 * /playerstats/:steam_id:
 *   get:
 *     description: Player stats from a given Steam ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: steam_id
 *         required: true
 *         type: string
 *     tags:
 *       - playerstats
 *     responses:
 *       200:
 *         description: Player stats from a given user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleResponse'
 *       404:
 *         $ref: '#/components/responses/PlayerStatsNotFound'
 *       500:
 *         $ref: '#/components/responses/Error'
 */
router.get("/:steam_id", async (req, res, next) => {
  try {
    //
    steamID = req.params.steam_id;
    let sql = "SELECT * FROM player_stats where steam_id = ?";
    const playerStats = await db.query(sql, steamID);
    if (playerStats.length === 0) {
      res.status(404).json({ message: "No stats found for player " + steamID });
      return;
    }
    res.json(playerStats);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

/**
 * @swagger
 *
 * /playerstats/match/:match_id:
 *   get:
 *     description: Player stats from a given match in the system.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: match_id
 *         required: true
 *         type: number
 *     tags:
 *       - playerstats
 *     responses:
 *       200:
 *         description: Player stats from a given match.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleResponse'
 *       404:
 *         $ref: '#/components/responses/PlayerStatsNotFound'
 *       500:
 *         $ref: '#/components/responses/Error'
 */
router.get("/match/:match_id", async (req, res, next) => {
  try {
    matchID = req.params.match_id;
    let sql = "SELECT * FROM player_stats where match_id = ?";
    const playerStats = await db.query(sql, matchID);
    if (playerStats.length === 0) {
      res.status(404).json({ message: "No stats found for match " + matchID });
      return;
    }
    res.json(playerStats);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

/**
 * @swagger
 *
 * /playerstats:
 *   post:
 *     description: Create player stats in a match/map.
 *     produces:
 *       - application/json
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NewStats'
 *     tags:
 *       - playerstats
 *     responses:
 *       200:
 *         description: Create successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleResponse'
 *       403:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/Error'
 */
router.post("/", Utils.ensureAuthenticated, async (req, res, next) => {
  try {
    if (
      req.body[0].match_id == null ||
      req.body[0].map_id == null ||
      req.body[0].team_id == null ||
      req.body[0].steam_id == null ||
      req.body[0].name == null ||
      req.body[0].api_key == null
    ) {
      res.status(404).json({ message: "Required Data Not Provided" });
      return;
    }
    let currentMatchInfo =
      "SELECT mtch.user_id as user_id, mtch.cancelled as cancelled, mtch.forfeit as forfeit, mtch.end_time as mtch_end_time, mtch.api_key as mtch_api_key FROM `match` mtch WHERE mtch.id=?";
    const matchRow = await db.query(currentMatchInfo, req.body[0].match_id);
    if (matchRow.length === 0) {
      res.status(404).json({ message: "No match found." });
      return;
    } else if (
      matchRow[0].mtch_api_key != req.body[0].api_key &&
      !Utils.superAdminCheck(req.user)
    ) {
      res
        .status(403)
        .json({ message: "User is not authorized to perform action." });
      return;
    } else if (
      matchRow[0].cancelled == 1 ||
      matchRow[0].forfeit == 1 ||
      matchRow[0].mtch_end_time != null
    ) {
      res.status(403).json({
        message:
          "Match is already finished. Cannot insert into historical matches.",
      });
      return;
    } else {
      await db.withTransaction(async () => {
        let insertSet = {
          match_id: req.body[0].match_id,
          map_id: req.body[0].map_id,
          team_id: req.body[0].team_id,
          steam_id: req.body[0].steam_id,
          name: req.body[0].name,
          kills: req.body[0].kills,
          deaths: req.body[0].deaths,
          roundsplayed: req.body[0].roundsplayed,
          assists: req.body[0].assists,
          flashbang_assists: req.body[0].flashbang_assists,
          teamkills: req.body[0].teamkills,
          suicides: req.body[0].suicides,
          headshot_kills: req.body[0].headshot_kills,
          damage: req.body[0].damage,
          bomb_plants: req.body[0].bomb_plants,
          bomb_defuses: req.body[0].bomb_defuses,
          v1: req.body[0].v1,
          v2: req.body[0].v2,
          v3: req.body[0].v3,
          v4: req.body[0].v4,
          v5: req.body[0].v5,
          k1: req.body[0].k1,
          k2: req.body[0].k2,
          k3: req.body[0].k3,
          k4: req.body[0].k4,
          k5: req.body[0].k5,
          firstdeath_ct: req.body[0].firstdeath_ct,
          firstdeath_t: req.body[0].firstdeath_t,
          firstkill_ct: req.body[0].firstkill_ct,
          firstkill_t: req.body[0].firstkill_t,
        };
        let sql = "INSERT INTO player_stats SET ?";
        // Remove any values that may not be inserted off the hop.
        insertSet = await db.buildUpdateStatement(insertSet);
        await db.query(sql, [insertSet]);
        res.json({ message: "Player Stats inserted successfully!" });
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

/**
 * @swagger
 *
 * /playerstats:
 *   put:
 *     description: Update player stats in a match/map.
 *     produces:
 *       - application/json
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NewStats'
 *     tags:
 *       - playerstats
 *     responses:
 *       200:
 *         description: Update successful.
 *         content:
 *           application/json:
 *             type: object
 *             schema:
 *               $ref: '#/components/schemas/SimpleResponse'
 *       403:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/Error'
 */
router.put("/", Utils.ensureAuthenticated, async (req, res, next) => {
  try {
    if (
      req.body[0].match_id == null ||
      req.body[0].map_id == null ||
      req.body[0].team_id == null ||
      req.body[0].steam_id == null ||
      req.body[0].api_key == null
    ) {
      res.status(404).json({ message: "Required Data Not Provided" });
      return;
    }
    let currentMatchInfo =
      "SELECT mtch.user_id as user_id, mtch.cancelled as cancelled, mtch.forfeit as forfeit, mtch.end_time as mtch_end_time, mtch.api_key as mtch_api_key FROM `match` mtch, map_stats mstat WHERE mtch.id=? AND mstat.match_id=mtch.id";
    const matchRow = await db.query(currentMatchInfo, req.body[0].match_id);
    if (matchRow.length === 0) {
      res.status(404).json({ message: "No match found." });
      return;
    } else if (
      matchRow[0].mtch_api_key != req.body[0].api_key &&
      !Utils.superAdminCheck(req.user)
    ) {
      res
        .status(403)
        .json({ message: "User is not authorized to perform action." });
      return;
    } else if (
      matchRow[0].cancelled == 1 ||
      matchRow[0].forfeit == 1 ||
      matchRow[0].mtch_end_time != null
    ) {
      res.status(403).json({
        message: "Match is already finished. Cannot update historical matches.",
      });
      return;
    } else {
      await db.withTransaction(async () => {
        let updateStmt = {
          name: req.body[0].name,
          kills: req.body[0].kills,
          deaths: req.body[0].deaths,
          roundsplayed: req.body[0].roundsplayed,
          assists: req.body[0].assists,
          flashbang_assists: req.body[0].flashbang_assists,
          teamkills: req.body[0].teamkills,
          suicides: req.body[0].suicides,
          headshot_kills: req.body[0].headshot_kills,
          damage: req.body[0].damage,
          bomb_plants: req.body[0].bomb_plants,
          bomb_defuses: req.body[0].bomb_defuses,
          v1: req.body[0].v1,
          v2: req.body[0].v2,
          v3: req.body[0].v3,
          v4: req.body[0].v4,
          v5: req.body[0].v5,
          k1: req.body[0].k1,
          k2: req.body[0].k2,
          k3: req.body[0].k3,
          k4: req.body[0].k4,
          k5: req.body[0].k5,
          firstdeath_ct: req.body[0].firstdeath_ct,
          firstdeath_t: req.body[0].firstdeath_t,
          firstkill_ct: req.body[0].firstkill_ct,
          firstkill_t: req.body[0].firstkill_t,
        };
        // Remove any values that may not be updated.
        updateStmt = await db.buildUpdateStatement(updateStmt);
        if (Object.keys(updateStmt).length === 0) {
          res
            .status(412)
            .json({ message: "No update data has been provided." });
          return;
        }
        let sql =
          "UPDATE player_stats SET ? WHERE map_id = ? AND match_id = ? AND steam_id = ?";
        const updatedPlayerStats = await db.query(sql, [
          updateStmt,
          req.body[0].map_id,
          req.body[0].match_id,
          req.body[0].steam_id,
        ]);
        if (updatedPlayerStats.affectedRows > 0) {
          res.json({ message: "Player Stats were updated successfully!" });
          return;
        } else {
          sql = "INSERT INTO player_stats SET ?";
          // Update values to include match/map/steam_id.
          updateStmt.steam_id = req.body[0].steam_id;
          updateStmt.map_id = req.body[0].map_id;
          updateStmt.match_id = req.body[0].match_id;
          //If a player is a standin we should still record stats as "that team".
          updateStmt.team_id = req.body[0].team_id;
          await db.query(sql, [updateStmt]);
          res.json({ message: "Player Stats Inserted Successfully!" });
          return;
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

/** DEL - Delete all match data associated with a match, including stats, vetoes, etc. **NOT IMPLEMENTED**
 * @name router.delete('/delete')
 * @memberof module:routes/playerstats
 * @function
 * @param {number} req.body[0].match_id - The ID of the match to remove all values pertaining to the match.
 *
 */
/**
 * @swagger
 *
 * /playerstats:
 *   delete:
 *     description: Delete all player stats object from a match.
 *     produces:
 *       - application/json
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              match_id:
 *                type: integer
 *     tags:
 *       - playerstats
 *     responses:
 *       200:
 *         description: Player stat deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/MatchNotFound'
 *       500:
 *         $ref: '#/components/responses/Error'
 */
router.delete("/", async (req, res, next) => {
  try {
    if (req.body[0].match_id == null) {
      res.status(404).json({ message: "Required Data Not Provided" });
      return;
    }
    let currentMatchInfo =
      "SELECT mtch.user_id as user_id, mtch.cancelled as cancelled, mtch.forfeit as forfeit, mtch.end_time as mtch_end_time, mtch.api_key as mtch_api_key FROM `match` mtch, map_stats mstat WHERE mtch.id=?";
    const matchRow = await db.query(currentMatchInfo, req.body[0].match_id);
    if (matchRow.length === 0) {
      res.status(404).json({ message: "No player stats data found." });
      return;
    } else if (
      matchRow[0].user_id != req.user.id &&
      !Utils.superAdminCheck(req.user)
    ) {
      res
        .status(403)
        .json({ message: "User is not authorized to perform action." });
      return;
    } else if (
      matchRow[0].cancelled == 1 ||
      matchRow[0].forfeit == 1 ||
      matchRow[0].mtch_end_time != null
    ) {
      let deleteSql = "DELETE FROM player_stats WHERE match_id = ?";
      await db.withTransaction(async () => {
        const delRows = await db.query(deleteSql, [req.body[0].match_id]);
        if (delRows.affectedRows > 0) {
          res.json({ message: "Player stats has been deleted successfully." });
          return;
        } else {
          res
            .status(500)
            .json({
              message:
                "Something went wrong deleting the data. Player stats remain intact.",
            });
          return;
        }
      });
    } else {
      res.status(403).json({
        message: "Match is currently live. Cannot delete live matches.",
      });
      return;
    }
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

module.exports = router;
