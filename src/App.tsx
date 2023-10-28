import './App.css';
import Sketch from "react-p5";
import p5Types from "p5";

import { Agent } from './Agent';
import { useRef, useState } from 'react';
import { sample } from "lodash";

function App() {
  const agents: Agent[] = []
  const agent_num = 20;
  const initialized = useRef(false);
  let t = 0;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    if (!initialized.current) {
      p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
      initialized.current = true;
    }
    for (let i = 0; i < agent_num; i++) {
      agents.push(new Agent(p5));
    }
    p5.background(0);
  }

  const draw = (p5: p5Types) => {
    p5.background(0);
    agents.forEach(agent => {
      agent.update();
      agent.isHits(agents);
      agent.draw();
    });

    if (t > 1000) {
      agents.sort((a, b) => b.eval - a.eval) // evalで降順にソート
      console.log(`max eval: ${agents[0].eval}`)
      agents.forEach(agent => {
        agent.eval = 0;
        agent.getNewGenome(sample(agents) ?? agent);
      })
      t = 0;
    } else {
      t += 1;
    }

  }

  const windowResized = (p5: p5Types) => {
  }

  return (
    <Sketch setup={setup} draw={draw} windowResized={windowResized} />
  )
}

export default App;
