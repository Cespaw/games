import './App.css';
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Navigationbar from './Navigationbar';
import MultiGame from './MultiGame/MultiGame'
import Navigation from './Navigation';

function App() {

  return (
    <div>
      <Navigationbar></Navigationbar>

      <div className='mainDiv'>
        <Navigation></Navigation>

      </div>
    </div>
  );
}

export default App;
