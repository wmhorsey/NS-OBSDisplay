var bc = new BroadcastChannel('SlideStream');

const liveView = document.getElementById("liveView");

liveView.addEventListener("webkitAnimationEnd", clearAnimations);

function clearAnimations() {
    if( liveView.classList.contains("inAnimation")) {
        liveView.classList.remove("inAnimation", "hidden");
    } else {
        liveView.classList.remove("outAnimation");
        liveView.classList.add("hidden");
    }
}

bc.onmessage = (messageEvent) => {
    // If our broadcast message is 'update_title' then get the new title from localStorage
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

