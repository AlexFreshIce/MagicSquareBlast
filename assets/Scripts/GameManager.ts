import { _decorator, Component, Node } from "cc";
import { TilesManager } from "./TilesManager";
import { UiControl } from "./UiControl";
const { ccclass, property } = _decorator;

enum GameState {
  GS_INIT,
  GS_PLAYING,
  GS_END,
}

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: TilesManager })
  private gameField: TilesManager | null = null;
  @property({ type: UiControl })
  private ui: UiControl | null = null;
  @property({ type: Node })
  private startMenu: Node = null;
  @property({ type: Node })
  private finalResoult: Node = null;
  // private _curState: GameState = GameState.GS_INIT;

  private restartGame: boolean = false;
  private bonusMixCount: number = 1;
  private reqScore: number = 35;
  private startMoveValue: number = 10;
  private curScore: number = 0;
  private curMoveValue: number | null = null;
  private curBonusMixCount: number = 0;

  set curState(value: GameState) {
    switch (value) {
      case GameState.GS_INIT:
        this.init();
        break;

      case GameState.GS_PLAYING:
        if (this.restartGame && this.gameField && this.ui) {
          this.finalResoult.active = false;
          this.restartGame = false;
          this.ui.activeMixBtn(true);
          this.gameField.restartGame();
        }
        if (this.startMenu) {
          this.startMenu.active = false;
        }
        this.gameField.startGame();
        this.curMoveValue = this.startMoveValue;
        this.curBonusMixCount = this.bonusMixCount;
        this.ui.startGame(
          this.curScore,
          this.reqScore,
          this.startMoveValue,
          this.curBonusMixCount
        );
        break;

      case GameState.GS_END:
        if (this.finalResoult) {
          this.gameField.allEventListenersOff();
          this.finalResoult.active = true;
        }
        break;
    }
    // this._curState = value;
  }

  init():void {
    if (this.finalResoult) {
      this.finalResoult.active = false;
    }
    if (this.startMenu) {
      this.startMenu.active = true;
    }
  }

  onStartButtonClicked():void {
    this.curState = GameState.GS_PLAYING;
  }

  onRestartButtonClicked():void {
    this.restartGame = true;
    this.curState = GameState.GS_PLAYING;
  }

  onMixButtonClicked():void {
    if (this.curBonusMixCount > 0) {
      this.curBonusMixCount--;
      this.gameField.mixCurrentTitles();
      this.ui.changeBonusMixCountValue(this.curBonusMixCount);
    } 
    if (this.curBonusMixCount === 0) {
      this.ui.activeMixBtn(false);
    }
  }

  onLoad() {
    this.curState = GameState.GS_INIT;
  }

  start() {}

  update(deltaTime: number) {
    if (this.gameField.amountDestroyTile > 0) {
      this.curScore = this.curScore + this.gameField.amountDestroyTile;
      this.ui.changeCurScore(this.curScore);
      this.gameField.amountDestroyTile = 0;
      this.curMoveValue = this.curMoveValue - 1;
      this.ui.changeMoveValue(this.curMoveValue);
    }
    if (this.curScore >= this.reqScore) {
      this.curScore = 0;
      this.curMoveValue = null;
      this.ui.changeResoultLabelValue("You Win");
      this.curState = GameState.GS_END;
    }
    if (this.curMoveValue === 0 && this.curScore < this.reqScore) {
      this.curScore = 0;
      this.curMoveValue = null;
      this.ui.changeResoultLabelValue("You Lose");
      this.curState = GameState.GS_END;
    }
  }
}
