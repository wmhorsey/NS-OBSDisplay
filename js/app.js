var myDiv = document.getElementById('preview');
    myDiv.style.maxWidth = (document.maxWidth * 0.96);

var myLVD = document.getElementById('liveView');

myLVD.addEventListener("webkitAnimationEnd", clearAnimations);

var myBGColor = {R: '00', G: '00', B: '00', A: 'ff'};

var slideShow = [],             //array to store data read from slide-file
    maxSlideHeight = 225,       //max height of projected slides in px
    currentSlide = 0,           //index counter to track position in slideShow array
    maxFontSize = 65;           //set a max limit on slide font size

function btnPrev() {
    if(currentSlide > 0) currentSlide--;
    callSlide( currentSlide );
}

function clearAnimations() {
    if( myLVD.className == "inAnimation" ) {
        console.log("Clearing 'inAnimation'");
        myLVD.classList.remove("inAnimation");
        myLVD.style.display = "block";
    }

    if( myLVD.className == "outAnimation" ) {
        console.log("Clearing 'outAnimation'");
        myLVD.classList.remove("outAnimation");
        myLVD.style.display = "none";
    }
}

function btnChangeBkColor( r = myBGColor.R, b = myBGColor.B, g = myBGColor.G, a = myBGColor.A) {
    myBGColor.R = r, myBGColor.B = b, myBGColor.G = g, myBGColor.A = a;
    myDiv.style.backgroundColor = `#${r}${b}${g}${a}`;
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
    myLVD.classList.add("inAnimation");

    document.getElementById(`btnSlide${currentSlide}`).className = "slidePreView";
    document.getElementById(`btnSlide${slide}`).className = "slideLiveView";
    myLVD.style.display = "block";
}

// GOES TO THE NEXT SLIDE
function btnNext() {
    if(currentSlide < (slideShow.length - 1) ) currentSlide++;
    callSlide( currentSlide );
}

//Shows currently selected slide in <div id="PREVIEW">
function showSlide( slide ) {

    myDiv.innerHTML = slideShow[slide].innerHTML;
    myDiv.style.fontSize = slideShow[slide].fontSize;
    myDiv.style.left = slideShow[slide].left;
    myDiv.style.width = slideShow[slide].width;
}

//updates <div id="LIVEVIEW"> to show currently selected slide
function btnUpdateLiveView( slide = currentSlide ) {
    
 //   btnHideLiveView();
 
    callLiveSlide( slide );
    btnNext();
}

// Hides the liveview slide from view.
function btnHideLiveView() {
    if(myLVD.style.display == "none") {
        myLVD.classList.add("inAnimation");
        console.log("inAnimation added");
    }else{
        myLVD.classList.add("outAnimation");
        console.log("outAnimation added");
    }
}

// Reads from selected file, toggles controls if load is successful and triggers slides to be built
var openFile = function(event) {
    
    const input = event.target.files[0];

    var reader = new FileReader();

    reader.onload = (event) => {
        slideShow += event.target.result;
        
        toggleControls();
        buildSlideShow( slideShow );
    };

    reader.onerror = (event) => { 
        alert(event.target.error.name);
    };

    reader.readAsText(input);
}
 
 // uses file contents to put slides together
function buildSlideShow() {
    //slideShow = slideShow.replace(/(\n|\r)/gm, "");                // strip out any sort of newline in the strings (except <br> codes... ignore those)
    slideShow = slideShow.split("<end-slide />").filter(x => x);

    for( slide in slideShow ) buildSlide( slide );
}

function buildSlide( slide ) {

    slideShow[slide] = slideShow[slide].split( "</span>" ).filter(x => x);

    slideShow[slide].textList = [];

    for(line in slideShow[slide]){
        if( slideShow[slide][line].includes('<span') ) slide[line] = slideShow[slide][line] + '</span>';    // fix span tags used to delimit
        if( slideShow[slide][line].includes('<span class="text') ) slideShow[slide].textList.push(line);
        if( slideShow[slide][line].includes("<span class='text") ) slideShow[slide].textList.push(line);
    };

    loadText( slide );
    resizeFont( slide );
    makeAButton( slide );

    if( document.getElementById('shrinkSlideCheckbox').checked ) shrinkSlide( slide );
    if( document.getElementById('centerSlideCheckbox').checked ) centerSlide( slide );
    console.log( slideShow[slide] );
}

