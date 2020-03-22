var myDiv = document.getElementById('preview');
var myLVD = document.getElementById('liveView');
myDiv.style.maxWidth = '95%';  //'`${window.width - 35}px`;
var slideShow = [];
var maxSlideHeight = 225, currentSlide = 0, displaySlide = 0, maxFontSize = 40;

function btnPrev() {
    if(currentSlide > 0) currentSlide--;
    showSlide( currentSlide );
}

function btnRefresh() {
    loadText( currentSlide );
    resizeFont( currentSlide );
    if( document.getElementById('shrinkSlideCheckbox').checked ) shrinkSlide( currentSlide );
    if( document.getElementById('centerSlideCheckbox').checked ) centerSlide( currentSlide );
    showSlide( currentSlide );
}

function btnClearAll(){
    currentSlide = 0;
    slideShow = [];
    delete myDiv.innerHTML;
    delete myLVD.innerHTML;

    toggleControls();
}

function btnFontUp(){
    slideShow[currentSlide].fontSize = `${(parseInt(slideShow[currentSlide].fontSize)+1)}px`;
    resizeFont( currentSlide );
    if( document.getElementById('shrinkSlideCheckbox').checked ) shrinkSlide( currentSlide );
    if( document.getElementById('centerSlideCheckbox').checked ) centerSlide( currentSlide );
    showSlide( currentSlide );
}

function btnFontDown(){
    slideShow[currentSlide].fontSize = `${(parseInt(slideShow[currentSlide].fontSize)-1)}px`;
    resizeFont( currentSlide );
    if( document.getElementById('shrinkSlideCheckbox').checked ) shrinkSlide( currentSlide );
    if( document.getElementById('centerSlideCheckbox').checked ) centerSlide( currentSlide );
    showSlide( currentSlide );
}

function btnNext() {
    if(currentSlide < (slideShow.length - 2) ) currentSlide++;
    showSlide( currentSlide );
}

function showSlide( slide ){
    myDiv.innerHTML = slideShow[slide].innerHTML;
    myDiv.style.fontSize = slideShow[slide].fontSize;
    myDiv.style.left = slideShow[slide].left;
    myDiv.style.width = slideShow[slide].width;
}

function btnUpdateLiveView( slide = currentSlide ) {
    myLVD.hidden = false;
    myLVD.innerHTML = slideShow[slide].innerHTML;
    myLVD.style.fontSize = slideShow[slide].fontSize;
    myLVD.style.left = slideShow[slide].left;
    myLVD.style.width = slideShow[slide].width;
}

function btnHideLiveView(){
    myLVD.hidden = true;
}

var openFile = function(event) {
    const input = event.target.files[0];

    var reader = new FileReader();

    reader.onload = (event) => {
        slideShow = event.target.result;
        
        toggleControls();
        buildSlideShow();
    };

    reader.onerror = (event) => {
        alert(event.target.error.name);
    };

    reader.readAsText(input);
}

// uses file contents to put slides together
function buildSlideShow() {

    slideShow = slideShow.split("<end-slide />").filter(x => x);

    for( slide in slideShow ){
        slideShow[slide] = slideShow[slide].split('</span>').filter(x => x);
        for(line in slideShow[slide]){
            if( slideShow[slide][line].includes('<span') ) slideShow[slide][line] = slideShow[slide][line] + '</span>';
            if( slideShow[slide][line].includes('<span class="text">') ) slideShow[slide].text = slideShow[slide][line];
            if( slideShow[slide][line].includes("<span class='text'>") ) slideShow[slide].text = slideShow[slide][line];
            if( slideShow[slide][line].includes('<span class="tag">') ) slideShow[slide].tag = slideShow[slide][line];
            if( slideShow[slide][line].includes("<span class='tag'>") ) slideShow[slide].tag = slideShow[slide][line];
        };

        loadText( slide );
        resizeFont( slide );
        if( document.getElementById('shrinkSlideCheckbox').checked ) shrinkSlide( slide );
        if( document.getElementById('centerSlideCheckbox').checked ) centerSlide( slide );

        delete slideShow[slide][0];
        delete slideShow[slide][1];
    };

    showSlide( 0 );
}

