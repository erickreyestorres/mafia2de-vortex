"use strict";

const path = require("path");

const WINDOWS_INVALID_CHARACTERS = /[<>:"|?*\x00-\x1f]/;
const WINDOWS_DEVICE_NAME = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i;

function isSafeArchivePath(filePath) {
  if (typeof filePath !== "string" || filePath.length === 0) {
    return false;
  }

  if (filePath.startsWith("/") || filePath.startsWith("\\")
      || /^[a-z]:/i.test(filePath)) {
    return false;
  }

  const segments = filePath.split(/[\\/]+/);
  for (const segment of segments) {
    if (segment === "") {
      continue;
    }

    if (segment === "." || segment === "..") {
      return false;
    }

    const normalizedSegment = segment.replace(/[. ]+$/g, "");
    if (normalizedSegment === "." || normalizedSegment === ".."
        || WINDOWS_INVALID_CHARACTERS.test(segment)
        || WINDOWS_DEVICE_NAME.test(segment)
        || /[. ]$/.test(segment)) {
      return false;
    }
  }

  const destination = path.normalize(filePath.replace(/[\\/]+/g, path.sep));
  return !path.isAbsolute(destination)
    && destination !== "."
    && destination !== ".."
    && !destination.startsWith(`..${path.sep}`);
}

function isDirectoryEntry(filePath) {
  return typeof filePath === "string" && /[\\/]$/.test(filePath);
}

function toDestinationPath(filePath) {
  if (!isSafeArchivePath(filePath)) {
    throw new Error(`Unsafe archive path: ${String(filePath)}`);
  }

  return path.normalize(filePath.replace(/[\\/]+/g, path.sep));
}

module.exports = {
  isDirectoryEntry,
  isSafeArchivePath,
  toDestinationPath,
};
