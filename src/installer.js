"use strict";

const { GAME_ID } = require("./constants");
const { isDirectoryEntry, isSafeArchivePath, toDestinationPath } = require("./paths");

function findUnsafePaths(files) {
  if (!Array.isArray(files)) {
    throw new TypeError("Installer file list must be an array.");
  }

  return files.filter((file) => !isSafeArchivePath(file));
}

function testSupportedContent(files, gameId) {
  const unsafePaths = findUnsafePaths(files);
  const hasFiles = files.some((file) => !isDirectoryEntry(file));

  return Promise.resolve({
    supported: gameId === GAME_ID && hasFiles && unsafePaths.length === 0,
    requiredFiles: [],
  });
}

function installContent(files) {
  const unsafePaths = findUnsafePaths(files);
  if (unsafePaths.length > 0) {
    throw new Error(`Refusing to install unsafe archive paths: ${unsafePaths.join(", ")}`);
  }

  const instructions = files
    .filter((file) => !isDirectoryEntry(file))
    .map((file) => ({
      type: "copy",
      source: file,
      destination: toDestinationPath(file),
    }));

  return Promise.resolve({ instructions });
}

module.exports = {
  findUnsafePaths,
  installContent,
  testSupportedContent,
};
