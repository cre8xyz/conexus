angular.module( 'conexus.marketPair', [
])

.config(['$stateProvider', function config( $stateProvider ) {
	$stateProvider.state( 'marketPair', {
		url: '/market/:id/:id1',
		views: {
			"main": {
				controller: 'MarketPairCtrl',
				templateUrl: 'marketPair/index.tpl.html'
			}
		},
        resolve:{
            orders: ['$stateParams', 'OrderModel', function($stateParams, OrderModel) {
                return OrderModel.getSome('marketPair', $stateParams.id, $stateParams.id1, 100, 0, 'createdAt DESC');
            }],
            mirrorOrders: ['$stateParams', 'OrderModel', function($stateParams, OrderModel) {
                return OrderModel.getSome('marketPair', $stateParams.id1, $stateParams.id, 100, 0, 'createdAt DESC');
            }],
        }
	});
}])

.controller( 'MarketPairCtrl', ['$scope', '$stateParams', 'config', 'mirrorOrders', 'OrderModel', 'orders', 'titleService', function MarketPairController( $scope, $stateParams, config, mirrorOrders, OrderModel, orders, titleService ) {
    $scope.currentUser = config.currentUser;
    $scope.stateParams = $stateParams;
    titleService.setTitle('Market | ' + $stateParams.id + ' | ' +  $stateParams.id1  + ' | CRE8.XYZ');

    $scope.market = $stateParams.id;
    $scope.market1 = $stateParams.id1;

    //TODO: BETTER
    $scope.mirrorOrders = mirrorOrders;
    $scope.mirrorOrders.forEach(function(part, index) {
        if ($scope.mirrorOrders[index].identiferSet){$scope.mirrorOrders[index].identiferSet = $scope.mirrorOrders[index].identiferSet.split(',');}
        if ($scope.mirrorOrders[index].amountSet){$scope.mirrorOrders[index].amountSet = $scope.mirrorOrders[index].amountSet.split(',');}
        if ($scope.mirrorOrders[index].identiferSet1){$scope.mirrorOrders[index].identiferSet1 = $scope.mirrorOrders[index].identiferSet1.split(',');}
        if ($scope.mirrorOrders[index].amountSet1){$scope.mirrorOrders[index].amountSet1 = $scope.mirrorOrders[index].amountSet1.split(',');}
    });

    $scope.percentChange = Math.random()*10;
    $scope.marketDepth = Math.random()*100000;

    $scope.bidAskChart = {
        chart: {
            zoomType: 'x',
        },
        legend:{enabled:true},
        title: {
            text: null
        },
        xAxis: {
            title: {
                text: null
            }
        },
        yAxis: {
            title: {
                text: null
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            type: 'column',
            id: 'Bids',
            name: 'Bids',
            color: '#a94442',
            data: []
        },{
            type: 'column',
            id:  'Asks',
            name: 'Asks',
            color: '#14b794',
            data: []
        }],
        credits:{enabled:false},
    };

	$scope.chart = {
        chart: {
            zoomType: 'x',
        },
        series: [{
            id: 'ExchangePrice',
            type: 'spline',
            name: 'Exchange Price ' + $stateParams.id + ' | ' + $stateParams.id1,
            data: []
        },
        {
            id: 'ExchangeVolume',
            type: 'column',
            name: 'Volume ' + $stateParams.id + ' | ' + $stateParams.id1,
            data: []
        }/*, {
            type: 'sma',
            linkedTo: 'ExchangePrice',
            params: {
                period: 14
            }
        }*/],
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            currentMin: 0,
            currentMax: 20,
            title: null,
            crosshair: true,
            gridLineWidth: 0.5,
            gridLineColor: 'grey'
        },
        yAxis: {
            title: {
                text: null
            }
        },
        credits:{enabled:false},
    };

    $scope.chartMap = {
        chart: {
            polar: true,
            margin: [30, 30, 30, 30]
        },
        series: [{
            id: 'values',
            type: 'area',
            name: 'Values',
            pointPlacement: 'on',
            data: [0.2, 0.15, 0.15, 0.10, 0.15, 0.15, 0.1],
            color: 'rgba(153,0,0,0.3)',
            fillOpacity: 0.3,
        }],
        title: {text: ''},
        xAxis: {
            title: {text: null},
            categories: ['Education', 'Shelter', 'Food', 'Creation', 'Health', 'Security', 'Transparency'],
            tickmarkPlacement: 'on',
            lineWidth: 0,
        },
        yAxis: {
            title: {text: null},
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
        },
        legend: {
            enabled: false,
            //align: 'right',
            //verticalAlign: 'top',
            //y: 70,
            //layout: 'vertical'
        },
        tooltip: {
        //    shared: true,
        },
        credits:{enabled:false},
    };

    //POPULATE ORDER BOOK
    if (orders.length == 0){
        for(var i=-1000;i<1000;i++){
            if (i>0){$scope.bidAskChart.series[1].data.push([i+100000,i*i]);$scope.bidAskChart.series[0].data.push([i+100000,0])}
            if (i<0){$scope.bidAskChart.series[0].data.push([i+100000,i*i]);$scope.bidAskChart.series[1].data.push([i+100000,0])}

            //[1000,1000000],[100,10000],[10,1000],[1,100],[200,2],[220,1],[30,1]
            //$scope.bidAskChart.series[0].data.push([i,i*i])
            //$scope.bidAskChart.series[1].data.push([i,i*i])
        }
    }

    //POPULATE PRICE CHART
    if (true){
        for(var i=0;i<1000;i++){
            var date = new Date();
            date.setTime(date.getTime() - (60*60*1000*(1000-i)));
            if (i == 0){
                $scope.chart.series[0].data.push([date.getTime(),Math.floor(150*Math.random())])
                $scope.chart.series[1].data.push([date.getTime(),Math.floor(20*Math.random())])
            }
            else{
                var random = 1.21*Math.random();
                var random1 = Math.random();
                if (random > random1){
                    $scope.chart.series[0].data.push([date.getTime(),$scope.chart.series[0].data[i-1][1]+3*Math.random()])
                    $scope.chart.series[1].data.push([date.getTime(),20*Math.random()])
                }
                else{
                    $scope.chart.series[0].data.push([date.getTime(),$scope.chart.series[0].data[i-1][1]-3*Math.random()])
                    $scope.chart.series[1].data.push([date.getTime(),20*Math.random()])
                }
            }
        }
    }

    //POPULATE MULTID SPIDER IF PAIRS ARE SETS
    if ($scope.market.split(',').length > 0 || $scope.market1.split(',').length > 0){
        //$scope.chartMap.xAxis.categories.push()
        //$scope.chartMap.series[0].data.push()
    }

    $scope.newOrder = {};
    $scope.newOrderToggleVar = false;
    $scope.orders = orders;
    $scope.orders.forEach(function(part, index) {
        if ($scope.orders[index].identiferSet){$scope.orders[index].identiferSet = $scope.orders[index].identiferSet.split(',');}
        if ($scope.orders[index].amountSet){$scope.orders[index].amountSet = $scope.orders[index].amountSet.split(',');}
        if ($scope.orders[index].identiferSet1){$scope.orders[index].identiferSet1 = $scope.orders[index].identiferSet1.split(',');}
        if ($scope.orders[index].amountSet1){ $scope.orders[index].amountSet1 = $scope.orders[index].amountSet1.split(',');}
    });
    $scope.newOrder.identiferSet = $scope.stateParams.id;
    $scope.newOrder.identiferSet1 = $scope.stateParams.id1;
    $scope.trades = {};

    //TODO | COLOR FLIP?

    //OrderBook ~ []
    //mapping(string => mapping(string => mapping(string => OrderMapping[]))) orderBook;
    //orderBook[_idSet1][_idSet2][_valueSet1];
    //['CRE8']['USD']['8888.8888'] = Positions Array []
    //bracket? ^ faces a query problem | event sorting? -- limit the query by event logs. good. 
    //bidAskChart[price][amount]
    var orderObj = {}
    if (orders.length > 0){
        for (x in orders){
            //TODO: MULTI D SET | Price
            //[a,b,c] = [d,e,f]
            //[1,2,3] = [4,5,6]
            //[1a,2b,3c] = [4d,5e,6f] --> what manifolds does this create? 
            //(1a+2b+3c) = (4d+5e+6f) | a = 4d+5e+6f-2b-3c.., b = (4d+5e+6f-a-3c)/2.., c = (4d+5e+6f-a-2b)/3
            //MD IS THE MANIFORLD CREATOR.. WHY PPL SHOULD BE EXCITED ABOUT ARRAY EXCHANGE. IT IS FUNCTIONAL | MANIFOLD
            //ITS HUGE TO STAKE YOU VALUE MAPS IN TERMS OTHERS | EQUALITY DOMINA IS VASTLY EXPONENTIATED

            //[a,b,c] = [d,e,f]
            //[2,2,3] = [5,5,6]
            //SCALABLE ALGEBRA | INTERWOVEN | SETS OF EQUATIONS | MD SET MARKETS AS SYSTEMS OF EQUATIONS

            var price = orders[x].amountSet1/orders[x].amountSet;
            if(!orderObj[price]){orderObj[price]=0}
            orderObj[price] += parseFloat(orders[x].amountSet[0]);
        }
    }

    var mirrorOrderObj = {};
    if (mirrorOrders.length > 0){
        for (x in mirrorOrders){
            var price = mirrorOrders[x].amountSet/mirrorOrders[x].amountSet1;
            if(!mirrorOrderObj[price]){mirrorOrderObj[price]=0}
            mirrorOrderObj[price] += parseFloat(mirrorOrders[x].amountSet[0]);
        }
    }

    for(x in Object.keys(orderObj)){
        var price = parseFloat(Object.keys(orderObj)[x]);
        var amount = orderObj[Object.keys(orderObj)[x]];
        console.log(price, amount)
        $scope.bidAskChart.series[0].data.push([price, amount]);
    }

    for(x in Object.keys(mirrorOrderObj)){
        var price = parseFloat(Object.keys(mirrorOrderObj)[x]);
        var amount = mirrorOrderObj[Object.keys(mirrorOrderObj)[x]];
        console.log(price, amount)
        $scope.bidAskChart.series[1].data.push([price, amount]);
    }

    $scope.bidAskChart.series[0].data = $scope.bidAskChart.series[0].data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} ); 
    $scope.bidAskChart.series[1].data = $scope.bidAskChart.series[1].data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} ); 

    console.log(orderObj, mirrorOrderObj);

    console.log($scope.bidAskChart.series[0].data);
    console.log($scope.bidAskChart.series[1].data)

    $scope.createContent = function(post) {
        if($scope.currentUser){
            $scope.newPost.post = post.id;
            $scope.newPost.user = $scope.currentUser.id;
            $scope.newPost.marketPair = 'CRE8/USD'; // || USD/CRE8
            PostModel.create($scope.newPost).then(function(model) {
                $scope.newPost = {};
            });
        }
        else{$location.path('/login')}
    };

    //TODO: CREATE ORDER
    $scope.createOrder = function() {
        $scope.newOrder.identiferSet = $scope.stateParams.id;
        $scope.newOrder.identiferSet1 = $scope.stateParams.id1;
        $scope.newOrder.user = $scope.currentUser.id;

        //TODO: PARSE INPUT
        //$scope.newOrder.amountSet.replace(/^(\d+(,\d+)*)?$/gm);
        //$scope.newOrder.amountSet1.replace(/^(\d+(,\d+)*)?$/gm);

        OrderModel.create($scope.newOrder).then(function(model) {
            $scope.orders.push($scope.newOrder);
            $scope.newOrder = {};
        });
    };

    $scope.invertMarket = function() {

        //$scope.market = [$scope.market, $scope.market = $scope.market1][0];
        var temp = $scope.newOrder.identiferSet;
        $scope.newOrder.identiferSet = $scope.newOrder.identiferSet1;
        $scope.newOrder.identiferSet1 = temp;
        console.log($scope.newOrder)
        $scope.inverted = !$scope.inverted;
        //$scope.$apply();

    };

    $scope.newOrderToggle = function () {
        $scope.newOrderToggleVar = $scope.newOrderToggleVar ? false : true;
    };

    $scope.reply = function(item){
        var index = $scope.orders.map(function(obj){return obj.id}).indexOf(item.id);
        $scope.orders[index].showReply = !$scope.orders[index].showReply
    };
    
}]);