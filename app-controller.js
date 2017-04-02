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