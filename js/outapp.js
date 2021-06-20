var bc = new BroadcastChannel('SlideStream');

const liveView = document.getElementById("liveView");

liveView.addEventListener("webkitAnimationEnd", clearAnimations);

function clearAnimations() {
    if( liveView.classList.contains("inAnimation") ) {
        console.log("in1: ", liveView.classList);
        liveView.classList.remove("inAnimation");
        liveView.classList.remove("hidden");
        console.log("in2: ", liveView.classList);
    } else {
        console.log("out1: ", liveView.classList);
        liveView.classList.add("hidden");
        liveView.classList.remove("outAnimation");
        console.log("out2: ", liveView.classList);
    }
}

bc.onmessage = (messageEvent) => {
    if (messageEvent.data === 'newSlide')
    {
        liveView.style.backgroundColor = localStorage.getItem("LiveSlideBackColor");
        liveView.style.fontSize = localStorage.getItem("LiveSlideFontSize");
        liveView.innerHTML = localStorage.getItem("LiveSlideInnerHTML");
        liveView.style.left = localStorage.getItem("LiveSlideLeft");
        liveView.style.width = localStorage.getItem("LiveSlideWidth");
        liveView.classList = localStorage.getItem("LiveSlideClassList");
        console.log("classList: ", liveView.classList);
    }
}

