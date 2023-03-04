import {
  _decorator,
  Component,
  Prefab,
  instantiate,
  Node,
  tween,
  Vec2,
  Vec3,
  Tween,
  EventTarget,
  Quat,
} from "cc";

const { ccclass, property } = _decorator;

const eventTarget = new EventTarget();

@ccclass("TilesManager")
export class TilesManager extends Component {
  @property({ type: Prefab })
  public tileBlue: Prefab | null = null;
  @property({ type: Prefab })
  public tileGreen: Prefab | null = null;
  @property({ type: Prefab })
  public tilePurple: Prefab | null = null;
  @property({ type: Prefab })
  public tileRed: Prefab | null = null;
  @property({ type: Prefab })
  public tileYellow: Prefab | null = null;

  private arrTiles: any[] = [];
  private arrWillDestroyTiles: any[] = [];
  public amountDestroyTile: number = 0;
  public maxFieldCol: number = 9;
  public maxFieldRow: number = 9;
  private needRefillArr: boolean = false;
  private needRegenerateTiles: boolean = false;

  fillArrTiles = (firstTime: boolean = false): void => {
    for (let i = 0; i < this.maxFieldCol; i++) {
      firstTime ? (this.arrTiles[i] = []) : null;
      for (let j = 0; j < this.maxFieldRow; j++) {
        // console.log(`i = ${i}, j = ${j}`);
        if (!this.arrTiles[i][j]) {
          const tileType = this.createRandomTileType();
          this.arrTiles[i][j] = {
            type: tileType,
            col: i,
            row: j,
            checked: false,
            drawStatus: false,
          };
        } else continue;
      }
    }
    this.needRegenerateTiles = true;
  };

  createRandomTileType = (): string => {
    const color = Math.floor(Math.random() * 5);
    switch (color) {
      case 0:
        return "tileBlue";
      case 1:
        return "tileGreen";
      case 2:
        return "tilePurple";
      case 3:
        return "tileRed";
      case 4:
        return "tileYellow";
    }
  };

  generateTiles = (): void => {
    for (let i = 0; i < this.maxFieldCol; i++) {
      for (let j = 0; j < this.maxFieldRow; j++) {
        // console.log(`i = ${i}, j = ${j}`);
        if (!this.arrTiles[i][j].drawStatus) {
          const tile = this.instantiateTileByType(this.arrTiles[i][j].type);
          this.node.addChild(tile);
          tile.curNumber = `${i}${j}`;
          this.setTilePos(tile, i, j);
          tile.on(Node.EventType.TOUCH_START, this.onTilePress, this);
          this.arrTiles[i][j].drawStatus = true;
        } else continue;
      }
    }
  };

  setTilePos = (tile: Node, i: number, j: number): void => {
    const spy = -39;
    const fpx = j * 46 + 32;
    const fpy = -(i * 50) - 39;
    this.tweenSpawnTile(tile, spy, fpx, fpy);
    // tile.setPosition(x, y, 0);
    // tile.setPosition(fpx, fpy, 0);
  };

  tweenSpawnTile = (tile: any, spy:number, fpx:number, fpy:number) => {
    tween(tile.position)
      .set(new Vec3(fpx, spy))

      .to(0.3, new Vec2(fpx, fpy), {
        // easing: "backIn",
        onUpdate: (target: Vec2, ratio: number) => {
          tile.position = target;
        },
      })
      .start();
  };

  tweendestroyTile = (tile:any, cb:Function| null = null ):void => {
    let quat: Quat = new Quat();
    Quat.fromEuler(quat, 0, 0, 120);

    tween(tile.rotation)
      .to(0.2, quat, {
        // easing: "backIn",
        onUpdate: (target: Quat, ratio: number) => {
          tile.rotation = target;
        },
      })
      .call(cb)
      .start();
  };

  instantiateTileByType = (type: string): any => {
    switch (type) {
      case "tileBlue":
        return instantiate(this.tileBlue);
      case "tileGreen":
        return instantiate(this.tileGreen);
      case "tilePurple":
        return instantiate(this.tilePurple);
      case "tileRed":
        return instantiate(this.tileRed);
      case "tileYellow":
        return instantiate(this.tileYellow);
    }
  };

  findSameColorBorderTile = (
    col: number,
    row: number,
    type: string,
    cb: Function | null = null
  ) => {
    if (col < 0 || col > 8 || row < 0 || row > 8) {
      return;
    }
    const tile = this.arrTiles[col][row];
    if (!tile.checked && tile.type === type) {
      this.arrWillDestroyTiles.push(tile);
      tile.checked = true;
      this.findSameColorBorderTile(col + 1, row, type);
      this.findSameColorBorderTile(col - 1, row, type);
      this.findSameColorBorderTile(col, row + 1, type);
      this.findSameColorBorderTile(col, row - 1, type);
    }
    cb ? cb() : null;
    // console.log(col, row, type);
  };

  onTilePress(event: any): void {
    const col = +event.target.curNumber[0];
    const row = +event.target.curNumber[1];
    const type = event.target.name;
    this.arrWillDestroyTiles = [];
    // event.target.destroy()
    // console.log(col, row, type);
    // console.log(event.target);
    const cb = (): void => {
      if (this.arrWillDestroyTiles.length >= 2) {
        this.destroyTiles();
      } else {
        this.arrWillDestroyTiles.forEach((tile) => {
          tile.checked = false;
        });
      }
    };
    this.findSameColorBorderTile(col, row, type, cb);
  }

  destroyTiles = (): void => {
    this.amountDestroyTile = this.arrWillDestroyTiles.length;
    this.arrWillDestroyTiles.forEach((item) => {
      const { col, row } = item;
      this.arrTiles[col][row] = null;
      const curNumber = `${col}${row}`;
      const index = this.node.children.findIndex(
        (i) => i.curNumber === curNumber
      );

      const cb = () => {
        this.node.children[index].destroy();
      };

      this.tweendestroyTile(this.node.children[index], cb);
      // this.node.children[index].destroy();
    });
    this.needRefillArr = true;
  };

  startGame = (): void => {
    this.fillArrTiles(true);
    if (this.needRegenerateTiles) {
      this.needRegenerateTiles = false;
      this.generateTiles();
    }
  };

  endGame = (): void => {
    this.node.children.forEach((tile) =>
      tile.off(Node.EventType.TOUCH_START, this.onTilePress, this)
    );
  };

  restartGame = (): void => {
    this.arrTiles = [];
    this.arrWillDestroyTiles = [];
    this.amountDestroyTile = 0;
    this.needRefillArr = false;
    this.needRegenerateTiles = false;
    this.node.removeAllChildren();
    Tween.stopAll();
  };

  onLoad() {}

  start() {}

  update(deltaTime: number) {
    if (this.needRefillArr) {
      this.needRefillArr = false;
      this.fillArrTiles();
    }
    if (this.needRegenerateTiles) {
      this.needRegenerateTiles = false;
      this.generateTiles();
    }
  }
}
