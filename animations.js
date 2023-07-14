// animations.js
// Created by: Michael Emborsky
// Purpose: Main source of animations for Lotus State website, including 
// the expansion of the project sub-links in the header and the background page 
// transition animation and idle animation.


// IDEA: Maybe when index.html first loads, FOR THE FIRST TIME, loads from black and all elements fade in


document.addEventListener('DOMContentLoaded', function() {
  // For Expanding
  var leftLink = document.querySelector('.left-link');
  var expandedLinks = document.querySelector('.expanded-links');

  // Constants for Background Animation
  const index = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');

  // Initializing
  var targetBackground = "";
  expandedLinks.style.display = 'none';
  var isExpanded = false; // Flag to track the state of expanded links

  // Retrieve the current page's SVG element
  var currentBackground = document.querySelector('object[data^="' + window.location.pathname + '"]');

  // Check if the SVG element exists on the page
  if (currentBackground) {
    // Get the SVG document within the object element
    var svgDoc = currentBackground.contentDocument;

    // Get the SVG root element
    var svgRoot = svgDoc.querySelector('svg');

    // Add your code to work with the SVG element here
    console.log(svgRoot); // Example: Output the SVG root element to the console
  }

  // EVENT LISTENERS //

  // Expand or Collapse Links
  leftLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (isExpanded) {
      // Collapse the links
      expandedLinks.style.display = 'none';
      isExpanded = false;
    } else {
      // Expand the links
      expandedLinks.style.display = 'flex';
      expandedLinks.style.alignItems = 'center';
      expandedLinks.style.flexDirection = 'column';
      expandedLinks.style.left = '25px';
      expandedLinks.style.top = '75px';
      isExpanded = true;
    }
  });

  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    const currentBackground = document.getElementById('background');
    const targetBackground = document.getElementById('background');
    animateCircles(currentBackground, targetBackground);
  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      const currentBackground = document.getElementById('background');
      const targetBackground = document.getElementById('backgroundTwo');
      animateCircles(currentBackground, targetBackground);
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    const currentBackground = document.getElementById('background');
    const targetBackground = document.getElementById('backgroundFive');
    animateCircles(currentBackground, targetBackground);
  });

  // Animating Background
  function animateCircles(currentBackground, targetBackground) {
    // Get the circles from the currentBackground SVG
    const currentCircles = Array.from(currentBackground.getElementsByTagName('circle'));

    // Get the circles from the targetBackground SVG
    const targetCircles = Array.from(targetBackground.getElementsByTagName('circle'));

    // Store the initial positions and required information of the current circles
    const initialPositions = currentCircles.map(circle => ({
      cx: circle.getAttribute('cx'),
      cy: circle.getAttribute('cy'),
      radius: circle.getAttribute('r')
      // Add any other required information you need
    }));

    // Store the target positions and required information of the target circles
    const targetPositions = targetCircles.map(circle => ({
      cx: circle.getAttribute('cx'),
      cy: circle.getAttribute('cy'),
      radius: circle.getAttribute('r')
      // Add any other required information you need
    }));

    // Animate the positions of the circles
    // You can use any animation library or implement your own animation logic here

    // Example using the anime.js library
    anime({
      targets: currentCircles,
      duration: 1000, // Animation duration in milliseconds
      easing: 'easeInOutSine', // Easing function
      update: function (anim) {
        const progress = anim.progress; // Animation progress from 0 to 1

        // Update the position of each circle based on the progress
        currentCircles.forEach((circle, index) => {
          const initialPos = initialPositions[index];
          const targetPos = targetPositions[index];

          const currentX = initialPos.cx + (targetPos.cx - initialPos.cx) * progress;
          const currentY = initialPos.cy + (targetPos.cy - initialPos.cy) * progress;

          circle.setAttribute('cx', currentX);
          circle.setAttribute('cy', currentY);
        });
      }
    });
  }
});
