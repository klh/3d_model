const bnLogo = document.querySelector("button.menu-logo")
const bnExpand = document.querySelector("button.menu-expand")
const container = document.querySelector("div.container")
const bnMenu = document.querySelector("button.menu-menu")
const bnDot = document.querySelectorAll("button.menu-dot")
const bnClip = document.querySelector("button.menu-clipboard")
const bn4square = document.querySelector("button.menu-4square")
const bnAdjust = document.querySelector("button.menu-adjust")
const bnPulse = document.querySelector("button.menu-pulse")
const bnCircles = document.querySelectorAll("button.menu-circle")
const bnSettings = document.querySelector("button.menu-settings")
const bnUser = document.querySelector("button.header-user")
const bnItemExpand = document.querySelectorAll("div.content-item-title button")
const contentItems = document.querySelectorAll("div.content-item")
const contentItemInputs = document.querySelectorAll("div.content-item input")


bnLogo.addEventListener("click", function () {
  console.log("bnLogo clicked")
})

bnExpand.addEventListener("click", function () {
  console.log("bnExpand clicked")
	container.classList.toggle("expanded")
	container.classList.toggle("collapsed")
})

bnMenu.addEventListener("click", function () {
  console.log("bnMenu clicked")
})


bnClip.addEventListener("click", function () {
  console.log("bnClip clicked")
})

bn4square.addEventListener("click", function () {
  console.log("bn4square clicked")
})
bnAdjust.addEventListener("click", function () {
  console.log("bnAdjust clicked")
})
bnPulse.addEventListener("click", function () {
  console.log("bnPulse clicked")
})
bnCircles.forEach(function (bnCircle) {
  bnCircle.addEventListener("click", function () {
    console.log("bnCircle clicked")
  })
})
bnSettings.addEventListener("click", function () {
  console.log("bnSetting clicked")
})

bnDot.forEach(function (bnDot) {
  bnDot.addEventListener("click", function () {
	console.log("bnDot clicked")
  })
})

bnUser.addEventListener("click", function () {
  console.log("bnUser clicked")
})

bnItemExpand.forEach(function (bnItem) {
	bnItem.addEventListener("click", function (event) {
		console.log("bnItemExpand clicked")
		const currentItem = event.target;
		contentItems.forEach(function (contentItem) {
			if (contentItem.contains(currentItem)) {
				contentItem.classList.toggle("expanded")
			}else{
				contentItem.classList.toggle("hidden")
			}
		})
	})
})

contentItemInputs.forEach(function (inputItem) {
	inputItem.addEventListener("input", function (event) {
		console.log(event.target.id, event.target.value, event.target.getAttribute("data-id"))
	})
})
