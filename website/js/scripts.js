/* eslint-disable no-undef */

(function($) {
	'use strict';

	/* Preloader */
	$(window).on('load', function() {
		const preloaderFadeOutTime = 500;
		function hidePreloader() {
			const preloader = $('.spinner-wrapper');
			setTimeout(function() {
				preloader.fadeOut(preloaderFadeOutTime);
			}, 500);
		}
		hidePreloader();
	});


	/* Navbar Scripts */
	// jQuery to collapse the navbar on scroll
	$(window).on('scroll load', function() {
		if ($('.navbar').offset().top >= 160) {
			$('.fixed-top').addClass('top-nav-collapse');
		}
		else {
			$('.fixed-top').removeClass('top-nav-collapse');
		}
	});

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$(document).on('click', 'a.page-scroll', function(event) {
			const $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top,
			}, 600, 'easeInOutExpo');
			event.preventDefault();
		});
	});

	// closes the responsive menu on menu item click
	$('.navbar-nav li a').on('click', function() {
		if (!$(this).parent().hasClass('dropdown')) {$('.navbar-collapse').collapse('hide');}
	});


	/* Move Form Fields Label When User Types */
	// for input and textarea fields
	$('input, textarea').keyup(function() {
		if ($(this).val() != '') {
			$(this).addClass('notEmpty');
		}
		else {
			$(this).removeClass('notEmpty');
		}
	});


	/* Back To Top Button */
	// create the back to top button
	$('body').prepend('<a href="body" class="back-to-top page-scroll">Back to Top</a>');
	const amountScrolled = 800;
	$(window).scroll(function() {
		if ($(window).scrollTop() > amountScrolled) {
			$('a.back-to-top').fadeIn('500');
		}
		else {
			$('a.back-to-top').fadeOut('500');
		}
	});


	/* Removes Long Focus On Buttons */
	$('.button, a, button').mouseup(function() {
		$(this).blur();
	});

})(jQuery);