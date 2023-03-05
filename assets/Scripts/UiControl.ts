import { _decorator, Component, Label, Button } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UiControl")
export class UiControl extends Component {
  @property({ type: Label })
  private curScoreLabel: Label | null = null;
  @property({ type: Label })
  private reqScoreLabel: Label | null = null;
  @property({ type: Label })
  private moveValLabel: Label | null = null;
  @property({ type: Label })
  private resoultLabel: Label | null = null;
  @property({ type: Label })
  private bonusMixCountLabel: Label | null = null;
  @property({ type: Button })
  private bonusMixBtn: Button | null = null;
  // @property

  changeCurScore = (score: number): void => {
    this.curScoreLabel.string = score.toString();
  };

  changeReqScore = (score: number): void => {
    this.reqScoreLabel.string = score.toString();
  };

  changeMoveValue = (move: number): void => {
    this.moveValLabel.string = move.toString();
  };

  changeResoultLabelValue = (value: string): void => {
    this.resoultLabel.string = value;
  };

  changeBonusMixCountValue = (count: number): void => {
    this.bonusMixCountLabel.string = count.toString();
  };

  activeMixBtn = (status:boolean): void => {
    this.bonusMixBtn.interactable = status;
  };

  startGame = (
    curScore: number = 0,
    reqScore: number = 0,
    startMoveValue: number = 0,
    bonusMixCount: number = 0
  ): void => {
    this.changeCurScore(curScore);
    this.changeReqScore(reqScore);
    this.changeMoveValue(startMoveValue);
    this.changeBonusMixCountValue(bonusMixCount);
  };

  onLoad() {}
  start() {}
  update(deltaTime: number) {}
}
