angular.module( 'conexus.app', [
])

.config(['$stateProvider', function config( $stateProvider ) {
    $stateProvider.state( 'app', {
        url: '/app/:id',
        views: {
            "main": {
                controller: 'AppController',
                templateUrl: 'app/index.tpl.html'
            }
        },
        resolve: {
            app: ['$stateParams', 'AppModel', function($stateParams, AppModel){
                return AppModel.get({id:$stateParams.id, limit:1, skip:0, sort:'createdAt DESC'});
            }],
        }
    });
}])

.controller( 'AppController', ['$location', '$mdSidenav', '$rootScope', '$sailsSocket', '$sce', '$scope', '$stateParams', 'app', 'AssociationModel', 'ReactionModel', 'titleService', 'toaster', 'ValidationModel', function AppController( $location, $mdSidenav, $rootScope, $sailsSocket, $sce, $scope, $stateParams, app, AssociationModel, ReactionModel, titleService, toaster, ValidationModel ) {
    
    $scope.app = app;
    if(!$scope.app){$location.path('/')}

    $scope.app.isAssociated = false;
    $scope.app.model = 'APP';
    $scope.app.protocols = JSON.stringify($scope.app.protocols, null, 4);

    if ($rootScope.currentUser){
        $scope.myApps = $rootScope.currentUser.apps;
        console.log($scope.myApps);
    }

    console.log($scope.app)

    var associationQuery = {
        app:$scope.app.id, 
        limit:10, 
        skip:0, 
        sort:'createdAt DESC'
    };
    AssociationModel.get(associationQuery).then(function(associations){
        console.log(associations);
        $scope.associations = associations.map(function(obj){obj.model='ASSOCIATION';return obj});
    });

    titleService.setTitle($scope.app.title + ' | App | CRE8.XYZ');

    //LOOK AT ALL FILES
    //ASSOCIATED CONTENT (TYPE CODE / PROTOCOL) AS CODE.. 
    //UNIFY MODEL(S) ?
    //.git repo.. etc

    $scope.selectedTab = 'INFORMATION';
    $scope.selectTab = function(model){$scope.selectedTab = model;};

    $scope.associateApp = function(model){
        if ($rootScope.currentUser){
            $scope.newValidation = {
                user:$rootScope.currentUser.id,
                creator:$rootScope.currentUser.id,
                context:{self:100},
                associatedModels:[
                    {type:'MEMBER', id:$rootScope.currentUser.id},
                    {type:'APP+'+model.id, id:model.id},
                ],
            };

            if (model.isAssociated == false){
                ValidationModel.create($scope.newValidation).then(function(newValidation){
                    $scope.app.isAssociated = true;
                    $rootScope.pop('Associated App!', 'You are now connected with '+ model.title + '!');
                });
            }

            else if (model.isAssociated == true){
                $scope.app.isAssociated = false;
                $rootScope.pop('Removed App!', 'It\'s all good!');
            }
        }
    };

    $sailsSocket.subscribe('app', function (envelope) {
        console.log(envelope)
        if (envelope.verb == 'update'){
            if ($scope.app.id == envelope.data.id){
                $scope.app.data.apps = envelope.data.data.apps
            }
        }
    });

    $sailsSocket.subscribe('association', function (envelope) {
        if (envelope.verb == 'update'){
            var index = $scope.associations.map(function(obj){return obj.id}).indexOf(envelope.data.id);
            if (index != -1){$scope.associations[index] = envelope.data;}
        }
    });

   
}]);
