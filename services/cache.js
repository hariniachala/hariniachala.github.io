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