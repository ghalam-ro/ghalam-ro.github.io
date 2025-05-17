"use strict";

$(async function () {
    let inputsChanged = false;

    // Monitor changes in all inputs inside the form
    $('[editForm] input').on('input', function () {
        inputsChanged = true;
        $('.formBtns').fadeIn(); // Show the button when any input is changed
    });

    // Optional: Reset the button visibility after form submission
    $('[editForm]').on('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission for testing
        alert('Form submitted!');
        inputsChanged = false;
        $('.formBtns').fadeOut(); // Hide the button after submission
    });

    $('[editForm]').on('reset' , function(e){
        $('.formBtns').fadeOut();
    });
});