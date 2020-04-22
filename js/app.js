var myDiv = document.getElementById('preview');
    myDiv.style.maxWidth = '95%';

var myLVD = document.getElementById('liveView');
myLVD.addEventListener("webkitAnimationEnd", clearAnimations);

var myBGColor = {R: '00', G: '00', B: '00', A: 'ff'};

var slideShow = [],             //array to store data read from slide-file
    maxSlideHeight = 225,       //max height of projected slides in px
    currentSlide = 0,           //index counter to track position in slideShow array
    totalSlides = 0,
    LVDOn = false;
    displaySlide = 0,           //used this somewhere... find out where later and see why **********************************
    maxFontSize = 40;           //set a max limit on slide font size

function btnPrev() {
    if(currentSlide > 0) currentSlide--;
    callSlide( currentSlide );
}

function clearAnimations() {
    myLVD.classList.remove("inAnimation","outAnimation");
    if( LVDOn == true ) myLVD.style.bottom = "20px";
    else myLVD.style.bottom = "-30%";
}

function btnShowQSlide() {
    slideShow.push( '<span class="text">' + document.getElementById('quickSlide').value + "</span><end-slide />" );
    buildSlide( slideShow.length - 1 );
}

function btnChangeBkColor( r = myBGColor.R, b = myBGColor.B, g = myBGColor.G, a = myBGColor.A) {

    myBGColor.R = r, myBGColor.B = b, myBGColor.G = g, myBGColor.A = a;
    myDiv.style.backgroundColor = `#${r}${b}${g}${a}`;

}

//Let system set slide properties back to algorithmically generated values
function btnRefresh() {
    loadText( currentSlide );
    resizeFont( currentSlide );
    if( document.getElementById('shrinkSlideCheckbox').checked ) shrinkSlide( currentSlide );
    if( document.getElementById('centerSlideCheckbox').checked ) centerSlide( currentSlide );
    showSlide( currentSlide );
}

//Don't use this... just refresh the page... Maybe I will make it work right someday.
function btnClearAll(){
    currentSlide = 0;
    slideShow = [];
    delete myDiv.innerHTML;
    delete myLVD.innerHTML;

    toggleControls();
}

// lets you click through the slides without moving to the slide
function viewSlide( slide ){
    showSlide( slide );
}

//moves you to the slide being viewed
function callSlide( slide ){

    if(document.getElementsByClassName("slidePreView")[0]) document.getElementsByClassName("slidePreView")[0].className = "slideButton";

    currentSlide = slide;
    showSlide( slide );

    if( document.getElementById(`btnSlide${slide}`).className != "slideLiveView") document.getElementById(`btnSlide${currentSlide}`).className = "slidePreView";
}


function callLiveSlide( slide = currentSlide ){

    if(document.getElementsByClassName("slideLiveView")[0]) document.getElementsByClassName("slideLiveView")[0].className = "slideButton";

    myLVD.style.backgroundColor = myDiv.style.backgroundColor;
    myLVD.innerHTML = slideShow[slide].innerHTML;
    myLVD.style.fontSize = slideShow[slide].fontSize;
    myLVD.style.left = slideShow[slide].left;
    myLVD.style.width = slideShow[slide].width;
    myLVD.style.bottom = "20px";
    myLVD.classList.add("inAnimation");
    LVDOn = true;

    document.getElementById(`btnSlide${currentSlide}`).className = "slidePreView";
    document.getElementById(`btnSlide${slide}`).className = "slideLiveView";
    myLVD.style.display = "block";
}

//Increases current slide font (and allows slide to adjust to new text size)
function btnFontUp(){
    slideShow[currentSlide].fontSize = `${(parseInt(slideShow[currentSlide].fontSize)+1)}px`;
    resizeFont( currentSlide );
    if( document.getElementById('shrinkSlideCheckbox').checked ) shrinkSlide( currentSlide );
    if( document.getElementById('centerSlideCheckbox').checked ) centerSlide( currentSlide );
    showSlide( currentSlide );
}

//Decreases current slide font (and allows slide to adjust to new text size)
function btnFontDown(){
    slideShow[currentSlide].fontSize = `${(parseInt(slideShow[currentSlide].fontSize)-1)}px`;
    resizeFont( currentSlide );
    if( document.getElementById('shrinkSlideCheckbox').checked ) shrinkSlide( currentSlide );
    if( document.getElementById('centerSlideCheckbox').checked ) centerSlide( currentSlide );
    showSlide( currentSlide );
}

// GOES TO THE NEXT SLIDE
function btnNext() {
    if(currentSlide < (slideShow.length - 1) ) currentSlide++;
    callSlide( currentSlide );
}

