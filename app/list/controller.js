'use strict';

angular.module('cards')
    .controller('ListCtrl', function ($scope, dataTruck) {
        $scope.data = dataTruck.get();
        $scope.cardId = null;
        $scope.cardsBlocked = true;

        /**
         * Send changed app data
         */
        $scope.$watch('data', function (data) {
            console.log(data);
            dataTruck.set(data);
        }, true);

        /**
         * Check when all cards are blocked
         */
        $scope.$watch('data.cards.list', function () {
            $scope.cardsBlocked = true;
            angular.forEach($scope.data.cards.list, function (value) {
                if (value.isActivated && !value.isBlocked) {
                    $scope.cardsBlocked = false;
                }
            });
        }, true);

        /**
         * Cards block toggle
         */
        $scope.cardsBlockToggle = function () {
            angular.forEach($scope.data.cards.list, function (value) {
                if (value.isActivated) {
                    value.isBlocked = $scope.cardsBlocked;
                }
            });
        };

        /**
         * Choose a default card
         */
        $scope.setDefaultCard = function () {
            var cards = $scope.data.cards.list;
            for (var num in cards) {
                var card = cards[num];
                if (card.isActivated) {
                    $scope.cardId = card.id;
                    break;
                }
            }
        };
        $scope.setDefaultCard();

        /**
         * Get a current card
         * @returns {*}
         */
        $scope.currentCard = function () {
            var key = getKeyById($scope.cardId);
            return $scope.data.cards.list[key];
        };

        /**
         * Choose a card
         * @param card
         */
        $scope.openCard = function (card) {
            $scope.cardId = card.id;
        };

        /**
         * Remove a card
         * @param card
         * @returns {boolean}
         */
        $scope.removeCard = function (card) {
            var key = getKeyById(card.id);
            if (confirm('Are you sure?')) {
                delete $scope.data.cards.list[key];
                var cards = $scope.data.cards.list;
                $scope.data.cards.list = cards.filter(function () {
                    return true;
                });
                $scope.setDefaultCard();
                return true;
            }
            return false;
        };

        /**
         * Activate a card
         * @param card
         */
        $scope.activateCard = function (card) {
            card.isActivated = true;
        };

        /**
         * Get a key of card by id
         * @param id
         * @returns {object|null}
         */
        function getKeyById(id) {
            var key = null;
            angular.forEach($scope.data.cards.list, function (value, num) {
                if (value.id == id) {
                    key = num;
                }
            });
            return key;
        }
    });