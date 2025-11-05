/**
 * File scripts.js.
 *
 * Main Javascript Codes
 */
$ = jQuery.noConflict();

// bloginaBlogSidebarFilter
(function ($) {
  $.fn.bloginaBlogSidebarFilter = function (options) {
    const settings = $.extend(
      {
        ajax_url: 0,
        nonce: "",
      },
      options
    );
    let $form = $("#categories-list");
    let $content = $(".blg-post-content");
    let ajax = false;

    setListeners();

    function setListeners() {
      $form.on("click", "#category-filter", function (event) {
        event.preventDefault();
        const categoryId = $(this).data("id");
        filterPosts(categoryId);
      });
    }

    function filterPosts(categoryId) {

      const $message = $("#blg_filter_posts_form_message");

      $message.html("");

      $content.addClass("blg-loading");

      if (ajax) ajax.abort();

      const data = {
        action: "filter_blogs_SideBar_widget",
        category_id: categoryId,
        nonce: settings.nonce,
      };

      ajax = $.ajax({
        type: "POST",
        url: settings.ajax_url,
        data: data,
        dataType: "JSON",
        success: function (response) {
          $content.removeClass("blg-loading");

          if (response.success) $content.html(response.content);
          else $content.html(blogina_alertify(response.message, "blg-error"));

        },
        error: function (jqXHR, textStatus, errorThrown) {
          $message.html(blogina_alertify(errorThrown, "blg-error"));
          $content.removeClass("blg-loading");
        },
      });
    }
  };
})(jQuery);

// bloginaBlogWidgetFilter
(function ($) {
  $.fn.bloginaBlogWidgetFilter = function (options) {
    const settings = $.extend(
      {
        ajax_url: 0,
        nonce: "",
      },
      options
    );

    let $form = $("#categories-list");
    let $content = $("#post-container");
    let ajax = false;

    setListeners();

    function setListeners() {
      $form.on("click", ".blg-filter-posts-button", function (event) {
        event.preventDefault();
        const categoryId = $(this).data("id") || 0; 
        filterPosts(categoryId, $(this));
      });
    }

    function filterPosts(categoryId, $activeButton) {
      const $message = $("#blg_filter_posts_form_message");
      $message.html("");
      $content.addClass("blg-loading");

      if (ajax) ajax.abort();

      const data = {
        action: "filter_blogs_elementor_widget",
        category_id: categoryId,
        nonce: settings.nonce,
      };

      $form.find(".blg-filter-posts-button").removeClass("blg-active-category");
      $activeButton.addClass("blg-active-category");

      ajax = $.ajax({
        type: "POST",
        url: settings.ajax_url,
        data: data,
        dataType: "JSON",
        success: function (response) {
          $content.removeClass("blg-loading");

          if (response.success) $content.html(response.content);
          else $content.html(blogina_alertify(response.message, "blg-error"));

        },
        error: function (jqXHR, textStatus, errorThrown) {
          $message.html(blogina_alertify(errorThrown, "blg-error"));
          $content.removeClass("blg-loading");
        },
      });
    }
  };
})(jQuery);

// bloginaCourseSidebarFilter
(function ($) {
  $.fn.bloginaCourseSidebarFilter = function (options) {
    const settings = $.extend(
      {
        ajax_url: "",
        nonce: "",
      },
      options
    );

    let $form = this;
    let $content = $(".blg-post-content");
    let ajax = false;

    setListeners();

    function setListeners() {
      // Category and Type filters
      $form.on("change", ".category-filter", function () {
        filterCourses();
      });

      $form.on("change", ".type-filter", function () {
        filterCourses();
      });

      // Price filter with noUiSlider
      const priceSlider = document.getElementById("slider");

      if (priceSlider) {
        priceSlider.noUiSlider.on("change", function (values) {
          const minPrice = Math.round(values[0]);
          const maxPrice = Math.round(values[1]);
          filterCourses(minPrice, maxPrice);
        });
      }
    }

    function filterCourses(minPrice = null, maxPrice = null) {
      const selectedCategories = [];
      const selectedTypes = [];

      $(".category-filter:checked").each(function () {
        selectedCategories.push($(this).data("id"));
      });

      $(".type-filter:checked").each(function () {
        selectedTypes.push($(this).data("id"));
      });

      // Add a loading class
      $content.addClass("blg-loading");

      if (ajax) ajax.abort();

      ajax = $.ajax({
        type: "POST",
        url: settings.ajax_url,
        data: {
          action: "filter_course_SideBar_widget",
          nonce: settings.nonce,
          categories: selectedCategories,
          types: selectedTypes,
          price_min: minPrice, // Pass min price from slider
          price_max: maxPrice, // Pass max price from slider
        },
        dataType: "JSON",
        success: function (response) {
          $content.removeClass("blg-loading");

          if (response.success) $content.html(response.content);
          else $content.html(blogina_alertify(response.message, "blg-error"));
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $content.removeClass("blg-loading");
          $content.html(`<p>${errorThrown}</p>`);
        },
      });
    }
  };
})(jQuery);

