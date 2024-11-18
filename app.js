//Global array that contains all the letters.
let letters = [];
let fullString = "";
//2D array to store the heatmap values.
let heatmap = createHeatMap();
//Get the most reccuring position in the heatmap.
let mostOccuringPair = [0, 0];
let occurencesMostReccuringPair = 0;
//Array to count the occurences of letters.
let occurencesLetters = new Array(26).fill(0)
let mostOccuringLetter = 0;

//Global variables for the size and position of everything.
let size = 20;
let x = size / 2;
let y = size / 2;
let marginX;
let marginY;
let textBlockWidth;
let textBlockHeight;

//Booleans for some of the voice control.
let animate = false;
let showMap = false;
let trail = false;
let radius = false;
let colorReccuring = false;
let showSliders = false;
let showHelp = true;
let wrap = false;

//initialize the heatmap with something
let feedMapString = document.getElementById("feedMap").innerText;

//Color array: 0 white, 1 black, 2 red, 3 blue, 4 yellow, 5 green, 6 pink
let colorbackArray = ["#FFFFFF", "#000000", "#FF0000", "#0000FF", "#FFAA00", "#006D43", "#C77F9B", "#DDDDFF"];
let colorback = colorbackArray[7];

//Function that control certain aspects of the program by voice.
function voiceCommand(word) {
    if (word == "animation") {
        animate = true;
    }
    else if (word == "freeze") {
        animate = false;
    }
    else if (word == "map") {
        showMap = true;
    }
    else if (word == "hide") {
        showMap = false;
        showSliders = false;
        showHelp = false
    }
    else if (word == "track") {
        trail = true;
    }
    else if (word == "help") {
        showHelp = true;
    }
    else if (word == "background") {
        trail = false;
    }
    else if (word == "delete") {
        letters = [];
    }
    else if (word == "radius") {
        radius = true;
    }
    else if (word == "recurring") {
        colorReccuring = true;
    }
    else if (word == "simple") {
        colorReccuring = false;
        radius = false
    }
    else if (word == "around") {
        wrap = true;
    }
    else if (word == "solid") {
        wrap = false;
    }
    else if (word == "white") {
        colorback = colorbackArray[0];
    }
    else if (word == "black") {
        colorback = colorbackArray[1];
    }
    else if (word == "red") {
        colorback = colorbackArray[2];
    }
    else if (word == "blue") {
        colorback = colorbackArray[3];
    }
    else if (word == "yellow") {
        colorback = colorbackArray[4];
    }
    else if (word == "green") {
        colorback = colorbackArray[5];
    }
    else if (word == "pink") {
        colorback = colorbackArray[6];
    }
    else if (word == "controls") {
        showSliders = true;
    }
    else if (word == "reset") {
        resetAllForces();
    }
    else if (word == "winter") {
        feedMap(feedMapString);
    }
    else if (word == "refresh") {
        refreshMap();
    }
}

//Function to handle the resizing of the window.
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    refreshDimensions();
}

//Recalculate the dimensions of the text block and the margins.
function refreshDimensions() {
    marginX = width / 7;
    marginY = height / 2;
    textBlockWidth = width - (2 * marginX);
    textBlockHeight = height - (2 * marginY);
}

//Function that return true if the word is too big to be displayed in the text block.
function wordTooBig(x, size, word) {
    if(x + (word.length * size) > textBlockWidth) {
        return true;
    }
    else return false;
}

//Function that manages the progression of the variables x and y.
function progression (x, y, size) {
    x += size;
    if(x > textBlockWidth) {
        x = marginX + size / 2;
        y += size
    }
    return {x, y};
    console.log(x);
}

//Function that resets x and y to their original values.
function resetXY() {
    x = marginX + size / 12;
    y = marginY + size / 12;
}

//Function that shows the letter count.
function showLetterCount() {
    let sizeCircle = 60;
    const characterWidth = textWidth(letters.length);
    offsetX = (characterWidth) / 2
    fill(255);
    stroke(0);
    circle(width - sizeCircle, height - sizeCircle, sizeCircle-10);
    fill(0);
    noStroke();
    text(letters.length, width - sizeCircle - offsetX, height - sizeCircle);
}

//Function that generate the empty heatmap.
function createHeatMap() {
    let array = [];
    for(let i = 0; i < 26; i ++) {
        let row = []
        for(let j = 0; j < 26; j ++) {
            let element = 0;
            row.push(element) 
        }
        array.push(row);
    }
    return array;
}

//Function that updates the heatmap.
function updateHeat(str) {
    for(let i = 0; i < str.length - 1; i ++) {
        //Get the indices of the current pair.
        let col = str.charAt(i).toLowerCase();
        let row = str.charAt(i+1).toLowerCase();

        //Update the array that count the letters
        occurencesLetters[charToPosition(col)] ++;
        if(occurencesLetters[charToPosition(col)] > mostOccuringLetter) {
            mostOccuringLetter = occurencesLetters[charToPosition(col)];
        }

        //if it is the last iteration count the last character
        if(i == str.length-2) {
            occurencesLetters[charToPosition(str.charAt(i+1).toLowerCase())] ++;
            if(occurencesLetters[charToPosition(str.charAt(i+1).toLowerCase())] > mostOccuringLetter) {
                mostOccuringLetter = occurencesLetters[charToPosition(str.charAt(i+1).toLowerCase())];
            }
        }

        //update the heatmap
        heatmap[charToPosition(col)][charToPosition(row)] ++;
        if(heatmap[charToPosition(col)][charToPosition(row)] > occurencesMostReccuringPair) {
            occurencesMostReccuringPair = heatmap[charToPosition(col)][charToPosition(row)] + 1;
            mostOccuringPair = [charToPosition(col), charToPosition(row)];
        }
    }
}

