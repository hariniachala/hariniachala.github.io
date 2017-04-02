/**
 * Created by hsirisena on 3/31/17.
 */
angular.module('app')
    .directive('resizeHeight', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                //console.log(element[0].clientWidth);
                //Set the image height to match, initialize.
                scope.initResize = false;
                if (!scope.initResize) {
                    element.css('height', element[0].clientWidth + 'px');
                    element.css('overflow', 'hidden');
                    scope.initResize = true;
                }

                //Make the height change responsive
                scope.$watch(function () {
                    return element[0].clientWidth;
                }, function (newVal, oldVal) {
                    if (newVal != oldVal) {
                        //console.log(element[0].clientWidth);
                        //Set the image height to match the width
                        element.css('height', element[0].clientWidth + 'px');
                        element.css('overflow', 'hidden');
                    }
                }, true);

                var win = angular.element($window);
                win.bind('resize', function () {
                    scope.$apply();
                });
            }
        };
    }])
;
