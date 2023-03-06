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
  Quat,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("TilesManager")
export class TilesManager extends Component {
  @property({ type: Prefab })
  private tileBlue: Prefab | null = null;
  @property({ type: Prefab })
  private tileGreen: Prefab | null = null;
  @property({ type: Prefab })
  private tilePurple: Prefab | null = null;
  @property({ type: Prefab })
  private tileRed: Prefab | null = null;
  @property({ type: Prefab })
  private tileYellow: Prefab | null = null;

  private arrTiles: any[] = [];
  private arrWillDestroyTiles: any[] = [];
  public amountDestroyTile: number = 0;
  public maxFieldCol: number = 9;
  public maxFieldRow: number = 9;
  public minTilesToDestr: number = 2;
  public bombActivated: boolean = false;
  public bombExplosed: boolean = false;
  public explosionRadius: number = 1;

  private needRefillArr: boolean = false;
  private needRegenerateTiles: boolean = false;
  private needMoveTiles: boolean = false;

  fillArrTiles = (firstTime: boolean = false): void => {
    for (let i = 0; i < this.maxFieldCol; i++) {
      firstTime ? (this.arrTiles[i] = []) : null;
      for (let j = 0; j < this.maxFieldRow; j++) {
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

  moveTilesAfterDestr = (): void => {
    for (let i = this.maxFieldCol - 1; i >= 0; i--) {
      let freeSpace = 0;
      for (let j = this.maxFieldRow - 1; j >= 0; j--) {
        if (!this.arrTiles[i][j]) {
          freeSpace++;
        } else if (freeSpace > 0) {
          this.arrTiles[i][j + freeSpace] = this.arrTiles[i][j];
          this.arrTiles[i][j] = null;
          this.arrTiles[i][j + freeSpace].row = j + freeSpace;
          const index = this.getIndexByCurNumber(null, i, j);
          const tile = this.node.children[index];
          tile.curNumber = `${i}${j + freeSpace}`;
          // this.node.children[index].curNumber = `${i}${j + freeSpace}`;
          this.setTilePos(tile, i, j + freeSpace, tile.position.y);
        }
      }
    }
    this.needRefillArr = true;
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
        if (!this.arrTiles[i][j].drawStatus) {
          const tile = this.instantiateTileByType(this.arrTiles[i][j].type);
          this.node.addChild(tile);
          tile.curNumber = `${i}${j}`;
          this.setTilePos(tile, i, j);
          // tile.on(Node.EventType.TOUCH_START, this.onTilePress, this);
          this.arrTiles[i][j].drawStatus = true;
        } else continue;
      }
    }
  };

  setTilePos = (tile: Node, i: number, j: number, spy: number = 12): void => {
    const fpx = i * 46 + 32;
    const fpy = -(j * 50) - 39;
    const cb = () => {
      tile.on(Node.EventType.TOUCH_START, this.onTilePress, this);
    };
    // const cb1 = () => {
    tile.off(Node.EventType.TOUCH_START, this.onTilePress, this);
    // };

    this.tweenMoveTile(tile, spy, fpx, fpy, cb);
    // tile.setPosition(fpx, fpy, 0);
  };

  tweenMoveTile = (
    tile: any,
    spy: number,
    fpx: number,
    fpy: number,
    cb: Function | null = null
  ) => {
    tween(tile.position)
      .set(new Vec3(fpx, spy, 0))
      .to(0.4, new Vec3(fpx, fpy, 0), {
        // easing: "expoOut",
        // easing: "circOut",
        easing: "cubicOut",
        onUpdate: (target: Vec3, ratio: number) => {
          tile.position = target;
        },
        onComplete: (target?: object) => {
          cb();
        },
      })
      // .call(cb)
      .start();
  };

  tweendestroyTile = (tile: any, cb: Function | null = null): void => {
    let quat: Quat = new Quat();
    Quat.fromEuler(quat, 0, 0, 140);
    if (tile) {
      tween(tile.rotation)
        .to(0.1, quat, {
          // easing: "backIn",
          // easing: "elasticInOut",
          onStart: (target?: object) => {
            tile.scale = new Vec3(0.6, 0.6, 0);
          },
          onUpdate: (target: Quat, ratio: number) => {
            tile.rotation = target;
          },
          onComplete: (target?: object) => {
            cb();
          },
        })
        // .call(cb)
        .start();
    }
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
    if (tile && !tile.checked && tile.type === type) {
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

  findNearestTiles = (
    col: number,
    row: number,
    type: string,
    cb: Function | null = null,
    minExplCol: number | null = null,
    maxExplCol: number | null = null,
    minExplRow: number | null = null,
    maxExplRow: number | null = null
  ) => {
    if (
      col < 0 ||
      col > 8 ||
      row < 0 ||
      row > 8 ||
      col < minExplCol ||
      col > maxExplCol ||
      row < minExplRow ||
      row > maxExplRow
    ) {
      return;
    }
    const tile = this.arrTiles[col][row];
    if (tile && !tile.checked) {
      this.arrWillDestroyTiles.push(tile);
      tile.checked = true;
      this.findNearestTiles(
        col + 1,
        row,
        type,
        null,
        minExplCol,
        maxExplCol,
        minExplRow,
        maxExplRow
      );
      this.findNearestTiles(
        col - 1,
        row,
        type,
        null,
        minExplCol,
        maxExplCol,
        minExplRow,
        maxExplRow
      );
      this.findNearestTiles(
        col,
        row + 1,
        type,
        null,
        minExplCol,
        maxExplCol,
        minExplRow,
        maxExplRow
      );
      this.findNearestTiles(
        col,
        row - 1,
        type,
        null,
        minExplCol,
        maxExplCol,
        minExplRow,
        maxExplRow
      );
    }
    cb ? cb() : null;
    // console.log(col, row, type);
  };

  onTilePress(event: any): void {
    const col = +event.target.curNumber[0];
    const row = +event.target.curNumber[1];
    const type = event.target.name;
    this.arrWillDestroyTiles = [];

    if (!this.bombActivated) {
      this.findSameColorBorderTile(col, row, type, this.checkDestrTileSize);
    } else {
      this.bombActivated = false;

      const minExplCol = col - this.explosionRadius;
      const maxExplCol = col + this.explosionRadius;
      const minExplRow = row - this.explosionRadius;
      const maxExplRow = row + this.explosionRadius;

      this.findNearestTiles(
        col,
        row,
        type,
        this.checkDestrTileSize,
        minExplCol,
        maxExplCol,
        minExplRow,
        maxExplRow
      );

      this.bombExplosed = true;
    }
  }

  checkDestrTileSize = (): void => {
    if (this.arrWillDestroyTiles.length >= this.minTilesToDestr) {
      this.destroyTiles();
    } else {
      this.arrWillDestroyTiles.forEach((tile) => {
        tile.checked = false;
      });
    }
  };

  getIndexByCurNumber = (
    item: { col: number; row: number } | null = null,
    col: number | null = null,
    row: number | null = null
  ): number => {
    const curNumber = item ? `${item.col}${item.row}` : `${col}${row}`;
    const index = this.node.children.findIndex(
      (i) => i.curNumber === curNumber
    );
    return index;
  };

  destroyTiles = (): void => {
    this.amountDestroyTile = this.arrWillDestroyTiles.length;
    this.arrWillDestroyTiles.forEach((item) => {
      const { col, row } = item;
      const index = this.getIndexByCurNumber(item);
      const tile = this.node.children[index];
      // tile.destroy();
      this.arrTiles[col][row] = null;
      const cb = () => {
        tile.destroy();
      };
      this.tweendestroyTile(tile, cb);
    });
    this.needMoveTiles = true;
  };

  startGame = (): void => {
    this.fillArrTiles(true);
    if (this.needRegenerateTiles) {
      this.needRegenerateTiles = false;
      this.generateTiles();
    }
  };

  allEventListenersOff = (): void => {
    this.node.children.forEach((tile) =>
      tile.off(Node.EventType.TOUCH_START, this.onTilePress, this)
    );
  };

  mixCurrentTitles = (): void => {
    const halfArr = Math.floor(this.maxFieldRow / 2);
    for (let i = 0; i < this.maxFieldCol; i++) {
      // if (i % 2 == 0) {
      if (Math.random() < 0.5 ? 0 : 1) {
        this.arrTiles[i].reverse();
      }
      for (let j = 0; j < halfArr; j++) {
        if (this.arrTiles[i][j].drawStatus) {
          const { col, row } = this.arrTiles[i][j];
          const index1 = this.getIndexByCurNumber(null, i, j);
          const tile1 = this.node.children[index1];
          const index2 = this.getIndexByCurNumber(null, col, row);
          const tile2 = this.node.children[index2];
          this.arrTiles[i][j].row = j;
          this.arrTiles[col][row].row = row;
          this.setTilePos(tile1, col, row, tile1.position.y);
          this.setTilePos(tile2, i, j, tile2.position.y);
          tile1.curNumber = `${col}${row}`;
          tile2.curNumber = `${i}${j}`;
        } else continue;
      }
    }
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
    if (this.needMoveTiles) {
      this.needMoveTiles = false;
      this.moveTilesAfterDestr();
    }
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
