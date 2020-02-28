var myDiv = document.getElementById('sl');
myDiv.style.maxWidth = `${window.innerWidth - 12}px`;
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

function btnClearAll(){
    delete slideShow;
    delete slide;
    currentSlide = 0;

    toggleControls();
    buildSlide();
}

function btnNext() {
    if(currentSlide < (slideShow.length - 2) ) currentSlide++;
    buildSlide();
}

// puts together the contents of the slide  **  needs more features
function buildSlide() {
    slide = slideShow[currentSlide];
    slide.text = slide.split('</span>', 1).filter(x => x);
    
    slide.text = slide[0];
    if( slide[1] ) slide.tag = slide[1];
    else slide.tag = "";
    slide.output = slide.tag + '<br>' + slide.text;

    console.log(slide, '|', slide.tag, '|', slide.text, '|', slide.output);
    // send slide to sizing before it is complete
    resizeSlide();

    //if( myDiv.clientHeight < 60 ) slide[0]

}

// try to count only VISIBLE characters appearing in HTML formatted strings
function htmlTextLength( countMe ){

    var slideLength = 0;
    for (index in countMe){
        for( var i = 0, counting = true; i < countMe[index].length; i++){
            if( countMe[index].charCodeAt(i) == 60 ) counting = false;           // disable counting while inside a tag... (or anything else in <>)
            if( countMe[index].charCodeAt(i) == 62 ) {i++; counting = true;}     // reenable counting after a tag... (or anything else in <>)
            if( countMe[index].charCodeAt(i) == 13 ||                            // disable counting for 'tab'
                countMe[index].charCodeAt(i) == 10 ) continue;                   // disable counting for 'return'
            
            if( counting == true ) slideLength++;                                // Count it up!
        };
    };
    return slideLength;
}

// determines how to best display the slide  **  needs working features!  lol
// tSize = text size, is the
function resizeSlide( maxFontSize = 30, charsPerLine = 90) {

    // reset all screen element(s) to default
    myDiv.style.left = 0;
    myDiv.style.width = `100%`;
    var slideLength = 0;

    //update div to current slide, make sure everything is aligning correctly
    var countHolder = myDiv.innerHTML = slide.output; //.toString();
    
    countHolder = countHolder.split('</span>').filter(x => x);
    slideLength = htmlTextLength( countHolder );
    
    // hide slide if no data.
    if (slideLength > 0) myDiv.style.display = "initial";
    else myDiv.style.display = "none";


    var fontSize = maxFontSize - (Math.floor(slideLength / charsPerLine) * 2);
    console.log( `fSize: ${fontSize} = maxFontSize: ${maxFontSize} - Math.floor(slideLength: ${slideLength}/ charsPerLline: ${charsPerLine})` );

    // set font size based
    myDiv.style.fontSize = `${fontSize}px`;

    // if still to big, resize again...
    console.log( `${myDiv.clientHeight} : ${myDiv.scrollHeight}`);

    if( myDiv.clientHeight < myDiv.scrollHeight ) resizeSlide( fontSize, 90 );

    if( document.getElementById('shrinkSlideCheckbox').checked == true) shrinkSlide();
    if( document.getElementById('centerSlideCheckbox').checked == true) centerSlide();    
}

//horizontal shrink
function shrinkSlide(){

    myHeight = myDiv.clientHeight;
    myWidth = startWidth = myDiv.clientWidth;

    do{ myWidth = myWidth - 5;
        myDiv.style.width = `${myWidth}px`;
    } while (myHeight == myDiv.clientHeight && myWidth > 0);

    myDiv.style.width = `${myWidth + 15}px`;

    if(myWidth < 2) myDiv.style.width = `${startWidth}px`;
}

//adjust left edge to center slide in the window, parseInt cleans up any 1/2 pixel sizes.
function centerSlide(){
    myDiv.style.left = `${ parseInt(((window.innerWidth) - myDiv.clientWidth) / 2 - 1)}px`;
}

window.onresize = function(){

    myDiv.style.maxWidth = `${window.innerWidth - 12}px`;
}

function toggleControls(){
    document.getElementById('fileSelect').toggleAttribute('disabled');
    document.getElementById('prevBtn').toggleAttribute('disabled');
    document.getElementById('refreshBtn').toggleAttribute('disabled');
    document.getElementById('nextBtn').toggleAttribute('disabled');
    document.getElementById('clearAllBtn').toggleAttribute('disabled');
}

var openFile = function(event) {
    const input = event.target.files[0];

    var reader = new FileReader();

    reader.onload = (event) => {
        const file = event.target.result;
        slideShow = file.split("<end-slide />");

        toggleControls();
        buildSlide();
    };

    reader.onerror = (event) => {
        alert(event.target.error.name);
    };

    reader.readAsText(input);
}