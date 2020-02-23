var myDiv = document.getElementById('sl');
var slide = [];
var slideShow = [];
var currentSlide = 0;

function btnPrev() {
    if(currentSlide > 0) currentSlide--;
    buildSlide();
}

//redo sizing, something doesn't look right.
function btnRefresh() {
    resizeSlide();
}

function btnNext() {
    if(currentSlide < (slideShow.length - 1) ) currentSlide++;
    buildSlide();
}

// puts together the contents of the slide  **  needs more features
function buildSlide() {
    slide = slideShow[currentSlide]
    // send slide to sizing before it is complete
    resizeSlide();
}

// determines how to best display the slide  **  needs working features!  lol
function resizeSlide() {

    // reset all screen element(s) to default
    myDiv.style.left = 0;
    myDiv.style.width = "100%";
    var slideHeight = 0;
    var slideLength = 0;

    //update div to current slide, make sure everything is aligning correctly
    var countHolder = myDiv.innerHTML = slide.toString();
    
    countHolder = countHolder.split('</div>');
    countHolder = countHolder[0].toString();

    for( var i = 0, counting = true; i < countHolder.length; i++){
        if( countHolder.charAt(i) == "<") counting = false;
        if( countHolder.charAt(i) == ">") counting = true;
        if( counting == true ) slideLength++;
    };

    //slideHeight = myDiv.clientHeight;
    //console.log( `myDiv.clientHeight = ${slideHeight}px` );

    // hide slide if no data.
    if (slideLength > 0) myDiv.style.display = "initial";
    else myDiv.style.display = "none";

    // I am working on a more elegant solution for this, but for now this works.
    // these breakpoints are intended for a 1080p screen.
    if(slideLength < 280) fSize = 30;
    else if(slideLength > 279 && slideLength < 320 ) fSize = 28;
    else if(slideLength > 319 && slideLength < 400 ) fSize = 26;
    else if(slideLength > 399 && slideLength < 450 ) fSize = 24;
    else if(slideLength > 449 && slideLength < 600 ) fSize = 22;
    else if(slideLength > 599 && slideLength < 660 ) fSize = 20;
    else if(slideLength > 659 && slideLength < 840 ) fSize = 18;
    else if(slideLength > 839) fSize = 16;

    // this didn't work as intended, but is going to be the basis of the self adjusting solution.
    // font size = text size - the length of the slide / characters per line
    // var fSize = tSize - Math.floor(slideLength / cPL)
    
    // set font size based
    myDiv.style.fontSize = `${fSize}px`;

    if( document.getElementById('shrinkSlideCheckbox').checked == true) shrinkSlide();
    if( document.getElementById('centerSlideCheckbox').checked == true) centerSlide();    
}

//horizontal shrink
function shrinkSlide(){

    myHeight = myDiv.clientHeight;
    myWidth = myDiv.clientWidth;

    do{ 
        myWidth=myWidth - 5;
        myDiv.style.width = `${myWidth}px`;
    } while (myHeight == myDiv.clientHeight);

    myDiv.style.width = `${myWidth + 5}px`
}

//adjust left edge to center on screen
function centerSlide(){
    myDiv.style.left = `${(window.innerWidth - myDiv.clientWidth) / 2}px`;
}



var openFile = function(event) {
    const input = event.target.files[0];

    var reader = new FileReader();

    reader.onload = (event) => {
        const file = event.target.result;
        slideShow = file.split("<end-slide />");

        document.getElementById('fileSelect').disabled = true;
        document.getElementById('prevBtn').disabled = false;
        document.getElementById('refreshBtn').disabled = false;
        document.getElementById('nextBtn').disabled = false;

        buildSlide();
    };

    reader.onerror = (event) => {
        alert(event.target.error.name);
    };

    reader.readAsText(input);
}