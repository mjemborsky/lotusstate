document.addEventListener('DOMContentLoaded', function() {
  // BACKGROUND ANIMATION //
  // Initializing Links
  const index = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');

  // NEED TO MAKE FUNCTION FOR SVG RETRIEVAL HERE
  // CALL WITH CURRENTBACKGROUND

  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    var targetBackground = 'backgroundOne.svg';
    animateBackground(currentBackground, targetBackground);
  });
  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      var targetBackground = 'backgroundTwo.svg';
      animateBackground(currentBackground, targetBackground);
    });
  });
  // Background: more
  more.addEventListener('click', function(i) {
    var targetBackground = 'backgroundFive.svg';
    animateBackground(currentBackground, targetBackground);
  });

  function animateBackground(currentBackground, targetBackground) {
    // Add class for animation
    currentBackground.classList.add('animate-background');

    // Wait for the animation to finish
    setTimeout(function () {
      // Remove animation class
      currentBackground.classList.remove('animate-background');
      // Set target background to black
      targetBackground.style.fill = "black";
      // Set container background image
      var contentElement = document.querySelector('.container');
      contentElement.style.backgroundImage = "url('path/to/your/svg/file.svg')"; // Replace 'path/to/your/svg/file.svg' with the actual path to your target SVG
    }, 3000); // 3000ms is the animation duration, adjust as needed
  }
});
