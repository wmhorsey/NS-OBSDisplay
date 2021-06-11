/* Default Values */

var slideShow = [],             //array to store data read from slide-file
    maxSlideHeight = 200,       //max height of projected slides in px
    currentSlide = 0,           //index counter to track position in slideShow array
    maxFontSize = 45;           //set a max limit on slide font size
var myBGColor = {R: '00', G: '00', B: '00', A: 'ff'};

var divPreview = document.getElementById('preview');
var divLiveView = document.getElementById('liveView');

divLiveView.addEventListener("webkitAnimationEnd", clearAnimations);


/*var t_b = new BroadcastChannel('toBrowser');
var t_c = new BroadcastChannel('toControl');

t_b.onmessage = function ( ev ) {
    const received_data = ev.data;
    console.log( received_data );
}*/

function clearAnimations() {
    if( divLiveView.classList.contains("inAnimation")) {
        console.log("Clearing 'inAnimation'");
        divLiveView.classList.remove("inAnimation", "hidden");
    }

    if( divLiveView.classList.contains("outAnimation")) {
        console.log("Clearing 'outAnimation'");
        divLiveView.classList.remove("outAnimation");
        divLiveView.classList.add("hidden");
    }
}

function btnChangeBkColor( r = myBGColor.R, g = myBGColor.G, b = myBGColor.B, a = myBGColor.A) {
    myBGColor.R = r;
    myBGColor.G = g;
    myBGColor.B = b;
    myBGColor.A = a;

    divPreview.style.backgroundColor = `#${r}${g}${b}${a}`;
    
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

    divLiveView.style.backgroundColor = divPreview.style.backgroundColor;
    divLiveView.innerHTML = slideShow[slide].innerHTML;
    divLiveView.style.fontSize = slideShow[slide].fontSize;
    divLiveView.style.left = slideShow[slide].left;
    divLiveView.style.width = slideShow[slide].width;
    divLiveView.classList.remove("hidden");
    divLiveView.classList.add("inAnimation");

    document.getElementById(`btnSlide${currentSlide}`).className = "slidePreView";
    document.getElementById(`btnSlide${slide}`).className = "slideLiveView";
}



// GOES TO THE NEXT SLIDE
function btnNext() {
    if(currentSlide < (slideShow.length - 1) ) currentSlide++;
    callSlide( currentSlide );
}

