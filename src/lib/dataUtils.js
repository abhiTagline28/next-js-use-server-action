import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src/data");

export function readDataFile(filename) {
  try {
    const filePath = path.join(dataDirectory, `${filename}.json`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

export function writeDataFile(filename, data) {
  try {
    const filePath = path.join(dataDirectory, `${filename}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

export function generateId(existingData) {
  // Ensure existingData is an array and handle edge cases
  if (!Array.isArray(existingData) || existingData.length === 0) {
    return 1;
  }

  // Filter out any items without valid IDs and get the maximum
  const validIds = existingData
    .filter((item) => item && typeof item.id === "number")
    .map((item) => item.id);

  if (validIds.length === 0) {
    return 1;
  }

  const maxId = Math.max(...validIds);
  return maxId + 1;
}
