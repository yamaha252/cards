'use strict';

angular.module('cards')
    .controller('ListCtrl', function ($scope, $routeParams, dataTruck) {
        $scope.data = dataTruck.get();
        $scope.cardId = $routeParams.id || null;
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
            $scope.cardId = null;
            var cards = $scope.data.cards.list;
            for (var num in cards) {
                var card = cards[num];
                if (card.isActivated) {
                    $scope.cardId = card.id;
                    break;
                }
            }
        };

        if (!$scope.cardId) {
            $scope.setDefaultCard();
        }

        /**
         * Get a current card
         * @returns {*}
         */
        $scope.currentCard = function () {
            var key = getCardKeyById($scope.cardId);
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
            var key = getCardKeyById(card.id);
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
            if (!$scope.cardId) {
                $scope.cardId = card.id;
            }
        };

        /**
         * Get a key of card by id
         * @param id
         * @returns {object|null}
         */
        function getCardKeyById(id) {
            var key = null;
            angular.forEach($scope.data.cards.list, function (value, num) {
                if (value.id == id) {
                    key = num;
                }
            });
            return key;
        }
    })
    /**
     * Progress line
     */
    .directive('ngProgress', function () {
        return {
            restrict: 'EA',
            scope: {
                current: '=?',
                max: '=?'
            },
            templateUrl: 'list/progress.html',
            link: function ($scope) {
                $scope.$watch('current', calculate);
                $scope.$watch('max', calculate);
                function calculate() {
                    var percent = Math.round(parseInt($scope.current) / parseInt($scope.max) * 100);
                    $scope.percent = percent > 100 ? 100 : percent;
                }
            }
        }
    })
    /**
     * Icon of an operation
     */
    .directive('ngIcon', function () {
        return {
            restrict: 'EA',
            scope: {
                description: '=?'
            },
            template: '<div style="background:{{color}};" class="operation-icon">{{letter}}</div>',
            link: function ($scope) {
                $scope.letter = $scope.description[0].toUpperCase();
                $scope.color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
            }
        }
    })
    /**
     * Operations list
     */
    .directive('ngOperations', function () {
        return {
            restrict: 'EA',
            scope: {
                items: '=?'
            },
            templateUrl: 'list/operations.html',
            link: function ($scope) {
                $scope.byPage = 10;
                $scope.page = 1;

                function calculate() {
                    $scope.count = $scope.items.length;
                    $scope.pages = Math.ceil($scope.count / $scope.byPage);
                    $scope.count = $scope.items.length;
                    $scope.start = ($scope.page-1) * $scope.byPage;
                    $scope.end = $scope.start + $scope.byPage;
                    if ($scope.end > $scope.count) {
                        $scope.end = $scope.count;
                    }
                    $scope.list = $scope.items.slice($scope.start, $scope.end);
                }

                $scope.$watch('items', function () {
                    $scope.page = 1;
                    calculate();
                });
                $scope.$watch('page', calculate);

                $scope.prev = function () {
                    if ($scope.page > 1) {
                        $scope.page--;
                    }
                };

                $scope.next = function () {
                    if ($scope.page < $scope.pages) {
                        $scope.page++;
                    }
                };
            }
        }
    })
;