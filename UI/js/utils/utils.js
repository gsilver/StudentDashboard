'use strict';
/* jshint  strict: true*/
/* global $, _*/

/**
 * get the strings from a hidden DOM element and
 * evaluate so that it is available to the non-Angular js
 */
var lang = JSON.parse($('#lang').text());

/**
 * Show spinner whenever ajax activity starts
 */
$(document).ajaxStart(function () {
  $('#spinner').show();
});

/**
 * Hide spinner when ajax activity stops
 */
$(document).ajaxStop(function () {
  $('#spinner').hide();
});

/**
 * set up global ajax options
 */
$.ajaxSetup({
  type: 'GET',
  dataType: 'json',
  cache: false
});

/**
 * Generic error handler
 */
var errorHandler = function (url, result) {
  var errorResponse = {};
  if (!result) {
    errorResponse.message = 'Something happened!';

  } else {
    errorResponse.message = lang.errorCourses;
  }
  return errorResponse;

};

/**
 * Manage dismissing alert
 */

$('.dashMessage').bind('closed.bs.alert', function () {
  dashMessageSeenUpdate();
});


var dashMessageSeenUpdate = function() {
  // on closing the alert, set a sessionStorage value
  sessionStorage.setItem('dashMessageSeen', true);
};



var countReps = function(arr) {
  // counts repetitions in in array, returns 2 arrays of
  // equal length  - one with the uniqued input array, the other 
  // with the number of times the uniqued value was repeated
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
};

/**
 *
 * event watchers
 */

/**
 * All instructors are hidden save the first primary instructor (by alphanum), or the first alphanum.
 * Handler below toggles the complete list
 */
$(document).on('click', '.showMoreInstructors', function (e) {
  e.preventDefault();
  var txt = $(this).closest('div.instructorsInfo').find('.moreInstructors').is(':visible') ? '(more)' : '(less)';
  $(this).text(txt);
  $(this).closest('div.instructorsInfo').find('.moreInstructors').fadeToggle();
  return null;
});

$(document).ready(function(){
  // determine size of viewport
  var is_mobile;
  if( $('#isMobile').is(':visible') === false) {
    is_mobile = true;
  }
  else {
    is_mobile = false;
  }
  // if not a small viewport fetch a list of the available background images
  if(!is_mobile){
    $.ajax({
      url: 'external/image',
      cache: true,
      dataType: 'json',
      method: 'GET'
    })
    .done(function(data){
      // pick a random image and assign it to the body element
      var ramdomImage = _.sample(data);

      //need to get absolute path to deal with Chrome/Safari
      document.body.style.backgroundImage = 'url(' +  'external/image/' + ramdomImage + ')';
    })
    .fail(function() {
      // select a default image and assign it to the body element
      document.body.style.backgroundImage = 'url(' +  'data/images/back/default.jpg' + ')';
    });
  }
});