angular.module( 'conexus.member', [
])

.config(['$stateProvider', function config( $stateProvider ) {
	$stateProvider.state( 'member', {
        abstract: true,
		url: '/member/:path',
		views: {
			"main": {
				controller: 'MemberCtrl',
				templateUrl: 'member/index.tpl.html'
			}
		},
		resolve: {
            //TODO: REFACTOR
            member: ['$stateParams', 'UserModel', function($stateParams, UserModel){
                return UserModel.getByUsername($stateParams.path);
            }],
            //TODO: REFACTOR
            followersCount: ['member', 'FollowerModel', function(member, FollowerModel) {
                return FollowerModel.getFollowers(member);
            }],
            followingCount: ['member', 'FollowerModel', function(member, FollowerModel) {
                return FollowerModel.getFollowing(member);
            }]
        }
	})
    .state( 'member.index', {
        url: '',
        views: {
            "memberActivity": {
                controller: 'MemberActivityCtrl',
                templateUrl: 'member/templates/activity.tpl.html'
            }
        },
        resolve: {
            orders: ['member', 'OrderModel', function(member, OrderModel){
                return OrderModel.getSome('user', member.id, 50, 0, 'createdAt DESC');
            }],
            posts: ['member', 'PostModel', function(member, PostModel) {
                return PostModel.getSome('user', member.id, 50, 0, 'createdAt DESC');
            }],
            transactionsFrom: ['member', 'TransactionModel', function(member, TransactionModel) {
                return TransactionModel.getSome('from', member.id, 50, 0, 'createdAt DESC');
            }],
            transactionsTo: ['member', 'TransactionModel', function(member, TransactionModel) {
                return TransactionModel.getSome('to', member.id, 50, 0, 'createdAt DESC');
            }],
            work: ['member', 'WorkModel', function(member, WorkModel) {
                return WorkModel.getSome('user', member.id, 50, 0, 'createdAt DESC');
            }]
        }
    })
    .state( 'member.content', {
        url: '/content',
        views: {
            "memberContent": {
                controller: 'MemberContentCtrl',
                templateUrl: 'member/templates/content.tpl.html'
            }
        },
        resolve: {
            //TODO: REFACTOR
            posts: ['member', 'PostModel', function(member, PostModel) {
                return PostModel.getSome('user', member.id, 100, 0, 'createdAt DESC');
            }],
            videos: ['member', function(member) {
                return [
                    {title:'Work Stream 597c55f43456040315c6724c',streamUrl:'https://www.cre8bid.io/v/597c55e56833048165c6720c', user: member, createdAt: new Date()},
                    {title:'Task 597c55e56833040315c6724c Stream',streamUrl:'https://www.cre8bid.io/v/597c55e56833048165c6720c', user: member, createdAt: new Date()},
                    {title:'Task 425c35e56833040315c6724c Stream 2',streamUrl:'https://www.cre8bid.io/v/597c55e56833048165c6720c', user: member, createdAt: new Date()},
                    {title:'Task 597c55e56833048165c6720c Stream 3',streamUrl:'https://www.cre8bid.io/v/597c55e56833048165c6720c', user: member, createdAt: new Date()}
                ];
            }],
        }
    })
    .state( 'member.followers', {
        url: '/followers',
        views: {
            "memberFollowers": {
                controller: 'MemberFollowersCtrl',
                templateUrl: 'member/templates/followers.tpl.html'
            }
        },
        resolve: {
            //TODO: REFACTOR
            followers: ['member', 'FollowerModel', function(member, FollowerModel) {
                return FollowerModel.getFollowers(member);
            }],
        }
    })
    .state( 'member.following', {
        url: '/following',
        views: {
            "memberFollowing": {
                controller: 'MemberFollowingCtrl',
                templateUrl: 'member/templates/following.tpl.html'
            }
        },
        resolve: {
            //TODO: REFACTOR
            following: ['member', 'FollowerModel', function(member, FollowerModel) {
                return FollowerModel.getFollowing(member);
            }],
        }
    })
    .state( 'member.ledger', {
        url: '/ledger',
        views: {
            "memberLedger": {
                controller: 'MemberLedgerCtrl',
                templateUrl: 'member/templates/ledger.tpl.html'
            }
        },
        resolve: {
            member: ['$stateParams', 'UserModel', function($stateParams, UserModel){
                return UserModel.getByUsername($stateParams.path);
            }],
            transactionsFrom: ['member', 'TransactionModel', function(member, TransactionModel) {
                return TransactionModel.getSome('from', member.id, 100, 0, 'createdAt DESC');
            }],
            transactionsTo: ['member', 'TransactionModel', function(member, TransactionModel) {
                return TransactionModel.getSome('to', member.id, 100, 0, 'createdAt DESC');
            }],
        }
    })
    .state( 'member.positions', {
        url: '/positions',
        views: {
            "memberPositions": {
                controller: 'MemberPositionsCtrl',
                templateUrl: 'member/templates/positions.tpl.html'
            }
        },
        resolve: {
            member: ['$stateParams', 'UserModel', function($stateParams, UserModel){
                return UserModel.getByUsername($stateParams.path);
            }],
            orders: ['member', 'OrderModel', function(member, OrderModel){
                return OrderModel.getSome('user', member.id, 100, 0, 'createdAt DESC');
            }],
        }
    })
}])