//Function that refreshes the heatmap.
function refreshMap() {
    for(row of heatmap) {
        for(let i = 0; i < 26; i++) {
            row[i] = 0;
        }
    }
    mostOccuringPair = [0, 0];
    occurencesMostReccuringPair = 0;
    occurencesLetters.fill(0)
    mostOccuringLetter = 0;
    updateHeat("refresh");
}

//Function that draws the heatmap.
function drawHeatMap() {
    let cellSide = 30;
    let widthMap = cellSide * 26;
    let offsetX = (width - widthMap) / 2;
    let offsetY = (height - widthMap) / 2
    
    for(let y = 0; y < 26; y ++) {
        for(let x = 0; x < 26; x ++) {
            let amountFilling = map(heatmap[x][y], 0, occurencesMostReccuringPair, 255, 0)
            fill(255,amountFilling,amountFilling);
            rect(offsetX + x * cellSide, offsetY + y * cellSide, cellSide, cellSide)
            let pair = positionToChar(x) + positionToChar(y);
            let pairWidth = textWidth(pair);
            let addX = pairWidth / 2;
            fill(0);
            text(pair, offsetX + x * cellSide + addX, offsetY + y * cellSide + cellSide / 2 + 3);
        }
    }
}

//Return true if a character is a letter.
function isLetter(char) {
    return /^[a-zA-Z]$/.test(char);
}

//Returns the position of a lower case character in the alphabet.
function charToPosition(char) {
    return char.charCodeAt(0) - 'a'.charCodeAt(0);
}

//Returns a lower case character based on an alphabet position.
function positionToChar(position) {
    return String.fromCharCode('a'.charCodeAt(0) + position);
}

//Feed the heatmap with something.
function feedMap(file) {
    let words = [];
    let newWord = "";
    for (const char of file) {
        if(isLetter(char)) {
            newWord += char;
        }
        else if (!isLetter(char)) {
            words.push(newWord);
            newWord = "";
        }
    }
    //Update the heatmap with each of the words.
    for (const word of words) {
        updateHeat(word);
    }
}

function sliders() {
    let slidersBlock = document.getElementById("sliders");
    if(showSliders) {
        slidersBlock.style.display = "block";
    }
    else {
        slidersBlock.style.display = "none";
    }
}

function help() {
    let helpBlock = document.getElementById("instructions");
    if(showHelp) {
        helpBlock.style.display = "flex";
    }
    else {
        helpBlock.style.display = "none";
    }
}

let speech = new p5.Speech();
let speechStarted = false;

//Setup Function
function setup() {
    //Define the speechRecognition object.
    let speechRec = new p5.SpeechRec("en-US", gotSpeech);

    //Create the canvas.
    let cnv =createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    refreshDimensions();
    x = marginX + size / 2;
    y = marginY + size / 2;
    
    
    //Set the parameters and start the speech recognition.
    let continuous = true;
    let interim = false;
    speechRec.start(continuous, interim);

    //Continuously restart the speech recognition when it ends.
    speechRec.onEnd = () => {
        console.log("Speech recognition ended. Restarting...");
        speechRec.start(continuous, interim);
    };

    //Callback function of the speech recognizer.
    function gotSpeech() {
        //When something is detected:
        if(animate == true) {
            resetXY();
        }
        if(speechRec.resultValue) {
            let currenString = speechRec.resultString + " ";
            //Create and populate an array of words from the result string.
            let words = [];
            let newWord = "";
            for (const char of currenString) {
                if(isLetter(char)) {
                    newWord += char;
                }
                else if (!isLetter(char)) {
                    words.push(newWord);
                    newWord = '';
                }
            }
            //Append the letters to the letters array.
            for (const word of words) {
                updateHeat(word);
                voiceCommand(word);
                if(wordTooBig(x, size, word)) {
                    x = marginX + size / 2;
                    y += size;
                }
                for (const char of word) {
                    const newLetter = new Letter(char.toUpperCase(), x, y, size);
                    letters.push(newLetter);
                    let newPosition = progression(x, y, size);
                    x = newPosition.x;
                    y = newPosition.y;
                }
                let newPosition = progression(x, y, size);
                x = newPosition.x;
                y = newPosition.y;
            }
        }
    }
}

//Draw function, loop.
function draw() {
    if(!trail) {
        background(colorback);   
    }
    if(showMap) {
        drawHeatMap();
    }
    //rect(marginX, marginY, textBlockWidth, textBlockHeight);
    for(l of letters) {
        l.display();
        if(radius) {
            l.displayRadius();
        }
        if(animate == true) {
            l.flock(letters)
            l.update();
        }
    }
    showLetterCount();
    sliders();
    help();
}
