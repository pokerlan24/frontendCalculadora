import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleClick = (value) => {
    const lastChar = input.slice(-1);

    // Evitar que operadores diferentes de '-' sean el primer carácter
    if (input === '' && /[\+\*\/]/.test(value)) return;

    // Evitar operadores consecutivos como '* /' o '/ *', pero permitir '+', '-' después de '*', '/'
    if (/[\+\-\*\/]/.test(lastChar) && /[\*\/]/.test(value)) return;

    // Evitar que dos '+' o dos '-' aparezcan juntos
    if ((lastChar === '+' && value === '+') || (lastChar === '-' && value === '-')) return;

    // Permitir '-' o '+' después de '*' o '/', pero asegurarse de que no haya otro operador antes
    if (/[\*\/]/.test(lastChar) && /[\+\-]/.test(value)) {
      setInput((prev) => prev + value);
      return;
    }

    // Si todo está correcto, añadir el valor normalmente
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleEqual = async () => {
    // Asegurarse de que no haya una división por 0
    if (/\/0/.test(input)) {
      setResult('Error: No se puede dividir por 0');
      return;
    }

    // Asegurarse de que no haya una expresión vacía o mal formada
    if (input === '') {
      setResult('Error: Expresión vacía');
      return;
    }

    try {
      // Codificar correctamente la expresión antes de enviarla
      const encodedExpression = encodeURIComponent(input);

      // Hacer la solicitud con la expresión codificada
      const response = await axios.get(`/calcular?exp=${encodedExpression}`);

      // Verificar si el backend devuelve datos válidos
      if (Array.isArray(response.data) && response.data.length > 0) {
        const newResult = response.data[0].resultado;
        setResult(newResult);

        // Actualizar el historial de operaciones
        setHistory((prev) => {
          const newHistory = [input + ' = ' + newResult, ...prev];
          return newHistory.slice(0, 10); // Mantener solo las últimas 10 operaciones
        });

        setInput(''); // Limpiar la entrada después de calcular
      } else {
        setResult('Error: No se recibió resultado');
      }
    } catch (error) {
      setResult('Error realizando la operación');
      console.error('Error realizando la operación:', error.response ? error.response.data : error.message);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          {showHistory ? (
            <div className="history">
              <h3>Historial</h3>
              <div className="history-content">
                <ul>
                  {history.map((entry, index) => (
                    <li key={index}>{entry}</li>
                  ))}
                </ul>
              </div>
              <button className="buttonVolver" onClick={toggleHistory}>Volver</button>
            </div>
          ) : (
            <div>
              <textarea
                className="input"
                value={result || input} // Mostrar el resultado si está presente, sino el input
                onChange={(e) => setInput(e.target.value)}
                title={result || input} // Tooltip con el texto completo
                rows={3}
                cols={20}
                readOnly // Para evitar que el usuario modifique el resultado
              />
              <div className="buttons">
                <button className="button clear" title='Limpiar Pantalla' onClick={handleClear}>C</button>
                <button className="button backspace" title='Borrar' onClick={handleBackspace}>←</button>
                <button className="button" onClick={() => handleClick('.')}>.</button>
                <button className="button" onClick={() => handleClick('/')}>/</button>
                <button className="button" onClick={() => handleClick('7')}>7</button>
                <button className="button" onClick={() => handleClick('8')}>8</button>
                <button className="button" onClick={() => handleClick('9')}>9</button>
                <button className="button" onClick={() => handleClick('*')}>*</button>
                <button className="button" onClick={() => handleClick('4')}>4</button>
                <button className="button" onClick={() => handleClick('5')}>5</button>
                <button className="button" onClick={() => handleClick('6')}>6</button>
                <button className="button" onClick={() => handleClick('-')}>-</button>
                <button className="button" onClick={() => handleClick('1')}>1</button>
                <button className="button" onClick={() => handleClick('2')}>2</button>
                <button className="button" onClick={() => handleClick('3')}>3</button>
                <button className="button" onClick={() => handleClick('+')}>+</button>
                <button className="button" onClick={() => handleClick('0')}>0</button>
                <button className="button equal" onClick={handleEqual}>=</button>
                <button className="button history" title='Mostrar Historial' onClick={toggleHistory}>H</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
