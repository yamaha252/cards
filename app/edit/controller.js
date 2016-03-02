'use strict';

angular.module('cards')
    .controller('EditCtrl', function ($scope, $routeParams, $location, $http, dataTruck) {
        var cardId = $routeParams.id;
        var data = dataTruck.get();
        $scope.card = getCardById(cardId);
        $scope.countries = [];

        $http.get('data/countries.json').success(function (result) {
            $scope.countries = result;
        });

        /**
         * Save changed data
         */
        $scope.save = function () {
            console.log(data);
            dataTruck.set(data).success(function () {
                $location.url('/list?id=' + cardId);
            });
        };

        /**
         * Get a card by id
         * @param id
         * @returns {*}
         */
        function getCardById(id) {
            var card = null;
            angular.forEach(data.cards.list, function (value) {
                if (value.id == id) {
                    card = value;
                }
            });
            return card;
        }
    });