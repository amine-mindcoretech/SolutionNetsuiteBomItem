//App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ButtonAppBar from './components/ButtonAppBar';
import SelectedListItem from './components/SelectedListItem';
import SelcetionCsvSolideWork from './components/SelcetionCsvSolideWork';
// import PageContainerContacts from './components/PageContainerContacts';
import PageContainerBasicUpdate from './components/PageContainerBasicUpdate';
import LinkingABomAssembly from './components/LinkingABomAssembly';
import CreationUsers from './components/CreationUsers';
import { SearchProvider } from './context/SearchContext';
import './App.css';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  // console.log("hhahahahaha",DatabaseSchema);
  // Correction pour appliquer les styles au chargement initial
  useEffect(() => {
    setCollapsed(false); // État initial par défaut
  }, []);

  return (
    <SearchProvider>
        <Router>
        <div className="app-container">
          <header>
            <ButtonAppBar onToggle={() => setCollapsed(!collapsed)} user="Utilisateur" />
          </header>
          <div className="content-container">
            <aside className={collapsed ? 'collapsed' : ''}>
              <SelectedListItem collapsed={collapsed} />
            </aside>
            <main>
              <Routes>
                <Route path="/" element={<h3>Bienvenue, sélectionnez une option.</h3>} />
                {/* <Route path="/afficher-clients/Genius" element={<PageContainerBasic />} /> */}
                <Route path="/afficher-clients/Update" element={<PageContainerBasicUpdate />} />
                <Route path="/SelcetionCsvSolideWork" element={<SelcetionCsvSolideWork />}/>
                <Route path="/LinkingABomAssembly" element={<LinkingABomAssembly />}/>
                <Route path="/CreationUsers" element={<CreationUsers />}/>
                {/* <Route path="/schema" element={<DatabaseSchema />} /> */}
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </SearchProvider>
    
  );
}

export default App;
