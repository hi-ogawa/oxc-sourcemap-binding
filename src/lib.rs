use oxc_sourcemap::{SourceMap, SourcemapVisualizer};
use wasm_bindgen::{prelude::wasm_bindgen, JsError};

#[wasm_bindgen]
pub fn visualize_sourcemap(code: String, map: String) -> Result<String, JsError> {
    let map = SourceMap::from_json_string(&map)?;
    let visualizer = SourcemapVisualizer::new(&code, &map);
    Ok(visualizer.into_visualizer_text())
}
