

export const horseColors = [
  "Aqua",
  "Black",
  "Blue",
  "LightGreen",
  "Brown",
  "Cyan",
  "DarkGreen",
  "Lime",
  "Magenta",
  "Pink",
  "Purple",
  "Red",
  "Yellow",
];

export class ImagesService {
  horseImages;
  taggedImages;
  baseUrl:string;

  constructor() {
    this.horseImages = [];
    // this.baseUrl = 'http://' + window.location.hostname + ':80/assets/horses/images/';
    this.baseUrl = `assets/images/`;
    this.taggedImages = [
      { name: 'grass', url: this.baseUrl + 'grass.jpeg' },
    ];

  }

  getNewImagePromise(imageUrl) {
    return new Promise((resolve) => {
      let image = new Image();
      image.onload = function () {
        resolve(image);
      };
      image.src = imageUrl;
    });
  }

  _loadAllHorseImages() {
    this.horseImages = [];
    return new Promise((resolve, reject) => {
      let imagePromises = [];
      for (let index in horseColors) {
        let name = horseColors[index];
        let colorName = `${this.baseUrl}Horse${name}.png`;
        imagePromises.push(this.getNewImagePromise(colorName));
      }
      Promise.all(imagePromises)
        .then((imageArray) => {
          for (let i in imageArray) {
            this.horseImages.push(imageArray[i]);
          }
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  _loadTaggedImages() {

    return new Promise((resolve, reject) => {
      let imagePromises = [];
      for (let index in this.taggedImages) {
        let imageReq = this.taggedImages[index];
        imagePromises.push(this.getNewImagePromise(imageReq.url));
      }
      Promise.all(imagePromises)
        .then((imageArray) => {
          for (let i in imageArray) {
            this.taggedImages[i].img = imageArray[i];
          }
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  loadImages() {
    return new Promise((resolve, reject) => {
      this._loadAllHorseImages()
        .then(() => {
          this._loadTaggedImages().then(() => {
            resolve();
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getImage(index){
    return (<HTMLImageElement>(this.horseImages[index]));
  }

  getTaggedImage(name) {
    let result = this.taggedImages.find((item) => {
      if (item.name === name) {
        return item;
      }
    });
    return (<HTMLImageElement>(result.img));


  }
}
