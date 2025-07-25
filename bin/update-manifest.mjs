import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const f = fileURLToPath(import.meta.url);
const dirname = path.dirname(f);

function updateManifest(browser) {
	const filename = `${dirname}/../src/manifest-${browser}.json`;
	const manifest = readFileSync(filename, "utf8");
	const data = {
		...JSON.parse(manifest),
		version: process.env.npm_package_version,
	};

	writeFileSync(filename, JSON.stringify(data, null, 2), "utf8");
}

["firefox", "chrome"].forEach((browser) => updateManifest(browser));
