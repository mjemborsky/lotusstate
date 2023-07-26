document.addEventListener('DOMContentLoaded', function() {
  // BACKGROUND ANIMATION //
  // Initializing Links
  const index = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');

  // Get combined background file
  var backgrounds = document.querySelector('.backgrounds');

  // Get the first referenced SVG element using the xlink:href attribute
  var firstUse = document.querySelector('.background-svg:first-child');
  var referencedSvgId = firstUse.getAttribute('id'); // Remove the '#' symbol
  console.log(referencedSvgId);
  var referencedSvg = document.getElementById(referencedSvgId);
  console.log(referencedSvg);

  // Set the container background as the referenced SVG element
  var container = document.querySelector('.container');
  container.appendChild(referencedSvg.cloneNode(true));
  console.log('Page Background Applied');

  // Add CSS to make the SVG fill the container
  container.style.backgroundSize = "100% 100%";
  container.style.backgroundRepeat = "no-repeat";
  container.style.backgroundPosition = "center";

  var currentBackground = referencedSvg;

  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    var targetBackground = backgrounds.getElementById('#backgroundOne');
    animateBackground(currentBackground, targetBackground);
  });
  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      var targetBackground = backgrounds.querySelector('#backgroundTwo');
      animateBackground(currentBackground, targetBackground);
    });
  });
  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    var targetBackground = backgrounds.querySelector('#backgroundFive');
    animateBackground(currentBackground, targetBackground);
  });

  function animateBackground(currentBackground, targetBackground) {
    // Fetch the Snap.svg instances of both SVGs
    var currentSnap = Snap.select(currentBackground);
    var targetSnap = Snap.select(targetBackground);
    var contentElement = document.querySelector('.container');

    // Fetch all circles and positions from the current SVG
    var currentCircles = currentSnap.selectAll("circle");
    var currentPositions = [];
    currentCircles.forEach(function (circle) {
      currentPositions.push({
        cx: parseFloat(circle.attr("cx")),
        cy: parseFloat(circle.attr("cy"))
      });
    });

    // Fetch all circles and positions from the target SVG
    var targetCircles = targetSnap.selectAll("circle");
    var targetPositions = [];
    targetCircles.forEach(function (circle) {
      targetPositions.push({
        cx: parseFloat(circle.attr("cx")),
        cy: parseFloat(circle.attr("cy"))
      });
    });

    currentCircles.forEach(function (circle, index) {
      circle.addClass('animate-circle'); // Add a class for animation
    });

    // Animate circle positions from current to target positions with a 3-second duration
    Snap.animate(currentPositions, targetPositions, function (value) {
      currentCircles.forEach(function (circle, index) {
        circle.attr({ cx: value[index].cx, cy: value[index].cy });
      });
    }, 3000, mina.easeout, function() {
      // Animation completed
      currentSnap.attr({ fill: "none" });
      targetSnap.attr({ fill: "black" });
      contentElement.style.backgroundImage = "url('path/to/your/svg/file.svg')"; // Replace 'path/to/your/svg/file.svg' with the actual path to your target SVG
    });
  }
});
