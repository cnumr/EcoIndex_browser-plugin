import { access, constants, link } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const f = fileURLToPath(import.meta.url);
const dirname = path.dirname(f);

const manifest = `${dirname}/../src/manifest.json`;

access(manifest, constants.F_OK, (err) => {
	if (err) {
		link(`${dirname}/../src/manifest-firefox.json`, manifest, (e) => {
			if (e) {
				console.log(e);
			}
		});
	}
});
