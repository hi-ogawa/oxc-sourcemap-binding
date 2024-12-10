use base64::{prelude::BASE64_STANDARD, Engine as _};
use oxc_sourcemap::{SourceMap, SourcemapVisualizer};
use wasm_bindgen::{prelude::wasm_bindgen, JsError};

const SOURCE_MAP_COMMENT: &str = "//# sourceMappingURL=data:application/json;charset=utf-8;base64,";

#[wasm_bindgen]
pub fn visualize_sourcemap(code: String, map: Option<String>) -> Result<String, JsError> {
    let map = match map {
        Some(map) => SourceMap::from_json_string(&map)?,
        None => {
            'result: {
                // extrace inline sourcemap
                for line in code.lines().rev() {
                    if line.starts_with(SOURCE_MAP_COMMENT) {
                        let input = line[SOURCE_MAP_COMMENT.len()..].as_bytes();
                        let decoded = String::from_utf8(BASE64_STANDARD.decode(input)?)?;
                        break 'result SourceMap::from_json_string(&decoded)?;
                    }
                }
                return Err(JsError::new("Inline source map not found"));
            }
        }
    };
    let visualizer = SourcemapVisualizer::new(&code, &map);
    Ok(visualizer.into_visualizer_text())
}
