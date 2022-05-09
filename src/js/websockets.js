// Web socket functions
var ws
var messageId = 0
var responsePending = false
var pendingTime
var startTime
var endTime
var widthFactor = 10
var heightFactor = 10
//https://10.1.0.56:8160/gui-api/contoursPOC.html
var IP = "10.1.0.56"
var PORT = "8160"

function sendEvent(e, preventThrottle) {
  if (preventThrottle || !responsePending || pendingExceeded()) {
    responsePending = true
    pendingTime = performance.now()
    messageId++
    e.messageId = messageId
    e.leftMouseDown = leftMouseDown
    e.rightMouseDown = rightMouseDown
    ws.send(JSON.stringify(e))
    startTime = performance.now()
  }
}

function pendingExceeded() {
  return performance.now() - pendingTime > 2000
}

var activeElement
var leftMouseDown = false
var rightMouseDown = false

function setButtonsDownState(e) {
  switch (e.button) {
    case 0:
      leftMouseDown = true
      break
    case 2:
      rightMouseDown = true
      break
    default:
      break
  }
}

function setButtonsUpState(e) {
  switch (e.button) {
    case 0:
      leftMouseDown = false
      break
    case 2:
      rightMouseDown = false
      break
    default:
      break
  }
}

function isScrollDown(e) {
  if (e.deltaY < 0) {
    return false
  } else {
    return true
  }
}