function makeAButton( slide ) {

    var btn = document.createElement('BUTTON');
    btn.innerHTML = ( slide );
    btn.setAttribute('onmouseleave',`viewSlide( currentSlide )`);
    btn.setAttribute('onmouseover',`viewSlide(${slide})`);
    btn.setAttribute('onclick',`callSlide(${slide})`);
    btn.setAttribute('onauxclick',`callLiveSlide(${slide})`);
    btn.setAttribute('class','slideButton');
    btn.setAttribute('id',`btnSlide${slide}`);
    document.getElementById('buttonBox').appendChild(btn);
}

function loadText( slide ){
        
    myDiv.innerHTML = "";
    
    for( index in slideShow[slide].textList ) myDiv.innerHTML += slideShow[slide][slideShow[slide].textList[index]];

    slideShow[slide].innerHTML = myDiv.innerHTML;
    console.log(myDiv);
}

function resizeFont( slide ) {

    delete slideShow[slide].left;
    delete slideShow[slide].width;

    myDiv.style.left = 0;
    myDiv.style.width = `100%`;
    myDiv.innerHTML = slideShow[slide].innerHTML;
    var fontSize = maxFontSize;
    console.log(`Slide: ${slide} SWidth: ${myDiv.scrollWidth}`);

    //if a value is stored for fontSize, make it the default value.
    if(!isNaN( parseInt(slideShow[slide].fontSize ))) fontSize = parseInt(slideShow[slide].fontSize);
    
    myDiv.style.fontSize = `${fontSize}px`;

    while( myDiv.clientHeight > maxSlideHeight ) { 
        myDiv.style.fontSize = `${--fontSize}px`; 
    };

    if( isNaN(parseInt(slideShow[slide].fontSize)) ) slideShow[slide].fontSize = myDiv.style.fontSize;
    else myDiv.style.fontSize = `${slideShow[slide].fontSize}px`;

    //console.log(`Slide ${slide} fontSize: ${myDiv.style.fontSize}`);

}

//horizontal shrink
function shrinkSlide( slide ){
    myHeight = myDiv.clientHeight;
    myWidth = myDiv.clientWidth;

    //while( myDiv.scrollWidth > myDiv.style.width )
    //{
    //    myDiv.style.fontSize = myDiv.style.fontSize - 1;
    //}

    //if( slideShow[slide].width > myDiv.maxWidth ) slideShow[slide].width == `${myDiv.maxWidth*.98}px`;

    //do{ myWidth = myWidth * .99;
    //    myDiv.style.width = `${myWidth}px`;
    //} while ( myDiv.style.width==`${myDiv.scrollWidth}px` && myWidth > 0 && myHeight == myDiv.clientHeight );

    //slideShow[slide].width = myDiv.style.width = `${myWidth * 1.01}px`;

    //console.log(`Slide ${slide} width: ${myWidth}`);
}

//adjust left edge to center slide in the window, parseInt cleans up any 1/2 pixel sizes.
function centerSlide( slide ) {
    slideShow[slide].left = myDiv.style.left = `${parseInt(((window.innerWidth) - myDiv.clientWidth) / 2)}px`;
}

function toggleControls() {

    document.getElementById('fileSelect').toggleAttribute('disabled');
    document.getElementById('prevBtn').toggleAttribute('disabled');
    document.getElementById('nextBtn').toggleAttribute('disabled');
    document.getElementById('updateLiveViewBtn').toggleAttribute('disabled');
    document.getElementById('hideLiveViewBtn').toggleAttribute('disabled');
}