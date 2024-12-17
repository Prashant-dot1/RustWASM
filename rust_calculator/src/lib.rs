use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn evaluate_expression(expression: &str) -> Result<f64, String> {
    meval::eval_str(expression).map_err(|e| e.to_string())
}


