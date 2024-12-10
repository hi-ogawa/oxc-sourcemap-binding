import { test, expect, beforeAll } from "vitest";
import { initNode, visualize_sourcemap } from "./index.js";

beforeAll(async () => {
	await initNode();
});

test("basic", async () => {
	const js = `\

//#region dep1.js
var dep1_default = "dep1-test";

//#endregion
//#region dep2.js
var dep2_default = "dep2-generated";

//#endregion
//#region dep3.js
var dep3_default = "dep3-test";

//#endregion
//#region main.js
console.log(dep1_default, dep2_default, dep3_default);

//#endregion
$$$//#$$$ sourceMappingURL=main.js.map
`.replace("$$$//#$$$", "//#"); // Vitest crashes with "///#" comment

	const map = JSON.stringify({
		version: 3,
		file: "main.js",
		names: ["dep1", "dep2", "dep3"],
		sources: ["../dep1.js", "../dep2.js", "../dep3.js", "../main.js"],
		sourcesContent: [
			'export default "dep1-test"\n',
			'export default "dep2-test"\n',
			'export default "dep3-test"\n',
			'import dep1 from "./dep1"\nimport dep2 from "./dep2"\nimport dep3 from "./dep3"\nconsole.log(dep1, dep2, dep3)\n',
		],
		mappings: ";;mBAAe;;;;;;;;mBEAA;;;;ACGf,QAAQ,IAAIA,cAAMC,cAAMC,aAAK",
	});
	expect(visualize_sourcemap(js, map)).toMatchInlineSnapshot(`
		"- ../dep1.js
		(0:15) "\\"dep1-test\\"\\n" --> (2:19) "\\"dep1-test\\";\\n"
		- ../dep3.js
		(0:15) "\\"dep3-test\\"\\n" --> (10:19) "\\"dep3-test\\";\\n"
		- ../main.js
		(3:0) "console." --> (14:0) "console."
		(3:8) "log(" --> (14:8) "log("
		(3:12) "dep1, " --> (14:12) "dep1_default, "
		(3:18) "dep2, " --> (14:26) "dep2_default, "
		(3:24) "dep3)" --> (14:40) "dep3_default)"
		(3:29) "\\n" --> (14:53) ";\\n"
		"
	`);
});

test("inline", async () => {
	const js = `\

//#region dep1.js
var dep1_default = "dep1-test";

//#endregion
//#region dep2.js
var dep2_default = "dep2-generated";

//#endregion
//#region dep3.js
var dep3_default = "dep3-test";

//#endregion
//#region main.js
console.log(dep1_default, dep2_default, dep3_default);

//#endregion
$$$//#$$$ sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm5hbWVzIjpbImRlcDEiLCJkZXAyIiwiZGVwMyJdLCJzb3VyY2VzIjpbIi4uL2RlcDEuanMiLCIuLi9kZXAyLmpzIiwiLi4vZGVwMy5qcyIsIi4uL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgXCJkZXAxLXRlc3RcIlxuIiwiZXhwb3J0IGRlZmF1bHQgXCJkZXAyLXRlc3RcIlxuIiwiZXhwb3J0IGRlZmF1bHQgXCJkZXAzLXRlc3RcIlxuIiwiaW1wb3J0IGRlcDEgZnJvbSBcIi4vZGVwMVwiXG5pbXBvcnQgZGVwMiBmcm9tIFwiLi9kZXAyXCJcbmltcG9ydCBkZXAzIGZyb20gXCIuL2RlcDNcIlxuY29uc29sZS5sb2coZGVwMSwgZGVwMiwgZGVwMylcbiJdLCJtYXBwaW5ncyI6Ijs7bUJBQWU7Ozs7Ozs7O21CRUFBOzs7O0FDR2YsUUFBUSxJQUFJQSxjQUFNQyxjQUFNQyxhQUFLIn0=
`.replace("$$$//#$$$", "//#");

	expect(visualize_sourcemap(js)).toMatchInlineSnapshot(`
		"- ../dep1.js
		(0:15) "\\"dep1-test\\"\\n" --> (2:19) "\\"dep1-test\\";\\n"
		- ../dep3.js
		(0:15) "\\"dep3-test\\"\\n" --> (10:19) "\\"dep3-test\\";\\n"
		- ../main.js
		(3:0) "console." --> (14:0) "console."
		(3:8) "log(" --> (14:8) "log("
		(3:12) "dep1, " --> (14:12) "dep1_default, "
		(3:18) "dep2, " --> (14:26) "dep2_default, "
		(3:24) "dep3)" --> (14:40) "dep3_default)"
		(3:29) "\\n" --> (14:53) ";\\n"
		"
	`);
});
