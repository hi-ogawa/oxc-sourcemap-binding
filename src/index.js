import initPkg, { visualize_sourcemap } from "../pkg/index.js";

export { visualize_sourcemap };

let initDone = false;

export async function initNode() {
	if (initDone) return;
	initDone = true;

	const fs = await import("node:fs");
	const data = await fs.promises.readFile("pkg/index_bg.wasm");
	await initPkg({
		module_or_path: new Response(data, {
			headers: {
				"content-type": "application/wasm",
			},
		}),
	});
}
