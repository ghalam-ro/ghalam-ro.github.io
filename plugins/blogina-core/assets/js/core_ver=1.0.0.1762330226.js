function showToast(message, type = 'success', duration = 4500) {
    // Create a toast element and append it to the body
    const toast = $('<div>', {
        class: `blg-alert-toast blg-${type}`,
        text: message
    }).css({
        position: 'fixed',
        top: '-100px', // Start above the screen
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999
    }).appendTo('body');

    // Slide in from the top
    toast.stop().animate({top: '20px'}, 500);

    // Slide out after the specified duration
    setTimeout(() => {
        toast.stop().animate({top: '-100px'}, 500, () => toast.remove());
    }, duration);

    // Optionally fade in (if you want a smoother entry)
    toast.fadeIn(200);
}


function video_slider(videoUrl, videoLink, videoTitle) {
    // Scroll to the top of the page
    window.scrollTo({top: 0, behavior: 'smooth'});

    // Hide the gallery
    const gallery = document.querySelector('.blg-gallery');
    if (gallery) {
        gallery.style.display = 'none';
    }

    // Show the video content
    const sliderModeContainer = document.querySelector('.slider-mode-container');
    if (sliderModeContainer) {
        sliderModeContainer.classList.remove('hidden');
        sliderModeContainer.innerHTML = `
            <div class="session-video-container is-image bg-[var(--blg-color-primary400)] rounded-[16px]">
                <video class="plyr" width="100%" height="400" controls autoplay>
                    <source src="${videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
            <a href="${videoLink}" target="_blank" title="${videoTitle}" class="get_more">
                <svg class="absolute right-[10px] top-[9px] z-50 w-7 h-7" xmlns="http://www.w3.org/2000/svg"
                     width="29" height="29" viewBox="0 0 29 29" fill="none">
                    <path opacity="0.4"
                          d="M21.7558 15.528V21.2796C21.7558 22.7613 20.6008 24.348 19.2125 24.8146L15.4908 26.0513C14.8375 26.273 13.7758 26.273 13.1341 26.0513L9.41247 24.8146C8.01247 24.348 6.86914 22.7613 6.86914 21.2796L6.88081 15.528L12.0375 18.888C13.2975 19.7163 15.3741 19.7163 16.6341 18.888L21.7558 15.528Z"
                          fill="var(--blg-color-primary500)"/>
                    <path d="M23.6223 8.08467L16.6339 3.49967C15.3739 2.67133 13.2973 2.67133 12.0373 3.49967L5.01395 8.08467C2.76228 9.543 2.76228 12.8447 5.01395 14.3147L6.88061 15.528L12.0373 18.888C13.2973 19.7163 15.3739 19.7163 16.6339 18.888L21.7556 15.528L23.3539 14.478V18.048C23.3539 18.5263 23.7506 18.923 24.2289 18.923C24.7073 18.923 25.1039 18.5263 25.1039 18.048V12.308C25.5706 10.803 25.0923 9.053 23.6223 8.08467Z"
                          fill="var(--blg-color-primary500)"/>
                </svg>
            </a>
        `;

        const videoElement = sliderModeContainer.querySelector('video');
        const player = new Plyr(videoElement);
    }
}


function video_modal(videoUrl, controls = true, autoplay = true) {
    var modalContainer = document.getElementById('video-modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'video-modal-container';
        document.body.appendChild(modalContainer);
    }

    var controlsAttribute = controls ? 'controls' : '';
    var autoplayAttribute = autoplay ? 'autoplay' : '';

    var modalHTML = `
        <div class="video-modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <div class="video-iframe-container">
                <video class="plyr" ${controlsAttribute} ${autoplayAttribute}>
                    <source src="${videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    `;
    modalContainer.innerHTML = modalHTML;
    modalContainer.style.display = 'block';

    const videoElement = modalContainer.querySelector('video');
    const player = new Plyr(videoElement);

    player.on('ready', function () {
        if (!controls) {
            const plyrControls = modalContainer.querySelector('.plyr__controls');
            if (plyrControls) {
                plyrControls.style.display = 'none';
            }
        }
    });

    modalContainer.addEventListener('click', function (event) {
        if (event.target === modalContainer) {
            closeModal();
        }
    });

}