//Shows currently selected slide in <div id="PREVIEW">
function showSlide( slide ){
    myDiv.innerHTML = slideShow[slide].innerHTML;
    myDiv.style.fontSize = slideShow[slide].fontSize;
    myDiv.style.left = slideShow[slide].left;
    myDiv.style.width = slideShow[slide].width;
}

//updates <div id="LIVEVIEW"> to show currently selected slide
function btnUpdateLiveView( slide = currentSlide ) {
    callLiveSlide( slide );
    LVDOn = true;
    //myLVD.classList.add("inAnimation");
    btnNext();
}

// Hides the liveview slide from view.
function btnHideLiveView( slide = currentSlide ){

    if( LVDOn == false ) {
        LVDOn = true;
        //myLVD.style.bottom = "20px",
        myLVD.classList.add("inAnimation");
    } else { 
        LVDOn = false;
        myLVD.classList.add("outAnimation");
    }
}

// Reads from selected file, toggles controls if load is successful and triggers slides to be built
var openFile = function(event) {
    const input = event.target.files[0];

    var reader = new FileReader();

    reader.onload = (event) => {
        slideShow += event.target.result;
        
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
    console.log(slideShow);
    slideShow = slideShow.replace(/(\n|\r)/gm, "");                // strip out any sort of newline in the strings (except <br> codes... ignore those)
    slideShow = slideShow.split("<end-slide />").filter(x => x);

    console.log(slideShow);

    for( slide in slideShow ) {
        if(totalSlides > 0) slide = totalSlides;
        buildSlide( slide );
    }
    showSlide( 0 );

    console.log(slideShow);

}

function buildSlide( slide ) {

    slideShow[slide] = slideShow[slide].split( "</span>" ).filter(x => x);

    slideShow[slide].textList = [];
    slideShow[slide].tagList = [];

    for(line in slideShow[slide]){
        if( slideShow[slide][line].includes('<span') ) slideShow[slide][line] = slideShow[slide][line] + '</span>';    // fix span tags used to delimit
        if( slideShow[slide][line].includes('<span class="text') ) slideShow[slide].textList.push(line);
        if( slideShow[slide][line].includes("<span class='text") ) slideShow[slide].textList.push(line);
    };

    loadText( slide );
    resizeFont( slide );
    if( document.getElementById('shrinkSlideCheckbox').checked ) shrinkSlide( slide );
    if( document.getElementById('centerSlideCheckbox').checked ) centerSlide( slide );

    var btn = document.createElement('BUTTON');
    btn.innerHTML = (slide + 1);
    btn.setAttribute('onmouseleave',`viewSlide( currentSlide )`);
    btn.setAttribute('onmouseover',`viewSlide(${slide})`);
    btn.setAttribute('onclick',`callSlide(${slide})`);
    btn.setAttribute('onauxclick',`callLiveSlide(${slide})`);
    btn.setAttribute('class','slideButton');
    btn.setAttribute('id',`btnSlide${slide}`);
    //btn.addEventListener("readystatechange")
    document.getElementById('buttonBox').appendChild(btn);
    //document.body.appendChild(btn);
    totalSlides++;

}

function loadText( slide ){
        
    delete slideShow[slide].fontSize;
    delete slideShow[slide].left;
    delete slideShow[slide].width;
    //slideShow[slide].innerHTML = "",
    myDiv.innerHTML = "";

    if( slideShow[slide].textList && slideShow[slide].tagList ) {
        for( index in slideShow[slide].textList ) myDiv.innerHTML += slideShow[slide][slideShow[slide].textList[index]];
        for( index in slideShow[slide].tagList ) myDiv.innerHTML += slideShow[slide][slideShow[slide].tagList[index]];
    } else if( slideShow[slide].textList ) {
        for( index in slideShow[slide].textList ) myDiv.innerHTML += slideShow[slide][slideShow[slide].textList[index]];
    } else if( slideShow[slide].tagList ) {
        for( index in slideShow[slide].tagList ) myDiv.innerHTML += slideShow[slide][slideShow[slide].tagList[index]];
    }

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

    do{ myWidth = myWidth - 5;
        myDiv.style.width = `${myWidth}px`;
    } while ( myDiv.style.width==`${myDiv.scrollWidth}px` && myWidth > 0 && myHeight == myDiv.clientHeight );

    slideShow[slide].width = myDiv.style.width = `${myWidth + 15}px`;
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
    //document.getElementById('clearAllBtn').toggleAttribute('disabled');
    //document.getElementById('fontUpBtn').toggleAttribute('disabled');
    //document.getElementById('fontDownBtn').toggleAttribute('disabled');
    document.getElementById('updateLiveViewBtn').toggleAttribute('disabled');
    document.getElementById('hideLiveViewBtn').toggleAttribute('disabled');
}