// GOES TO THE PREVIOUS SLIDE
function btnPrev() {
    if(currentSlide > 0) currentSlide--;
    callSlide( currentSlide );
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

function btnBoxDown(){
    slideShow[currentSlide].width = `${(parseInt(slideShow[currentSlide].width)-10)}px`;
    //resizeFont( currentSlide );
    if( document.getElementById('shrinkSlideCheckbox').checked ) shrinkSlide( currentSlide );
    if( document.getElementById('centerSlideCheckbox').checked ) centerSlide( currentSlide );
    showSlide( currentSlide );
}

//Shows currently selected slide in <div id="PREVIEW">
function showSlide( slide ) {

    divPreview.innerHTML = slideShow[slide].innerHTML;
    divPreview.style.fontSize = slideShow[slide].fontSize;
    divPreview.style.left = slideShow[slide].left;
    divPreview.style.width = slideShow[slide].width;
}

//updates <div id="LIVEVIEW"> to show currently selected slide
function btnUpdateLiveView( slide = currentSlide ) {
    
 //   btnHideLiveView();
 
    callLiveSlide( slide );
    btnNext();
}

// Hides the liveview slide from view.
function btnHideLiveView() {
    if(divLiveView.classList.contains("hidden")){
        divLiveView.classList.add("inAnimation");
        console.log("inAnimation added");
    }else{
        divLiveView.classList.add("outAnimation");
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

    slideShow = slideShow.split("<end-slide />").filter(x => x);

    for( slide in slideShow ) buildSlide( slide );
}

function buildSlide( slide ) {

    slideShow[slide] = slideShow[slide].split( "</span>" ).filter(x => x);

    slideShow[slide].textList = [];

    for(line in slideShow[slide]){
        if( slideShow[slide][line].includes('<span') ) slide[line] = slideShow[slide][line] + '</span>';    // fix span tags used to delimit
        if( slideShow[slide][line].includes('<span') ) slideShow[slide].textList.push(line);
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
    btn.innerHTML = ( parseInt(slide) + 1 );   // start numbering at 1... just more natural for non-coders
    btn.setAttribute('onmouseleave',`viewSlide( currentSlide )`);
    btn.setAttribute('onmouseover',`viewSlide(${slide})`);
    btn.setAttribute('onclick',`callSlide(${slide})`);
    btn.setAttribute('onauxclick',`callLiveSlide(${slide})`);
    btn.setAttribute('class','slideButton');
    btn.setAttribute('id',`btnSlide${slide}`);
    document.getElementById('buttonBox').appendChild(btn);
}

function loadText( slide ){
        
    divPreview.innerHTML = "";
    
    for( index in slideShow[slide].textList ) divPreview.innerHTML += slideShow[slide][slideShow[slide].textList[index]];

    slideShow[slide].innerHTML = divPreview.innerHTML;
    console.log(divPreview);
}

function resizeFont( slide ) {

    delete slideShow[slide].left;
    delete slideShow[slide].width;

    divPreview.style.left = 0;
    divPreview.style.width = divPreview.style.maxWidth;

    divPreview.innerHTML = slideShow[slide].innerHTML;
    var fontSize = maxFontSize;
    console.log(`Slide: ${slide} SWidth: ${divPreview.scrollWidth}`);

    //if a value is stored for fontSize, make it the default value.
    if(!isNaN( parseInt(slideShow[slide].fontSize ))) fontSize = parseInt(slideShow[slide].fontSize);
    
    divPreview.style.fontSize = `${fontSize}px`;

    while( divPreview.clientHeight > maxSlideHeight ) { 
        divPreview.style.fontSize = `${--fontSize}px`; 
    };

    if( isNaN(parseInt(slideShow[slide].fontSize)) ) slideShow[slide].fontSize = divPreview.style.fontSize;
    else divPreview.style.fontSize = `${slideShow[slide].fontSize}px`;

    console.log(`Slide ${slide} fontSize: ${divPreview.style.fontSize}`);

}

//horizontal shrink
function shrinkSlide( slide ){
//    myHeight = divPreview.clientHeight;
//    myWidth = divPreview.clientWidth;

//    while( divPreview.scrollWidth > divPreview.style.width )
//    {
//       divPreview.style.fontSize = divPreview.style.fontSize - 1;
//    }

//    if( slideShow[slide].width > divPreview.maxWidth ) slideShow[slide].width == `${divPreview.maxWidth*.98}px`;

//    do{ myWidth = myWidth * .99;
//       divPreview.style.width = `${myWidth}px`;
//    } while ( divPreview.style.width==`${divPreview.scrollWidth}px` && myWidth > 0 && myHeight == divPreview.clientHeight );

//    slideShow[slide].width = divPreview.style.width = `${myWidth * 1.01}px`;

//    console.log(`Slide ${slide} width: ${myWidth}`);
}

//adjust left edge to center slide in the window, parseInt cleans up any 1/2 pixel sizes.
function centerSlide( slide ) {
    slideShow[slide].left = divPreview.style.left = `${parseInt(((window.innerWidth) - divPreview.clientWidth) / 2)}px`;
}

function toggleControls() {

    document.getElementById('fileSelect').toggleAttribute('disabled');
    document.getElementById('prevBtn').toggleAttribute('disabled');
    document.getElementById('nextBtn').toggleAttribute('disabled');
    document.getElementById('updateLiveViewBtn').toggleAttribute('disabled');
    document.getElementById('hideLiveViewBtn').toggleAttribute('disabled');
    document.getElementById('fontDecrease').toggleAttribute('disabled');
    document.getElementById('fontIncrease').toggleAttribute('disabled');
}