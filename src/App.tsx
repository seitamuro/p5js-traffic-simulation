import React from 'react';
import './App.css';
import Sketch from "react-p5";
import p5Types from "p5";

let x = 50;
let y = 50;
const max_speed = 10;
let direction_x = 1;
let direction_y = 1;

function App() {

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const direction = p5.random(0, max_speed*100) / 100;
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    direction_x = direction;
    direction_y = p5.sqrt(max_speed * max_speed - direction * direction);
  }

  const draw = (p5: p5Types) => {
    p5.background(0);
    const theta = p5.map(x, 0, p5.width, 0, p5.PI / 2);
    p5.fill(255 * Math.cos(theta), 255 * Math.sin(theta), 255 * Math.cos(theta));
    p5.ellipse(x, y, 70, 70);
    x += direction_x;
    y += direction_y;

    if (x > p5.width) {
      direction_x *= -1;
    } else if (x < 0) {
      direction_x *= -1;
    }

    if (y > p5.height) {
      direction_y *= -1;
    } else if (y < 0) {
      direction_y *= -1;
    }
  }

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    if (x > p5.windowHeight) { 
      y = p5.windowHeight;
    }

    if (y > p5.windowWidth) {
      x = p5.windowWidth;
    }
  }

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}

export default App;
