angular.module("app", ["ui.router"]);
angular.module("app")
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app', {
                url: '/app',
                templateUrl: 'app.html',
                cache: false,
                controller: 'AppController'
            })
        $urlRouterProvider.otherwise('/app');

    }]);
