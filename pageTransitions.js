async function preloadSVGs(urls) {
  try {
    for (const url of urls) {
      const cachedSVG = sessionStorage.getItem(url);
      if (!cachedSVG) {
        const response = await fetch(url);
        const svgContent = await response.text();
        sessionStorage.setItem(url, svgContent); // Cache the SVG content in SessionStorage
      }
    }
  } catch (error) {
    console.error('Error preloading SVG:', error);
  }
}
function getStoredSVG(url) {
  const svgString = sessionStorage.getItem(url);
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  return svgDoc.documentElement;
}

function animateBackground(currentBackground, targetBackground) {
}

document.addEventListener('DOMContentLoaded', function () {
  // Initializing Links
  const home = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');
  const container = document.querySelector('.container');
  const currentBackground = document.querySelector('.container .background-svg');
  console.log(currentBackground);
  // Initializing Background Elements
  const svgUrls = [
    'backgroundOne.svg',
    'backgroundTwo.svg',
    'backgroundFive.svg',
    'backgroundThree.svg',
    'backgroundFour.svg'
  ];
  // Preload SVGs for Background
  let preloadedSVGs = sessionStorage.getItem('backgroundFour.svg');
  if (!preloadedSVGs) {
    preloadedSVGs = [];
    preloadSVGs(svgUrls);
  } else {
    console.log('SVGs already preloaded');
  }

  // Remove the fade-out class and add fade-in class after navigating to a new page
  container.addEventListener("transitionend", function() {
    container.classList.remove("fade-out");
    container.classList.add("fade-in");
  });

  home.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackground = getStoredSVG('backgroundOne.svg');
    container.classList.add("fade-out");
    
    // After a delay (to allow the fade-out animation to finish), navigate to the clicked link
    setTimeout(() => {
      window.location.href = home.getAttribute("href");
    }, 2000); // Delay in milliseconds, matching the fade-out transition duration
    animateBackground(currentBackground, targetBackground);
  });

  projects.forEach(link => {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      const targetBackground = getStoredSVG('backgroundTwo.svg');
      container.classList.add("fade-out");

      // After a delay (to allow the fade-out animation to finish), navigate to the clicked link
      setTimeout(() => {
        window.location.href = link.getAttribute("href");
      }, 2000); // Delay in milliseconds, matching the fade-out transition duration
      animateBackground(currentBackground, targetBackground);
    });
  });

  more.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackground = getStoredSVG('backgroundFive.svg');
    container.classList.add("fade-out");

    // After a delay (to allow the fade-out animation to finish), navigate to the clicked link
    setTimeout(() => {
      window.location.href = more.getAttribute("href");
    }, 2000); // Delay in milliseconds, matching the fade-out transition duration    
    animateBackground(currentBackground, targetBackground);
  });
});