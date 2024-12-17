import React, { useState } from 'react';
import RustCalculator from './components/RustCalculator';
import TextToShader from './components/TextToShader';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [calculatorState, setCalculatorState] = useState({ expression: '', result: '' });

  const handleTabChange = (tab) => {
    if (tab === activeTab) return; // Avoid unnecessary re-renders
    if (tab === 'calculator') {
      setCalculatorState({ ...calculatorState }); // Save the state of the calculator tab
    }
    setActiveTab(tab);
  };

  return (
    <div>
      <nav className="navbar">
        <button onClick={() => handleTabChange('calculator')}>Rust Calculator</button>
        <button onClick={() => handleTabChange('shader')}>Text-to-Shader</button>
      </nav>
      <main>
        {activeTab === 'calculator' && (
          <RustCalculator
            initialExpression={calculatorState.expression}
            initialResult={calculatorState.result}
          />
        )}
        {activeTab === 'shader' && <TextToShader />}
      </main>
    </div>
  );
}

export default App;