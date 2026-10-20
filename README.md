# Mafia II: Definitive Edition for Vortex

Community game-support extension for Steam App ID `1030830` and Nexus game ID
`3272`. This is an initial `0.1.0` release.

## What it supports

- Steam discovery through Vortex's `GameStoreHelper.findByAppId`.
- The Steam launch executable `pc/Mafia II Definitive Edition.exe`.
- Loose-file mods deployed to the game root by Vortex. Archive paths are
  preserved as provided; the installer does not guess or flatten a mod's
  internal folder layout.
- Rejection of absolute paths, traversal, and invalid Windows destination names.

The extension does not edit game files itself. Vortex controls mod deployment,
conflict handling, enabling/disabling, and removal. Check Vortex's conflict
prompts before deploying files that share a name with game files, and keep a
recoverable copy of the game before testing unfamiliar mods. This version does
not inspect or modify `.sds` files.

## Local installation

1. Run `npm test` from the project directory.
2. In Vortex, open **Extensions** and choose **Install From File**.
3. Create an extension archive from the project root, keeping the following
   items at the archive root:

   ```powershell
   Compress-Archive -Path info.json,index.js,src,gameart.png `
     -DestinationPath .\mafia2de-vortex-0.1.0.zip -Force
   ```

4. Select the ZIP in Vortex, enable the extension, and restart Vortex if
   prompted. Enable Mafia II: Definitive Edition in the Games view.

For development, Vortex can also load the unpacked extension directory from
its **Extensions** page. After changing the source, restart Vortex to reload it.

## Local testing

- Run the automated installer/path checks with `npm test`.
- Verify that Vortex discovers the Steam installation and reports the executable
  as `pc/Mafia II Definitive Edition.exe`.
- Install a test archive with nested folders and confirm that Vortex preserves
  those folders. Test deployment and removal on a disposable game copy/profile.
- Try an archive containing a `..` path and verify the installer rejects it.

## Extension API and game metadata

- [Vortex API README and extension examples](https://github.com/Nexus-Mods/Vortex/blob/master/packages/vortex-api/README.md)
- [How to package a game extension](https://github.com/Nexus-Mods/Vortex/wiki/How-to-package-a-game-extension)
- [Steam app metadata](https://api.steamcmd.net/v1/info/1030830) confirms the install directory and launch target.
- [Nexus Mods game list](https://data.nexusmods.com/file/nexus-data/games.json) lists Mafia II: Definitive Edition as game ID `3272`.
