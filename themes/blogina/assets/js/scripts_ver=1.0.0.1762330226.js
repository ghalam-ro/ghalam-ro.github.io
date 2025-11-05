/**
 * File scripts.js.
 *
 * Main Javascript Codes
 */
$ = jQuery.noConflict();


function blogina_alertify(alert, type) {
    return '<div class="blg-alert ' + type + '">' + alert + '</div>';
}

(function ($) {
    // Toggle Mobile Menu Sidebar
    $('#toggleSidebar').on('click', function () {
        $('#mobile-menu-sidebar').toggleClass('show-side-box');
        $('.bac-overlay').toggle();
    });

    // Close Mobile Menu Sidebar
    $('#toggle-sidebar-close').on('click', function () {
        $('#mobile-menu-sidebar').toggleClass('show-side-box');
        $('.bac-overlay').toggle();
    });

    // Toggle Mini Cart Sidebar
    $('#cart-toggle').on('click', function () {
        $('#mini-cart-sidebar').toggleClass('show-side-box');
        $('.bac-overlay').toggle();
    });
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#mini-cart-sidebar, #cart-toggle').length) {
            $('#mini-cart-sidebar').removeClass('show-side-box');
            $('.bac-overlay').hide();
        }
    });
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#mobile-menu-sidebar, #toggleSidebar').length) {
            $('#mobile-menu-sidebar').removeClass('show-side-box');
            $('.bac-overlay').hide();
        }
    });
})(jQuery);

jQuery(document).ready(function ($) {
    function initializeCollapsibleMenu() {
        const windowWidth = $(window).width();
        const collapsibleItems = $('.has-collapsible > a');
        const menuItemsWithChildren = $('.menu-item-has-children');

        // Reset everything before applying logic
        $('.has-collapsible').removeClass('open');
        $('.sub-menu').removeClass('active-menu-mobile').removeAttr('style');
        collapsibleItems.off('click');
        menuItemsWithChildren.off('mouseenter mouseleave');

        if (windowWidth <= 1023) {
            // Mobile: Add click handlers for collapsible menus
            collapsibleItems.on('click', function (e) {
                const $this = $(this);
                const $parent = $this.parent();
                const $submenu = $parent.find('.sub-menu').first();

                // Prevent navigation
                e.preventDefault();

                // Toggle submenu
                if ($parent.hasClass('open')) {
                    $parent.removeClass('open');
                    $submenu.removeClass('active-menu-mobile').fadeOut(300);
                    $this.attr('aria-expanded', 'false');
                } else {
                    $parent.addClass('open');
                    $submenu.addClass('active-menu-mobile').fadeIn(300);
                    $this.attr('aria-expanded', 'true');

                    // Close other open submenus
                    $('.has-collapsible.open').not($parent).each(function () {
                        const $otherParent = $(this);
                        $otherParent.removeClass('open');
                        $otherParent.find('.sub-menu').first().removeClass('active-menu-mobile').fadeOut(300);
                        $otherParent.find('> a').attr('aria-expanded', 'false');
                    });
                }
            });
        } else {
            // Desktop: Add hover behavior for menus
            menuItemsWithChildren.hover(
                function () {
                    $(this).children('.sub-menu').stop(true, true).delay(100).slideDown(100);
                    $('.menu-item-has-children li').css({
                        'margin-top': '7px',
                        'margin-bottom': '7px'
                    });
                },
                function () {
                    $(this).children('.sub-menu').stop(true, true).delay(100).slideUp(100);
                }
            );
        }
    }

    // Initialize on document ready and on resize
    initializeCollapsibleMenu();
    $(window).on('resize', function () {
        initializeCollapsibleMenu();
    });
});


$('.blg-accordion-button').on('click', function () {
    var $button = $(this);
    var accordionContent = $($button.data('target'));
    var isExpanded = $button.attr('aria-expanded') === 'true';

    // Hide all other blg-accordion contents and reset button states
    $('.blg-accordion-content').addClass('hidden');
    $('.blg-accordion-button').attr('aria-expanded', 'false').find('.blg-accordion-icon').text('+'); // Reset icons to +

    // Remove bottom border from all buttons

    // If the clicked button was not expanded, show its content and mark it as expanded
    if (!isExpanded) {
        accordionContent.removeClass('hidden');
        $button.attr('aria-expanded', 'true');
        $button.find('.blg-accordion-icon').text('-'); // Change icon to -
    }


});

