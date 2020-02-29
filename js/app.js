var myDiv = document.getElementById('sl');
myDiv.style.maxWidth = `${window.innerWidth - 12}px`;
var slide = [];
var slideShow = [];
var currentSlide = 0;

function btnPrev() {
    if(currentSlide > 0) currentSlide--;
    resizeSlide();
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
    resizeSlide();
}

function fontUp(){
    slideShow[currentSlide].fontSize = `${(parseInt(slideShow[currentSlide].fontSize)+1)}px`;
    myDiv.style.fontSize = `${slideShow[currentSlide].fontSize}px`;
    resizeSlide();
}

function fontDown(){
    slideShow[currentSlide].fontSize = `${(parseInt(slideShow[currentSlide].fontSize)-1)}px`;
    myDiv.style.fontSize = `${slideShow[currentSlide].fontSize}px`;
    resizeSlide();
}

function btnNext() {
    if(currentSlide < (slideShow.length - 1) ) currentSlide++;
    resizeSlide();
}

// puts together the contents of the slide  **  needs more features
function buildSlides() {

    slideShow = slideShow.split("<end-slide />").filter(x => x);
    //console.log( `slideshow: ${slideShow}` );

    for( slide in slideShow ){
        slideShow[slide] = slideShow[slide].split('</span>').filter(x => x);
        for(line in slideShow[slide]){
            if( slideShow[slide][line].includes('<span') ) slideShow[slide][line] = slideShow[slide][line] + '</span>';
            if( slideShow[slide][line].includes('<span class="text">') ) slideShow[slide].text = slideShow[slide][line];
            if( slideShow[slide][line].includes('<span class="tag">') ) slideShow[slide].tag = slideShow[slide][line];
        };
    };

    for(x in slideShow){
        delete slideShow[x]['0'];
        delete slideShow[x]['1'];
    };

    resizeSlide();
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
function resizeSlide( maxFontSize = 36, charsPerLine = 90) {

    // reset all screen element(s) to default
    myDiv.style.left = 0;
    myDiv.style.width = `100%`;
    var slideLength = 0;

    //update div to current slide, make sure everything is aligning correctly
    if( slideShow[currentSlide].tag ) myDiv.innerHTML = slideShow[currentSlide].text + slideShow[currentSlide].tag;
    else myDiv.innerHTML = slideShow[currentSlide].text;
    
    slideLength = htmlTextLength( slideShow[currentSlide] );
    
    // hide slide if no data.
    if (slideLength > 0) myDiv.style.visibility = 'visible';
    else myDiv.style.visibility = 'hidden';


    if( slideShow[currentSlide].fontSize ){ fontSize = parseInt(slideShow[currentSlide].fontSize) }
    else {
    var fontSize = maxFontSize - ( Math.floor(slideLength / charsPerLine) * 3 );
    if( fontSize < 18 ) fontSize = 18;

    console.log( `fSize: ${fontSize} = maxFontSize: ${maxFontSize} - Math.floor(slideLength: ${slideLength}/ charsPerLline: ${charsPerLine})` );

    if(slideLength < 30) myDiv.style.width = `${slideLength}ch`; 
    };
    // set font size based
    myDiv.style.fontSize = `${fontSize}px`;

    //console.log( slideShow[currentSlide].fontSize, '<=>', myDiv.style.fontSize );
    
    if( isNaN(parseInt(slideShow[currentSlide].fontSize)) ) slideShow[currentSlide].fontSize = myDiv.style.fontSize;
    else myDiv.style.fontSize = `${slideShow[currentSlide].fontSize}px`;
    
    //console.log( slideShow[currentSlide].fontSize, '<=>', myDiv.style.fontSize );
    
    // if still to big, resize again...
    //if( myDiv.clientHeight < myDiv.scrollHeight ) resizeSlide( fontSize, 90 );

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

    if(myWidth < 2) {
        myDiv.style.width = `${startWidth}px`;
        
        console.log( document.getElementsByClassName('text') );
        console.log(`Using StartWidth on slide ${currentSlide}`);
    }
}

//adjust left edge to center slide in the window, parseInt cleans up any 1/2 pixel sizes.
function centerSlide(){
    myDiv.style.left = `${parseInt(((window.innerWidth) - myDiv.clientWidth) / 2) - 16}px`;
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
        slideShow = event.target.result;
        
        toggleControls();
        buildSlides();
    };

    reader.onerror = (event) => {
        alert(event.target.error.name);
    };

    reader.readAsText(input);
}