.controller( 'MemberCtrl', ['$location', '$sailsSocket', '$scope', '$stateParams', 'config', 'followersCount', 'followingCount', 'FollowerModel', 'lodash', 'member', 'seoService', 'titleService', 'TransactionModel', function MemberController($location, $sailsSocket, $scope, $stateParams, config, followersCount, followingCount, FollowerModel, lodash, member, seoService, titleService, TransactionModel) {
	$scope.currentUser = config.currentUser;
    //TODO: PART OF MEMBER
    $scope.followersCount = followersCount;
    $scope.followingCount = followingCount;
    $scope.newFollower = {};
    $scope.newTransactionToggleVar = false;
    $scope.newTransaction = {};
    $scope.member = member;
    titleService.setTitle($scope.member.username + ' | CRE8.XYZ');
    if($scope.currentUser){
        $scope.newTransaction.from = $scope.currentUser.id;
        $scope.newTransaction.identifier = 'CRE8';
        $scope.newTransaction.content = $scope.member.username + ' here\'s some '+$scope.newTransaction.identifier;
    }

    //TODO: seoService

    if(!$scope.member){$location.path('/')}

    $scope.createTransaction = function(){
        if($scope.currentUser){
            $scope.newTransaction.to = $scope.member.id;
            TransactionModel.create($scope.newTransaction).then(function(model){
                $scope.newTransaction = {};
            });
        }
        else{$location.path('/login')}
    };

    $scope.follow = function() {
        $scope.newFollower.followed = $scope.member.id;
        $scope.newFollower.follower = $scope.currentUser.id;
        FollowerModel.create($scope.newFollower).then(function(model) {
            $scope.newFollower = {};
        });
    };

    $scope.unfollow = function(member) {
        FollowerModel.delete(member);
    };

    $scope.newTransactionToggle = function() {
        $scope.newTransactionToggleVar = !$scope.newTransactionToggleVar;
    }


    //TODO: SOCKET | WEB3
    /*
    $sailsSocket.subscribe('follower', function (envelope) {
        switch(envelope.verb) {
            case 'created':
                  $scope.followers.unshift(envelope.data);
                break;
            case 'destroyed':
                lodash.remove($scope.followers, {id: envelope.id});
                break;
        }
    });
    */

}])
.controller( 'MemberActivityCtrl', ['$sailsSocket', '$sce', '$scope', '$stateParams', 'config', 'FollowerModel', 'lodash', 'member', 'orders', 'PostModel', 'posts', 'titleService', 'transactionsFrom', 'transactionsTo', 'work', function MemberActivityController($sailsSocket, $sce, $scope, $stateParams, config, FollowerModel, lodash, member, orders, PostModel, posts, titleService, transactionsFrom, transactionsTo, work) {
    $scope.currentUser = config.currentUser;
    $scope.member = member;
    titleService.setTitle($scope.member.username + ' | Activity | CRE8.XYZ');
    $scope.newPost = {};

    //TODO: ACTIVITY FEED ~ BLEND OF MODELS
    $scope.orders = orders;
    $scope.posts = posts;
    $scope.transactions = [].concat.apply([], [transactionsFrom, transactionsTo]);
    $scope.transactions = $scope.transactions.sort(function(a,b) {return (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0);} ); 
    $scope.work = work;

    $scope.orders = $scope.orders.map(function(obj){
        obj.model = 'ORDER';
        return obj;
    });

    $scope.posts = $scope.posts.map(function(obj){
        obj.model = 'CONTENT';
        return obj;
    });

    $scope.transactions = $scope.transactions.map(function(obj){
        obj.model = 'TRANSACTION';
        return obj;
    });

    $scope.work = $scope.work.map(function(obj){
        obj.model = 'WORK';
        return obj;
    });
    
    $scope.activity = [].concat.apply([], [$scope.orders, $scope.posts, $scope.transactions, $scope.work]);
    $scope.activity = $scope.activity.sort(function(a,b) {return (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0);} ); 
    $scope.activity = $scope.activity.slice(0,100);

    $scope.createPost = function(post){
        $scope.newPost.post = post.id;
        $scope.newPost.user = $scope.currentUser.id;
        $scope.newPost.profile = $scope.member.id;
        PostModel.create($scope.newPost).then(function(model) {
            $scope.newPost = {};
        });
    };

    //YIKES
    $scope.renderContent = function(content){
        if (content){
            if (!content.includes('>')){
                var replacedText = content.replace(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, '<a href="$1" target="_blank">$1</a>');
                var replacedText = replacedText.replace(/(^|[^\/])(www\.[\S]+(\b|$))/gim, '$1<a href="http://$2" target="_blank">$2</a>');
                return $sce.trustAsHtml(replacedText);
            }
            else{return $sce.trustAsHtml(content)}
        }
    };

    $scope.reply = function(item){
        var index = $scope.activity.map(function(obj){return obj.id}).indexOf(item.id);
        $scope.activity[index].showReply = !$scope.activity[index].showReply
    };

    $sailsSocket.subscribe('post', function (envelope) {
        switch(envelope.verb) {
            case 'created':
                $scope.posts.unshift(envelope.data);
                break;
            case 'destroyed':
                lodash.remove($scope.posts, {id: envelope.id});
                break;
        }
    });

}])

