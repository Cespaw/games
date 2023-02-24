import React, { useRef, useEffect, useState } from 'react';

function Game({ jumpKey }) {
  const GAME_WIDTH = 400
  const GAME_HEIGHT = 400
  const JUMP_HEIGHT = 15
  const GAME_SPEED = 15
  const OBSTACLE_SPEED = 5
  const OBSTACLE_FREQUENCY = 0.005

  const canvasRef = useRef(null);
  const [playerPos, setPlayerPos] = useState({ x: 100, y: 50 });
  const [playerVel, setPlayerVel] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);

  const [obstacles, setObstacles] = useState([
    {
      x: GAME_WIDTH,
      y: GAME_HEIGHT - 30
    }
  ])

  function spawnObstacles() {
    if (Math.random() < OBSTACLE_FREQUENCY) {
      const x = GAME_WIDTH;
      const y = GAME_HEIGHT - 30;
      obstacles.push({ x, y });
    }

    const filteredObstacles = obstacles.filter(obs => obs.x > 0 - 30)

    const movedObstacles = filteredObstacles.map(obs => {
      return { ...obs, x: obs.x - OBSTACLE_SPEED }
    })
    setObstacles(movedObstacles)
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

  }

  function drawLogic() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(playerPos.x, playerPos.y, 50, 50);
    ctx.fillRect(playerPos.x, playerPos.y + 20, 50, 50)
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
  </div>;
}

export default Game;
