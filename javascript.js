const elementById = (id) => document.getElementById(id);
const elementsByclass = (className) => document.getElementsByClassName(className);
const themeList = ["Default", "Ben", "Cartoons", "DC", "Marvel", "Pokemon", "Programming", "TechBrands"];
const getThemeName = () => localStorage.getItem("theme") || "Default";
const getColorName = () => localStorage.getItem("color") || "#1e90ff";
let tileClickCount = 0,
    firstTileIndex = 0,
    secondTileIndex = 0,
    totalScore = 0;
let imageList = getThemeImageList(getThemeName());
const isPairFound = () => imageList[secondTileIndex] == imageList[firstTileIndex];

function showThemeSelectors() {
    if (elementById("themeSelector").style.visibility == "visible") {
        elementById("themeSelector").style.visibility = "hidden";
    } else {
        elementById("themeSelector").style.visibility = "visible";
    }
}

function changeTheme(theme) {
    localStorage.setItem("theme", theme);
    resetGame();
}

function changeBlocksColor(colorPicker) {
    localStorage.setItem("color", colorPicker.value);
    const blocks = elementsByclass("block-button");
    for (let index = 0; index < blocks.length; index++) {
        blocks[index].style.backgroundColor = colorPicker.value;
    }
}
// creating shuffled imageList for a theme
function setButtonImageOnClick() {
    const blocks = elementsByclass("block-button");
    for (let index = 0; index < blocks.length; index++) {
        blocks[index].style.backgroundImage = "none";
    }
    if (tileClickCount == 1) {
        blocks[secondTileIndex].style.backgroundImage = imageList[secondTileIndex];
    }
    blocks[firstTileIndex].style.backgroundImage = imageList[firstTileIndex];
}

function setPairedButtonsOff() {
    elementsByclass("block-button")[firstTileIndex].style.backgroundImage = imageList[firstTileIndex];
    elementsByclass("block-button")[secondTileIndex].style.backgroundImage = imageList[secondTileIndex];
    elementsByclass("block-button")[firstTileIndex].disabled = true;
    elementsByclass("block-button")[secondTileIndex].disabled = true;
    elementsByclass("block-button")[firstTileIndex].innerHTML = "PAIRED";
    elementsByclass("block-button")[secondTileIndex].innerHTML = "PAIRED";
}

function secondBlockClicked() {
    // elementsByclass("block-button")[firstTileIndex].style.backgroundImage = "none";
    // elementsByclass("block-button")[secondTileIndex].style.backgroundImage = "none";
    if (isPairFound()) {
        totalScore++;
        setPairedButtonsOff();
        if (totalScore == 10) {
            resetGame();
        }
    }
}

function getThemeImageList(themeName) {
    let imageList = [];
    for (let index = 0; index < 10; index++) {
        imageList.push(`url(images/${themeName}/image${index}.png)`);
        imageList.push(`url(images/${themeName}/image${index}.png)`);
    }
    for (let i = 19; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = imageList[i];
        imageList[i] = imageList[j];
        imageList[j] = temp;
    }
    return imageList;
}
// adding pictures and event handlers on themeselectors buttons
function setThemeSelectors() {
    const themeButtons = elementsByclass("theme-pic");
    for (let index = 0; index < themeButtons.length; index++) {
        const themeButton = themeButtons[index];
        themeButton.id = themeList[index];
        themeButton.style.backgroundImage = `url(images/${themeButton.id}/image0.png)`;
        themeButton.setAttribute("onclick", "changeTheme(this.id)");
    }
}

function blockClicked(clickedButton, clickedIndex) {
    if (tileClickCount == 0) {
        firstTileIndex = clickedIndex;
    }
    secondTileIndex = clickedIndex;
    if (firstTileIndex == secondTileIndex) {
        tileClickCount = 0;
    }
    setButtonImageOnClick();
    if (tileClickCount == 1) {
        secondBlockClicked();
    }
    tileClickCount = (tileClickCount + 1) % 2;
}
//creating blocks for the game
const createBlocks = () => {
    const blocksContainer = elementById("blocksContainer");
    for (let index = 0; index < 20; index++) {
        let newBlock = document.createElement("button");
        newBlock.className = "block-button";
        newBlock.setAttribute("onclick", `blockClicked(this,${index})`);
        newBlock.style.backgroundColor = getColorName();
        blocksContainer.appendChild(newBlock);
    }
};
const resetGame = () => {

    elementsByclass("block-button")[firstTileIndex].style.backgroundImage = "none";
    elementsByclass("block-button")[secondTileIndex].style.backgroundImage = "none";
    tileClickCount = 0,
        firstTileIndex = 0,
        secondTileIndex = 0,
        totalScore = 0;
    imageList = getThemeImageList(getThemeName());
}
// initial function to run on page load
const initiate = () => {
    createBlocks();
    setThemeSelectors();
    elementById("newGameButton").setAttribute("onclick", "resetGame()");
    elementById("colorButton").setAttribute("onchange", "changeBlocksColor(this)");
    elementById("themeButton").setAttribute("onclick", "showThemeSelectors()");
    elementById("colorButton").setAttribute("value", getColorName());
};

window.onload = initiate;