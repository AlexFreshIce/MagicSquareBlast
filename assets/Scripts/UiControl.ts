import { _decorator, Component, Node, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UiControl")
export class UiControl extends Component {
  @property({ type: Label })
  public curScoreLabel: Label | null = null;
  @property({ type: Label })
  public reqScoreLabel: Label | null = null;
  @property({ type: Label })
  public moveValLabel: Label | null = null;
  @property({ type: Label })
  public resoultLabel: Label | null = null;

  // @property

  public reqScore: number = 10;
  public startMoveValue: number = 2;
  // public reqScore: number = 100;
  // public startMoveValue: number = 20;

  public curScore: number = 0;
  public curMoveValue: number | null = null;

  changeCurScore = (score: number): void => {
    const resoult = +this.curScoreLabel.string + score;
    this.curScore = resoult;
    this.curScoreLabel.string = `${resoult}`;
  };

  changeMoveValue = (): void => {
    const resoult = +this.moveValLabel.string - 1;
    this.curMoveValue = resoult;
    this.moveValLabel.string = `${resoult}`;
  };

  chamgeResoultLabelValue = (value: string) => {
    this.resoultLabel.string = value;
  };

  startGame = (): void => {
    this.curScoreLabel.string = `${this.curScore}`;
    this.reqScoreLabel.string = `${this.reqScore}`;
    this.moveValLabel.string = `${this.startMoveValue}`;
  };

  restartGame = (): void => {
    this.curMoveValue = null;
  };

  onLoad() {}
  start() {}
  update(deltaTime: number) {}
}
