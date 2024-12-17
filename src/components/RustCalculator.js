import React, { useState, useEffect } from 'react';

function RustCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [wasm, setWasm] = useState(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const wasmModule = await import(/* webpackIgnore: true */ '/wasm/rust_calculator.js');
        await wasmModule.default();
        setWasm(wasmModule);
      } catch (err) {
        console.error('Failed to load WASM module:', err);
      }
    };

    loadWasm();
  }, []);

  const calculate = () => {
    if (!wasm) {
      setResult('Error: WASM module not loaded yet.');
      return;
    }

    try {
      const res = wasm.evaluate_expression(expression);
      setResult(res);
    } catch (err) {
      setResult('Not a valid expression to calculate.');
    }
  };

  return (
    <div className="container">
      <h1>Rust Calculator</h1>
      <div className="input-group">
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Enter expression (e.g., 2+2)"
          style={{ marginRight: '10px', width: '300px', height: '35px' }}
        />
        <button onClick={calculate}>Calculate</button>
      </div>
      <p>Result: {result}</p>
    </div>
  );
}

export default RustCalculator;
