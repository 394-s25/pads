import { useState } from 'react';
import logo from './logo.svg';
import './App.css';


const App = () => {
  const [activeTab, setActiveTab] = useState('map');

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <div>TBD ..</div>;
      case 'report':
        return <div>TBD ..</div>;
      case 'resources':
        return <div>TBD ..</div>;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="nav-bar">
          <div className="title">PADS Lake County Good Neighbor</div>
          <div className="tabs">
            <button onClick={() => setActiveTab('map')} className={activeTab === 'map' ? 'active' : ''}>Map</button>
            <button onClick={() => setActiveTab('report')} className={activeTab === 'report' ? 'active' : ''}>Report</button>
            <button onClick={() => setActiveTab('resources')} className={activeTab === 'resources' ? 'active' : ''}>Resources</button>
          </div>
        </div>
      </header>
      <main className="tab-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;