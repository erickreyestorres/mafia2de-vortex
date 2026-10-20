"use strict";

const { log, util } = require("@nexusmods/vortex-api");
const { EXECUTABLE, GAME_ID, GAME_NAME, STEAM_APP_ID, STEAM_APP_ID_NUMBER } = require("./constants");
const { findUnsafePaths, installContent, testSupportedContent } = require("./installer");

function findGame() {
  return util.GameStoreHelper.findByAppId(STEAM_APP_ID, "steam")
    .then((game) => game.gamePath)
    .catch((err) => {
      log("warn", `Unable to locate ${GAME_NAME} through Steam`, {
        message: err.message,
      });
      throw err;
    });
}

function main(context) {
  context.registerGame({
    id: GAME_ID,
    name: GAME_NAME,
    mergeMods: true,
    queryPath: findGame,
    queryModPath: () => ".",
    executable: () => EXECUTABLE,
    requiredFiles: [EXECUTABLE],
    environment: {
      SteamAPPId: STEAM_APP_ID,
    },
    details: {
      steamAppId: STEAM_APP_ID_NUMBER,
      nexusPageId: GAME_ID,
    },
  });

  context.registerInstaller(
    "mafia2de-loose-files",
    25,
    (files, gameId) => {
      const unsafePaths = findUnsafePaths(files);
      if (unsafePaths.length > 0) {
        log("warn", "Rejected an archive with unsafe paths", { paths: unsafePaths });
      }
      return testSupportedContent(files, gameId);
    },
    (files) => {
      const unsafePaths = findUnsafePaths(files);
      if (unsafePaths.length > 0) {
        log("error", "Refusing to install an archive with unsafe paths", { paths: unsafePaths });
      }
      return installContent(files);
    },
  );

  log("info", `Registered ${GAME_NAME} support`, {
    steamAppId: STEAM_APP_ID,
    executable: EXECUTABLE,
  });

  return true;
}

module.exports = {
  default: main,
};
