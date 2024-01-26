const fs = require("fs");
const archiver = require("archiver");

const foldersToCompress = ["commands", "server", "utils"];
const filesToCompress = [
  "package.json",
  "index.js",
  "discloud.config",
  "config.json",
  "deploy-commands.js",
];
const outputFilename = "build.zip";

const archive = archiver("zip");
const output = fs.createWriteStream(outputFilename);

archive.pipe(output);

foldersToCompress.forEach((folder) => {
  archive.directory(folder, folder);
});

filesToCompress.forEach((file) => {
  archive.file(file, { name: file });
});

archive.finalize();

output.on("close", () => {
  console.log(`Folders compressed successfully into ${outputFilename}`);
});

archive.on("error", (err) => {
  console.error("Error compressing folders:", err);
});
