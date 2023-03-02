import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  EventMouse,
  EventTarget,
} from "cc";
import { TilesManager } from "./TilesManager";
import { UiControl } from "./UiControl";
const { ccclass, property } = _decorator;

// enum GameState {
//   GS_INIT,
//   GS_PLAYING,
//   GS_END,
// }

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: TilesManager })
  private gameField: TilesManager | null = null;
  @property({ type: UiControl })
  private ui: UiControl | null = null;

  // private _curState: GameState = GameState.GS_INIT;

  // set curState(value: GameState) {
  //   switch (value) {
  //     case GameState.GS_INIT:
  //       // this.init();
  //       break;
  //     case GameState.GS_PLAYING:
  //       break;
  //     case GameState.GS_END:
  //       break;
  //   }
  //   this._curState = value;
  // }

  start() {}

  update(deltaTime: number) {
    if (this.gameField.amountDestroyTile > 0) {
      this.ui.changeCurScore(this.gameField.amountDestroyTile);
      this.gameField.amountDestroyTile = 0
      this.ui.changeMoveValue();
    }
  }
}
