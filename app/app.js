'use strict';

require('angular');
require('angular-route');
require('angular-smart-table');

var JSONb = require('json-bigint-string');

var module = angular.module('cards', ['ngRoute', 'smart-table']);
module.service('dataTruck', function ($http) {
    var data = [];
    return {
        load: function () {
            return $http.get('data/cards.json', {
                transformResponse: function (data) {
                    return JSONb.parse(data);
                }
            }).success(function (result) {
                data = result;
            });
        },
        get: function () {
            return data;
        },
        set: function (result) {
            data = result;
            return $http.post('#', data);
        }
    };
});

module.config(function ($routeProvider) {
    $routeProvider
        .when('/list', {
            templateUrl: 'list/index.html',
            controller: 'ListCtrl',
            resolve: {
                init: function(dataTruck) {
                    return dataTruck.load();
                }
            }
        })
        .when('/edit', {
            templateUrl: 'edit/index.html',
            controller: 'EditCtrl',
            resolve: {
                init: function(dataTruck) {
                    return dataTruck.load();
                }
            }
        })
        .otherwise({redirectTo: '/list'});
});

require('./edit/controller.js');
require('./list/controller.js');