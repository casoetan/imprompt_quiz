'use strict'

angular.module('rorquizapp')
  .factory('MainRestangular', function(Restangular) {
    var restangular, _apiService;

    restangular = Restangular.withConfig(function(Configurer) {
      // return Configurer.setBaseUrl('http://localhost:8000');
    });

    _apiService = restangular.all('api');
    return {
      url: function() {
        return _apiService.getRestangularUrl();
      },
      getQuizzes: function(quizType) {
        var requestService = null;
        if (quizType) {
          requestService = _apiService.get('quizzes/' + quizType);
        } else {
          requestService = _apiService.get('quizzes');
        }
        return requestService.then(function(quizzes) {
          return quizzes;
        }, function(err) {
          return err;
        });
      },
      postQuiz: function(quiz) {
        return _apiService.customPOST(quiz, 'quiz').then(function(response) {
          return response;
        }, function(err) {
          return err;
        });
      }
    }
  });
