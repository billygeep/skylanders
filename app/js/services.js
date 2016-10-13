myApp.service("dataService", function($http, $q){
    var deferred = $q.defer();
    $http.get('data.json').then(function(data) {
        deferred.resolve(data);
    });
    this.getData = function(){
        return deferred.promise;
    };
});