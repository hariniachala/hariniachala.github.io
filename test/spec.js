describe('app.controller', function () {

    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('$scope.canLoadMore', function () {
        it('Check if "show more" button is shown when user is on the first page', function () {
            //init scope query
            var scope = {
                query: {
                    text: '',
                    page: 0,
                    total: 0
                }
            };
            var controller = $controller('AppController', {
                $scope: scope
            });
            //setup the test scenario
            scope.query.page = 1;
            scope.query.total = 60;
            //consider fetch limit of 6.
            expect(scope.canLoadMore()).toBe(true);
        });
    });

    describe('$scope.canLoadMore', function () {
        it('Check if "show more" button is not shown when user is on the last page', function () {
            //init scope query
            var scope = {
                query: {
                    text: '',
                    page: 0,
                    total: 0
                }
            };
            var controller = $controller('AppController', {
                $scope: scope
            });
            //setup the test scenario
            scope.query.page = 10;
            scope.query.total = 60;
            //consider fetch limit of 6.
            expect(scope.canLoadMore()).toBe(false);
        });
    });

});