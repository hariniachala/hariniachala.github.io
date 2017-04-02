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