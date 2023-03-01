import { _decorator, Component, Prefab, instantiate } from "cc";
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

  public arrTitles: any = [];

  createRandomTile = () => {
    const color = Math.floor(Math.random() * 5);
    console.log(color);
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

  fillArrTitles = () => {
    for (let i = 0; i < 9; i++) {
      this.arrTitles[i] = [];
      for (let j = 0; j < 9; j++) {
        // console.log(`i = ${i}, j = ${j}`);
        // if (!(arr[i][j])) {
        const tileType = this.createRandomTile()
        this.arrTitles[i][j] = {
          type: tileType,
          col: i,
          row: j,
          checked: false,
        };
        // } else continue;
      }
    }
  };


  generateTiles = () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // console.log(`i = ${i}, j = ${j}`);
        // if (arr[i][j]) {
        const tile = this.spawnTileByType(this.arrTitles[i][j].type);
        this.setTilePos(tile, i, j);
        tile.setScale(0.25, 0.25, 0);
        this.node.addChild(tile);
        // } else continue;
      }
    }
  };

  setTilePos = (tile, i, j) => {
    const x = j*46 + 21 ;
    const y = -(i * 50)+11;
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

  onLoad() {
    this.fillArrTitles();
  }
  
  start() {
    this.generateTiles();
    console.log(this.arrTitles);
    console.log(this.node);
  }

  update(deltaTime: number) {}
}
