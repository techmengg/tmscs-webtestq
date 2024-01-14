document.addEventListener("DOMContentLoaded", function() {
    var body = document.body;

    window.addEventListener("scroll", function() {
        // Calculate the scroll percentage
        var scrollPercentage = (document.documentElement.scrollTop || document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);

        // Define the transition point (adjust as needed)
        var transitionPoint = 0.2;

        // Toggle the class based on the scroll position
        if (scrollPercentage > transitionPoint) {
            body.classList.add("dark-background");
        } else {
            body.classList.remove("dark-background");
        }
    });
});




