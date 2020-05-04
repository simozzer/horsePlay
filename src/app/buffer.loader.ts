export class BufferLoader {


  _urlList = [];
  _callback = null;
  _callbackOwner = null;

  _bufferList = [];
  _loadCount = 0;

  _promises = [];

  constructor(urlList, callback, callbackOwner) {
    this._urlList = urlList;
    this._callback = callback;
    this._callbackOwner = callbackOwner;

    this._promises = [];
    this._bufferList = [];
    this._loadCount = 0;
  }

  async loadBuffer(url, iIndex):Promise<any> {
    // Load buffer asynchronously
      const request = new XMLHttpRequest();
      request.open("GET", url, true);
    request.responseType = "arraybuffer";

      const loader = this;
      const req = request;

      request.onload = function () {
      // Asynchronously decode the audio file data in request.response
      loader._bufferList[iIndex] = request.response;
      if (++loader._loadCount == loader._urlList.length) {
        loader._callback.call(loader._callbackOwner,loader._bufferList);
      };
    };

    request.onerror = function () {
      alert("BufferLoader: XHR error");
    };

    request.send();

    return request;
  };

  getPromise(index) {
    return this._promises[index];
  }

  async load() {
    for (let i = 0; i < this._urlList.length; ++i) {
      this._promises.push(await this.loadBuffer(this._urlList[i], i));
    }
  };
}
