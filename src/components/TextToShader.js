import React, { useState } from 'react';
import ShaderCanvas from './ShaderCanvas';

function TextToShader() {
  const [description, setDescription] = useState('');
  const [shaderData, setShaderData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchShader = async () => {
    setIsLoading(true);
    setError(null);
    setShaderData(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/generate-shader`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();

      if (response.ok) {
        // Validate essential fields
        if (data.vertexShaderCode && data.fragmentShaderCode && data.vertices && data.indices) {
          setShaderData(data);
        } else {
          throw new Error('Incomplete shader data received from the backend.');
        }
      } else {
        throw new Error(data.error || 'Failed to generate shader.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '2rem' }}>
      <h1>Text-to-Shader</h1>
      <p>Describe the shader (e.g., "A rotating cube with a gradient background"):</p>
      
      {/* Input Area */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter shader description here..."
        rows="4"
        style={{
          width: '100%',
          padding: '1em',
          marginBottom: '1em',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />

      {/* Generate Button */}
      <button
        onClick={fetchShader}
        disabled={isLoading || !description.trim()}
        style={{
          padding: '0.75em 1.5em',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {isLoading ? 'Generating...' : 'Generate Shader'}
      </button>

      {/* Error Message */}
      {error && <p style={{ color: 'red', marginTop: '1em' }}>{error}</p>}

      {/* Shader Canvas */}
      {shaderData && (
        <>
          <h2>Generated Shader</h2>
          <ShaderCanvas shaderData={shaderData} setError={setError} />

          {/* Display Raw Shader Data */}
          <h3>Shader Data</h3>
          <pre
            style={{
              backgroundColor: '#f4f4f4',
              padding: '1em',
              border: '1px solid #ddd',
              overflowX: 'auto',
              maxHeight: '400px',
            }}
          >
            {JSON.stringify(shaderData, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

export default TextToShader;
