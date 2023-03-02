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
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: TilesManager })
  private GameField: TilesManager | null = null;

  start() {
    
  }

 

  update(deltaTime: number) {}
}