function loadText( slide ){
        
    delete slideShow[slide].fontSize;
    delete slideShow[slide].left;
    delete slideShow[slide].width;

    if( slideShow[slide].text && slideShow[slide].tag ) 
        myDiv.innerHTML = slideShow[slide].text + slideShow[slide].tag;
    else if( slideShow[slide].text) myDiv.innerHTML = slideShow[slide].text;
    else if( slideShow[slide].tag ) myDiv.innerHTML = slideShow[slide].tag;
    
    slideShow[slide].innerHTML = myDiv.innerHTML;
}

function resizeFont( slide ) {

    delete slideShow[slide].left;
    delete slideShow[slide].width;

    myDiv.style.left = 0;
    myDiv.style.width = `100%`;
    myDiv.innerHTML = slideShow[slide].innerHTML;
    var fontSize = maxFontSize;

    //if a value is stored for fontSize, make it the default value.
    if(!isNaN( parseInt(slideShow[slide].fontSize ))) fontSize = parseInt(slideShow[slide].fontSize);
    
    myDiv.style.fontSize = `${fontSize}px`;

/*     console.log( `${slide})before while myDiv.clientHeight > 110: ${myDiv.clientHeight}` );
    console.log( `${slide})before while myDiv.scrollWidth: ${myDiv.scrollWidth} > myDiv.clientWidth: ${myDiv.clientWidth}` );
 */
    while( myDiv.clientHeight > maxSlideHeight ) { 
        myDiv.style.fontSize = `${--fontSize}px`; 
    };

//    if( myDiv.scrollWidth > myDiv.clientWidth ) myDiv.style.fontSize = `${--fontSize}px`;

/*     console.log( `${slide})after while myDiv.clientHeight > 110: ${myDiv.clientHeight}` );
    console.log( `${slide})after while myDiv.scrollWidth: ${myDiv.scrollWidth} > myDiv.clientWidth: ${myDiv.clientWidth}` );
 */
    if( isNaN(parseInt(slideShow[slide].fontSize)) ) slideShow[slide].fontSize = myDiv.style.fontSize;
    else myDiv.style.fontSize = `${slideShow[slide].fontSize}px`;

}

//horizontal shrink
function shrinkSlide( slide ){
    myHeight = myDiv.clientHeight;
    myWidth = myDiv.clientWidth;

    if( slideShow[slide].width > myDiv.maxWidth ) slideShow[slide].width == `${myDiv.maxWidth - 15}px`;

    do{ 
        myWidth = myWidth - 15;
        myDiv.style.width = `${myWidth}px`;
    } while ( myDiv.style.width==`${myDiv.scrollWidth}px` && myWidth > 0 && myHeight == myDiv.clientHeight );

    slideShow[slide].width = myDiv.style.width = `${myWidth + 35}px`;
}

//adjust left edge to center slide in the window, parseInt cleans up any 1/2 pixel sizes.
function centerSlide( slide ){
    slideShow[slide].left = myDiv.style.left = `${parseInt(((window.innerWidth) - myDiv.clientWidth) / 2)}px`;
}

function toggleControls(){
    document.getElementById('fileSelect').toggleAttribute('disabled');
    document.getElementById('prevBtn').toggleAttribute('disabled');
    document.getElementById('refreshBtn').toggleAttribute('disabled');
    document.getElementById('nextBtn').toggleAttribute('disabled');
    document.getElementById('clearAllBtn').toggleAttribute('disabled');
    document.getElementById('fontUpBtn').toggleAttribute('disabled');
    document.getElementById('fontDownBtn').toggleAttribute('disabled');
    document.getElementById('updateLiveViewBtn').toggleAttribute('disabled');
}
