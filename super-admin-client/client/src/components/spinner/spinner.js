import { useState, CSSProperties } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

function App() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState('#ffffff');

  return (
    <div className="sweet-loading">
      <button onClick={() => setLoading(!loading)}>Toggle Loader</button>
      <input
        value={color}
        onChange={(input) => setColor(input.target.value)}
        placeholder="Color of the loader"
      />

      <ClipLoader
        color={color}
        loading={loading}
        cssOverride={{ display: 'block', margin: '0 auto', borderColor: 'red' }}
        size={150}
      />
    </div>
  );
}

export default App;
