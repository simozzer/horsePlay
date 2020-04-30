import { Component, OnInit } from '@angular/core';
import {GamesService} from "../games.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SoundsService} from "../sounds.service";
import {ImagesService, horseColors} from "../images.service";
import {forkJoin} from "rxjs";



const MAX_PROGRESS_PER_SECOND = 250;
const PIXELS_PER_FURLONG = 250; //780;
const HORSE_NOSE = 134;
const HORSE_NOSE_ADJUST = [
  0,
  -8,
  -18,
  -3,
  -10,
  -21,
  -6,
  -16,
  -26,
  -8,
  -20,
  -22,
];

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})
export class RaceComponent implements OnInit {

  gameId;
  raceId;
  bets;
  raceData;
  horses;
  _mainCanvasContext;
  _mainCanvas: HTMLCanvasElement;
  _canvasWidth: number;
  _canvasHeight: number;
  _finishLine: number;
  _verticalInterval: number;
  _backCanvas: HTMLCanvasElement;
  _backContext: any;
  _scrollAdjust: number;
  _pauseCycles: number;
  _lastFrameTimestamp: number;
  _title : string = "TESTING";
  _lines : any;
  _raceFinished;
  _finishers;

  constructor(private gamesService: GamesService,
              private route: ActivatedRoute,
              private router: Router,
              private images: ImagesService,
              private sounds : SoundsService) {}


  setup() {
    // All resources ready at this point.
    this._finishLine = this.raceData.LENGTH_FURLONGS * PIXELS_PER_FURLONG;
    this._verticalInterval = ((4 * this._canvasHeight) / 5 - 100) / this.horses.length;
    this._mainCanvasContext.drawImage(this.images.getTaggedImage("grass"), 0, 0);
    this._backCanvas = document.createElement("canvas");
    this._backContext = this._backCanvas.getContext("2d");
    this._backCanvas.width = this._mainCanvas.width;
    this._backCanvas.height = this._mainCanvas.height;
    this._scrollAdjust = 0;
    this._pauseCycles = 0;
    this._lastFrameTimestamp = -1;
    this._finishers = [];

    let y = this._verticalInterval;
    for (let i = 0; i < this.horses.length; i++) {
      let horse = this.horses[i];
      horse.top = (1 + i) * this._verticalInterval;
      horse.backgroundPositionX = 0;
      horse.backgroundPositionY = 0;
      horse.animIndexer = 0.0;
    }
    this.horses.forEach((horse) => {
      horse.raceSpeedFactor = Math.random() / 5;
      horse.left = 0;
      horse.finished = false;
    });
    this.updateDisplay();
    this.sounds.playSound(1);
    window.requestAnimationFrame(this.handleDrawRequest.bind(this));
  }

  handleDrawRequest(lTicks) {
    let ticksSinceLastFrame = 0;
    if (this._lastFrameTimestamp > 0) {
      ticksSinceLastFrame = lTicks - this._lastFrameTimestamp;
    } else {
      this.sounds.playSound(5);
    }
    this._lastFrameTimestamp = lTicks;

    this.moveHorses(ticksSinceLastFrame);
    this.checkHorsesFinished();
    this.tileBackground();
    this.drawLines();
    this.drawHorses();
    this.drawFinishers();
    this.drawPositionList();

    this.paintFromBackground();

    if (!this._raceFinished && this._scrollAdjust < 15000) {
      window.requestAnimationFrame(this.handleDrawRequest.bind(this));
    } else {
      window.alert("all done");
    }
  }

  tileBackground() {
    const grass = this.images.getTaggedImage('grass');
    const grassTileWidth = grass.width;
    const grassTileHeight = grass.height;
    for (
      let x = 0;
      x < this._canvasWidth + grassTileWidth;
      x += grassTileWidth
    ) {
      for (let y = 0; y < this._canvasHeight; y += grassTileHeight) {
        this._backContext.drawImage(
          grass,
          x - (this._scrollAdjust % grassTileWidth),
          y
        );
      }
    }

    this._backContext.fillStyle = "darkblue";
    this._backContext.font = "24pt arial";
    this._backContext.fillText(this._title, 50, 50);
  }