// bloginatelevisionSidebarFilter
(function ($) {
  $.fn.bloginatelevisionSidebarFilter = function (options) {

    const settings = $.extend(
      {
        ajax_url: "",
        nonce: "",
      },
      options
    );

    let $form = this; 
    let $content = $(".blg-post-content"); 
    let ajax = false;

    setListeners();

    function setListeners() {

      $form.on("change", ".category-filter", function () {
        filterTelevision();
      });

    }

    function filterTelevision() {
      const selectedCategories = [];

      $(".category-filter:checked").each(function () {
        selectedCategories.push($(this).data("id"));
      });

      $content.addClass("blg-loading");

      if (ajax) ajax.abort();

      ajax = $.ajax({
        type: "POST",
        url: settings.ajax_url,
        data: {
          action: "filter_television_SideBar_widget",
          nonce: settings.nonce,
          categories: selectedCategories,
        },

        dataType: "JSON",
        success: function (response) {
          $content.removeClass("blg-loading");

          if (response.success) $content.html(response.content);
          else $content.html(blogina_alertify(response.message, "blg-error"));

        },
        error: function (jqXHR, textStatus, errorThrown) {
          $content.removeClass("blg-loading");
          $content.html(`<p>${errorThrown}</p>`);
        },
      });
    }
  };
})(jQuery);

// bloginaSearchSidebarFilter
(function ($) {
  $.fn.bloginaSearchSidebarFilter = function (options) {
    const settings = $.extend(
      {
        ajax_url: 0,
        nonce: "",
      },
      options
    );
    let $form = $(".search-form");
    let $content = $(".blg-post-content");
    let ajax = false;

    setListeners();

    function setListeners() {
      $form.on("submit", function (event) {
        event.preventDefault();
        const searchQuery = $("#search-field").val();
        filterSearch(searchQuery);
      });
    }

    function filterSearch(query) {

      const $message = $("#blg_filter_posts_form_message");

      $message.html("");

      $content.addClass("blg-loading");

      if (ajax) ajax.abort();

      const data = {
        action: "filter_search_sidebar_widget",
        search_query: query,
        post_type: settings.post_type,
        nonce: settings.nonce,
      };

      ajax = $.ajax({
        type: "POST",
        url: settings.ajax_url,
        data: data,
        dataType: "JSON",
        success: function (response) {
          $content.removeClass("blg-loading");

          if (response.success) $content.html(response.content);
          else $content.html(blogina_alertify(response.message, "blg-error"));

        },
        error: function (jqXHR, textStatus, errorThrown) {
          $message.html(blogina_alertify(errorThrown, "blg-error"));
          $content.removeClass("blg-loading");
        },
      });
    }
  };
})(jQuery);

// Blogina REGISTER FORM PLUGIN
(function ($) {
  $.fn.bloginaRegisterForm = function (options) {
    const settings = $.extend(
      {
        ajax_url: 0,
      },
      options
    );
    let $register = $("#blg_register_wrapper");
    let $form = $("#blogina-register-form");
    let ajax = false;

    setListeners();

    function setListeners() {
      $form.off("submit").on("submit", function (event) {
        event.preventDefault();
        register();
      });
    }

    function register() {

      const $message = $("#blg_register_form_message");

      $message.html("");

      $form.addClass("blg-loading");

      $register.fadeTo(200, 0.7);

      if (ajax) ajax.abort();

      const data =
        $form.serialize() +
        "&action=blg_ajax_register&blg_register=" +
        settings.nonce;
      ajax = $.ajax({
        type: "POST",
        url: settings.ajax_url,
        data: data,
        dataType: "JSON",
        success: function (response) {
          $form.removeClass("blg-loading");

          if (response.success) 
          {
            $message.html(blogina_alertify(response.message, "blg-success"));
            if (response.redirect) window.location.href = response.redirect;
         
          } else $message.html(blogina_alertify(response.message, "blg-error"));

          $register.fadeTo(200, 1);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $message.html(blogina_alertify(errorThrown, "blg-error"));
          $form.removeClass("blg-loading");
        },
      });
    }
  };
})(jQuery);

//
// Blogina LOGIN FORM PLUGIN
(function ($) {
  $.fn.BloginaLoginForm = function (options) {
    const settings = $.extend(
      {
        ajax_url: 0,
      },
      options
    );
    let $login = $("#blg_login_wrapper");
    let $form = $("#blogina-login-form");
    let ajax = false;

    setListeners();

    function setListeners() {
      $form.off("submit").on("submit", function (event) {
        event.preventDefault();
        login();
      });
    }

    function login() {

      const $message = $("#blg_login_form_message");

      $message.html("");

      $form.addClass("blg-loading");

      $login.fadeTo(200, 0.7);

      if (ajax) ajax.abort();

      const data =
        $form.serialize() +
        "&action=blg_ajax_login&blg_login=" +
        settings.nonce;

      ajax = $.ajax({
        type: "POST",
        url: settings.ajax_url,
        data: data,
        dataType: "JSON",
        success: function (response) {
          $form.removeClass("blg-loading");
          
          if (response.success) {
            $message.html(blogina_alertify(response.message, "blg-success"));
            if (response.redirect) window.location.href = response.redirect;
          } else $message.html(blogina_alertify(response.message, "blg-error"));

          $login.fadeTo(200, 1);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $message.html(blogina_alertify(errorThrown, "blg-error"));
          $form.removeClass("blg-loading");
        },
      });
    }
  };
})(jQuery);

