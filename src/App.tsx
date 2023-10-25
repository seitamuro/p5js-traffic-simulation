import './App.css';
import Sketch from "react-p5";
import p5Types from "p5";

import { Agent } from './Agent';

function App() {

  const agents: Agent[] = []
  const agent_num = 10;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
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
  }

  const windowResized = (p5: p5Types) => {
  }

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}

export default App;