  drawLines() {
    const drawLineIfVisible = (x, color, label) => {
      let transformedOrigin = x + HORSE_NOSE - this._scrollAdjust;
      if (transformedOrigin > 0 && transformedOrigin < this._canvasWidth) {
        this._backContext.strokeStyle = color;
        this._backContext.beginPath();
        this._backContext.moveTo(transformedOrigin, 0);
        this._backContext.lineTo(transformedOrigin, this._canvasHeight);
        this._backContext.stroke();
        this._backContext.fillStyle = "white";
        this._backContext.font = "12px Sans";
        this._backContext.fillText(label, transformedOrigin, 20);
      }
    };

    this._lines.forEach((line) => {
      drawLineIfVisible(line.x, line.color, line.label);
    });
  }

  addFurlongs() {
    this._lines = [{ x: 0, color: "white", label: "start" }];
    for (var i = 0; i < this.raceData.LENGTH_FURLONGS; i++) {
      let line = {
        x: (i + 1) * PIXELS_PER_FURLONG,
        color: "yellow",
        label: "F" + (i + 1),
      };

      this._lines.push(line);
    }
    this._lines[this._lines.length - 1].label = "Finish";
  }

  drawHorses() {
    this.horses.forEach((horse, index) => {
      const left = horse.left - this._scrollAdjust;
      const top = horse.top;
      this._backContext.drawImage(
        this.images.getImage(index % 12),
        horse.backgroundPositionX,
        horse.backgroundPositionY,
        150,
        100,
        left,
        top,
        150,
        100
      );
      this._backContext.fillStyle = horseColors[index % 12 | 0];
      this._backContext.font = "16px Sans";
      const caption = horse.PLAYER_NAME + ": " + horse.NAME;// + "(" + horse._raceOdds + "/1)",
      this._backContext.fillText(
        caption,
        10,
        top + 30
      );
    });
  }

  paintFromBackground() {
    this._mainCanvasContext.drawImage(this._backCanvas, 0, 0);
  }

  updateDisplay(){
    this.addFurlongs();
    this.tileBackground();
    this.drawLines();
    this.drawHorses();
    this.paintFromBackground();
  }


  getHorsesInOrder(horses) {
    const cloneHorses = [...horses];
    cloneHorses.sort((a, b) => {
      let a1 = a.left;
      let b1 = b.left;
      if (a1 === b1) {
        return 0;
      } else if (a1 < b1) {
        return 1;
      } else {
        return -1;
      }
    });
    return cloneHorses;
  }

  moveHorses(ticksSinceLastFrame) {
    if (this._pauseCycles > 0) {
      this._pauseCycles--;
      return;
    }

    let chance = (Math.random() * 200) | 0;

    if (chance === 0) {
      chance = (Math.random() * 3) | 0;
      if (chance === 2) {
        this.sounds.playSound(4);
      } else {
        this.sounds.playSound(0);
      }
    }
    // number of pixels per sec we can move at maximum.
    const maxProgressPerSecMs = MAX_PROGRESS_PER_SECOND / 1000;
    const maxProgressThisFrame = maxProgressPerSecMs * ticksSinceLastFrame;

    let moveValues = [];
    const getHorseSpeedFactorAtPosition = (horse, pos) => {
      if (pos < horse.ENERGY_FALL_DISTANCE) {
        return horse.SPEED_FACTOR + horse.raceSpeedFactor;
      } else {
        return horse.SPEED_FACTOR + horse.raceSpeedFactor;
      }
    };
    this.horses.forEach((horse, index) => {
      this.animateHorse(horse, ticksSinceLastFrame);
      let moveX =
        Math.random() *
        maxProgressThisFrame *
        getHorseSpeedFactorAtPosition(horse,horse.left);
      let left = horse.left + moveX;
      moveValues.push(moveX);
      horse.left = left;
    });

    let maxAfterMove = this.getMaxHorsePosition();
    if (maxAfterMove > this._scrollAdjust + this._canvasWidth - 350) {
      // 1st horse approaching right of screen.
      let adjust = Math.abs(
        this._canvasWidth - 350 - (maxAfterMove + this._scrollAdjust)
      );
      this._scrollAdjust += maxProgressThisFrame;
    }
  }

