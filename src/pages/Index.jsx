import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 15, y: 15 };

const Index = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newHead = {
        x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (newHead.x === food.x && newHead.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
        return [newHead, ...prevSnake];
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      return [newHead, ...prevSnake.slice(0, -1)];
    });
  }, [direction, food, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': setDirection({ x: 1, y: 0 }); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 100);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
  };

  return (
    <div className="flex-grow flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-4">Snake Game</h1>
      <div 
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          border: '1px solid #ccc',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              style={{
                backgroundColor: isSnake ? 'green' : isFood ? 'red' : 'white',
                border: '1px solid #eee',
              }}
            />
          );
        })}
      </div>
      {gameOver && (
        <div className="mt-4">
          <p className="text-xl mb-2">Game Over!</p>
          <Button onClick={resetGame}>Restart Game</Button>
        </div>
      )}
      <p className="mt-4">Use arrow keys to control the snake</p>
    </div>
  );
};

export default Index;