window.addEventListener("load", event => {
  if (ws == null) {
    ws = new WebSocket(`ws://${IP}:${PORT}/gui-api/contoursPOC`)
    ws.onopen = function () {
      // Web Socket is connected, send data using send()
      var e1 = new Object()
      e1.command = "get_initial_images"
      e1.elementWidth = 570
      e1.elementHeight = 570
      e1.elementId = "EShortAxisView"
      sendEvent(e1)
      responsePending = false
      e1.elementId = "EHorizontalLongAxisView"
      sendEvent(e1)
      responsePending = false
      e1.elementId = "EPolarMap"
      sendEvent(e1)
      responsePending = false
      e1.elementId = "EVerticalLongAxisView"
      sendEvent(e1)
      responsePending = false
    }
    ws.onmessage = function (evt) {
      if (evt.data instanceof Blob) {
        console.log("3d model received")
        update3DModel(evt.data)
        return
      }
      try {
        var data = JSON.parse(evt.data)
      } catch (e) {
        console.log("json parse failed", evt, e, evt.data)
        var data = {}
      }
      if (data.messageId == messageId) {
        responsePending = false
      }

      endTime = performance.now()
      console.log("Roundtrip: " + (endTime - startTime))
      if (data.commandId == "get_initial_images") {
        updateImages(data)
      } else if (data.commandId == "mouse_event") {
        updateContours(data)
      } else if (data.commandId == "mouse_wheel_event") {
        updateImages(data)
        updateContours(data)
      } else if (data.commandId == "update3DModel") {
        console.log("Update model event received")
        update3DModel(data)
      }
    }
  }

  function updateContours(data) {
    switch (data.updateElementId) {
      case "EVerticalLongAxisView":
        verticalLongAxisContourContext.clearRect(0, 0, verticalLongAxisContour.width, verticalLongAxisContour.height)
        verticalLongAxisContourContext.fillStyle = "#D8D3D3"
        for (let i = 0; i < data.contoursInner.length; i++) {
          verticalLongAxisContourContext.fillRect(data.contoursInner[i][0] - 2, data.contoursInner[i][1] - 2, 3, 3)
          if (i != 0) {
            verticalLongAxisContourContext.beginPath()
            verticalLongAxisContourContext.moveTo(data.contoursInner[i - 1][0], data.contoursInner[i - 1][1])
            verticalLongAxisContourContext.lineTo(data.contoursInner[i][0], data.contoursInner[i][1])
            verticalLongAxisContourContext.strokeStyle = "#ffffff"
            verticalLongAxisContourContext.stroke()
          }
        }
        for (let i = 0; i < data.contoursOuter.length; i++) {
          verticalLongAxisContourContext.fillStyle = "#D8D3D3"
          verticalLongAxisContourContext.fillRect(data.contoursOuter[i][0] - 2, data.contoursOuter[i][1] - 2, 3, 3)
          if (i != 0) {
            verticalLongAxisContourContext.beginPath()
            verticalLongAxisContourContext.moveTo(data.contoursOuter[i - 1][0], data.contoursOuter[i - 1][1])
            verticalLongAxisContourContext.lineTo(data.contoursOuter[i][0], data.contoursOuter[i][1])
            verticalLongAxisContourContext.strokeStyle = "#ffffff"
            verticalLongAxisContourContext.stroke()
          }
        }
        break
      case "EHorizontalLongAxisView":
        horizontalLongAxisContourContext.clearRect(
          0,
          0,
          horizontalLongAxisContour.width,
          horizontalLongAxisContour.height
        )
        horizontalLongAxisContourContext.fillStyle = "#ffffff"
        for (let i = 0; i < data.contoursInner.length; i++) {
          horizontalLongAxisContourContext.fillRect(data.contoursInner[i][0] - 2, data.contoursInner[i][1] - 2, 3, 3)
          if (i != 0) {
            horizontalLongAxisContourContext.beginPath()
            horizontalLongAxisContourContext.moveTo(data.contoursInner[i - 1][0], data.contoursInner[i - 1][1])
            horizontalLongAxisContourContext.lineTo(data.contoursInner[i][0], data.contoursInner[i][1])
            horizontalLongAxisContourContext.strokeStyle = "#ffffff"
            horizontalLongAxisContourContext.stroke()
          }
        }
        for (let i = 0; i < data.contoursOuter.length; i++) {
          horizontalLongAxisContourContext.fillRect(data.contoursOuter[i][0] - 2, data.contoursOuter[i][1] - 2, 3, 3)
          if (i != 0) {
            horizontalLongAxisContourContext.beginPath()
            horizontalLongAxisContourContext.moveTo(data.contoursOuter[i - 1][0], data.contoursOuter[i - 1][1])
            horizontalLongAxisContourContext.lineTo(data.contoursOuter[i][0], data.contoursOuter[i][1])
            horizontalLongAxisContourContext.strokeStyle = "#ffffff"
            horizontalLongAxisContourContext.stroke()
          }
        }
        break
      case "EShortAxisView":
        shortAxisContourContext.clearRect(0, 0, shortAxisContour.width, shortAxisContour.height)
        shortAxisContourContext.fillStyle = "#ffffff"
        for (let i = 0; i < data.contoursInner.length; i++) {
          shortAxisContourContext.fillRect(data.contoursInner[i][0] - 2, data.contoursInner[i][1] - 2, 3, 3)
          if (i != 0) {
            shortAxisContourContext.beginPath()
            shortAxisContourContext.moveTo(data.contoursInner[i - 1][0], data.contoursInner[i - 1][1])
            shortAxisContourContext.lineTo(data.contoursInner[i][0], data.contoursInner[i][1])
            shortAxisContourContext.strokeStyle = "#ffffff"
            shortAxisContourContext.stroke()
          }
        }
        for (let i = 0; i < data.contoursOuter.length; i++) {
          shortAxisContourContext.fillRect(data.contoursOuter[i][0] - 2, data.contoursOuter[i][1] - 2, 3, 3)
          if (i != 0) {
            shortAxisContourContext.beginPath()
            shortAxisContourContext.moveTo(data.contoursOuter[i - 1][0], data.contoursOuter[i - 1][1])
            shortAxisContourContext.lineTo(data.contoursOuter[i][0], data.contoursOuter[i][1])
            shortAxisContourContext.strokeStyle = "#ffffff"
            shortAxisContourContext.stroke()
          }
        }
        break
      /*case "EPolarMap":
					polarMapContourContext.clearRect(0, 0, polarMapContour.width, polarMapContour.height);
					polarMapContourContext.fillStyle = "#ffffff";
					for(let i = 0; i < data.contoursInner.length; i++) {
						polarMapContourContext.fillRect(data.contoursInner[i][0],data.contoursInner[i][1],1,1);
						if (i != 0) {
							polarMapContourContext.beginPath();
							polarMapContourContext.moveTo(data.contoursInner[i-1][0], data.contoursInner[i-1][1]);
							polarMapContourContext.lineTo(data.contoursInner[i][0], data.contoursInner[i][1]);
							polarMapContourContext.strokeStyle = '#ffffff';
							polarMapContourContext.stroke();
						}
					}
					for(let i = 0; i < data.contoursOuter.length; i++) {
						polarMapContourContext.fillRect(data.contoursOuter[i][0],data.contoursOuter[i][1],1,1);
						if (i != 0) {
							polarMapContourContext.beginPath();
							polarMapContourContext.moveTo(data.contoursOuter[i-1][0], data.contoursOuter[i-1][1]);
							polarMapContourContext.lineTo(data.contoursOuter[i][0], data.contoursOuter[i][1]);
							polarMapContourContext.strokeStyle = '#ffffff';
							polarMapContourContext.stroke();
						}
					}
					break;*/
      default:
        break
    }
  }

  function updateImages(data) {
    var image = new Image()
    switch (data.updateElementId) {
      case "EVerticalLongAxisView":
        verticalLongAxisCanvas.width = data.imageWidth * widthFactor
        verticalLongAxisCanvas.height = data.imageHeight * heightFactor
        verticalLongAxisCanvasContour.width = data.imageWidth * widthFactor
        verticalLongAxisCanvasContour.height = data.imageHeight * heightFactor

        image.onload = function () {
          verticalLongAxisContext.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            0,
            0,
            verticalLongAxisCanvas.width,
            verticalLongAxisCanvas.height
          )
        }
        break
      case "EHorizontalLongAxisView":
        horizontalLongAxisCanvas.width = data.imageWidth * widthFactor
        horizontalLongAxisCanvas.height = data.imageHeight * heightFactor
        horizontalLongAxisCanvasContour.width = data.imageWidth * widthFactor
        horizontalLongAxisCanvasContour.height = data.imageHeight * heightFactor
        image.onload = function () {
          horizontalLongAxisContext.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            0,
            0,
            horizontalLongAxisCanvas.width,
            horizontalLongAxisCanvas.height
          )
        }
        break
      case "EShortAxisView":
        shortAxisCanvas.width = data.imageWidth * widthFactor
        shortAxisCanvas.height = data.imageHeight * heightFactor
        shortAxisCanvasContour.width = data.imageWidth * widthFactor
        shortAxisCanvasContour.height = data.imageHeight * heightFactor
        image.onload = function () {
          shortAxisContext.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            0,
            0,
            shortAxisCanvas.width,
            shortAxisCanvas.height
          )
        }
        break
      /*case "EPolarMap":
					polarMapCanvas.width = data.imageWidth * widthFactor;
					polarMapCanvas.height = data.imageHeight * heightFactor;
					polarMapCanvasContour.width = data.imageWidth * widthFactor;
					polarMapCanvasContour.height = data.imageHeight * heightFactor;
					image.onload = function() {
						polarMapContext.drawImage(image, 0, 0, image.width, image.height,
							0, 0, polarMapCanvas.width, polarMapCanvas.height);
					}
					break;*/
      default:
        break
    }
    image.src = "data:image/png;base64, " + data.imageContents
  }

  var verticalLongAxisCanvas = document.getElementById("verticalLongAxis")
  var verticalLongAxisContext = verticalLongAxisCanvas.getContext("2d")
  var verticalLongAxisCanvasContour = document.getElementById("verticalLongAxisContour")
  var verticalLongAxisContourContext = verticalLongAxisCanvasContour.getContext("2d")
  var horizontalLongAxisCanvas = document.getElementById("horizontalLongAxis")
  var horizontalLongAxisContext = horizontalLongAxisCanvas.getContext("2d")
  var horizontalLongAxisCanvasContour = document.getElementById("horizontalLongAxisContour")
  var horizontalLongAxisContourContext = horizontalLongAxisCanvasContour.getContext("2d")
  var shortAxisCanvas = document.getElementById("shortAxis")
  var shortAxisContext = shortAxisCanvas.getContext("2d")
  var shortAxisCanvasContour = document.getElementById("shortAxisContour")
  var shortAxisContourContext = shortAxisCanvasContour.getContext("2d")
  /*
		var polarMapCanvas = document.getElementById("polarMap");

		var polarMapContext = polarMapCanvas.getContext('2d');
		var polarMapCanvasContour = document.getElementById("polarMapContour");
		var polarMapContourContext = polarMapCanvas.getContext('2d');
	 */

  // e1.offsetX, e1.offsetY gives the (x,y) offset from the edge of the canvas.

  // Add the e1 listeners for mousedown, mousemove, and mouseup
  verticalLongAxisCanvasContour.addEventListener("mousedown", e => {
    setButtonsDownState(e)
    var e1 = new Object()
    e1.command = "mouse_event"
    e1.elementId = "EVerticalLongAxisView"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = verticalLongAxisCanvas.width
    e1.elementHeight = verticalLongAxisCanvas.height
    sendEvent(e1)
  })

  verticalLongAxisCanvasContour.addEventListener("mouseup", e => {
    setButtonsUpState(e)
    var e1 = new Object()
    e1.command = "mouse_event"
    e1.elementId = "EVerticalLongAxisView"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = verticalLongAxisCanvas.width
    e1.elementHeight = verticalLongAxisCanvas.height
    sendEvent(e1)
  })

  verticalLongAxisCanvasContour.addEventListener("mousemove", e => {
    if (!leftMouseDown) {
      return
    }
    var e1 = new Object()
    e1.elementId = "EVerticalLongAxisView"
    e1.command = "mouse_event"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = verticalLongAxisCanvas.width
    e1.elementHeight = verticalLongAxisCanvas.height
    sendEvent(e1)
  })

  verticalLongAxisCanvasContour.addEventListener("wheel", e => {
    var e1 = new Object()
    e1.elementId = "EVerticalLongAxisView"
    e1.command = "mouse_wheel_event"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = verticalLongAxisCanvas.width
    e1.elementHeight = verticalLongAxisCanvas.height
    e1.isScroll = true
    e1.isScrollDown = isScrollDown(e)
    sendEvent(e1)
  })

  // e1.offsetX, e1.offsetY gives the (x,y) offset from the edge of the canvas.

  // Add the e1 listeners for mousedown, mousemove, and mouseup
  horizontalLongAxisCanvasContour.addEventListener("mousedown", e => {
    setButtonsDownState(e)
    var e1 = new Object()
    e1.command = "mouse_event"
    e1.elementId = "EHorizontalLongAxisView"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = horizontalLongAxisCanvasContour.width
    e1.elementHeight = horizontalLongAxisCanvasContour.height
    sendEvent(e1)
  })

  horizontalLongAxisCanvasContour.addEventListener("mouseup", e => {
    setButtonsUpState(e)
    var e1 = new Object()
    e1.command = "mouse_event"
    e1.elementId = "EHorizontalLongAxisView"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = horizontalLongAxisCanvasContour.width
    e1.elementHeight = horizontalLongAxisCanvasContour.height
    sendEvent(e1)
  })

  horizontalLongAxisCanvasContour.addEventListener("mousemove", e => {
    if (!leftMouseDown) {
      return
    }
    var e1 = new Object()
    e1.elementId = "EHorizontalLongAxisView"
    e1.command = "mouse_event"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = horizontalLongAxisCanvasContour.width
    e1.elementHeight = horizontalLongAxisCanvasContour.height
    sendEvent(e1)
  })

  horizontalLongAxisCanvasContour.addEventListener("wheel", e => {
    var e1 = new Object()
    e1.elementId = "EHorizontalLongAxisView"
    e1.command = "mouse_wheel_event"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = horizontalLongAxisCanvasContour.width
    e1.elementHeight = horizontalLongAxisCanvasContour.height
    e1.isScroll = true
    e1.isScrollDown = isScrollDown(e)
    sendEvent(e1)
  })

  // e1.offsetX, e1.offsetY gives the (x,y) offset from the edge of the canvas.

  // Add the e1 listeners for mousedown, mousemove, and mouseup
  shortAxisCanvasContour.addEventListener("mousedown", e => {
    setButtonsDownState(e)
    var e1 = new Object()
    e1.command = "mouse_event"
    e1.elementId = "EShortAxisView"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = shortAxisCanvas.width
    e1.elementHeight = shortAxisCanvas.height
    sendEvent(e1)
  })

  shortAxisCanvasContour.addEventListener("mouseup", e => {
    setButtonsUpState(e)
    var e1 = new Object()
    e1.command = "mouse_event"
    e1.elementId = "EShortAxisView"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = shortAxisCanvas.width
    e1.elementHeight = shortAxisCanvas.height
    sendEvent(e1)
  })

  shortAxisCanvasContour.addEventListener("mousemove", e => {
    if (!leftMouseDown) {
      return
    }
    var e1 = new Object()
    e1.elementId = "EShortAxisView"
    e1.command = "mouse_event"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = shortAxisCanvas.width
    e1.elementHeight = shortAxisCanvas.height
    sendEvent(e1)
  })

  shortAxisCanvasContour.addEventListener("wheel", e => {
    var e1 = new Object()
    e1.elementId = "EShortAxisView"
    e1.command = "mouse_wheel_event"
    e1.mouseX = e.offsetX
    e1.mouseY = e.offsetY
    e1.elementWidth = shortAxisCanvas.width
    e1.elementHeight = shortAxisCanvas.height
    e1.isScroll = true
    e1.isScrollDown = isScrollDown(e)
    sendEvent(e1)
  })

  /*
			// e1.offsetX, e1.offsetY gives the (x,y) offset from the edge of the canvas.

			// Add the e1 listeners for mousedown, mousemove, and mouseup

			polarMapCanvasContour.addEventListener('mousedown', e => {
					setButtonsDownState(e);
					activeElement = "EPolarMap"
					var e1 = new Object();
					e1.command="mouse_event";
					e1.elementId = "EPolarMap";
					e1.mouseX = e.offsetX;
					e1.mouseY = e.offsetY;
					e1.elementWidth = polarMapCanvas.width;
					e1.elementHeight = polarMapCanvas.height;
					sendEvent(e1);
				}
			);

			polarMapCanvasContour.addEventListener('mouseup', e => {
					setButtonsUpState(e);
					activeElement = "EPolarMap"
					var e1 = new Object();
					e1.command="mouse_event";
					e1.elementId = "EPolarMap";
					e1.mouseX = e.offsetX;
					e1.mouseY = e.offsetY;
					e1.elementWidth = polarMapCanvas.width;
					e1.elementHeight = polarMapCanvas.height;
					sendEvent(e1);
				}
			);

			polarMapCanvasContour.addEventListener('mousemove', e => {
					if (!leftMouseDown) {
						return;
					}
					activeElement = "EPolarMap"
					var e1 = new Object();
					e1.command="mouse_event";
					e1.elementId = "EPolarMap";
					e1.mouseX = e.offsetX;
					e1.mouseY = e.offsetY;
					e1.elementWidth = polarMapCanvas.width;
					e1.elementHeight = polarMapCanvas.height;
					sendEvent(e1);
				}
			);

			polarMapCanvasContour.addEventListener('wheel', e => {
					activeElement = "EPolarMap"
					var e1 = new Object();
					e1.command="mouse_wheel_event";
					e1.elementId = "EPolarMap";
					e1.mouseX = e.offsetX;
					e1.mouseY = e.offsetY;
					e1.elementWidth = polarMapCanvas.width;
					e1.elementHeight = polarMapCanvas.height;
					e1.isScroll = true;
					e1.isScrollDown = isScrollDown(e);
					sendEvent(e1);
				}
			);
			*/

  const contentItemInputs = document.querySelectorAll("div.content-item input")
  contentItemInputs.forEach(function (inputItem) {
    inputItem.addEventListener("change", function (event) {
      const targetElemId = event.target.getAttribute("data-id") || undefined
      if (targetElemId) {
        var e1 = new Object()
        e1.command = "range_slider_event"
        e1.elementId = targetElemId
        e1.selectedSlice = event.target.value
        sendEvent(e1, true)
      }
    })
  })

  const modelViewer = document.querySelector("div.content-item-view.model #model-viewer")
  const update3DModel = async data => {
    modelViewer.setAttribute("src", "data:model/gltf+json;base64," + data.imageContents)
  }
})

document.addEventListener("beforeunload", () => {
  if (ws) {
    ws.close()
  }
})
