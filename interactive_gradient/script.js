document.addEventListener('DOMContentLoaded', () => {
  const interactiveBubble = document.querySelector('.interactive-bubble');
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  const animateBubble = () => {
    currentX += (targetX - currentX) / 15;
    currentY += (targetY - currentY) / 15;
    interactiveBubble.style.transform = `translate(${Math.round(currentX)}px, ${Math.round(currentY)}px)`;
    requestAnimationFrame(animateBubble);
  };

  window.addEventListener('mousemove', event => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  // Add touch support for mobile devices
  window.addEventListener('touchmove', event => {
    targetX = event.touches[0].clientX;
    targetY = event.touches[0].clientY;
  });

  animateBubble();

  // Color palettes (without rgb())
  const colorPalettes = [
    [ [18, 113, 255], [107, 74, 255], [100, 100, 255], [50, 160, 220], [80, 47, 122] ],
    [ [255, 99, 132], [54, 162, 235], [255, 206, 86], [75, 192, 192], [153, 102, 255] ],
    [ [34, 197, 94], [234, 179, 8], [239, 68, 68], [56, 189, 248], [64, 64, 122] ],
    [ [255, 165, 0], [34, 139, 34], [135, 206, 250], [233, 150, 122], [210, 105, 30] ],
  ];

  // Background gradient color sets (dark colors with blue or red tint)
  const backgroundGradients = [
    { bg1: [8, 10, 15], bg2: [0, 17, 32] }, // Original colors
    { bg1: [15, 15, 35], bg2: [5, 5, 25] }, // Dark blue tones
    { bg1: [20, 5, 5], bg2: [35, 10, 10] }, // Dark reddish tones
    { bg1: [10, 10, 20], bg2: [20, 20, 40] }, // Dark purple tones
    { bg1: [5, 15, 20], bg2: [10, 25, 35] }, // Dark teal tones
  ];

  // Select random color palette
  function chooseRandomPalette() {
    const randomIndex = Math.floor(Math.random() * colorPalettes.length);
    return colorPalettes[randomIndex];
  }

  // Apply random colors to CSS variables
  function applyRandomPalette() {
    const root = document.documentElement;
    const selectedPalette = chooseRandomPalette();

    root.style.setProperty('--color1', `${selectedPalette[0].join(', ')}`);
    root.style.setProperty('--color2', `${selectedPalette[1].join(', ')}`);
    root.style.setProperty('--color3', `${selectedPalette[2].join(', ')}`);
    root.style.setProperty('--color4', `${selectedPalette[3].join(', ')}`);
    root.style.setProperty('--color5', `${selectedPalette[4].join(', ')}`);
  }

  // Select random background gradient
  function chooseRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgroundGradients.length);
    return backgroundGradients[randomIndex];
  }

  // Apply random background gradient to CSS variables
  function applyRandomBackground() {
    const root = document.documentElement;
    const selectedBackground = chooseRandomBackground();

    root.style.setProperty('--color-bg1', `rgb(${selectedBackground.bg1.join(', ')})`);
    root.style.setProperty('--color-bg2', `rgb(${selectedBackground.bg2.join(', ')})`);
  }

  // Array of gradient position configurations (array of arrays)
const gradientConfigurations = [
  [
    { top: 'calc(50% - var(--circle-size) / 2 - 50px)', left: 'calc(50% - var(--circle-size) / 2 + 200px)' },
    { top: 'calc(50% - var(--circle-size) / 2 + 100px)', left: 'calc(50% - var(--circle-size) / 2 - 300px)' },
    { top: 'calc(50% - var(--circle-size) / 2 + 200px)', left: 'calc(50% - var(--circle-size) / 2 - 300px)' },
    { top: 'calc(50% - var(--circle-size) / 2 - 150px)', left: 'calc(50% - var(--circle-size) / 2 + 200px)' },
    { top: 'calc(50% - var(--circle-size))', left: 'calc(50% - var(--circle-size))' }
  ],
  [
    { top: 'calc(50% - var(--circle-size) / 2 - 100px)', left: 'calc(50% - var(--circle-size) / 2 + 100px)' },
    { top: 'calc(50% - var(--circle-size) / 2 + 50px)', left: 'calc(50% - var(--circle-size) / 2 - 200px)' },
    { top: 'calc(50% - var(--circle-size) / 2 + 150px)', left: 'calc(50% - var(--circle-size) / 2 - 100px)' },
    { top: 'calc(50% - var(--circle-size) / 2 - 50px)', left: 'calc(50% - var(--circle-size) / 2 + 250px)' },
    { top: 'calc(50% - var(--circle-size))', left: 'calc(50% - var(--circle-size) / 2 - 150px)' }
  ],
  [
    { top: 'calc(50% - var(--circle-size) / 2)', left: 'calc(50% - var(--circle-size) / 2 + 150px)' },
    { top: 'calc(50% - var(--circle-size) / 2 - 200px)', left: 'calc(50% - var(--circle-size) / 2 - 200px)' },
    { top: 'calc(50% - var(--circle-size) / 2 + 200px)', left: 'calc(50% - var(--circle-size) / 2)' },
    { top: 'calc(50% - var(--circle-size) / 2 - 150px)', left: 'calc(50% - var(--circle-size) / 2 + 250px)' },
    { top: 'calc(50% - var(--circle-size) / 2 + 100px)', left: 'calc(50% - var(--circle-size) / 2 - 300px)' }
  ]
];

// Function to randomly select a configuration
function selectRandomConfiguration() {
  const randomIndex = Math.floor(Math.random() * gradientConfigurations.length);
  return gradientConfigurations[randomIndex];
}

// Function to apply positions to gradient circles
function applyGradientPositions() {
  const gradients = document.querySelectorAll('.gradient-circle');
  
  // Select a random configuration of positions
  const selectedPositions = selectRandomConfiguration();
  
  gradients.forEach((gradient, index) => {
    const position = selectedPositions[index % selectedPositions.length]; // Apply selected configuration
    gradient.style.top = position.top;
    gradient.style.left = position.left;
  });
}

  

  // Initialize colors and positions
  applyRandomPalette();
  applyRandomBackground();
  applyGradientPositions();
});
