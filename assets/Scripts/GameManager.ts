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
  public startMenu: Node = null;
  @property({ type: Node })
  public finalResoult: Node = null;
  // private _curState: GameState = GameState.GS_INIT;

  private restartGame: boolean = false;
  public resoultLabel: any = null;

  set curState(value: GameState) {
    switch (value) {
      case GameState.GS_INIT:
        this.init();
        break;

      case GameState.GS_PLAYING:
        if (this.restartGame && this.gameField && this.ui) {
          this.finalResoult.active = false;
          this.restartGame = false;
          this.gameField.restartGame();
          this.ui.restartGame();
        }
        if (this.startMenu) {
          this.startMenu.active = false;
        }
        this.gameField.startGame();
        this.ui.startGame();
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

  init() {
    if (this.finalResoult) {
      this.finalResoult.active = false;
    }
    if (this.startMenu) {
      this.startMenu.active = true;
    }
  }

  onStartButtonClicked() {
    this.curState = GameState.GS_PLAYING;
  }

  onRestartButtonClicked() {
    this.restartGame = true;
    this.curState = GameState.GS_PLAYING;
  }

  onLoad() {
    // UiControl.resoultLabel = this.getComponent("ResoultLabel")
    this.curState = GameState.GS_INIT;
  }

  start() {}

  update(deltaTime: number) {
    if (this.gameField.amountDestroyTile > 0) {
      this.ui.changeCurScore(this.gameField.amountDestroyTile);
      this.gameField.amountDestroyTile = 0;
      this.ui.changeMoveValue();
    }
    if (this.ui.curScore >= this.ui.reqScore) {
      this.ui.curScore = 0;
      this.ui.curMoveValue = null;
      this.ui.chamgeResoultLabelValue("You Win");
      this.curState = GameState.GS_END;
    }
    if (this.ui.curMoveValue === 0 && this.ui.curScore < this.ui.reqScore) {
      this.ui.curScore = 0;
      this.ui.curMoveValue = null;
      this.ui.chamgeResoultLabelValue("You Lose");
      this.curState = GameState.GS_END;
    }
  }
}
