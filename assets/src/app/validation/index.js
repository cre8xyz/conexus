angular.module( 'conexus.validation', [
])

.config(['$stateProvider', function config( $stateProvider ) {
    $stateProvider.state( 'validation', {
        url: '/validation/:id',
        views: {
            "main": {
                controller: 'ValidationController',
                templateUrl: 'validation/index.tpl.html'
            }
        },
        resolve: {
            validation: ['$stateParams', 'ValidationModel', function($stateParams, ValidationModel){
                return ValidationModel.getSome({id:$stateParams.id, limit:1, skip:0, sort:'createdAt DESC'});
            }]
        }
    });
}])

.controller( 'ValidationController', ['$mdSidenav', '$location', '$rootScope', '$sailsSocket', '$sce', '$scope', 'ReactionModel', 'titleService', 'validation', 'ValidationModel', function ValidationController( $mdSidenav, $location, $rootScope, $sailsSocket, $sce, $scope, ReactionModel, titleService, validation, ValidationModel) {
    
    $scope.validation = validation[0];
    if(!$scope.validation){$location.path('/')}
    $scope.validation.model = 'VALIDATION';

    titleService.setTitle('Validation | ' + $scope.validation.id + ' | CRE8.XYZ');

    //TODO: FIX
    $rootScope.associatedModels = [{type:'VALIDATION', id:$scope.validation.id}];

    $scope.newReaction = {};
    $scope.reputationList = [];
    $scope.reputationWeightedList = []
    $scope.validationList = [];
    if ($scope.validation.context){
        for (x in Object.keys($scope.validation.context)){
            $scope.validationList.push([Object.keys($scope.validation.context)[x], $scope.validation.context[Object.keys($scope.validation.context)[x]]]);
            $scope.reputationList.push([Object.keys($scope.validation.reputation)[x], $scope.validation.reputation[Object.keys($scope.validation.reputation)[x]]]);        
            $scope.reputationWeightedList.push([Object.keys($scope.validation.reputation)[x], $scope.validation.reputation[Object.keys($scope.validation.reputation)[x]]*$scope.validation.context[Object.keys($scope.validation.context)[x]]]);
        }
    }

    $scope.validationColumn = {
        chart: {zoomType: 'x'},
        series: [{
            id: 'validation',
            type: 'column',
            name: 'Validation',
            data: [],
            yAxis: 0
        },{
            id: 'reputation',
            type: 'column',
            name: 'Reputation',
            data: [],
            yAxis: 1
        },{
            id: 'reputationWeighted',
            type: 'column',
            name: 'Reputation Weighted Validation',
            data: [],
            yAxis: 2
        }],
        title: {text: ''},
        xAxis: {
            crosshair: true,
            gridLineWidth: 0.5,
            gridLineColor: 'grey',
            title: {text: null},
            categories: [],
        },
        yAxis: [
            {title: {text: null}},
            {title: {text: null}},
            {title: {text: null}}
        ],
        legend: {enabled: true},
        credits:{enabled:false},
        plotOptions: {column: {minPointLength: 3}},
    };

    for (x in $scope.validationList){
        $scope.validationColumn.series[0].data.push($scope.validationList[x][1]);
        $scope.validationColumn.series[1].data.push($scope.reputationList[x][1]);
        $scope.validationColumn.series[2].data.push($scope.reputationWeightedList[x][1]);
        $scope.validationColumn.xAxis.categories.push($scope.validationList[x][0]);
    }

    //TODO: DEPRECIATE
    $scope.createReaction = function(item, type){
        if ($rootScope.currentUser){
            $scope.newReaction.amount = 1;
            $scope.newReaction.type = type;
            $scope.newReaction.user = $rootScope.currentUser.id;
            $scope.newReaction.associatedModels = [{type:'VALIDATION', id:item.id}];
            $scope.validation.reactions[type]++;
            ReactionModel.create($scope.newReaction);
        }
        else{$mdSidenav('login').toggle()}
    };

    $sailsSocket.subscribe('validation', function (envelope) {
        switch(envelope.verb) {
            case 'created':
                if ($scope.validation.id == envelope.data.id){
                    $scope.validation.attention = envelope.data.attention;
                }
                break;
        }
    });

}]);
