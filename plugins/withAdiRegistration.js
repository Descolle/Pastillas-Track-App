const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withAdiRegistration(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const source = path.join(
        config.modRequest.projectRoot,
        "assets",
        "adi-registration.properties"
      );

      const targetDir = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "raw"
      );

      if (!fs.existsSync(source)) {
        throw new Error(`Missing ADI registration file: ${source}`);
      }

      // crear carpeta raw si no existe
      fs.mkdirSync(targetDir, { recursive: true });

      // copiar archivo
      fs.copyFileSync(
        source,
        path.join(targetDir, "adi-registration.properties")
      );

      return config;
    },
  ]);
};
