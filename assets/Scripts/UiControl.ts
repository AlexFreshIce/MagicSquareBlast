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
  // @property
  public curScore: number = 0;
  public reqScore: number = 100;
  public moveValue: number = 20;

  changeCurScore = (score: number):void => {
    const resoult = +this.curScoreLabel.string + score;
    this.curScoreLabel.string = `${resoult}`;
  };

  changeMoveValue = ():void => {
    const resoult = +this.moveValLabel.string - 1;
    this.moveValLabel.string = `${resoult}`;
  };


  startGame = ():void => {
    this.curScoreLabel.string = `${this.curScore}`;
    this.reqScoreLabel.string = `${this.reqScore}`;
    this.moveValLabel.string = `${this.moveValue}`;
  };

  onLoad() {}
  start() {}
  update(deltaTime: number) {}
}
