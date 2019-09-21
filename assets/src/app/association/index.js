angular.module( 'conexus.association', [
])

.config(['$stateProvider', function config( $stateProvider ) {
	$stateProvider.state( 'association', {
		url: '/association/:id',
		views: {
			"main": {
				controller: 'AssociationCtrl',
				templateUrl: 'association/index.tpl.html'
			}
		},
        resolve:{
            association: ['$stateParams', 'AssociationModel', function($stateParams, AssociationModel){
                return AssociationModel.get({id:$stateParams.id});
            }]
        }
	});
}])

.controller( 'AssociationCtrl', ['$location', '$mdSidenav', '$rootScope', '$sailsSocket', '$sce', '$scope', 'association', 'ReactionModel', 'titleService', 'ValidationModel', function AssociationController( $location, $mdSidenav, $rootScope, $sailsSocket, $sce, $scope, association, ReactionModel, titleService, ValidationModel ) {

	$scope.association = association;
    $scope.association.model = 'ASSOCIATION';

    if(!$scope.association){$location.path('/')}

    $scope.connection = {
        title:'Default Connection',
        description:'this is the default connection',
        context:{lol:100},
        type:'PRACTICE',
        information:{
            direction:{},
        },
        logic:{},
        data:{
            self:{},
            apps:{
                reactions:{plus:0,minus:0},
                attention:{general:0}
            }
        },

        modelAlpha:'CONTENT',
        modelBeta:'CONTENT',
        creator:'troverman',
        id:1
    }

    console.log($scope.association);

    $scope.tokens = [
        {string:'CRE8+ASSOCIATION+'+$scope.association.id, amount:1},
        {string:'CRE8+ASSOCIATION+'+$scope.association.associatedModels[0].id+'+'+$scope.association.associatedModels[1].id, amount:1}
    ]
    
    titleService.setTitle('Association | '+$scope.association.id + ' | CRE8.XYZ');

    //BACKEND.. FRONTEND.. HM
    var validationQuery = {
        association:[$scope.association.associatedModels[0].id,$scope.association.associatedModels[1].id], 
        limit:10, 
        skip:0, 
        sort:'createdAt DESC'
    };
    ValidationModel.get(validationQuery).then(function(validations){
        $scope.validations = validations.map(function(obj){obj.model='VALIDATION';return obj});
    });

    $scope.associationColumn = {
        chart: {zoomType: 'x'},
        series: [{
            id: 'association',
            type: 'column',
            name: 'Validation',
            data: [],
            yAxis: 0
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
        legend: {enabled: false},
        credits:{enabled:false},
        plotOptions: {column: {minPointLength: 3}},
    };

    $scope.contextList = [];
    if ($scope.association.context){
        for (x in Object.keys($scope.association.context)){
            $scope.contextList.push([Object.keys($scope.association.context)[x], $scope.association.context[Object.keys($scope.association.context)[x]]]);
        }
    }

    //TODO: CAN IMRPOVE
    for (x in $scope.contextList){
        $scope.associationColumn.series[0].data.push($scope.contextList[x][1]);
        $scope.associationColumn.xAxis.categories.push($scope.contextList[x][0]);
    }

    $scope.selectedTab = 'INFORMATION';
    $scope.selectTab = function(model){$scope.selectedTab = model;};

    $sailsSocket.subscribe('association', function (envelope) {
        console.log(envelope)
        if (envelope.verb == 'update'){
            if ($scope.association.id == envelope.data.id){
                $scope.association.data = envelope.data.data
            }
        }
    });

    $sailsSocket.subscribe('validation', function (envelope) {
        console.log(envelope);
        if (envelope.verb == 'update'){
            var index = $scope.validations.map(function(obj){return obj.id}).indexOf(envelope.data.id);
            if (index != -1){$scope.validations[index] = envelope.data;}
        }
    });

}]);