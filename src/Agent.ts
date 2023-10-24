import p5Types from "p5";

export class Agent {
  pos: p5Types.Vector; // エージェントの位置
  vec: p5Types.Vector; // エージェントの速度
  acc: p5Types.Vector; // エージェントの加速度
  p5: p5Types; // コンストラクタに渡されたp5を保持する
  r: number; // エージェントの半径
  color: p5Types.Color; // エージェントの色

  /**
   * エージェントの生成
   * @param p5 p5インスタンス
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
  }

  /**
   * エージェントを描画する
   */
  draw() {
    this.p5.fill(this.color);
    this.p5.ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }
}