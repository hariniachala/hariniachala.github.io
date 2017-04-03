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

angular.module("app")
    .constant("SPOTIFY_CLINET_ID", "61f223f618424f60b1b6e451bff9806f")
    .constant("SPOTIFY_CLINET_SECRET", "b4dcb4a38c194e9cb6257dd5b0d9efc1")
    .constant("SEARCH_FETCH_LIMIT", 6);//At most 12 items will be fetched at a time.
/**
 * Created by hsirisena on 3/29/17.
 */

// Have a cache implemented using localstorage
angular.module("app").service("cachingService", function(){

    return {
        getCache: getCache,
        setCache: setCache,
        clearCache: clearCache
    }

    function getCache(key){
        return localStorage[key];
    }

    function setCache(key, value){
        localStorage[key] = value;
    }

    function clearCache(){
        localStorage.clear();
    }

});
angular.module("app")
    .service("spotifyService", ['$http', '$log', '$q', 'cachingService', 'SEARCH_FETCH_LIMIT', function ($http, $log, $q, cachingService, SEARCH_FETCH_LIMIT) {

        return {
            searchArtistOrAlbum: searchArtistOrAlbum,
            getArtistAlbums: getArtistAlbums,
            getAlbumTracks: getAlbumTracks
        }

        function searchArtistOrAlbum(searchString, offset) {
            var limit = SEARCH_FETCH_LIMIT;
            var apiUrl = "https://api.spotify.com/v1/search?q=" + encodeURIComponent(searchString) + "&type=artist,album&offset=" + offset + "&limit=" + limit;
            return $http.get(apiUrl, {cache: true}).then(function (response) {
                if (response) {
                    $log.debug('API GET was called. Response: ' + JSON.stringify(response));
                }
                return response.data;
            });
        }

        function getArtistAlbums(artistId, offset) {
            var deferred = $q.defer();
            var cacheId = "artist-" + artistId;
            var cachedRecord = cachingService.getCache(cacheId);
            if (cachedRecord) {
                deferred.resolve(JSON.parse(cachedRecord));
            } else {
                var apiUrl = "https://api.spotify.com/v1/artists/" + artistId + "/albums";//&offset="+ offset;
                $http.get(apiUrl, {cache: true}).then(function (response) {
                    if (response) {
                        $log.debug('API GET was called. Response: ' + JSON.stringify(response));
                    }
                    var artistRecord = (response.data && response.data.items) ? response.data.items : [];
                    cachingService.setCache(cacheId, JSON.stringify(artistRecord));
                    deferred.resolve(artistRecord);
                });
            }
            return deferred.promise;
        }

        function getAlbumTracks(albumId, offset) {
            var deferred = $q.defer();
            var cacheId = "album-" + albumId;
            var cachedRecord = cachingService.getCache(cacheId);
            if (cachedRecord) {
                deferred.resolve(JSON.parse(cachedRecord));
            } else {
                var apiUrl = "https://api.spotify.com/v1/albums/" + albumId + "/tracks";//&offset=" + offset;
                $http.get(apiUrl, {cache: true}).then(function (response) {
                    if (response) {
                        $log.debug('API GET was called. Response: ' + JSON.stringify(response));
                    }
                    var albumRecord = (response.data && response.data.items) ? response.data.items : [];
                    cachingService.setCache(cacheId, JSON.stringify(albumRecord));
                    deferred.resolve(albumRecord);
                });
            }
            return deferred.promise;

        }
    }]);
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



/**
 * Created by hsirisena on 3/29/17.
 */
angular.module("app").controller("AppController", ['$scope', '$log', '$http', 'spotifyService', 'SEARCH_FETCH_LIMIT', 'cachingService', function ($scope, $log, $http, spotifyService, SEARCH_FETCH_LIMIT, cachingService) {

    //Init scope variables
    $scope.searchTerm = '';
    $scope.search = search;
    $scope.selectItem = selectItem;
    $scope.query = {
        text: null,
        page: 0,
        total: 0
    };
    $scope.loadMore = loadMore;
    $scope.isMoreAvailable = false;
    $scope.items = [];//allItems.albums.items.concat(allItems.artists.items),
    $scope.noResults = false;
    $scope.canLoadMore = canLoadMore;


    function search() {
        $log.debug("Called search with search term: " + $scope.searchTerm);

        if ($scope.searchTerm.trim().length == 0) {
            $log.debug("Cannot search without search term.");
            return;
        }

        $scope.query.text = $scope.searchTerm;
        $scope.query.page = 1;
        $scope.query.total = 0;
        spotifyService.searchArtistOrAlbum($scope.searchTerm, 0)
            .then(function (results) {
                var totalItems = results.albums.items.concat(results.artists.items);
                $scope.items = addMissingImages(totalItems);
                $scope.query.total = (results.albums.total > results.artists.total) ? results.albums.total : results.artists.total;//The type with the most number of results will be considered for pagination.
                $scope.isMoreAvailable = canLoadMore();
                $scope.noResults = totalItems.length > 0 ? false : true;
            })
            .catch(function (error) {
                $log.error("Error in search: " + JSON.stringify(error));
                $scope.items = [];
            });

    }

    function loadMore() {
        $scope.searchTerm = $scope.query.text;
        var offsetVal = (SEARCH_FETCH_LIMIT * $scope.query.page);
        spotifyService.searchArtistOrAlbum($scope.searchTerm, offsetVal)
            .then(function (results) {
                var totalItems = results.albums.items.concat(results.artists.items);
                var items = addMissingImages(totalItems);
                Array.prototype.push.apply($scope.items, items);
                $scope.query.page++;
                $scope.isMoreAvailable = canLoadMore();
            })
            .catch(function (error) {
                console.log("Error!");
            })
        ;
    }

    function canLoadMore() {
        return ( $scope.query.total > $scope.query.page * SEARCH_FETCH_LIMIT);
    }

    //Show a default image when their is no image available.
    function addMissingImages(items) {
        return items.map(function (item, index) {
            if (item.images.length === 0) {
                item.images = [{url: 'images/no-image.png'}];
            }
            return item;
        });
    }

    function selectItem(item) {
        $scope.selectedItem = item;
    }

}])
;