$('#billing_address_2_field label').removeClass('screen-reader-text');
$('#shipping_address_2_field label').removeClass('screen-reader-text');

$(document).ready(function () {
    // Open the overlay when the search icon is clicked
    $('#search-icon').click(function () {
        $('#search-overlay').slideDown(200);
    });

    // Close the overlay if clicked outside the form
    $(document).click(function (event) {
        if (!$(event.target).closest('#search-overlay form').length && !$(event.target).closest('#search-icon').length) {
            $('#search-overlay').slideUp(200);
            setTimeout(function () {
                $('#search-overlay');
            }, 500);
        }
    });
});

jQuery(document.body).on('added_to_cart', function () {
    // Refresh mini cart content
    $('#mini-cart-sidebar').load(location.href + ' #mini-cart-sidebar > *', function () {
        // Trigger WooCommerce fragments update after the load
        $(document.body).trigger('wc_fragment_refresh');
    });

    // Update cart count and then toggle the cart
    updateCartCount();
});

function updateCartCount() {
    // Fetch updated cart count via AJAX
    jQuery.ajax({
        url: wc_add_to_cart_params.ajax_url,
        type: 'POST',
        data: { action: 'get_cart_count' },
        success: function (response) {
            // Update the cart count element
            $('#cart-count').text(response);

            // Toggle the mini cart after updating the cart count
            $('#cart-toggle').trigger('click');
        }
    });
}



jQuery(function ($) {
    $('body').on('change', '.quantity input.qty', function () {
        var quantity = $(this).val();
        var cart_item_key = $(this).closest('.quantity-price').attr('key');

        // Add loading class to the mini-cart
        $('#mini-cart-sidebar').addClass('blg-loading');

        $.ajax({
            url: wc_add_to_cart_params.ajax_url,
            type: 'POST',
            data: {
                action: 'update_cart_item_quantity',
                cart_item_key: cart_item_key,
                quantity: quantity
            },
            success: function (response) {
                // Replace mini-cart content with updated content
                $('#mini-cart-sidebar .sidebar-content').html($(response).find('.sidebar-content').html());
            },
            complete: function () {
                // Remove the loading class
                $('#mini-cart-sidebar').removeClass('blg-loading');
            }
        });
    });
});

jQuery(document).ready(function () {
    jQuery('body').on('click', '.add_to_cart_button', function (e) {
        const $button = jQuery(this);

        // Change to loading state
        $button.addClass('loading');
        const $iconContainer = $button.find('div');
        $iconContainer.html('<div class="spinner"></div>'); // Add a spinner

        // When AJAX completes, update the state
        jQuery(document.body).on('added_to_cart', function () {
            $button.removeClass('loading');
            $iconContainer.html(`
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" viewBox="0 0 24 24">
                    <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4L9 16.2z"></path>
                </svg>
            `);
        });

        // Handle AJAX errors
        jQuery(document.body).on('ajax_error', function () {
            $button.removeClass('loading');
            $iconContainer.html('<div class="error-icon"></div>'); // Optionally show error feedback
        });
    });
});

$(window).on('beforeunload', function () {
    $('.blg-preloader').fadeIn('fast');
});

$(window).on('pageshow', function (event) {
    if (event.originalEvent.persisted) {
      fadeOutPreloader();
    }
});

$(window).on('load', function () {
    clearTimeout(fallbackTimeout); // Stop timeout if load event fires
    fadeOutPreloader();
});

// Fallback timeout in case the load event is delayed
var fallbackTimeout = setTimeout(fadeOutPreloader, 10000); // 10s max wait

function fadeOutPreloader() {
    $('.blg-preloader').fadeOut(500, function () {});
}


$(document).on('change', '.quantity input.qty', function () {
    $('button[name="update_cart"]').prop('disabled', false);
});
// Event for increasing quantity
$(document).on('click', '.quantity-button.increase', function (e) {
    e.preventDefault(); // Prevent browser's native input handling

    var $input = $(this).siblings('input');
    var currentValue = parseFloat($input.val()) || 0;
    var step = parseFloat($input.attr('step')) || 1;
    var maxValue = parseFloat($input.attr('max')) || Infinity;

    // Calculate the new value
    var newValue = Math.min(currentValue + step, maxValue);

    // Update the input value and trigger WooCommerce's change event
    $input.val(newValue).trigger('change');
    $('button[name="update_cart"]').trigger('click');
    updateMiniCart();

});

