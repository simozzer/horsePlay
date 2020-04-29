export class BufferLoader {

  _context = null;
  _urlList = [];
  _callback = null;

  _bufferList = [];
  _loadCount = 0;

  constructor(context, urlList, callback) {
    this._context = context;
    this._urlList = urlList;
    this._callback = callback;
    this._bufferList = [];
    this._loadCount = 0;
  }

  loadBuffer(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function () {
      // Asynchronously decode the audio file data in request.response
      loader._context.decodeAudioData(
        request.response,
        function (buffer) {
          if (!buffer) {
            alert("error decoding file data: " + url);
            return;
          }
          this.bufferList[index] = buffer;
          if (++loader._loadCount == loader._urlList.length)
            this.onload(loader._bufferList);
        },
        function (error) {
          console.error("decodeAudioData error", error);
        }
      );
    };

    request.onerror = function () {
      alert("BufferLoader: XHR error");
    };

    request.send();
  };

  load() {
    for (let i = 0; i < this._urlList.length; ++i)
      this.loadBuffer(this._urlList[i], i);
  };
}
