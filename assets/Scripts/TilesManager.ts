import { _decorator, Component, Prefab, instantiate, Node } from "cc";
const { ccclass, property } = _decorator;

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

  private needRefillArr: boolean = false;
  private needRegenerateTiles: boolean = false;

  fillArrTiles = (firstTime: boolean = false): void => {
    for (let i = 0; i < 9; i++) {
      firstTime ? (this.arrTiles[i] = []) : null;
      for (let j = 0; j < 9; j++) {
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
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // console.log(`i = ${i}, j = ${j}`);
        if (!this.arrTiles[i][j].drawStatus) {
          const tile = this.spawnTileByType(this.arrTiles[i][j].type);
          this.node.addChild(tile);
          this.setTilePos(tile, i, j);
          tile.curNumber = `${i}${j}`;
          tile.on(Node.EventType.TOUCH_START, this.onTilePress, this);
          this.arrTiles[i][j].drawStatus = true;
        } else continue;
      }
    }
  };

  setTilePos = (tile: Node, i: number, j: number) => {
    const x = j * 46 + 32;
    const y = -(i * 50) - 39;
    tile.setPosition(x, y, 0);
  };

  spawnTileByType = (type: string) => {
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
    cb: () => void | null = null
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

    // console.log(this.arrWillDestroyTiles);
    // console.log(this.arrTiles);
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
      this.node.children[index].destroy();
    });
    // console.log(this.arrTiles);
    this.needRefillArr = true;
  };

  onLoad() {
    this.fillArrTiles(true);
    if (this.needRegenerateTiles) {
      this.needRegenerateTiles = false;
      this.generateTiles();
    }
  }

  start() {}

  update(deltaTime: number) {
    if (this.needRefillArr) {
      this.needRefillArr = false;
      this.fillArrTiles();
      // setTimeout(this.fillArrTiles, 1);
      // console.log("fill");
    }
    if (this.needRegenerateTiles) {
      this.needRegenerateTiles = false;
      this.generateTiles();
      // console.log("gener");
      // console.log(this.arrTiles);
      // setTimeout(this.generateTiles, 1);
    }
  }
}
