'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
        $http.get('/menu.json')
            .then(function (response) {
                $scope.menu = response.data;
            });

        //todo: я тут наворотил дичи канеш, банально не хватает опыта, и тест не проходит =(
        var $ctrl = this;

        $ctrl.saveToStorage = function (key, obj) {
            $window.localStorage.setItem(key, angular.toJson(obj));
        };

        $ctrl.loadFromStorage = function (key) {
            return angular.fromJson($window.localStorage.getItem(key));
        };

        $scope.resetFilters = function () {
            $scope.sortProp = '';
            $scope.sortReverse = false;
            $scope.searchVal = {};
            $ctrl.saveToStorage('filters', {
                sortProp: '',
                sortReverse: false,
                searchVal: {}
            });
        };

        var storage = $ctrl.loadFromStorage('filters');
        if (storage == undefined) {
            storage = {
                sortProp: '',
                sortReverse: false,
                searchVal: {}
            };
            $ctrl.saveToStorage('filters', storage);
        }

        $scope.sortProp = storage.sortProp;
        $scope.sortReverse = storage.sortReverse;
        $scope.searchVal = storage.searchVal;

        $scope.sortBy = function (sortProp) {
            storage.sortReverse = (storage.sortProp === sortProp) ? !storage.sortReverse : false;
            storage.sortProp = sortProp;
            $ctrl.saveToStorage('filters', storage);
        };

        $scope.$watchCollection('searchVal', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                storage.searchVal = $scope.searchVal;
                $ctrl.saveToStorage('filters', storage);
            }
        });
    }])

    .controller('ModalCtrl', function ($uibModal, $scope, $log) {
        $scope.openModal = function (item) {
            $uibModal.open({
                templateUrl: '/view1/modal.html',
                windowTemplateUrl: '/lib/angular-ui-bootstrap/template/modal/window.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    ingredients: function () {
                        return item.ingredients;
                    }
                }
            }).result.then(function (value) {
                $log.info(value);
            }, function (reason) {
                $log.info(reason);
            });
        };
    })

    .controller('ModalInstanceCtrl', function ($uibModalInstance, ingredients) {
        var $ctrl = this;
        $ctrl.ingredients = ingredients;
        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });