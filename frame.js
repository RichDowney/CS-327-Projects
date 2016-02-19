var sender, receiver, mode, method, output, input;

window.onload = function() {
  sender = document.getElementById("sender");
  receiver = document.getElementById("receiver");
  output = document.getElementById("output");
  input = document.getElementById("input");
  setMode("sender");
  setMethod("byteCount");
};

function setMode(selectedMode) {
  mode = selectedMode;
  if (mode === "receiver") {
    sender.className = "inactive";
    receiver.className = "active";
  } else {
    sender.className = "active";
    receiver.className = "inactive";
  }
  setOutputText("");
  input.value = "";
}

function setOutputText(message) {
  output.innerHTML = message;
}

function setMethod(selectedMethod) {
  method = selectedMethod;
  setOutputText("");
  input.value = "";
}

function submit() {
  if (mode === "sender") {
    frameData();
  } else {
    deframeData();
  }
}

function frameData() {
  if (method === "bitStuffing") {
    validateSentBitStuffData();
  } else if (method === "byteCount") {
    validateSentByteCountData();
  } else {
    validateSentByteStuffData();
  }
}

function validateSentBitStuffData() {
  var bitStuffingCheck = new RegExp("[^0-1]")
  var data = input.value;
  if (data === "") {
    setOutputText("No data given");
  } else if (bitStuffingCheck.test(data)) {
    setOutputText("Data must only contain 1s or 0s");
  } else {
    frameBitStuffData(data);
  }
}

function frameBitStuffData(data) {
  var count = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i] === "1") {
      count++;
    } else {
      count = 0;
    }
    if (count === 5) {
      data = data.substring(0, i + 1) + "0" + data.substring(i + 1);
      count = 0;
    }
  }
  setOutputText("01111110" + data + "01111110");
}

function validateSentByteCountData() {
  var byteCountCheck = new RegExp("[^a-zA-Z]")
  var data = input.value;
  if (data === "") {
    setOutputText("No data given");
  } else if (byteCountCheck.test(data)) {
    setOutputText("Data must only contain letters");
  } else {
    frameByteCountData(data);
  }
}

function frameByteCountData(data) {
  setOutputText((data.length+1) + data);
}

function validateSentByteStuffData() {
  var byteStuffingCheck = new RegExp("[^a-zA-Z]");
  var data = input.value;
  if (data === "") {
    setOutputText("No data given");
  } else if (byteStuffingCheck.test(data)) {
    setOutputText("Data must only contain letters");
  } else {
    frameByteStuffData(data);
  }
}

function frameByteStuffData(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i] === "E" || data[i] === "F") {
      data = data.substring(0, i) + "E" + data.substring(i);
      i++
    }
  }
  setOutputText("F" + data + "F");
}

function deframeData() {
  if (method === "bitStuffing") {
    validateReceivedBitStuffData();
  } else if (method === "byteCount") {
    validateReceivedByteCountData();
  } else {
    validateReceivedByteStuffData();
  }
}

function validateReceivedBitStuffData() {
  var bitStuffingCheck = /^(01111110)([0-1]*)(01111110)$/;
  var data = input.value;
  if (data === "") {
    setOutputText("No data given");
  } else if (!data.match(bitStuffingCheck)) {
    setOutputText("Data must contain '01111110' at each end and must only have 0s or 1s in between them.");
  } else {
    deframeBitStuffData(data);
  }
}

function deframeBitStuffData(data) {
  var count = 0;
  data = data.replace(/(01111110)/g, "");
  if (data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      if (data[i] === "1") {
        count++;
      } else {
        count = 0;
      }
      if (count === 5 && data[i + 1] === "0") {
        data = data.slice(0, i + 1) + data.slice(i + 2);
        count = 0;
      } else if (count === 5) {
        setOutputText("Malformed data, no 0 following 5 consecutive 1s");
        return;
      }
    }
    setOutputText(data);
  } else {
    setOutputText("No Data between the flag frames!");
  }
}

function validateReceivedByteCountData() {
  var byteCountCheck = /^\d[a-zA-Z]([a-zA-Z]*)$/;
  var data = input.value;
  if (data === "") {
    setOutputText("No data given");
  } else if (!data.match(byteCountCheck)) {
    setOutputText("Data must have a single digit number that is only followed by letters");
  } else {
    deframeByteCountData(data);
  }
}

function deframeByteCountData(data) {
  if(parseInt(data[0]) != (data.length)) {
    setOutputText("Length Byte not equal to length of data");
  } else {
    setOutputText(data.substring(1));
  }
}

function validateReceivedByteStuffData() {
  var byteStuffingCheck = /^(F)([a-zA-Z]*)(F)$/;
  var data = input.value;
  if (data === "") {
    setOutputText("No data given");
  } else if (!data.match(byteStuffingCheck)) {
    setOutputText("Data must only contain letters with 'F' at each end");
  } else {
    deframeByteStuffData(data);
  }
}

function deframeByteStuffData(data) {
  if (data.length === 2) {
    setOutputText("No Data between the flag frames!");
    return;
  } else {
    data = data.substring(1, data.length - 1);
  }
  for (var i = 0; i < data.length; i++) {
    if (data[i] === "E" && (data[i + 1] === "E" || data[i + 1] === "F")) {
      data = data.slice(0, i + 1) + data.substring(i + 2);
    } else if (data[i] === "E" || data[i] === "F") {
      setOutputText("Malformed data, missing 'E' before special charcaters");
      return;
    }
  }
  setOutputText(data);
}