  getMaxHorsePosition() {
    let max = 0;
    this.horses.forEach((horse) => {
      if (horse.left > max) {
        max = horse.left;
      }
    });
    return max;
  }


  animateHorse(horse, timeSpanMs) {
    if (horse) {
      const framesThisInterval = timeSpanMs * (12 / 1000);
      horse.animIndexer += framesThisInterval;
      const frameIndex = horse.animIndexer % 12 | 0;
      const xIndex = frameIndex % 3;
      const yIndex = frameIndex % 4;
      horse.backgroundPositionX = xIndex * 150;
      horse.backgroundPositionY = yIndex * 100;
    }
  }

  checkHorsesFinished() {
    let winners = [];
    this.horses.forEach((horse) => {
      if (!horse.finished) {
        if (horse.left >= this._finishLine) {
          winners.push(horse);
          horse.finished = true;
        }
      }
    });
    if (winners.length > 0) {
      if (winners.length === 1) {
        this.addWinner(winners[0]);
      } else {
        /* Multiple finished in this cycle) */
        winners = this.getHorsesInOrder(winners);
        for (let j = 0; j < winners.length; j++) {
          this.addWinner(winners[j]);
        }
      }
      // this._pauseCycles = 300;
    }
  }

  addWinner(horse) {
    this._finishers.push(horse);
    //TODO horse.FORM.push(this._finishers.length);
    this.sounds.playSound(2);
    if (this._finishers.length === this.horses.length) {
      this._raceFinished = true;
    }
  }


  drawFinishers() {
    if (this._finishers.length > 0) {
      this._backContext.fillStyle = "white";
      this._backContext.strokeStyle = "black";
      this._backContext.fillRect(
        this._canvasWidth - 150,
        0,
        150,
        40 + 16 * this._finishers.length
      );
      this._backContext.font = "12px Sans";
      this._backContext.fillStyle = "black";
      this._finishers.forEach((horse, index) => {
        this._backContext.fillText(
          horse.NAME + "/" + horse.PLAYER_NAME,
          this._canvasWidth - 140,
          30 + 16 * index
        );
      });
      this._backContext.stroke();
    }
  }

  drawPositionList() {
    this._backContext.fillStyle = "Green";
    const boxTop = this._canvasHeight - (40 + 16 * this.horses.length);
    this._backContext.fillRect(
      this._canvasWidth - 150,
      boxTop,
      150,
      40 + 16 * this.horses.length
    );

    this._backContext.font = "12px Sans";
    this._backContext.fillStyle = "white";
    const cloneHorses = this.getHorsesInOrder(this.horses);
    cloneHorses.forEach((horse, index) => {
      this._backContext.fillText(
        horse.NAME + "/" + horse.PLAYER_NAME,
        this._canvasWidth - 140,
        boxTop + 30 + 16 * index
      );
    });
  }


  ngOnInit(): void {
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId'),10);
    this.raceId = parseInt(this.route.snapshot.paramMap.get('raceId'),10);

    this._mainCanvas = <HTMLCanvasElement>document.getElementById('raceCanvas');
    this._mainCanvasContext = this._mainCanvas.getContext("2d");
    this._canvasWidth = this._mainCanvas.clientWidth;
    this._canvasHeight = this._mainCanvas.clientHeight;
    this._mainCanvas.width = this._canvasWidth;
    this._mainCanvas.height = this._canvasHeight;


    forkJoin([this.images.loadImages(),
      this.gamesService.getRaceInfo(this.raceId),
      this.gamesService.getBetsForRace(this.gameId, this.raceId),
      this.gamesService.getHorsesForRace(this.gameId, this.raceId)
      ]).subscribe((responses) => {
        this.raceData = responses[1];
        this.bets = responses[2];
        this.horses = responses[3];
        this.setup();
      }, error => {
        debugger;
        console.log("error in forkJoin: " + error)
      });

  }

}
