import { access, link, F_OK } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const f = fileURLToPath(import.meta.url);
const dirname = path.dirname(f);

const manifest = `${dirname}/../src/manifest.json`;

access(manifest, F_OK, (err) => {
	if (err) {
		link(`${dirname}/../src/manifest-firefox.json`, manifest, (e) => {
			if (e) {
				console.log(e);
			}
		});
	}
});
