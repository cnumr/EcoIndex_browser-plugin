import { getBrowserPolyfill } from "../common.js";

const STORAGE_KEY = "ecoindex_options";
const DEFAULT_OPTIONS = { showScreenshot: true };

const browserApi = getBrowserPolyfill();
const statusEl = document.getElementById("options-status");
const checkbox = document.getElementById("show-screenshot");
const versionEl = document.getElementById("extension-version");

function showSaved() {
	statusEl.textContent = "Enregistré.";
	setTimeout(() => {
		statusEl.textContent = "";
	}, 2000);
}

async function load() {
	const manifest = browserApi.runtime.getManifest();
	versionEl.textContent = manifest.version ?? "—";

	const stored = await browserApi.storage.local.get({
		[STORAGE_KEY]: DEFAULT_OPTIONS,
	});
	const opts = { ...DEFAULT_OPTIONS, ...stored[STORAGE_KEY] };
	checkbox.checked = opts.showScreenshot !== false;
}

async function save() {
	await browserApi.storage.local.set({
		[STORAGE_KEY]: {
			...DEFAULT_OPTIONS,
			showScreenshot: checkbox.checked,
		},
	});
	showSaved();
}

checkbox.addEventListener("change", () => {
	save().catch(console.error);
});

load().catch(console.error);
