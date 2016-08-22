'use strict';

angular.module('rorquizapp')
  .controller('QuizController', function($scope, $log, $timeout, $state, $stateParams, MainRestangular) {
    $scope.formData = {};
    var quizStarted = false;
    var submitted = false;

    MainRestangular.getQuizzes($stateParams.quizType).then(function(response) {
      $scope.quizzes = response;
    }, function(err) {
      console.log(err);
    });

    //jQuery time
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    // $scope.$on('timer-stopped', function (event, data) {
    //   event.preventDefault();
    //   if (!submitted) {
    //     $scope.submitQuiz($scope.responder);
    //     quizStarted = false;
    //   }
    // });

    $scope.nextStep = function(event) {
      if (!quizStarted) {
        quizStarted = true;
        // $scope.$broadcast('timer-start');
        // $scope.countDown = 45 * 60; // 2700
      }

      if (animating) return false;
      animating = true;

      var target = angular.element(event.target);
      current_fs = target.parent();
      next_fs = target.parent().next();
      // console.log(this);
      // console.log(current_fs);
      // console.log(next_fs);

      //activate next step on progressbar using the index of next_fs
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();
      //hide the current fieldset with style
      current_fs.animate({
        opacity: 0
      }, {
        step: function(now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale current_fs down to 80%
          scale = 1 - (1 - now) * 0.2;
          //2. bring next_fs from the right(50%)
          left = (now * 50) + "%";
          //3. increase opacity of next_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({
            'transform': 'scale(' + scale + ')'
          });
          next_fs.css({
            'left': left,
            'opacity': opacity
          });
        },
        duration: 800,
        complete: function() {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
      });
    };

    $scope.previousStep = function(event) {
      if (animating) return false;
      animating = true;

      var target = angular.element(event.target);
      current_fs = target.parent();
      previous_fs = target.parent().prev();

      //de-activate current step on progressbar
      $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

      //show the previous fieldset
      previous_fs.show();
      //hide the current fieldset with style
      current_fs.animate({
        opacity: 0
      }, {
        step: function(now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale previous_fs from 80% to 100%
          scale = 0.8 + (1 - now) * 0.2;
          //2. take current_fs to the right(50%) - from 0%
          left = ((1 - now) * 50) + "%";
          //3. increase opacity of previous_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({
            'left': left
          });
          previous_fs.css({
            'transform': 'scale(' + scale + ')',
            'opacity': opacity
          });
        },
        duration: 800,
        complete: function() {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
      });
    };

    $scope.submitQuiz = function(responder) {
      submitted = true;
      quizStarted = false;
      MainRestangular.postQuiz(responder).then(function(err, res) {
        // console.error(err);
        // console.info(res);
        if (err && err.data) {
          // var errMessage = err.data.error;
          // console.log(errMessage);
          alert('An error occured while submitting your answers');
          return $state.reload();
        } else {
          $state.go('thanks');
          $timeout(function() {
            // return window.location.go('http://localhost:3000');
          }, 3000);
        }
      });
    };
  });
