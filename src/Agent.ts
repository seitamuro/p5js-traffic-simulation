import p5Types from 'p5';

export class Agent {
  pos: p5Types.Vector; // エージェントの位置
  vec: p5Types.Vector; // エージェントの速度
  acc: p5Types.Vector; // エージェントの加速度
  p5: p5Types; // コンストラクタに渡されたp5を保持する
  r: number; // エージェントの半径
  color: p5Types.Color; // エージェントの色

  /**
   * エージェントの生成
   * @param {p5Types} p5 p5インスタンス
   */
  constructor(p5: p5Types) {
    this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
    this.vec = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
    this.acc = p5.createVector(0, 0);
    this.p5 = p5;
    this.r = 10;
    this.color = p5.color(255, 255, 255);
  }

  /**
   * エージェントの情報を更新する
   */
  update() {
    this.vec.add(this.acc);
    this.pos.add(this.vec);

    if (this.pos.x < 0) {
      this.pos.x = this.p5.width - (-this.pos.x % this.p5.width);
    } else if (this.pos.x > this.p5.width) {
      this.pos.x = this.pos.x % this.p5.width;
    }

    if (this.pos.y < 0) {
      this.pos.y = this.p5.height - (-this.pos.y % this.p5.height);
    } else if (this.pos.y > this.p5.windowHeight) {
      this.pos.y = this.pos.y % this.p5.height;
    }
  }

  /**
   * エージェントを描画する
   */
  draw() {
    this.p5.fill(this.color);
    this.p5.ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }

  /**
   * 渡されたエージェントとの衝突判定を行う
   * @param {Agent} agent 衝突判定を行うエージェント
   * @return {boolean} 衝突しているかどうか
   */
  isHit(agent: Agent): boolean {
    if (
      this.p5.dist(this.pos.x, this.pos.y, agent.pos.x, agent.pos.y) <
      this.r + agent.r
    ) {
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
    for (const agent of agents) {
      if (this.isHit(agent)) {
        return true;
      }
    }
    return false;
  }
}
