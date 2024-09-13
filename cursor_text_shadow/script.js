const container = document.getElementById('splash');
const text = document.getElementById('title');

const distance = 30;

function setShadow(e) {
    const width = this.offsetWidth;
    const height = this.offsetHeight;

    let x = e.offsetX;
    let y = e.offsetY;

    if (this !== e.target) {
        x = x + e.target.offsetLeft;
        y = y + e.target.offsetTop;
    }

    const xDistance = Math.round(( x / width * distance) - (distance / 2));
    const yDistance = Math.round(( y / height * distance) - (distance / 2));

    text.style.textShadow = `${xDistance}px ${yDistance}px #EB492C`;
}

container.addEventListener('mousemove', setShadow);

// Define an array of background colors
const colors = ['#FCB043', '#FF5733', '#33FF57', '#33C1FF', '#FFC300', '#C70039', '#900C3F', '#581845'];

// Define an array of text options for the title
const textOptions = [
  'Good Vibes Only', 
  'Stay Positive', 
  'Chase Your Dreams', 
  'Make Today Awesome', 
  'Radiate Happiness', 
  'Keep the Energy High', 
  'Seize the Day', 
  'Smile, It’s Free'
];

// Function to set random background color
function setRandomBackgroundColor() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.backgroundColor = randomColor;
}

// Function to set random title text
function setRandomTitleText() {
  const randomText = textOptions[Math.floor(Math.random() * textOptions.length)];
  document.getElementById('title').textContent = randomText;
}

// Call the functions to change background color and title text when the page loads
window.onload = function() {
  setRandomBackgroundColor();
  setRandomTitleText();
};