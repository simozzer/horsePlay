export class AudioBufferLoader {

  _context = null;
  _urlList = [];
  _callback = null;
  _callbackOwner = null;

  _bufferList = [];
  _loadCount = 0;

  constructor(audioContext, urlList, callback, callbackOwner) {
    this._context = audioContext;
    this._urlList = urlList;
    this._callback = callback;
    this._callbackOwner = callbackOwner;

    this._bufferList = [];
    this._loadCount = 0;

  }

  loadBuffer(url, index) {
    // Load buffer asynchronously
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    const loader = this;
    const req = request;

    request.onload = function () {
      // Asynchronously decode the audio file data in request.response
      loader._context.decodeAudioData(
        request.response,
        function (buffer) {
          if (!buffer) {
            alert("error decoding file data: " + url);
            return;
          }
          loader._bufferList[index] = buffer;
          if (++loader._loadCount == loader._urlList.length) {
            loader._callback.call(loader._callbackOwner,loader._bufferList);
          }
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
