import React, { useEffect, useRef } from "react";

function ShaderCanvas({ shaderData, setError }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!shaderData) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      setError("WebGL is not supported in this browser.");
      return;
    }

    try {
      // === Utility: Validate and Fix Data ===
      const validateIndices = (indices, vertices) => {
        const maxIndex = vertices.length / 3 - 1; // Each vertex has 3 components
        return indices.filter((index) => index <= maxIndex);
      };

      const padVertices = (vertices) => {
        // Ensure vertices are multiples of 3 (vec3)
        const paddedVertices = [];
        for (let i = 0; i < vertices.length; i += 3) {
          paddedVertices.push(vertices[i] || 0, vertices[i + 1] || 0, vertices[i + 2] || 0);
        }
        return paddedVertices;
      };

      // === Extract and Validate Shader Data ===
      let { vertexShaderCode, fragmentShaderCode, vertices, indices, drawMode } = shaderData;

      if (!vertexShaderCode || !fragmentShaderCode || !vertices || !indices) {
        throw new Error("Shader data is incomplete.");
      }

      // Validate and pad vertices
      vertices = padVertices(vertices);

      // Validate indices
      indices = validateIndices(indices, vertices);

      // === Compile Shaders ===
      // const compileShader = (type, source) => {
      //   const shader = gl.createShader(type);
      //   gl.shaderSource(shader, source);
      //   gl.compileShader(shader);

      //   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      //     const errorLog = gl.getShaderInfoLog(shader);
      //     console.warn(`Shader compilation failed:\n${errorLog}`);
      //     throw new Error("Shader compilation failed.");
      //   }
      //   return shader;
      // };

      const compileShader = (type, source) => {
        console.log(`Compiling Shader of type ${type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT"}`);
      
        // Strip #version directives for WebGL 1.0 compatibility
        const cleanSource = source.replace(/#version\s+\d+/g, "").trim();
        console.log("Cleaned Shader Source:", cleanSource);
      
        const shader = gl.createShader(type);
        gl.shaderSource(shader, cleanSource);
        gl.compileShader(shader);
      
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const errorLog = gl.getShaderInfoLog(shader);
          console.error(`Shader compilation failed:\n${errorLog}`);
          throw new Error("Shader compilation failed.");
        }
      
        return shader;
      };

      const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderCode);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderCode);

      // === Create and Link Program ===
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("Program linking failed: " + gl.getProgramInfoLog(program));
      }
      gl.useProgram(program);

      // === Create Buffers ===
      // Vertex Buffer
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

      // Index Buffer
      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

      // === Attribute Setup ===
      const positionLoc = gl.getAttribLocation(program, "position");
      if (positionLoc !== -1) {
        gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLoc);
      } else {
        console.warn("Attribute 'position' not found in vertex shader.");
      }

      // === Draw ===
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.enable(gl.DEPTH_TEST);
      gl.drawElements(gl[drawMode] || gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    } catch (err) {
      console.error("ShaderCanvas Error:", err.message);
      setError(err.message);
    }
  }, [shaderData, setError]);

  return <canvas ref={canvasRef} width="500" height="500" style={{ display: "block", margin: "auto" }} />;
}

export default ShaderCanvas;
