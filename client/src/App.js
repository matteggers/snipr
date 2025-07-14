import React from 'react';
//import NavMenu from './components/navbar.js';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <div className="App mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <AppRouter />
    </div>
  );
}

export default App;