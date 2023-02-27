import React, { useRef, useEffect, useState } from 'react';

function MultiGame() {
  const GAME_WIDTH = 1200
  const GAME_HEIGHT = 400
  const JUMP_HEIGHT = 12
  const GAME_SPEED = 15
  const OBSTACLE_SPEED = 5
  const OBSTACLE_FREQUENCY = 0.1
  const NUM_OBSTACLES = 5

  const canvasRef = useRef(null);
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)

  const [leftPlayerPos, setLeftPlayerPos] = useState({ x: 100, y: GAME_HEIGHT })
  const [leftPlayerVel, setLeftPlayerVel] = useState({ x: 0, y: 0 })
  const [leftPlayerJumping, setLeftPlayerJumping] = useState(false)

  const [middlePlayerPos, setMiddlePlayerPos] = useState({ x: 500, y: GAME_HEIGHT })
  const [middlePlayerVel, setMiddlePlayerVel] = useState({ x: 0, y: 0 })
  const [middlePlayerJumping, setMiddlePlayerJumping] = useState(false)

  const [rightPlayerPos, setRightPlayerPos] = useState({ x: 900, y: GAME_HEIGHT })
  const [rightPlayerVel, setRightPlayerVel] = useState({ x: 0, y: 0 })
  const [rightPlayerJumping, setRightPlayerJumping] = useState(false)

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
      else if (obstacles[obstacles.length - 1].x < GAME_WIDTH / 5) {
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
      if (
        Math.abs(obs.x - leftPlayerPos.x) < 50 &&
        Math.abs(obs.y - leftPlayerPos.y < 50) &&
        !obs.collided ||
        Math.abs(obs.x - middlePlayerPos.x) < 50 &&
        Math.abs(obs.y - middlePlayerPos.y < 50) &&
        !obs.collided ||
        Math.abs(obs.x - rightPlayerPos.x) < 50 &&
        Math.abs(obs.y - rightPlayerPos.y < 50) &&
        !obs.collided) {

        setHits((hits) => hits + 1)
        const changedObstacles = obstacles.map(o => {
          return { ...obs, collided: true }
        })
        setObstacles(changedObstacles)

      }
    });
  }

  function gameLogic() {

    spawnObstacles()

    setLeftPlayerPos((prevState) => ({
      x: prevState.x + leftPlayerVel.x,
      y: prevState.y + leftPlayerVel.y,
    }));

    setMiddlePlayerPos((prevState) => ({
      x: prevState.x + middlePlayerVel.x,
      y: prevState.y + middlePlayerVel.y
    }))

    setRightPlayerPos((prevState) => ({
      x: prevState.x + rightPlayerVel.x,
      y: prevState.y + rightPlayerVel.y
    }))

    if (leftPlayerJumping) {
      setLeftPlayerVel((prevState) => ({ ...prevState, y: prevState.y + 0.5 }));
      if (leftPlayerPos.y + leftPlayerVel.y > GAME_HEIGHT - 50) {
        setLeftPlayerJumping(false);
        setLeftPlayerVel({ ...leftPlayerVel, y: 0 });
        setLeftPlayerPos((prevState) => ({ ...prevState, y: GAME_HEIGHT - 50 }));
      }
    } else {
      if (leftPlayerPos.y < GAME_HEIGHT - 50) {
        setLeftPlayerVel((prevState) => ({ ...prevState, y: prevState.y + 0.5 }));
      }
      if (leftPlayerPos.y + leftPlayerVel.y > GAME_HEIGHT - 50) {
        setLeftPlayerVel({ ...leftPlayerVel, y: 0 });
        setLeftPlayerPos((prevState) => ({ ...prevState, y: GAME_HEIGHT - 50 }));
      }
    }

    if (middlePlayerJumping) {
      setMiddlePlayerVel((prevState) => ({ ...prevState, y: prevState.y + 0.5 }));
      if (middlePlayerPos.y + middlePlayerVel.y > GAME_HEIGHT - 50) {
        setMiddlePlayerJumping(false);
        setMiddlePlayerVel({ ...middlePlayerVel, y: 0 });
        setMiddlePlayerPos((prevState) => ({ ...prevState, y: GAME_HEIGHT - 50 }));
      }
    } else {
      if (middlePlayerPos.y < GAME_HEIGHT - 50) {
        setMiddlePlayerVel((prevState) => ({ ...prevState, y: prevState.y + 0.5 }));
      }
      if (middlePlayerPos.y + middlePlayerVel.y > GAME_HEIGHT - 50) {
        setMiddlePlayerVel({ ...middlePlayerVel, y: 0 });
        setMiddlePlayerPos((prevState) => ({ ...prevState, y: GAME_HEIGHT - 50 }));
      }
    }

    if (rightPlayerJumping) {
      setRightPlayerVel((prevState) => ({ ...prevState, y: prevState.y + 0.5 }));
      if (rightPlayerPos.y + rightPlayerVel.y > GAME_HEIGHT - 50) {
        setRightPlayerJumping(false);
        setRightPlayerVel({ ...rightPlayerVel, y: 0 });
        setRightPlayerPos((prevState) => ({ ...prevState, y: GAME_HEIGHT - 50 }));
      }
    } else {
      if (rightPlayerPos.y < GAME_HEIGHT - 50) {
        setRightPlayerVel((prevState) => ({ ...prevState, y: prevState.y + 0.5 }));
      }
      if (rightPlayerPos.y + rightPlayerVel.y > GAME_HEIGHT - 50) {
        setRightPlayerVel({ ...rightPlayerVel, y: 0 });
        setRightPlayerPos((prevState) => ({ ...prevState, y: GAME_HEIGHT - 50 }));
      }
    }

    detectCollission()

  }

  function drawLogic() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    //Draw player
    ctx.fillStyle = 'black'
    ctx.fillRect(leftPlayerPos.x, leftPlayerPos.y, 50, 50);
    ctx.fillRect(leftPlayerPos.x, leftPlayerPos.y + 20, 50, 50)

    ctx.fillStyle = 'black'
    ctx.fillRect(middlePlayerPos.x, middlePlayerPos.y, 50, 50);
    ctx.fillRect(middlePlayerPos.x, middlePlayerPos.y + 20, 50, 50)

    ctx.fillStyle = 'black'
    ctx.fillRect(rightPlayerPos.x, rightPlayerPos.y, 50, 50);
    ctx.fillRect(rightPlayerPos.x, rightPlayerPos.y + 20, 50, 50)

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
      if (e.key === 'ArrowLeft' && !leftPlayerJumping) {
        setLeftPlayerJumping(true);
        setLeftPlayerVel({ ...leftPlayerVel, y: -JUMP_HEIGHT });
      }

      if (e.key === 'ArrowUp' && !middlePlayerJumping) {
        setMiddlePlayerJumping(true);
        setMiddlePlayerVel({ ...middlePlayerVel, y: -JUMP_HEIGHT });
      }

      if (e.key === 'ArrowRight' && !rightPlayerJumping) {
        setRightPlayerJumping(true);
        setRightPlayerVel({ ...rightPlayerVel, y: -JUMP_HEIGHT });
      }

    };


    document.addEventListener('keydown', handleKeyDown);
    //document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      //document.removeEventListener('keyup', handleKeyUp);
    };
  }, [leftPlayerJumping, leftPlayerVel, middlePlayerJumping, middlePlayerVel, rightPlayerJumping, rightPlayerVel]);

  /**
   * Main Game-loop
   */
  useEffect(() => {

    const handle = setInterval(() => {
      gameLogic()
      drawLogic()
    }, GAME_SPEED);

    return () => clearInterval(handle);
  }, [leftPlayerJumping, leftPlayerPos, leftPlayerVel,
      middlePlayerJumping, middlePlayerPos, middlePlayerVel,
      rightPlayerJumping, rightPlayerPos, rightPlayerVel]);

  return <div>
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      style={{ border: "2px solid #d3d3d3" }}
    />
    <p>leftplayerpos x: {leftPlayerPos.x} , {leftPlayerPos.y}</p>
    <p>middleplayerpos x: {middlePlayerPos.x} , {middlePlayerPos.y}</p>
    <p>rightplayerpos x: {rightPlayerPos.x} , {rightPlayerPos.y}</p>
    <p>num hits: {hits}</p>
  </div>;
}

export default MultiGame;
