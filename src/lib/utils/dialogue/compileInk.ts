import { exec } from "child_process";
import path from "path";
import fs from "fs";

// Directories
const INK_DIR = path.resolve("./src/lib/utils/dialogue/ink");
const OUTPUT_DIR = path.resolve("./src/lib/utils/dialogue/compiled");

// Compile Ink to JSON file
function compileInk(inputFile: string): void {
  const inputPath = path.resolve(inputFile);
  const fileName = path.basename(inputPath, ".ink");
  const outputPath = path.join(OUTPUT_DIR, `${fileName}.ink.json`);

  // Ensure input file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File "${inputFile}" not found.`);
    return;
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Run inklecate command
  const command = `inklecate.exe -o "${outputPath}" "${inputPath}"`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error compiling Ink file: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Compiler stderr: ${stderr}`);
    }
    console.log(`Successfully compiled ${inputFile} to ${outputPath}`);
  });
}

// Compile all Ink files in directory
function compileAllInkFiles(directory: string): void {
  if (!fs.existsSync(directory)) {
    console.error(`Error: Directory "${directory}" not found.`);
    process.exit(1);
  }

  const files = fs.readdirSync(directory).filter(file => file.endsWith(".ink"));

  if (files.length === 0) {
    console.log(`No .ink files found in "${directory}".`);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(directory, file);
    compileInk(filePath);
  });
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("No input file provided. Compiling all .ink files in the default directory...");
  compileAllInkFiles(INK_DIR);
} else {
  compileInk(args[0]);
}