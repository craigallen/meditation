import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Library from './components/Library';
import { SongProvider } from './context/SongContext';

function App() {
  return (
    <SongProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </Router>
    </SongProvider>
  );
}

export default App;