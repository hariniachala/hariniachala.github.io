/**
 * Created by hsirisena on 3/31/17.
 */
angular.module('app')
    .directive('modalBox', [
        '$log',
        '$q',
        'spotifyService',
        function ($log, $q, spotifyService) {
            return {
                restrict: 'E',
                templateUrl: 'directives/modal-box.html',
                scope: {
                    selectedItem: '='
                },
                link: function (scope, element) {


                    scope.$watch(function () {
                        return (scope.selectedItem != null);
                    }, function (newVal, oldVal) {
                        loadData();
                    }, true);

                    function loadData() {
                        if (scope.selectedItem && scope.selectedItem.type === 'artist') {
                            spotifyService.getArtistAlbums(scope.selectedItem.id, 0).then(function (results) {
                                scope.isLoaded = true;
                                scope.selectedItem.list = results;
                            });
                        }

                        if (scope.selectedItem && scope.selectedItem.type === 'album') {
                            spotifyService.getAlbumTracks(scope.selectedItem.id, 0).then(function (results) {
                                scope.isLoaded = true;
                                scope.selectedItem.list = results;
                            });
                        }

                    }

                },
                controller: ['$scope', function ($scope) {

                    $scope.closeModal = closeModal;
                    $scope.showModal = showModal;
                    $scope.isLoaded = false;

                    function showModal() {
                        return $scope.selectedItem != null;
                    }

                    function closeModal() {
                        $scope.selectedItem = null;
                        $scope.isLoaded = false;
                    }

                }]
            };
        }]);


