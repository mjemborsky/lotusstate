// animations.js
// Created by: Michael Emborsky
// Last Modified: 11/4/2023

// PURPOSE - Page Transition and Idle Animations //
// This javascript file is used to load, manipulate, and 
// animate 2 svg's, the background circles and the idle 
// floating 'paths'. 


// TO START (WHEN INDEX.HTML FIRST LOADS)
// Need to do animation of background circles with all r=0 to index.html svg
// Need to TEST this performance with performance.now to determine user's machine capabilities
// Need to establish categories of performance that determine what animation methods and how
// much animation will be shown (2g + low cores/low performance, 3g + medium cores/medium performance, 4/5g)


// Preload SVGs for Background - Stores svg's as list of names
const svgUrls = [
  'backgroundOne.svg',
  'backgroundTwo.svg',
  'backgroundFive.svg',
  'backgroundThree.svg',
  'backgroundFour.svg'
];
// Preload SVGs
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
    console.log("SVG's Preloaded");
  } catch (error) {
    console.error('Error preloading SVG:', error);
  }
}
// Get stored SVG from SessionStorage
function getStoredSVG(url) {
  const svgString = sessionStorage.getItem(url);
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  return svgDoc.documentElement;
}
// Function to check if the currentSVG matches a specific SVG filename
function isCurrentSVG(filename) {
  const currentSVG = document.querySelector('.background-svg');
  return currentSVG.src.includes(filename);
}
// Function for Idle animation, applies infinite animation to list of paths
function animatePathWithDelay(paths) {
  const idleAnimationDuration = 12000;
  const delayBetweenPaths = 1000;
  function getInitialY(path) {
    const transformAttribute = path.getAttribute('transform');
    const matrix = new DOMMatrix(transformAttribute);
    return matrix.m42;
  }
  const sortedPaths = [...paths].sort((a, b) => getInitialY(b) - getInitialY(a));
  function animateSinglePath(path, delay) {
    const startY = getInitialY(path);
    const endY = parseFloat(window.innerHeight*4);
    let startTime;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / idleAnimationDuration;
      if (progress >= 1) {
        path.setAttribute('transform', `matrix(1, 0, 0, 1, 0, ${startY - (window.innerHeight*2)})`);
        startTime = timestamp;
      } else {
        const newY = parseFloat(startY - progress * (startY - endY));
        path.setAttribute('transform', `matrix(1, 0, 0, 1, 0, ${newY})`);
      }
      requestAnimationFrame(step);
    }
    setTimeout(() => requestAnimationFrame(step), delay);
  }
  sortedPaths.forEach((path, index) => {
    const delay = index * delayBetweenPaths;
    animateSinglePath(path, delay);
  });
}
// Animate Idle SVG (rain.svg)
function animateIdle() {
  const idle = document.getElementById("idle");
  console.log(idle);
  const paths = idle.querySelectorAll('path');
  console.log(paths);
  animatePathWithDelay(paths);
}
// Circle Animation
function animateCircles(targetSVG) {
  const currentSVG = document.querySelector('.background-svg');
  const currentCircles = currentSVG.querySelectorAll('circle');
  const targetCircles = targetSVG.querySelectorAll('circle');
  // Store the animation start time
  const animationDuration = 4000; // 4 seconds
  const startTime = performance.now();
  function animate(currentTime) {
    const elapsedTime = currentTime - startTime;
    // Ensure elapsed time does not exceed the animation duration
    if (elapsedTime < animationDuration) {
      currentCircles.forEach((currentCircle, index) => {
        const targetRadius = parseFloat(targetCircles[index].getAttribute('r'));
        const currentRadius = parseFloat(currentCircle.getAttribute('r'));
        const radiusDifference = targetRadius - currentRadius;
        // Calculate the new radius based on elapsed time and animation duration
        const newRadius = currentRadius + (radiusDifference * (elapsedTime / (animationDuration*2)));
        currentCircle.setAttribute('r', newRadius);
      });
      // Continue the animation
      requestAnimationFrame(animate);
    } else {
      // Ensure the final radius values are set correctly
      currentCircles.forEach((currentCircle, index) => {
        const targetRadius = parseFloat(targetCircles[index].getAttribute('r'));
        currentCircle.setAttribute('r', targetRadius);
      });
    }
  }
  // Start the animation
  requestAnimationFrame(animate);
}
// Handle page transition including fade and AJAX loading
async function handlePageTransition(destinationURL, targetBackground) {
  const container = document.querySelector('.container');
  const content = document.querySelectorAll('.fade-target');
  content.forEach((fadeItem) => {
    fadeItem.style.opacity = '0';
  });
  try {
    const response = await fetch(destinationURL);
    const newPage = await response.text();
    const animationPromise = Promise.all([
      new Promise((resolve) => {
        animateCircles(targetBackground);
        setTimeout(() => {
          resolve();
        }, 4000);
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          container.innerHTML = newPage;
          const newContent = container.querySelectorAll('.fade-target');
          newContent.forEach((newFadeItem) => {
            newFadeItem.style.opacity = '1';
          });
        }, 2000);
        resolve(); 
      }),
    ]);
    await animationPromise;
    animateIdle();
  } catch (error) {
    console.error('Error loading page:', error);
  }
}
// MAIN PAGE LISTENER
// Preload SVGs before setting up link event listeners
preloadSVGs(svgUrls).then(() => {
  // Setup event listeners after preloading background SVG's
  document.addEventListener('DOMContentLoaded', function () {
    const home = document.querySelector('.header-text');
    const projects = document.querySelectorAll('.link-left');
    const more = document.querySelector('.link-right');
    var content = document.querySelectorAll('.fade-target');
    // Add fade-in class to trigger fade-in animation
    content.forEach((element) => {
      element.style.opacity = '1';
    });
    // Event listener for Home link
    home.addEventListener('click', function (event) {
      event.preventDefault();
      const destinationURL = home.getAttribute('href');
      const targetBackground = getStoredSVG('backgroundOne.svg');
      handlePageTransition(destinationURL, targetBackground);
    });
    // Event listeners for Projects links
    projects.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const destinationURL = link.getAttribute('href');
        const targetBackground = getStoredSVG('backgroundTwo.svg');
        handlePageTransition(destinationURL, targetBackground);
      });
    });
    // Event listener for More link
    more.addEventListener('click', function (event) {
      event.preventDefault();
      const destinationURL = more.getAttribute('href');
      const targetBackground = getStoredSVG('backgroundFive.svg');
      handlePageTransition(destinationURL, targetBackground);
      console.log("call page transition");
    });
  });
});