// Close modal function and pause the video
function closeModal() {
    var modalContainer = document.getElementById('video-modal-container');
    if (modalContainer) {
        // Find the video element and pause it
        var videoElement = modalContainer.querySelector('video');
        if (videoElement) {
            videoElement.pause();
        }

        // Hide the modal and clear its content
        modalContainer.style.display = 'none';
        modalContainer.innerHTML = '';
    }
}

function show_session_video() {
    let currentPlayer = null;

    jQuery(document).on('click', '.view-session-btn', function (event) {
        event.preventDefault();

        if ($(this).data('view-mode') === 'sessionmode') {
            $('.session-video-container').addClass('hidden');

            if (currentPlayer) {
                currentPlayer.pause();
                currentPlayer.destroy();
                currentPlayer = null;
            }

            const videoContainer = $(this).closest('.blg-session').find('.session-video-container');
            videoContainer.removeClass('hidden');

            const videoElement = videoContainer.find('.plyr')[0];
            if (videoElement) {
                currentPlayer = new Plyr(videoElement, {
                    autoplay: false,
                });
            }
        }
    });
}

show_session_video();

function showMoreItems(button, itemsSelector, hiddenClass) {
    jQuery(itemsSelector).removeClass(hiddenClass);
    jQuery(button).hide();
}


function togglePasswordVisibility(inputId, iconElement) {
    var $passwordField = $('#' + inputId);
    var inputType = $passwordField.attr('type');

    // Toggle between 'password' and 'text' types
    if (inputType === 'password') {
        $passwordField.attr('type', 'text');
        $(iconElement).html('<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none"> <path opacity="0.4" d="M21.7672 9.65012C21.2772 8.87012 20.7172 8.17012 20.1372 7.54012L16.3672 11.3101C16.4872 11.6801 16.5572 12.0801 16.5572 12.5001C16.5572 14.7401 14.7472 16.5401 12.5172 16.5401C12.0972 16.5401 11.6972 16.4701 11.3272 16.3501L7.86719 19.8101C9.32719 20.6301 10.9072 21.0601 12.5172 21.0601C14.2972 21.0601 16.0272 20.5401 17.6072 19.5701C19.1872 18.5901 20.6072 17.1601 21.7672 15.3401C22.7672 13.7801 22.7672 11.2201 21.7672 9.65012Z" fill="var(--blg-color-primary500)" /> <path d="M14.5372 10.4801L10.4972 14.5201C9.98723 14.0001 9.65723 13.2801 9.65723 12.5001C9.65723 10.9301 10.9372 9.64012 12.5172 9.64012C13.2972 9.64012 14.0172 9.97012 14.5372 10.4801Z" fill="var(--blg-color-primary500)" /> <path opacity="0.4" d="M18.7676 6.25011L15.3776 9.64011C14.6476 8.90012 13.6376 8.46011 12.5176 8.46011C10.2776 8.46011 8.47758 10.2701 8.47758 12.5001C8.47758 13.6201 8.92758 14.6301 9.65758 15.3601L6.27758 18.7501H6.26758C5.15758 17.8501 4.13758 16.7001 3.26758 15.3401C2.26758 13.7701 2.26758 11.2201 3.26758 9.65011C4.42758 7.83011 5.84758 6.40011 7.42758 5.42011C9.00758 4.46011 10.7376 3.93011 12.5176 3.93011C14.7476 3.93011 16.9076 4.75011 18.7676 6.25011Z" fill="var(--blg-color-primary500)" /> </svg>'); // Hide password icon (eye closed)
    } else {
        $(iconElement).html('<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none"> <path opacity="0.4" d="M21.7672 9.65012C21.2772 8.87012 20.7172 8.17012 20.1372 7.54012L16.3672 11.3101C16.4872 11.6801 16.5572 12.0801 16.5572 12.5001C16.5572 14.7401 14.7472 16.5401 12.5172 16.5401C12.0972 16.5401 11.6972 16.4701 11.3272 16.3501L7.86719 19.8101C9.32719 20.6301 10.9072 21.0601 12.5172 21.0601C14.2972 21.0601 16.0272 20.5401 17.6072 19.5701C19.1872 18.5901 20.6072 17.1601 21.7672 15.3401C22.7672 13.7801 22.7672 11.2201 21.7672 9.65012Z" fill="var(--blg-color-primary500)" /> <path d="M14.5372 10.4801L10.4972 14.5201C9.98723 14.0001 9.65723 13.2801 9.65723 12.5001C9.65723 10.9301 10.9372 9.64012 12.5172 9.64012C13.2972 9.64012 14.0172 9.97012 14.5372 10.4801Z" fill="var(--blg-color-primary500)" /> <path opacity="0.4" d="M18.7676 6.25011L15.3776 9.64011C14.6476 8.90012 13.6376 8.46011 12.5176 8.46011C10.2776 8.46011 8.47758 10.2701 8.47758 12.5001C8.47758 13.6201 8.92758 14.6301 9.65758 15.3601L6.27758 18.7501H6.26758C5.15758 17.8501 4.13758 16.7001 3.26758 15.3401C2.26758 13.7701 2.26758 11.2201 3.26758 9.65011C4.42758 7.83011 5.84758 6.40011 7.42758 5.42011C9.00758 4.46011 10.7376 3.93011 12.5176 3.93011C14.7476 3.93011 16.9076 4.75011 18.7676 6.25011Z" fill="var(--blg-color-primary500)" /> <path d="M15.3777 12.5001C15.3777 14.0701 14.0977 15.3601 12.5177 15.3601C12.4577 15.3601 12.4077 15.3601 12.3477 15.3401L15.3577 12.3301C15.3777 12.3901 15.3777 12.4401 15.3777 12.5001Z" fill="var(--blg-color-primary500)" /> <path d="M22.2875 2.73013C21.9875 2.43013 21.4975 2.43013 21.1975 2.73013L2.74746 21.1901C2.44746 21.4901 2.44746 21.9801 2.74746 22.2801C2.89746 22.4201 3.08746 22.5001 3.28746 22.5001C3.48746 22.5001 3.67746 22.4201 3.82746 22.2701L22.2875 3.81013C22.5975 3.51013 22.5975 3.03013 22.2875 2.73013Z" fill="var(--blg-color-primary500)" /> </svg>'); // Change to open-eye icon
        $passwordField.attr('type', 'password');
    }
}

