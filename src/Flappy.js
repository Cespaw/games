import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'
import { useEffect, useState } from 'react';

const CHAR_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 3;
const JUMP_HEIGHT = 50;
const OBSTACLE_WIDTH = 40;

const SCROLL_SPEED = 3
const OBSTACLE_GAP = CHAR_SIZE * 5

function Flappy() {

  const [charPosition, setcharPosition] = useState(250)
  const [gameStarted, setgameStarted] = useState(false)
  const [obstacleHeight, setObstacleHeight] = useState(100)
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH)
  const [score, setScore] = useState(0)

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;


  useEffect(() => {

    let timeId;
    if (gameStarted && charPosition < GAME_HEIGHT - CHAR_SIZE) {
      timeId = setInterval(() => {
        setcharPosition(charPosition => charPosition + GRAVITY)
      }, 24)
    }

    return () => {
      clearInterval(timeId)
    }
  }, [charPosition, gameStarted]);

  useEffect(() => {
    let obstacleId;
    if (gameStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - SCROLL_SPEED)
      }, 24);

      return () => {
        clearInterval(obstacleId)
      };
    }
    else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH)
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      )
      if (gameStarted) {

        setScore(score => score + 1)
      }
    }
  }, [gameStarted, obstacleLeft])

  useEffect(() => {
    const hasCollidedTop = charPosition >= 0 && charPosition < obstacleHeight;
    const hasCollidedBottom = charPosition <= 500 && charPosition >= 500 - bottomObstacleHeight;

    if (obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollidedTop || hasCollidedBottom)) {
      setgameStarted(false)
    }
  })

  const handleClick = () => {
    let newPosition = charPosition - JUMP_HEIGHT;

    if (!gameStarted) {
      setgameStarted(true)
      setScore(0)
    }
    else if (newPosition < 0) {
      setcharPosition(0)
    } else {
      setcharPosition(newPosition)
    }
  }

  return (
    <div className="App">

      <Box onClick={handleClick}>
        <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>

          <Character size={CHAR_SIZE} top={charPosition} />

          <Obstacle
            top={0}
            width={OBSTACLE_WIDTH}
            height={obstacleHeight}
            left={obstacleLeft}
          />

          <Obstacle
            top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
            width={OBSTACLE_WIDTH}
            height={bottomObstacleHeight}
            left={obstacleLeft}

          />

          <p>{score}</p>

        </GameBox>
      </Box>

    </div>
  );
}

export default Flappy;

const Character = styled.div`
  position: absolute;
  background-color: blue;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Box = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const GameBox = styled.div`
  background-color: grey;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  overflow:hidden;

 `;

const Obstacle = styled.div`
  position:relative;
  top: ${(props) => props.top}px;
  background-color:black;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;

  
 `