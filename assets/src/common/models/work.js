angular.module('models.work', ['lodash', 'services', 'sails.io',])

.service('WorkModel',['lodash', 'utils', '$sailsSocket', function(lodash, utils, $sailsSocket) {
    
    this.getSome = function(type, filter, limit, skip, sort) {
        var query = {};
        if (type=="project"){query = {params:{project:filter, limit:limit,skip:skip,sort:sort}};}
        if (type=="task"){query = {params:{task:filter, limit:limit,skip:skip,sort:sort}};}
        if (type=="user"){query = {params:{user:filter, limit:limit,skip:skip,sort:sort}};}
        else{query = {params:{limit:limit,skip:skip,sort:sort}};}
        var url = utils.prepareUrl('work');
        return $sailsSocket.get(url, query).then(success, error);
    };

    this.create = function(newModel) {
        var url = utils.prepareUrl('work');
        return $sailsSocket.post(url, newModel).then(success, error);
    };

    var success = function(response) {
        return response.data;
    };

    var error = function(error) {
        console.log(error);
    };

}]);