// Enqueue this script inside the widget script
(function ($) {
    $(document).ready(function () {
        // Accordion Style
        $('.bloginac-faq-item .faq-question').on('click', function () {
            var $faqItem = $(this).closest('.bloginac-faq-item');
            var $answer = $faqItem.find('.faq-answer');

            if ($answer.is(':visible')) {
                $answer.slideUp();
            } else {
                if ($('.faq-answer').is(':visible')) {
                    $('.faq-answer').slideUp();
                }
                $answer.slideDown();
            }
        });

        // Toggle Style
        if ($('.bloginac-faq-wrapper').hasClass('toggle')) {
            $('.faq-question').on('click', function () {
                $(this).next('.faq-answer').slideToggle();
            });
        }
    });
})(jQuery);

/**
 * Blogina Navigation Tabs
 */

(function ($) {
    $(document).ready(function () {
        // Handle tab switching
        $('.blg-nav-tab-wrapper .blg-nav-tab').on('click', function (e) {
            e.preventDefault();

            // Remove active class from tabs and content
            $('.blg-nav-tab').removeClass('blg-nav-tab-active');
            $('.blg-tab-content').removeClass('active');

            // Add active class to the clicked tab
            $(this).addClass('blg-nav-tab-active');

            // Show the corresponding content
            var targetTab = $(this).data('tab');
            $('[data-content="' + targetTab + '"]').addClass('active');
        });

        // Ensure the correct tab is active on page load
        var initialTab = $('.blg-nav-tab-active').data('tab') || 'general';
        $('[data-content="' + initialTab + '"]').addClass('active');
    });
})(jQuery);



