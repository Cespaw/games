import './App.css';
import Game from './Game';
import MultiGame from './MultiGame'

function App() {

  return (
    <div className='mainDiv'>
      
      <MultiGame />

      {/*
      <Game jumpKey='ArrowLeft'></Game>
      <Game jumpKey='ArrowUp'></Game>
      <Game jumpKey='ArrowRight'></Game>
  */}
  
    </div>
  );
}

export default App;
