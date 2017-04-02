describe('app.controller', function () {

    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('Check if load more search results is shown correctly when can load more results', function () {
        it('Test', function () {
            var $scope = {
                query: {
                    text: 'abc',
                    page: 1,
                    total: 60
                }
            };
            var controller = $controller('AppController', {
                $scope: $scope
            });
            //Consider fetch limit is 6.
            expect($scope.vm.canLoadMore()).toBe(true);
        });
    });

    describe('Check if load more search results is shown correctly when you cannot load more results', function () {
        it('Test', function () {
            var $scope = {
                query: {
                    text: 'abc',
                    page: 10,
                    total: 60
                }
            };
            var controller = $controller('AppController', {
                $scope: $scope
            });
            //Consider fetch limit is 6.
            expect($scope.vm.canLoadMore()).toBe(false);
        });
    });

});