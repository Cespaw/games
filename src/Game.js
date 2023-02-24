import React, { useRef, useEffect, useState } from 'react';

function Game({ jumpKey }) {
  const GAME_WIDTH = 400
  const GAME_HEIGHT = 400
  const JUMP_HEIGHT = 12
  const GAME_SPEED = 15
  const OBSTACLE_SPEED = 5
  const OBSTACLE_FREQUENCY = 0.005
  const NUM_OBSTACLES = 2

  const canvasRef = useRef(null);
  const [playerPos, setPlayerPos] = useState({ x: 100, y: GAME_HEIGHT });
  const [playerVel, setPlayerVel] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)

  const [obstacles, setObstacles] = useState([])

  function spawnObstacles() {
    if (Math.random() < OBSTACLE_FREQUENCY &&
      obstacles.length < NUM_OBSTACLES) {

      if (obstacles.length === 0) {
        const x = GAME_WIDTH;
        const y = GAME_HEIGHT - 30;
        obstacles.push({ x, y });
      }

      //Makes sure there is enough space between the obstacles
      else if (obstacles[obstacles.length - 1].x < 200) {
        const x = GAME_WIDTH;
        const y = GAME_HEIGHT - 30;
        obstacles.push({ x, y });
      }
    }

    const filteredObstacles = obstacles.filter(obs => obs.x > 0 - 30)

    setScore((score) => score + (obstacles.length - filteredObstacles.length))

    const movedObstacles = filteredObstacles.map(obs => {
      return { ...obs, x: obs.x - OBSTACLE_SPEED }
    })
    setObstacles(movedObstacles)
  }

  function detectCollission() {
    obstacles.forEach(obs => {
      if (Math.abs(obs.x - playerPos.x) < 50 &&
        Math.abs(obs.y - playerPos.y < 50) &&
        !obs.collided) {

        setHits((hits) => hits + 1)
        const changedObstacles = obstacles.map(obs => {
          return { ...obs, collided: true }
        })
        setObstacles(changedObstacles)

      }
    });
  }

  function gameLogic() {

    spawnObstacles()

    setPlayerPos((prevState) => ({
      x: prevState.x + playerVel.x,
      y: prevState.y + playerVel.y,
    }));

    if (isJumping) {
      setPlayerVel((prevState) => ({ ...prevState, y: prevState.y + 0.5 }));
      if (playerPos.y + playerVel.y > GAME_HEIGHT - 50) {
        setIsJumping(false);
        setPlayerVel({ ...playerVel, y: 0 });
        setPlayerPos((prevState) => ({ ...prevState, y: GAME_HEIGHT - 50 }));
      }
    } else {
      if (playerPos.y < GAME_HEIGHT - 50) {
        setPlayerVel((prevState) => ({ ...prevState, y: prevState.y + 0.5 }));
      }
      if (playerPos.y + playerVel.y > GAME_HEIGHT - 50) {
        setPlayerVel({ ...playerVel, y: 0 });
        setPlayerPos((prevState) => ({ ...prevState, y: GAME_HEIGHT - 50 }));
      }
    }

    detectCollission()

  }

  function drawLogic() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw player
    ctx.fillStyle = 'black'
    ctx.fillRect(playerPos.x, playerPos.y, 50, 50);
    ctx.fillRect(playerPos.x, playerPos.y + 20, 50, 50)

    //Draw each obstacle
    ctx.fillStyle = 'black'
    obstacles.forEach(e => {
      ctx.fillRect(e.x, e.y, 30, 30)
    });
  }

  /**
   * Jump logic
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleKeyDown = (e) => {
      if (e.key === jumpKey && !isJumping) {
        setIsJumping(true);
        setPlayerVel({ ...playerVel, y: -JUMP_HEIGHT });
      }
    };

    /*
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setPlayerVel({ ...playerVel, x: 0 });
      }
    };
    */

    document.addEventListener('keydown', handleKeyDown);
    //document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      //document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isJumping, playerVel, jumpKey]);

  /**
   * Main Game-loop
   */
  useEffect(() => {

    const handle = setInterval(() => {
      gameLogic()
      drawLogic()
    }, GAME_SPEED);

    return () => clearInterval(handle);
  }, [isJumping, playerPos, playerVel]);

  return <div>
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      style={{ border: "2px solid #d3d3d3" }}
    />
    <p>number of obstacles: {obstacles.length}</p>
    <p>num hits: {hits}</p>
    <p>score: {score}</p>
  </div>;
}

export default Game;
