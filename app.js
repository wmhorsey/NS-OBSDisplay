var slideShow = [];
var currentSlide = 0;

function btnPrev() {
    if(currentSlide > 0) currentSlide--;
    resizeSlide();
}

function btnNext() {
    if(currentSlide < (slideShow.length - 1) ) currentSlide++;
    resizeSlide();
}

function resizeSlide() {
    //const cPL = 90;         // characters per line
    //const tSize = 30;       // base text size 30px

    // reset screen element(s) to 0
    document.getElementById('hl').style.left = "0px";

    //how long is the text that goes on the slide...
    var slideLength = slideShow[currentSlide].length;

    // hide slide if no data.
    if (slideLength > 0) document.getElementById('hl').style.display = "initial";
    else document.getElementById('hl').style.display = "none";

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
    //font size = text size - the length of the slide / characters per line
    //var fSize = tSize - Math.floor(slideLength / cPL)
    
    // set font size based
    document.getElementById('hl').style.fontSize = `${fSize}px`;

    //update text element to wrap slide
    //  I would like it to wrap the text evenly up to 
    document.getElementById("hl").innerHTML = slideShow[currentSlide];

    //adjust left edge to center on screen
    document.getElementById('hl').style.left = ( `${((window.innerWidth - document.getElementById("hl").offsetWidth)/2)}px` )
}

var openFile = function(event) {
    const input = event.target.files[0];

    var reader = new FileReader();

    reader.onload = (event) => {
        const file = event.target.result;
        const allLines = file.split("</a-slide>");
        
        // Reading line by line
        allLines.forEach((line) => {
            slideShow.push(line);
            console.log(line);
        });

        document.getElementById('fileSelect').disabled = true;
        document.getElementById('prevBtn').disabled = false;
        document.getElementById('nextBtn').disabled = false;

        resizeSlide();
    };

    reader.onerror = (event) => {
        alert(event.target.error.name);
    };

    reader.readAsText(input);
}