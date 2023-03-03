import { _decorator, Component, Node} from "cc";
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
  // private _curState: GameState = GameState.GS_INIT;

  set curState(value: GameState) {
    switch (value) {
      case GameState.GS_INIT:
        this.init();
        break;
      case GameState.GS_PLAYING:
        if (this.startMenu) {
          this.startMenu.active = false;
        }
        this.gameField.startGame();
        this.ui.startGame();
        break;
      case GameState.GS_END:
        break;
    }
    // this._curState = value;
  }

  init() {
    if (this.startMenu) {
      this.startMenu.active = true;
    }
  }

  onStartButtonClicked() {
    this.curState = GameState.GS_PLAYING;
  }

  onLoad() {
    this.curState = GameState.GS_INIT;
  }

  start() {}

  update(deltaTime: number) {
    if (this.gameField.amountDestroyTile > 0) {
      this.ui.changeCurScore(this.gameField.amountDestroyTile);
      this.gameField.amountDestroyTile = 0;
      this.ui.changeMoveValue();
    }
  }
}
