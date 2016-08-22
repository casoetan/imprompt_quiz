'use strict';

angular
  .module('rorquizapp',
    [
      'ngAnimate',
      'ngCookies',
      'ngTouch',
      'ngSanitize',
      'restangular',
      'ui.router',
      'timer'
    ]
  )
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('quiz', {
        url: '/q',
        templateUrl: 'partials/quiz/quiz.html',
        controller: 'QuizController'
      })
      .state('quiz_type', {
        url: '/q/:quizType',
        templateUrl: 'partials/quiz/quiz.html',
        controller: 'QuizController'
      })
      .state('result', {
        url: '/results',
        templateUrl: 'partials/quiz/results.html'
      })
      .state('thanks', {
        url: '/thankyou',
        templateUrl: 'partials/quiz/thankyou.html'
      })
      ;

    $urlRouterProvider.otherwise('/q');
  })
;