(function ($) {
  $.fn.bloginaDashboard = function (options) {
    const settings = $.extend(
      {
        ajax_url: "",
      },
      options
    );

    return this.each(function () {
      let $accountContent = $("#account-content");
      let $dashboard = $(this);
      let ajax = false;
      let $dynamicTitle = $("#dynamic-title");

      setListeners();

      function setListeners() {
        $dashboard.find('a').on('click', function (e) {
          e.preventDefault();

          $dashboard.find('a').removeClass('dashboard-active-tab');
          $(this).addClass('dashboard-active-tab');

          let endpoint = $(this).data('endpoint');
          let newTitle = $(this).text(); // Get the text of the clicked tab

          updateTitle(newTitle); // Update the title
          loadContent(endpoint);
        });

        // Default tab selection
        $dashboard.find('a[data-endpoint="dashboard"]').addClass('dashboard-active-tab');
      }

      function loadContent(endpoint) {
        if (ajax) ajax.abort(); 

        $accountContent.addClass('blg-loading');

        ajax = $.ajax({
          url: settings.ajax_url, 
          type: 'POST',
          dataType: "JSON",
          data: {
            action: 'blg_load_account_content',
            endpoint: endpoint,
          },
          success: function (response) {
            $accountContent.removeClass('blg-loading');
            
            if (response.success){
              $accountContent.html(response.content);
              if(response.redirect_url){
                $accountContent.html(blogina_alertify(response.message, "blg-success"));
                window.location.href = response.redirect_url;
              }
            } else $accountContent.html(blogina_alertify(response.message, "blg-error"));
            
          },
          error: function () {
            $accountContent.html(blogina_alertify('An Error occurred', "blg-error"));
            $accountContent.removeClass('blg-loading');
          }
        });
      }

      function updateTitle(newTitle) {
        // Update the dynamic title
        $dynamicTitle.text(newTitle);
      }
    });
  };
})(jQuery);

// Television filter bar ajax
(function ($) {
  $.fn.bloginaTelevisionFilterBar = function (options) {
    const settings = $.extend(
      {
        ajax_url: "",
        nonce: "",
      },
      options
    );
    
    let $form = $(".television-filter-bar");
    let $content = $(".blg-post-content");
    let ajax = false;

    setListeners();

    function setListeners() {
      $form.on("change", function (event) {
        event.preventDefault();
        televisionFilterBar();
      });
    }

    function televisionFilterBar() {

      $content.addClass("blg-loading");

      if (ajax) ajax.abort();

      const filterValue = $form.val();

      const data = {
        action: "television_filter_bar",
        nonce: settings.nonce,
        filter: filterValue 
      };

      ajax = $.ajax({
        type: "POST",
        url: settings.ajax_url,
        data: data,
        dataType: "JSON",
        success: function (response) {
          $content.removeClass("blg-loading");

          if (response.success) {
            $content.html(response.content); 
          } else {
            $content.html(blogina_alertify(response.message, "blg-error"));
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $content.html(blogina_alertify(errorThrown, "blg-error"));
          $content.removeClass("blg-loading");
        },
      });
    }
  };
})(jQuery);

(function ($) {
  // Document is Ready!
  $(function () {
    $("#toggle-sidebar").click(function () {
      $("#sidebar").removeClass("translate-x-full").addClass("translate-x-0");
    });

    $("#toggle-sidebar-close").click(function () {
      $("#sidebar").removeClass("translate-x-0").addClass("translate-x-full");
    });
  });

  function toggleSidebarWidget(widgetClass, categoriesClass, iconClass) {
    $(widgetClass).on("click", function () {
      var $this = $(this);
      var $categoriesList = $this.next(categoriesClass);
      var $icon = $this.find(iconClass + " svg");
      var isExpanded = $categoriesList.is(":visible");
  
      $categoriesList.toggle();
  
      if (isExpanded) {
        $this.removeClass('border-b border-gray-100');
      } else {
        $this.addClass('border-b border-gray-100');
      }
  
      $icon.css("transform", isExpanded ? "rotate(0deg)" : "rotate(265deg)");
    });
  }
  

  toggleSidebarWidget(
    ".blog-sidebar-widget-title",
    ".blog-sidebar-widget-categories",
    ".blog-sidebar-widget-icon"
  );
  toggleSidebarWidget(
    ".course-sidebar-widget-title",
    ".course-sidebar-widget-section",
    ".course-sidebar-widget-icon"
  );
  toggleSidebarWidget(
    ".television-sidebar-widget-title",
    ".television-sidebar-widget-categories",
    ".television-sidebar-widget-icon"
  );
})(jQuery);

