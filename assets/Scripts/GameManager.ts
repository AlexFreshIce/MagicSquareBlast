import { _decorator, Component, Node } from "cc";
import { TilesManager } from "./TilesManager";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: TilesManager })
  private titles: TilesManager | null = null;

  start() {}

  update(deltaTime: number) {}
}
