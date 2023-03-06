import { _decorator, Component, Node, Animation } from "cc";
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
  private bonusMixCount: number = 2;
  private bonusBombCount: number = 2;
  private reqScore: number = 40;
  private startMoveValue: number = 10;
  private curScore: number = 0;
  private curMoveValue: number | null = null;
  private curBonusMixCount: number = 0;
  private curBonusBombCount: number = 0;
  private gameFieldAnimation: Animation | null = null;

  set curState(value: GameState) {
    switch (value) {
      case GameState.GS_INIT:
        this.init();
        break;

      case GameState.GS_PLAYING:
        if (this.restartGame && this.gameField && this.ui) {
          this.finalResoult.active = false;
          this.restartGame = false;
          this.ui.activeBtn(true, "mix");
          this.ui.activeBtn(true, "bomb");
          this.gameField.restartGame();
        }
        if (!this.restartGame) {
          this.gameFieldAnimation = this.gameField.getComponent(Animation);
        }
        if (this.startMenu) {
          this.startMenu.active = false;
        }
        this.gameField.startGame();
        this.curMoveValue = this.startMoveValue;
        this.curBonusMixCount = this.bonusMixCount;
        this.curBonusBombCount = this.bonusBombCount;
        this.ui.startGame(
          this.curScore,
          this.reqScore,
          this.startMoveValue,
          this.curBonusMixCount,
          this.curBonusBombCount
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

  init(): void {
    if (this.finalResoult) {
      this.finalResoult.active = false;
    }
    if (this.startMenu) {
      this.startMenu.active = true;
    }
  }

  onStartButtonClicked(): void {
    this.curState = GameState.GS_PLAYING;
  }

  onRestartButtonClicked(): void {
    this.restartGame = true;
    this.curState = GameState.GS_PLAYING;
  }

  onMixButtonClicked(): void {
    if (this.curBonusMixCount > 0) {
      this.curBonusMixCount--;
      this.gameField.mixCurrentTitles();
      this.ui.changeBonusCountValue(this.curBonusMixCount, "mix");
    }
    if (this.curBonusMixCount === 0) {
      this.ui.activeBtn(false, "mix");
    }
  }

  onBombButtonClicked(): void {
    if (this.curBonusBombCount > 0) {
      this.gameField.bombActivated = true;
      this.ui.activeBtn(false, "bomb");
      this.gameFieldAnimation.play();
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
    if (this.gameField.bombExplosed) {
      this.gameField.bombExplosed = false;
      this.curBonusBombCount--;
      this.gameFieldAnimation.stop();
      this.ui.changeBonusCountValue(this.curBonusBombCount, "bomb");
      if (this.curBonusBombCount !== 0) {
        this.ui.activeBtn(true, "bomb");
      }
    }
  }
}
