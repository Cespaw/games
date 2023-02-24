import './App.css';
import Game from './Game';

function App() {

  return (
    <div className='mainDiv'>
      <Game jumpKey='ArrowUp'></Game>
      {/*
      <Game jumpKey='ArrowLeft'></Game>
      <Game jumpKey='ArrowRight'></Game>
  */}
    </div>
  );
}

export default App;