// Event for decreasing quantity
$(document).on('click', '.quantity-button.decrease', function (e) {
    e.preventDefault(); // Prevent browser's native input handling

    var $input = $(this).siblings('input');
    var currentValue = parseFloat($input.val()) || 0;
    var step = parseFloat($input.attr('step')) || 1;
    var minValue = parseFloat($input.attr('min')) || 0;

    // Calculate the new value
    var newValue = Math.max(currentValue - step, minValue);

    // Update the input value and trigger WooCommerce's change event
    $input.val(newValue).trigger('change');
    $('button[name="update_cart"]').trigger('click');
    updateMiniCart();

});

function updateMiniCart() {
    // Use WooCommerce's AJAX method to refresh the mini cart
    $.ajax({
        url: wc_cart_fragments_params.wc_ajax_url.replace('%%endpoint%%', 'get_refreshed_fragments'),
        type: 'POST',
        success: function (response) {
            if (response && response.fragments) {
                $.each(response.fragments, function (key, value) {
                    $(key).replaceWith(value); // Replace the mini cart content
                });
            }
        },
        error: function () {
            console.error('Failed to update mini cart.');
        }
    });
}



jQuery(document).ready(function ($) {
    const modal = $('#chaptersModal');
    const closeModal = $('#closeModal');
    const sessionContent = $('#sessionContent');
    const sessionTitle = $('.blg-modal-session-title');

    // Utility function to update session content
    function updateSessionContent({ title, url, type, status, bought }) {
        // Add loading class before updating the content
        sessionContent.addClass('blg-loading'); // Show the loading spinner
    
        sessionTitle.text(title);
        sessionContent.empty().append(sessionTitle);
    
        // Simulate loading content
        setTimeout(() => {
            if (bought || status === 'free') {
                if (type === 'video') {
                    const videoElement = $(`
                        <video class="plyr" width="100%" height="400" controls>
                            <source src="${url}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    `);
    
                    // Append the video element
                    sessionContent.append(videoElement);
    
                    // Initialize Plyr on the newly added video element
                    const player = new Plyr(videoElement[0]);
    
                    // Remove loading spinner after the video is ready
                    sessionContent.removeClass('blg-loading');
                } else {
                    // Create the iframe element
                    const iframe = $(`
                        <iframe 
                            src="${url}?view=desktop" 
                            style="width: 100%; height: 100%; border: 0;" 
                            allowfullscreen>
                        </iframe>
                    `);
    
                    // Listen for the iframe load event
                    iframe.on('load', function () {
                        // Remove the loading class after the iframe is fully loaded
                        sessionContent.removeClass('blg-loading');
                    });
    
                    // Append the iframe to the content area
                    sessionContent.append(iframe);
                }
            } else {
                sessionContent.append(blogina_alertify(
                    `برای دیدن این جلسه باید دوره را خریداری کنید`,
                    'blg-error'
                ));
                // Remove the loading class if the user hasn't bought the content
                sessionContent.removeClass('blg-loading');
            }
        }, 1500); // Simulate 1.5 seconds of loading time (you can adjust this time)
    }
    

    // Open modal and handle session selection
    $('.view-modal-btn').click(function () {
        const dataTitle = $(this).data('title');
        modal.removeClass('hidden');

        $('.blg-accordion-button').each(function () {
            const button = $(this);
            const targetId = button.attr('data-target');
            const relatedContent = $(targetId);

            if (relatedContent.find(`.session-btn[data-title="${dataTitle}"]`).length) {
                button.attr('aria-expanded', 'true');
                relatedContent.removeClass('hidden');

                relatedContent.find('.session-btn').each(function () {
                    const sessionButton = $(this);
                    sessionButton.toggleClass('active-session-tab', sessionButton.data('title') === dataTitle);
                    if (sessionButton.hasClass('active-session-tab')) {
                        sessionButton.trigger('click');
                    }
                });
            } else {
                button.attr('aria-expanded', 'false');
                relatedContent.addClass('hidden');
            }
        });
    });

    // Close modal
    closeModal.click(() => modal.addClass('hidden'));

    // Handle session button click
    $('.session-btn').click(function () {
        $('.session-btn').removeClass('active-session-tab');
        $(this).addClass('active-session-tab');

        updateSessionContent({
            title: $(this).data('title'),
            url: $(this).data('url'),
            type: $(this).data('type'),
            status: $(this).data('status'),
            bought: $(this).data('bought')
        });
    });
});



// Back to Top Button
var btn = $('#blgbackToTop');

$(window).scroll(function() {
  if ($(window).scrollTop() > 500) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '1000');
});