.controller( 'MemberContentCtrl', ['$sailsSocket', '$sce', '$scope', '$stateParams', 'config', 'posts', 'lodash', 'titleService', 'videos', function MemberContentController($sailsSocket, $sce, $scope, $stateParams, config, posts, lodash, titleService, videos) {
    $scope.currentUser = config.currentUser;
    $scope.content = [{}];
    $scope.newContent = {};
    $scope.newContentToggleVar = false;

    titleService.setTitle($scope.member.username + ' | Content | CRE8.XYZ');
    $scope.posts = posts;
    $scope.videos = videos;

    $scope.newContentToggle = function() {
        $scope.newContentToggleVar = !$scope.newContentToggleVar;
    };

    $scope.renderContent = function(stream){
        var html = '<iframe width="510" height="265" src="'+stream+'" frameborder="0" allowfullscreen></iframe>'
        return $sce.trustAsHtml(html);
    };

}])

.controller( 'MemberFollowersCtrl', ['$sailsSocket', '$scope', '$stateParams', 'config', 'FollowerModel', 'followers', 'lodash', 'titleService', function MemberFollowersController($sailsSocket, $scope, $stateParams, config, FollowerModel, followers, lodash, titleService) {
    $scope.currentUser = config.currentUser;
    titleService.setTitle($scope.member.username + ' | Followers | CRE8.XYZ');
    $scope.followers = followers;

    /*
    $sailsSocket.subscribe('follower', function (envelope) {
        switch(envelope.verb) {
            case 'created':
                $scope.followers.unshift(envelope.data);
                break;
            case 'destroyed':
                lodash.remove($scope.followers, {id: envelope.id});
                break;
        }
    });
    */

}])

.controller( 'MemberFollowingCtrl', ['$sailsSocket', '$scope', '$stateParams', 'config', 'following', 'FollowerModel', 'lodash', 'titleService', function MemberFollowingController($sailsSocket, $scope, $stateParams, config, following, FollowerModel, lodash, titleService) {
    $scope.currentUser = config.currentUser;
    titleService.setTitle($scope.member.username + ' | Following | CRE8.XYZ');
    $scope.following = following;
    console.log(following)

    /*
    $sailsSocket.subscribe('follower', function (envelope) {
        switch(envelope.verb) {
            case 'created':
                $scope.followers.unshift(envelope.data);
                break;
            case 'destroyed':
                lodash.remove($scope.followers, {id: envelope.id});
                break;
        }
    });
    */

}])

