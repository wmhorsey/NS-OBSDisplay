var myDiv = document.getElementById('sl');
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

    //update  to current slide
    myDiv.innerHTML = slideShow[currentSlide];

    myDiv.innerHTML.trim();

    // reset screen element(s) to 0
    myDiv.style.left = "0px";
    myDiv.style.maxWidth = "";

    //how long is the text that goes on the slide...
    var slideLength = slideShow[currentSlide].length;

    var slideHeight = myDiv.clientHeight;
    console.log( "slideHeight = " + slideHeight );

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
    //font size = text size - the length of the slide / characters per line
    //var fSize = tSize - Math.floor(slideLength / cPL)
    
    // set font size based
    myDiv.style.fontSize = `${fSize}px`;

    myDiv.innerHTML = slideShow[currentSlide];

    if( slideHeight != myDiv.clientHeight ) {
        // okay, so our height changed because of a wrap.  starting height / pixel height should get us a roughly
        // the number of lines being used.  Then dividing the text evenly that many lines should justify the text
        // better while still maximizing utilized screen space.
        // slideHeight = myDiv.offsetHeight - slideHeight;
        var lines = (myDiv.clientHeight - (fSize * .8 + 10) ) / fSize;
        lines = Math.ceil(lines);

        myDiv.style.maxWidth = `${(slideLength / lines) - 20 }ch`;
    }

    //adjust left edge to center on screen
    myDiv.style.left = ( `${((window.innerWidth - myDiv.offsetWidth)/2)}px` )
}

var openFile = function(event) {
    const input = event.target.files[0];

    var reader = new FileReader();

    reader.onload = (event) => {
        const file = event.target.result;
        const allLines = file.split("<end-slide />");
        
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