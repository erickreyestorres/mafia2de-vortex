"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { GAME_ID } = require("../src/constants");
const { installContent, testSupportedContent } = require("../src/installer");
const { isSafeArchivePath } = require("../src/paths");

test("accepts file layouts only for Mafia II: Definitive Edition", async () => {
  const files = ["pc/mod.dll", "README.txt"];

  assert.equal((await testSupportedContent(files, GAME_ID)).supported, true);
  assert.equal((await testSupportedContent(files, "another-game")).supported, false);
});

test("preserves archive paths and does not flatten wrapper directories", async () => {
  const { instructions } = await installContent([
    "ModPackage/pc/mod.dll",
    "ModPackage/data/example.bin",
    "ModPackage/",
  ]);

  assert.deepEqual(
    instructions.map(({ source, destination }) => [source, destination]),
    [
      ["ModPackage/pc/mod.dll", path.join("ModPackage", "pc", "mod.dll")],
      ["ModPackage/data/example.bin", path.join("ModPackage", "data", "example.bin")],
    ],
  );
});

test("rejects unsafe paths rather than generating deployment instructions", async () => {
  const unsafePaths = [
    "../outside.dll",
    "folder/../../outside.dll",
    "folder/./file.dll",
    "../",
    "/absolute/file.dll",
    "\\\\server\\share\\file.dll",
    "C:\\outside.dll",
    "folder/file.dll:stream",
    "folder/CON.txt",
    "folder/trailing. ",
  ];

  for (const unsafePath of unsafePaths) {
    assert.equal(isSafeArchivePath(unsafePath), false, unsafePath);
    assert.equal(
      (await testSupportedContent([unsafePath], GAME_ID)).supported,
      false,
      unsafePath,
    );
    assert.throws(() => installContent([unsafePath]), /unsafe archive paths/i);
  }
});

test("allows ordinary nested paths and rejects an empty archive", async () => {
  assert.equal(isSafeArchivePath("pc/data/mod-file.bin"), true);
  assert.equal((await testSupportedContent([], GAME_ID)).supported, false);
});
