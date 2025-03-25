import { useEffect, useState } from 'react';

const ZigWasmPage = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const response = await fetch('/zig-wasm/zig_module.wasm');
        const buffer = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(buffer);
        const addOne = instance.exports.add_one;
        const result = addOne(41);
        setResult(result);
      } catch (error) {
        console.error('Error loading WASM module:', error);
      }
    };

    loadWasm();
  }, []);

  return (
    <div>
      <h1>Zig WebAssembly Example</h1>
      <p>Result from Zig WASM module: {result}</p>
    </div>
  );
};

export default ZigWasmPage;