.controller( 'MemberLedgerCtrl', ['$sailsSocket', '$scope', '$stateParams', 'config', 'lodash', 'member', 'titleService', 'transactionsFrom', 'transactionsTo', function MemberLedgerController($sailsSocket, $scope, $stateParams, config, lodash, member, titleService, transactionsFrom, transactionsTo) {
    $scope.currentUser = config.currentUser;
    $scope.member = member;
    $scope.newTransaction = {};
    titleService.setTitle($scope.member.username + ' | Ledger | CRE8.XYZ');

    $scope.transactionsFrom = transactionsFrom;
    $scope.transactionsTo = transactionsTo;
    $scope.transactions = $scope.transactionsFrom.concat($scope.transactionsTo);

    if($scope.currentUser){
        $scope.newTransaction.from = $scope.currentUser.id;
        $scope.newTransaction.to = $scope.member.id;
    }

    $scope.chart = {
        chart: {
            zoomType: 'x',
        },
        series: [{
            id: 'Expense',
            type: 'spline',
            name: 'Expense',
            data: [],
        },{
            id: 'Revenue',
            type: 'spline',
            name: 'Revenue',
            data: [],
        }],
        title: {
            text: ''
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
        credits:{enabled:false},
    };

    $scope.pie = {
        chart: {},
        series: [{
            id: 'Pie',
            type: 'pie',
            name: 'Pie',
            colorByPoint: true,
            data: [{
                name: 'Expense',
                y: [],
            }, {
                name: 'Revenue',
                y: [],
            }]
        }],
        
        title: {
            text: ''
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
        credits:{enabled:false},
    };

    if ($scope.transactions.length == 0){
        for (var i=0, t=88; i<t; i++) {
            $scope.transactionsFrom.push({to:'EXAMPLE ORGANIZATION', from:member.username.toUpperCase(), identifier:'CRE8', content:'SEED EXPENSE', createdAt:new Date(), amount:Math.round(0.5*Math.random() * t), ledger:'EXPENSE, SEED, EXAMPLE'})
            $scope.transactionsTo.push({to:member.username.toUpperCase(), from:'EXAMPLE ORGANIZATION', identifier:'CRE8', content:'SEED REVENUE', createdAt:new Date(), amount:Math.round(Math.random() * t), ledger:'REVENUE, SEED, EXAMPLE'})
        }
        $scope.transactions = $scope.transactionsFrom.concat($scope.transactionsTo);
    }

    function countInArray(array, value) {
        return array.reduce(function(n, x){ return n + (x === value)}, 0);
    }

    function amountInArray(array, value) {
        return array.reduce(function(n, x){
            if (x.tag == value.tag){n+=parseFloat(x.amount)}
            return n;
        },0);
    }

    /*$scope.transactionTags = $scope.transactions.map(function(obj){
        var returnObj = {};
        if(obj.ledger){obj.ledger = obj.ledger.split(',')}
        returnObj = obj.ledger;
        return returnObj;
    });
    $scope.transactionTags = [].concat.apply([], $scope.transactionTags);*/


    $scope.transactionTags = $scope.transactions.map(function(obj){
        var returnArray = [];
        if(obj.ledger){
            obj.ledger = obj.ledger.split(',');
            for (x in obj.ledger){
                returnArray.push({tag:obj.ledger[x].trim().toLowerCase(),amount:obj.amount})
            }
        }
        return returnArray;
    });
    $scope.transactionTags = [].concat.apply([], $scope.transactionTags);

    $scope.sortedTransactionTags = [];
    for (x in $scope.transactionTags){
        var amount = amountInArray($scope.transactionTags, $scope.transactionTags[x]);
        if ($scope.sortedTransactionTags.map(function(obj){return obj.element}).indexOf($scope.transactionTags[x].tag) == -1){
            $scope.sortedTransactionTags.push({amount:amount, element:$scope.transactionTags[x].tag})
        }
    }
    $scope.sortedTransactionTags.sort(function(a,b) {return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);});
    console.log( $scope.sortedTransactionTags)

    /*$scope.sortedTransactionTags = [];
    for (x in $scope.transactionTags){
        var amount = countInArray($scope.transactionTags, $scope.transactionTags[x]);
        if ($scope.sortedTransactionTags.map(function(obj){return obj.element}).indexOf($scope.transactionTags[x]) == -1){
            $scope.sortedTransactionTags.push({amount:amount, element:$scope.transactionTags[x]})
        }
    }
    $scope.sortedTransactionTags.sort(function(a,b) {return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);});*/

    $scope.sumTransactions = [];
    $scope.transactions.map(function(obj){return obj.amount}).reduce(function(a,b,i) {
        return $scope.sumTransactions[i] = parseFloat(a)+parseFloat(b);
    }, 0);

    $scope.sumFrom = [];
    $scope.transactionsFrom.reduce(function(a,b,i) {
        return $scope.sumFrom[i] = parseFloat(a)+parseFloat(b.amount);
    }, 0);

    $scope.sumTo = [];
    $scope.transactionsTo.reduce(function(a,b,i) {
        return $scope.sumTo[i] = parseFloat(a) + parseFloat(b.amount);;
    }, 0);


    $scope.chart.series[0].data = $scope.sumFrom;
    $scope.chart.series[1].data = $scope.sumTo;

    /*$scope.pie.series[0].data = [{
        name: 'Expense',
        y: $scope.sumFrom[$scope.sumFrom.length-1],
    }, {
        name: 'Revenue',
        y: $scope.sumTo[$scope.sumTo.length-1],
    }];*/

    //console.log($scope.sortedTransactionTags)
    for (x in $scope.sortedTransactionTags){
        $scope.pie.series[0].data.push({
            name: $scope.sortedTransactionTags[x].element,
            y: $scope.sortedTransactionTags[x].amount,
        });
    }

    $scope.newTransactionToggle = function(){
        $scope.newTransactionToggleVar = $scope.newTransactionToggleVar ? false : true;
    };

    $scope.createTransaction = function(){
        $scope.newTransaction.project = $scope.project.id;
        $scope.newTransaction.user = $scope.currentUser.id;
        TransactionModel.create($scope.newTransaction).then(function(model){
            $scope.newTransaction = {};
        });
    };


}])

.controller( 'MemberPositionsCtrl', ['$sailsSocket', '$scope', '$stateParams', 'config', 'lodash', 'member', 'OrderModel', 'orders', 'titleService', function MemberPositionsController($sailsSocket, $scope, $stateParams, config, lodash, member, OrderModel, orders, titleService) {
    $scope.currentUser = config.currentUser;
    $scope.member = member;
    $scope.orders = orders;
    $scope.orders.forEach(function(part, index) {
        if ($scope.orders[index].identiferSet){$scope.orders[index].identiferSet = $scope.orders[index].identiferSet.split(',');}
        if ($scope.orders[index].amountSet){$scope.orders[index].amountSet = $scope.orders[index].amountSet.split(',');}
        if ($scope.orders[index].identiferSet1){$scope.orders[index].identiferSet1 = $scope.orders[index].identiferSet1.split(',');}
        if ($scope.orders[index].amountSet1){ $scope.orders[index].amountSet1 = $scope.orders[index].amountSet1.split(',');}
    });
    titleService.setTitle($scope.member.username + ' | Positions | CRE8.XYZ');
    
    $scope.newOrderToggle = function(){
        $scope.newOrderToggleVar = $scope.newOrderToggleVar ? false : true;
    };

    $scope.createOrder = function() {
        if ($scope.currentUser){
            $scope.newOrder.user = $scope.currentUser.id;
            //TODO: PARSE INPUT
            //$scope.newOrder.amountSet = $scope.newOrder.amountSet.replace(/^(\d+(,\d+)*)?$/gm);
            //$scope.newOrder.amountSet1 = $scope.newOrder.amountSet1.replace(/^(\d+(,\d+)*)?$/gm);
            OrderModel.create($scope.newOrder).then(function(model) {
                //$scope.orders.push($scope.newOrder);
                $scope.newOrder = {};
            });
        }
        else{}
    };

    $scope.chart = {
        chart: {polar: true},
        series: [{
            id: 'values',
            type: 'area',
            name: 'Values',
            pointPlacement: 'on',
            data: [0.2, 0.15, 0.2, 0.15, 0.15, 0.15],
            color: 'rgba(153,0,0,0.3)',
            fillOpacity: 0.3,
        }],
        title: {text: ''},
        xAxis: {
            title: {text: null},
            categories: ['Education', 'Shelter', 'Food', 'Creation', 'Health', 'Security'],
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

}]);