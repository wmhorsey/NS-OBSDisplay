var bc = new BroadcastChannel('SlideStream');

const liveView = document.getElementById("liveView");

liveView.addEventListener("webkitAnimationEnd", clearAnimations);

function loadLiveSlide(slide) {

    //slideShow = localStorage.getItem("theSlideShow");

    liveView.innerHTML = localStorage.getItem("LiveSlideInnerHTML");
    liveView.style.fontSize = localStorage.getItem("LiveSlideFontSize");
    liveView.classList = localStorage.getItem("LiveSlideClassList");
    //console.log("goto slide: ", slide);
    //console.log(slideShow[slide]);

}

function clearAnimations() {
    if( liveView.classList.contains("inAnimation") ) {
        liveView.classList.remove("inAnimation");
    } else {
        liveView.classList.remove("outAnimation");
        liveView.classList.add("hidden");
    }
}

bc.onmessage = (messageEvent) => {
    console.log( messageEvent.data );
    if ( liveSlide = parseInt(messageEvent.data) ){
        loadLiveSlide(liveSlide);
    }
    if (messageEvent.data === "newSlide")    {
        liveView.style.fontSize = localStorage.getItem("LiveSlideFontSize");
        liveView.innerHTML = localStorage.getItem("LiveSlideInnerHTML");
        liveView.classList = localStorage.getItem("LiveSlideClassList");
    } else if (messageEvent.data === 'hiddenSlide') {
        console.log("Toggle Hidden!");
        if(liveView.classList.contains("hidden")){
            liveView.classList.remove("hidden");
            liveView.classList.add("inAnimation");
        } else {
            liveView.classList.add("outAnimation");
        }
    }
}

