import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import webExt from "web-ext";

const args = process.argv.slice(2);
const f = fileURLToPath(import.meta.url);
const dirname = path.dirname(f);

/**
 * @param {"firefox" | "chrome"} browser
 */
async function buildForBrowser(browser) {
	fs.rmSync(`${dirname}/../dist/${browser}`, {
		recursive: true,
		force: true,
	});
	fs.mkdirSync(`${dirname}/../dist/${browser}`, { recursive: true });
	fs.copySync(
		`${dirname}/../src/manifest-${browser}.json`,
		`${dirname}/../dist/${browser}/manifest.json`,
	);
	fs.copySync(`${dirname}/../src/popup`, `${dirname}/../dist/${browser}/popup`);
	fs.copySync(
		`${dirname}/../src/options`,
		`${dirname}/../dist/${browser}/options`,
	);
	fs.copySync(
		`${dirname}/../src/images`,
		`${dirname}/../dist/${browser}/images`,
	);
	fs.copySync(
		`${dirname}/../src/background`,
		`${dirname}/../dist/${browser}/background`,
	);
	fs.copySync(
		`${dirname}/../src/common.js`,
		`${dirname}/../dist/${browser}/common.js`,
	);

	const distPath = path.resolve(`${dirname}/../dist/${browser}`);

	await webExt.cmd.build(
		{
			sourceDir: distPath,
			artifactsDir: `${dirname}/../web-ext-artifacts`,
			overwriteDest: true,
			filename: `ecoindex.fr-${browser}.zip`,
		},
		{
			shouldExitProgram: false,
		},
	);

	console.log("Build complete");

	if (browser === "chrome") {
		console.log(
			"\nChrome (test local) : chrome://extensions → Mode développeur → « Charger l’extension non empaquetée ».",
		);
		console.log(
			`Sélectionnez ce dossier (pas le .zip) :\n  ${distPath}\n`,
		);
		console.log(
			"Le fichier .zip sert au Chrome Web Store ou à une archive ; il ne convient pas au chargement non empaqueté.\n",
		);
	}
}

async function main() {
	const browsers = args.filter((b) => ["firefox", "chrome"].includes(b));
	if (browsers.length === 0) {
		console.error("Usage: node build-extension.mjs <chrome|firefox>");
		process.exitCode = 1;
		return;
	}
	for (const browser of browsers) {
		await buildForBrowser(/** @type {"chrome" | "firefox"} */ (browser));
	}
}

main().catch((err) => {
	console.error(err);
	process.exitCode = 1;
});
