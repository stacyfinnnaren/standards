(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.export = $(function(){
  if ( $('#back-to-top').length ) {
    var scrollTrigger = 100, // px
      backToTop = function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > scrollTrigger) {
          $('#back-to-top').addClass('show');
        } else {
          $('#back-to-top').removeClass('show');
        }
      };

    backToTop();

    $(window).on('scroll', function () {
      backToTop();
      if ( $('#full-footer-start').offset().top < $(this).height() + $(this).scrollTop() ){
        $('#back-to-top').removeClass('show');
      }

    });

    $('#back-to-top').on('click', function (e) {
      e.preventDefault();
      $('html,body').animate({
        scrollTop: 0
      }, 700);
    });
  }
});

},{}],2:[function(require,module,exports){
require('./back-to-top.js');
require('./phila-gov.js');

},{"./back-to-top.js":1,"./phila-gov.js":3}],3:[function(require,module,exports){
/**
 *
 * Custom js for our theme
 *
**/
/*
//department filter list
new List('filter-list', {
  valueNames: ['item', 'item-desc']
});
*/
//provide function for preventing link follow-through
function noLink(e){
  e.preventDefault();
}

//provide logo fallback for old browsers. Thanks https://css-tricks.com/a-complete-guide-to-svg-fallbacks/
function svgasimg() {
  return document.implementation.hasFeature(
    'http://www.w3.org/TR/SVG11/feature#Image', '1.1');
}

if (!svgasimg()){
  var e = document.getElementsByTagName('img');
  if (!e.length){
    e = document.getElementsByTagName('IMG');
  }
  for (var i=0, n=e.length; i<n; i++){
    var img = e[i],
        src = img.getAttribute('src');
    if (src.match(/svgz?$/)) {
      /* URL ends in svg or svgz */
      img.setAttribute('src',
      img.getAttribute('data-fallback'));
    }
  }
}

jQuery(document).ready(function($) {

  /*Globals */
  var navHeight = $('.global-nav').height();
  var currentPath = window.location.pathname;
  var windowWidth = $(window).width();

  //Generic class for links that should prevent clickthrough
  $('.no-link').click(function(e){
    e.preventDefault();
  });

  $('.top-bar').css( 'top', navHeight );

  var translate = setTimeout(function() { $('#google_translate_element a').prepend('<i class="fa fa-globe"></i>'); }, 1000);

  $( $( '.global-nav a' ) ).each( function() {
    if ( currentPath == $( this ).attr('href') || currentPath == $( this ).data( 'link' ) ){

      $(this).addClass('js-is-current');
      //special handling for services
    }else if( currentPath.indexOf('/services/') === 0 ){
      $('.services-menu-link a').addClass('js-is-current');
    }
  });

  /* Provide option for explict show/hide declarations, with jQuery fallbacks for older (ios) browsers */
  function togglePageBody( show ){
    if( show === true ){
      $('#page').show();
      $('#page').removeClass('hide');

      $('footer').show();
      $('footer').removeClass('hide');
      return;
    }

    if( show === false ){

      $('#page').hide();
      $('#page').addClass('hide');

      $('footer').hide();
      $('footer').addClass('hide');
      return;
    }
    $('#page').toggle();
    $('#page').toggleClass('hide');

    $('footer').toggle();
    $('footer').toggleClass('hide');


  }
  /* Drilldown menu */

  $(document).on('toggled.zf.responsiveToggle', '[data-responsive-toggle]', function(){
    var mobileMenu = new Foundation.Drilldown( $('.mobile-nav-drilldown') );

    if ( $( '.js-current-section' ).length === 0 ) {
      $('li.js-drilldown-back').after( '<li class="js-current-section" aria-hidden="false"></li>' );
    }
    $('li.js-drilldown-back').attr('tabindex', '1');

    $('.mobile-nav-drilldown li').each( function() {
        $(this).attr('tabindex', '0');
    });

    $('.menu-icon .title-bar-title').text( ( $('.menu-icon .title-bar-title' ).text() == 'Menu' ) ? 'Close' : 'Menu' );

    $('.global-nav .menu-icon').toggleClass('active');

    $('body').removeClass('no-scroll');

    $('.menu-icon i').toggleClass('fa-bars').toggleClass('fa-close');

    /* duplicate aria tags on drilldown parents, to allow full tap on item */
    $('li.is-drilldown-submenu-parent').each(function() {
      var aria = $(this).attr('aria-label');
      $(this).children('a').first().attr('aria-label', aria);
    });

    drilldownMenuHeight();

    if($('.mobile-nav-drilldown').is(':visible')){
      togglePageBody(false);

    }else{
      togglePageBody(true);
    }
  });

  var parentLink = ['Main Menu'];

  $(document).on('open.zf.drilldown', '[data-drilldown]', function(){

    $('body').scrollTop('0');

    parentLink.push( $(this).find('.is-active').last().prev().text() );

    $(this).find('.is-active').last().addClass('current-parent');

    $('.current-parent > li.js-drilldown-back a').text( 'Back to ' + parentLink.slice(-2)[0] );

    $('.js-current-section').html( parentLink.slice(-1)[0] );

    /* Ensure no events get through on titles */
    $('.js-current-section').each(function( ) {
      $(this).click(function(e) {
        return false;
      });

    });
    //don't let events bubble up and cause issues on ul click
    $( 'ul.is-active' ).click(function( e ) {
      e.stopPropagation();
    });

    $(this).find('.is-active').attr('aria-hidden', 'false');

    $(this).find('.is-drilldown-submenu').not('.is-active').attr('aria-hidden', 'true');


  });

  $(document).on('hide.zf.drilldown', '[data-drilldown]', function(){
    parentLink.pop();

    $('.current-parent > li.js-drilldown-back a').text( 'Back to ' + parentLink.slice(-2)[0] );

    $('.js-current-section').html( parentLink.slice(-1)[0] );

  });

  $('#services-mega-menu').hover( function(){
    $( '.site-search i' ).addClass('fa-search').removeClass('fa-close');

  }, function(){
    $('body').removeClass('no-scroll');
    $( '.site-search i' ).addClass('fa-search').removeClass('fa-close');

  });

  function resetLayout(){
    togglePageBody( true );
    $('.menu-icon i').addClass('fa-bars').removeClass('fa-close');
    $('.menu-icon .title-bar-title').text('Menu');
    $('.menu-icon').removeClass('active');

    $('#services-mega-menu').foundation('close');

    $('body').removeClass('no-scroll');

    if ( $('.is-drilldown').is(':visible') ) {
      $('.title-bar').foundation('toggleMenu');
    }
  }

  function resetScroll(){
    $('#page').click( function() {
      $('body').removeClass('no-scroll');
      $( '.site-search i' ).addClass('fa-search').removeClass('fa-close');
    });

    $('footer').click( function() {
      $('body').removeClass('no-scroll');
      $( '.site-search i' ).addClass('fa-search').removeClass('fa-close');
    });

    $(document).keyup(function(e) {
      //on escape, also remove no-scroll
      if (e.keyCode == 27) {
        $('body').removeClass('no-scroll');
        if ( $('.is-drilldown').is(':visible') ) {
          $('.title-bar').foundation('toggleMenu');
          togglePageBody(true);
        }
      }
    });
  }

  function checkBrowserHeight( navHeight ){
    if ( $('body').hasClass('logged-in') ) {
      return;
    }

    var wh = window.innerHeight;

    var sh = $('#services-mega-menu').innerHeight();

    sh = sh + navHeight;

    if ( $('.sticky').hasClass('is-stuck') ){
      navHeight = $('.sticky-container').height();
    }

    if ( wh <= sh ) {
      $('#services-mega-menu').css({
        'position': 'absolute',
        'top': 0
      });

      togglePageBody( false );
      $('body').removeClass('no-scroll');

    }else{

      togglePageBody( true );
      $('body').addClass('no-scroll');

    }

  }
  /* Mega menu Dropdown */
  $('#services-mega-menu').on('show.zf.dropdown', function() {

    $('#back-to-top').css('display', 'none');

    checkBrowserHeight( navHeight );
  });

  //click and hover handler for desktop service menu link
  $('.services-menu-link').on('click mouseover', function () {
    $( '.site-search i' ).addClass('fa-search').removeClass('fa-close');
  });

  /* All dropdowns */
  $(document).on('hide.zf.dropdown', '[data-dropdown]', function() {
    togglePageBody( true );
    $('body').removeClass('no-scroll');
  });

  /* Site search dropdown */
  $('.site-search-dropdown').on('show.zf.dropdown', function(){
    if ( $('.is-drilldown').is(':visible') ) {

      $('.title-bar').foundation('toggleMenu');
      togglePageBody(true);

    }

    $( '.site-search i' ).addClass('fa-close').removeClass('fa-search');

    $('.site-search span').text( ( $('.site-search span' ).text() == 'Search' ) ? 'Close' : 'Search' );

    $('body').addClass('no-scroll');

    if ( $('.sticky').hasClass('is-stuck') ){
      navHeight = $('.sticky-container').height();
    }

    $(this).css('top', navHeight);

  });

  $('.site-search-dropdown').on('hide.zf.dropdown', function() {
    $( '.site-search i' ).removeClass('fa-close').addClass('fa-search');
    $('.site-search span').text('Search');
  });

  function drilldownMenuHeight(){
    if (Foundation.MediaQuery.current == 'small') {
      var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      var drilldownHeight = $('.global-nav .is-drilldown').outerHeight();
      var singleHeight = $('.global-nav .is-drilldown li').outerHeight() + 10;
      $('.global-nav .is-drilldown ul').css({
        'height': drilldownHeight +  singleHeight + 'px'
      });
    }
  }

  $( window ).resize(function() {

    //check window width for mobile devices to prevent window resize on scroll.
    if ($(window).width() != windowWidth) {
      windowWidth = $(window).width();

      checkBrowserHeight( navHeight ) ;

      drilldownMenuHeight();

      if (Foundation.MediaQuery.atLeast('medium')) {
        //$('.sticky:visible').foundation('_calc', true);
        resetLayout();
      }
    }
    $(window).bind('orientationchange', function(e){

    resetLayout();

  });

  //orientation doesn't matter, always remove the no-scroll class
  $('body').removeClass('no-scroll');

});

  /* prevent search dropdown from becoming dissconnected from header when keyboard is closed on iOS devices */
  $('.search-field').focusout(function() {
    if ( Foundation.MediaQuery.current == 'small' ) {
      window.scrollTo(0, 0);
    }
  });

  resetScroll();

  //prevent enter from refreshing the page and stopping filter search
  $('#filter-list input').keypress(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  $('.clickable-row').click(function() {
    window.location = $(this).data('href');
  });

  $('.clickable-row').hover(function() {
      $(this).addClass('is-hover');
    },
    function(){
      $(this).removeClass('is-hover');
  });

  /* Hijack mailchimp signup forms to use ajax handler */

  /*NOTE: this method requires that the form action URL from mailchimp uses subscribe/post-json */
  ajaxMailChimpForm($('#mc-embedded-subscribe-form'), $('#mc_embed_signup'));
  // Turn the given MailChimp form into an ajax version of it.
  // If resultElement is given, the subscribe result is set as html to
  // that element.
  function ajaxMailChimpForm($form, $resultElement){
    // Hijack the submission. We'll submit the form manually.
    $form.submit(function(e) {
      e.preventDefault();
      if (!isValidEmail($form)) {
        var error =  'A valid email address must be provided.';
        $resultElement.append(error);
        $resultElement.css('color', '#f99300');
      } else {
        $resultElement.css('color', 'black');
        $resultElement.append('Subscribing...');
        submitSubscribeForm($form, $resultElement);
      }
    });
  }
  // Validate the email address in the form
  function isValidEmail($form) {
    var email = $form.find('input[type="email"]').val();
    if (!email || !email.length) {
        return false;
    } else if (email.indexOf('@') == -1) {
        return false;
    }
    return true;
  }
  // Submit the form with an ajax/jsonp request.
  // Based on http://stackoverflow.com/a/15120409/215821
  function submitSubscribeForm($form, $resultElement) {
    $.ajax({
      type: 'GET',
      url: $form.attr('action'),
      data: $form.serialize(),
      cache: false,
      dataType: 'jsonp',
      jsonp: 'c', // trigger MailChimp to return a JSONP response
      contentType: 'application/json; charset=utf-8',
      error: function(error){
          // According to jquery docs, this is never called for cross-domain JSONP requests
      },
      success: function(data){
        if (data.result != 'success') {
          var message = data.msg || 'Sorry. Unable to subscribe. Please try again later.';
          $resultElement.css('color', '#f99300');
          if (data.msg && data.msg.indexOf('already subscribed') >= 0) {
            message = 'You\'re already subscribed. Thank you.';
            $resultElement.css('color', 'black');
          }else if (data.msg && data.msg.indexOf('zip code') >= 0) {
            message = 'Please enter a valid zip code.';
            $resultElement.css('color', 'f99300');
          }
          $resultElement.append(message);
        } else {
          $resultElement.css('color', '#58c04d');
          $resultElement.html('Thank you!<br>You must confirm the subscription in your inbox.');
        }
      }
    });
  }

  //Set Hero Header Tagline font sizes
  if( $('.intro .hero-tagline').length && $('.intro .hero-tagline.emphasis').length  ) {
    var smallFontSize = 2;
    var largeFontSize = 3.5;

    if( $('[data-type="hero-measure"]').width() > 350) {
      while ( $('[data-type="hero-measure"]').width() > 350 ) {
        smallFontSize = smallFontSize - .1;
        $('[data-type="hero-measure"]').css('font-size', smallFontSize + 'rem');
      }
      $('[data-type="hero-tagline"]').css('font-size', smallFontSize + 'rem');
    }

    if( $('[data-type="hero-measure-emphasis"]').width() > 350 ) {
      while ( $('[data-type="hero-measure-emphasis"]').width() > 350 ) {
        largeFontSize = largeFontSize - .1;
        $('[data-type="hero-measure-emphasis"]').css('font-size', largeFontSize + 'rem');
      }
      $('[data-type="hero-tagline-emphasis"]').css('font-size', largeFontSize + 'rem');
    }
  }

  //Homepage Feedback Form
  $('[data-toggle="feedback"]').click(function() {
    $('[data-type="feedback-form"] iframe').css( 'height', '');
    var formOffset = $('[data-toggle="feedback"]').offset();
    var stickyHeight = $('.sticky-container').outerHeight();
    if ( $('#wpadminbar').length ){
      var wpadminbarHeight = $('#wpadminbar').outerHeight();
    } else {
      var wpadminbarHeight = 0;
    }
    var formPosition = formOffset.top - ( stickyHeight + wpadminbarHeight );

    $('[data-type="feedback-form"] iframe').attr('onload',"window.parent.scrollTo(0," + formPosition + ")");

    if ( $('[data-type="feedback-indicator"]').hasClass('up') ){
      $('[data-type="feedback-form"]').slideToggle( function(){
        $('[data-type="feedback-indicator"]').removeClass('up');
        $('[data-type="feedback-footer"]').toggle();
      });
    } else {
      $('[data-type="feedback-form"]').slideToggle();
      $('[data-type="feedback-indicator"]').addClass('up');
      $('[data-type="feedback-footer"]').toggle();
    }
  });

  //Beta tester form
  if ( $('[data-type="data-beta-tester-form"]').length ){
    var formOffset = $('[data-type="data-beta-tester-form"]').offset();
    var stickyHeight = $('.sticky-container').outerHeight();
    if ( $('#wpadminbar').length ){
      var wpadminbarHeight = $('#wpadminbar').outerHeight();
    } else {
      var wpadminbarHeight = 0;
    }
    var formPosition = formOffset.top - ( stickyHeight + wpadminbarHeight );

    $('[data-type="data-beta-tester-form"] iframe').attr('onload',"window.parent.scrollTo(0," + formPosition + ")");
  }

  // Staff summary expand
  $('[data-toggle="data-staff-bio"]').click(function(e){
    e.preventDefault();
    $(this).parent().siblings().toggleClass('expandable');
    if($(this).html() === ' Expand + '){
      $(this).html(' Collapse - ');
    } else {
      $(this).html(' Expand + ');
    }
  });

  /* Async loaded feedback forms */
  $.fn.feedbackify = function( src ) {
    postscribe('#form-container', '<script  type="text/javascript" src="' + src + '"><\/script>');
    $('html,body').animate({
        scrollTop: $('.feedback').position().top - $('header .is-stuck').height()
      }, 700 );
    return false;
  };

  $("footer .feedback").on('click', function(){
    $(this).feedbackify('https://form.jotform.com/jsform/62765090493967');
  });

  $(".neighborhood-resources .feedback").on('click', function(){
    $(this).feedbackify('https://form.jotform.com/jsform/62516788470970');
  });

  //foundation equalizer rows
  if ( $('.equal').length > 0 ) {

    //equalizeByRow: true to force each instance of equalizer to work individually
    var equalizerOptions = { equalizeOnStack: false, equalizeByRow: true };

    $('.equal-height').each( function() {

      $(this).find('.equal').attr('data-equalizer-watch','');

    });

    var equalHeight = new Foundation.Equalizer($ ('.equal-height'), equalizerOptions );

  }

  //foundation tooltips
  if ($('.has-tip').length > 0) {

    var tooltip = new Foundation.Tooltip( $('.has-tip') );

  }

  //reponsive tables
  $( document ).trigger( 'enhance.tablesaw' );

});

},{}]},{},[2]);
