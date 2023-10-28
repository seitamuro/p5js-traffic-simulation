import p5Types from 'p5';

export enum AgentState {
  Initial,
  Hit,
}

type AgentProperty = {
  color: p5Types.Color;
};

export class Agent {
  pos: p5Types.Vector; // エージェントの位置
  vec: p5Types.Vector; // エージェントの速度
  acc: p5Types.Vector; // エージェントの加速度
  direction: p5Types.Vector; // エージェントの進行方向
  p5: p5Types; // コンストラクタに渡されたp5を保持する
  r: number; // エージェントの半径
  state: AgentState = AgentState.Initial; // エージェントの状態
  properties: AgentProperty; // エージェントの状態に応じたプロパティ
  eval: number;
  genome: number[];
  default_color: p5Types.Color;
  hit_color: p5Types.Color;
  most_nearest_agent: null | Agent;
  most_nearest_dist: number = 0;
  near_dist: number = 60;
  near_agents: Agent[] = [];

  agentProperties = {
    [AgentState.Initial]: {
      color: [255, 255, 255],
    },
    [AgentState.Hit]: {
      color: [255, 0, 0],
    },
  };

  /**
   * エージェントの生成
   * @param {p5Types} p5 p5インスタンス
   */
  constructor(p5: p5Types) {
    this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
    this.vec = p5.createVector(1.0, 1.0);
    this.acc = p5.createVector(1.0, 0.0);
    this.p5 = p5;
    this.r = 20;
    this.properties = this.createProperties();
    this.eval = 0;
    this.genome = [
      p5.random(),
      p5.random(),
      p5.random(),
      p5.random(),
      1,
      1,
      1,
      1,
      1,
      40,
      1,
      1,
    ];
    this.direction = p5.createVector(0, 0);
    this.setDirection(p5.createVector(p5.random(0, 1), p5.random(0, 1)));
    this.default_color = p5.color(255, 255, 255);
    this.hit_color = p5.color(255, 0, 0);
    this.most_nearest_agent = null;
  }

  /**
   * エージェントの進行方向を設定
   *
   * @param {p5Types.Vector} newDirection
   */
  setDirection(newDirection: p5Types.Vector) {
    newDirection.div(this.p5.dist(0, 0, newDirection.x, newDirection.y));
    this.direction = newDirection;
  }

  /**
   * プロパティを生成する
   */
  createProperties(): AgentProperty {
    let c = this.agentProperties[this.state].color;
    return {
      color: this.p5.color(c[0], c[1], c[2]),
    };
  }

  /**
   * エージェントの進行方向を決める
   *
   * @param {Agent[]} situation 周囲のエージェント
   */
  decideDirection(situation: Agent[]) {
    if (situation.length === 0) {
      let direction = this.p5.createVector(0, 0);
      direction.x = this.acc.x * this.genome[0] + this.vec.x * this.genome[1];
      direction.y = this.acc.y * this.genome[2] + this.vec.y * this.genome[3];
      this.setDirection(direction);
    } else {
      let direction = this.p5.createVector(0);
      situation.forEach((agent) => {
        let d = this.p5.dist(this.pos.x, this.pos.y, agent.pos.x, agent.pos.y);
        direction.x +=
          (this.direction.x * this.genome[4] +
            agent.direction.x * this.genome[5]) *
          this.genome[8] *
          (d - this.r);
        direction.y +=
          (this.direction.y * this.genome[6] +
            agent.direction.y * this.genome[7]) *
          this.genome[8] *
          (d - this.r);
      });
      this.setDirection(direction);
    }
  }

  /**
   * genomeを更新する
   *
   * @param {Agent} parent もう一人の親
   */
  getNewGenome(parent: Agent) {
    // crossover
    for (let i = 0; i < this.genome.length; i++) {
      // crossover
      if (Math.random() < 0.5) {
        this.genome[i] = parent.genome[i];
      }

      // mutation
      if (Math.random() < 0.1) {
        this.genome[i] += Math.random() * 2 - 1;
      }
    }
  }

  /**
   * エージェントの情報を更新する
   */
  update() {
    this.near_dist = this.genome[9];
    this.changeState(AgentState.Initial);

    this.decideDirection(this.near_agents);
    this.near_agents = [];
    this.pos.add(this.direction);

    if (this.pos.x < 0) {
      this.pos.x = this.p5.width - (-this.pos.x % this.p5.width);
    } else if (this.pos.x > this.p5.width) {
      this.pos.x = this.pos.x % this.p5.width;
    }

    if (this.pos.y < 0) {
      this.pos.y = this.p5.height - (-this.pos.y % this.p5.height);
    } else if (this.pos.y > this.p5.height) {
      this.pos.y = this.pos.y % this.p5.height;
    }

    this.eval += 1;
  }

  /**
   * エージェントを描画する
   */
  draw() {
    if (this.state === AgentState.Hit) {
      this.p5.fill(this.hit_color);
    } else {
      this.p5.fill(this.default_color);
    }
    this.p5.ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }

  /**
   * デフォルトの色を変更する
   *
   * @param {number} r
   * @param {number} g
   * @param {number} b
   */
  setDefaultColor(r: number, g: number, b: number) {
    this.default_color = this.p5.color(r, g, b);
  }

  /**
   * 渡されたエージェントとの衝突判定を行う
   * @param {Agent} agent 衝突判定を行うエージェント
   * @return {boolean} 衝突しているかどうか
   */
  isHit(agent: Agent): boolean {
    if (agent === this) return false;
    let d = this.p5.dist(this.pos.x, this.pos.y, agent.pos.x, agent.pos.y);
    if (d < this.near_dist) {
      this.near_agents.push(agent);
    }
    if (d < this.r) {
      this.changeState(AgentState.Hit);
      this.eval -= (this.r - d) * 2.0;
      return true;
    }
    return false;
  }

  /**
   * 複数のエージェントとの衝突判定を行う
   * @param {Agent[]} agents 衝突判定を行うエージェントの配列
   * @return {boolean} いづれかのエージェントと衝突しているか
   */
  isHits(agents: Agent[]): boolean {
    let ans = false;
    for (const agent of agents) {
      if (this.isHit(agent)) {
        ans = true;
      }
    }
    return ans;
  }

  /**
   * エージェントの状態を変更する
   * @param {AgentState} state 変更後の状態
   */
  changeState(state: AgentState) {
    this.state = state;
    this.properties = this.createProperties();
  }
}
