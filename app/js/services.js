


//handle the json data
myApp.service("dataService", function($http, $q){

    var deferred = $q.defer();

    $http.get('data.json').then(function(data) {

        deferred.resolve(data);

    });

    this.getData = function(){

        return deferred.promise;

    };
});


//display service stores the current character arrangements
myApp.factory('DisplayService', function($rootScope) {

	var item;
	var character;

    return {

        updateItem: function(_item) {
            item = _item;
        },

        returnItem: function(call) {
        	return item;
        },

        saveCharacter: function(_item) {
            character = _item;
        },

        returnCharacter: function(call) {
        	return character;
        }
    };
});

//communicate between controllers
myApp.factory('NotifyingService', function($rootScope) {

    return {
        subscribe: function(scope, call, callback) {
            var handler = $rootScope.$on(call, callback);
            scope.$on('$destroy', handler);
        },

        notify: function(call) {
            $rootScope.$emit(call);
        }
    };
});
