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
                return OrderModel.getSome('user', member.id, 20, 0, 'createdAt DESC');
            }],

            //TODO | BETTER....
            posts: ['member', 'PostModel', function(member, PostModel) {
                return PostModel.getSome('user', member.id, 20, 0, 'createdAt DESC');
            }],
            profilePosts: ['member', 'PostModel', function(member, PostModel) {
                return PostModel.getSome('profile', member.id, 20, 0, 'createdAt DESC');
            }],

            transactionsFrom: ['member', 'TransactionModel', function(member, TransactionModel) {
                return TransactionModel.getSome('from', member.id, 20, 0, 'createdAt DESC');
            }],
            transactionsTo: ['member', 'TransactionModel', function(member, TransactionModel) {
                return TransactionModel.getSome('to', member.id, 20, 0, 'createdAt DESC');
            }],
            work: ['member', 'WorkModel', function(member, WorkModel) {
                return WorkModel.getSome('user', member.id, 20, 0, 'createdAt DESC');
            }]
        }
    })
    .state( 'member.assets', {
        url: '/assets',
        views: {
            "memberAssets": {
                controller: 'MemberAssetsCtrl',
                templateUrl: 'member/templates/assets.tpl.html'
            }
        },
        resolve: {
            
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
                return PostModel.getSome('user', member.id, 20, 0, 'createdAt DESC');
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
                return TransactionModel.getSome('from', member.id, 50, 0, 'createdAt DESC');
            }],
            transactionsTo: ['member', 'TransactionModel', function(member, TransactionModel) {
                return TransactionModel.getSome('to', member.id, 50, 0, 'createdAt DESC');
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
                return OrderModel.getSome('user', member.id, 20, 0, 'createdAt DESC');
            }],
        }
    })
    .state( 'member.time', {
        url: '/time',
        views: {
            "memberTime": {
                controller: 'MemberTimeCtrl',
                templateUrl: 'member/templates/time.tpl.html'
            }
        },
        resolve: {
            work: ['member', 'WorkModel', function(member, WorkModel) {
                return WorkModel.getSome('user', member.id, 50, 0, 'createdAt DESC');
            }]
        }
    })
}])

.controller( 'MemberCtrl', ['$location', '$sailsSocket', '$scope', '$stateParams', 'config', 'followersCount', 'followingCount', 'FollowerModel', 'lodash', 'member', 'seoService', 'titleService', 'TransactionModel', function MemberController($location, $sailsSocket, $scope, $stateParams, config, followersCount, followingCount, FollowerModel, lodash, member, seoService, titleService, TransactionModel) {
	$scope.currentUser = config.currentUser;
    //TODO: PART OF MEMBER
    $scope.followersCount = followersCount;
    $scope.followingCount = followingCount;
    $scope.member = member;
    if(!$scope.member){$location.path('/')}
    $scope.newFollower = {};
    $scope.newTransactionToggleVar = false;
    $scope.newTransaction = {};
    $scope.newTransaction.identifier = 'CRE8';
    $scope.newTransaction.content = $scope.member.username + ' here\'s some '+$scope.newTransaction.identifier;
    $scope.tabsToggleVar = false;
    titleService.setTitle($scope.member.username + ' | CRE8.XYZ');
    if($scope.currentUser){
        $scope.newTransaction.from = $scope.currentUser.id;
    }

    //TODO: seoService

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

    $scope.newTransactionToggle = function() {
        $scope.newTransactionToggleVar = !$scope.newTransactionToggleVar;
    };

    $scope.search = function(){};

    $scope.tabsToggle = function() {
        $scope.tabsToggleVar = !$scope.tabsToggleVar;
    };

    $scope.unfollow = function(member) {
        FollowerModel.delete(member);
    };

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
.controller( 'MemberActivityCtrl', ['$sailsSocket', '$sce', '$scope', '$stateParams', 'config', 'FollowerModel', 'lodash', 'member', 'orders', 'PostModel', 'posts', 'profilePosts', 'ReactionModel', 'titleService', 'transactionsFrom', 'transactionsTo', 'work', function MemberActivityController($sailsSocket, $sce, $scope, $stateParams, config, FollowerModel, lodash, member, orders, PostModel, posts, profilePosts, ReactionModel, titleService, transactionsFrom, transactionsTo, work) {
    $scope.currentUser = config.currentUser;
    $scope.member = member;
    titleService.setTitle($scope.member.username + ' | Activity | CRE8.XYZ');
    $scope.newPost = {};

    //TODO: ACTIVITY FEED ~ BLEND OF MODELS
    $scope.orders = orders;
    $scope.posts = posts;
    $scope.profilePosts = profilePosts;

    $scope.transactions = [].concat.apply([], [transactionsFrom, transactionsTo]);
    $scope.transactions = $scope.transactions.sort(function(a,b) {return (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0);} ); 
    $scope.work = work;

    $scope.orders = $scope.orders.map(function(obj){
        obj.model = 'ORDER';
        return obj;
    });

    $scope.posts = [].concat.apply([], [$scope.posts, $scope.profilePosts]);
    $scope.posts = $scope.posts.map(function(obj){
        obj.model = 'CONTENT';
        return obj;
    });

    //COMBINE AND REMOVE DUPS .. REDO THIS LATER | REFACTOR .... BLEH
    $scope.posts = $scope.posts.filter(function(obj){
        if (obj.profile){
            if (obj.profile.hasOwnProperty('id')){
                console.log(obj.profile, obj.user.id)
                if(obj.profile.id == obj.user.id){return false}
                else{return true}
            }
            else{return true}
        }
        else{return true}
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

    //TODO: MODELS | ONLY POST/CONTENT
    $scope.createReaction = function(content, type){
        if($scope.currentUser){
            $scope.newReaction.amount = 1;
            $scope.newReaction.post = content.id;
            $scope.newReaction.type = type;
            $scope.newReaction.user = $scope.currentUser.id;

            var index = $scope.contentList.map(function(obj){return obj.id}).indexOf(content.id);

            if (type =='plus'){$scope.contentList[index].plusCount++}
            if (type =='minus'){$scope.contentList[index].minusCount++}
            ReactionModel.create($scope.newReaction).then(function(model){
                $scope.newReaction = {};
            });

        }
        else{$location.path('/login')}
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

    $scope.search = function(){};

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

.controller( 'MemberAssetsCtrl', ['$scope', 'config', 'titleService', function MemberAssetsCtrl( $scope, config, titleService ) {
    titleService.setTitle($scope.member.username + ' | Assets | CRE8.XYZ');
    $scope.currentUser = config.currentUser;

}])

.controller( 'MemberContentCtrl', ['$sailsSocket', '$sce', '$scope', '$stateParams', 'config', 'posts', 'lodash', 'titleService', 'videos', function MemberContentController($sailsSocket, $sce, $scope, $stateParams, config, posts, lodash, titleService, videos) {
    $scope.currentUser = config.currentUser;
    $scope.content = posts;
    $scope.newContent = {};
    $scope.newContentToggleVar = false;

    titleService.setTitle($scope.member.username + ' | Content | CRE8.XYZ');
    //$scope.posts = posts;
    //$scope.videos = videos;

    $scope.createContent = function(){};

    //TODO: MODELS | ONLY POST/CONTENT
    $scope.createReaction = function(content, type){
        if($scope.currentUser){
            $scope.newReaction.amount = 1;
            $scope.newReaction.post = content.id;
            $scope.newReaction.type = type;
            $scope.newReaction.user = $scope.currentUser.id;

            var index = $scope.contentList.map(function(obj){return obj.id}).indexOf(content.id);

            if (type =='plus'){$scope.contentList[index].plusCount++}
            if (type =='minus'){$scope.contentList[index].minusCount++}
            ReactionModel.create($scope.newReaction).then(function(model){
                $scope.newReaction = {};
            });

        }
        else{$location.path('/login')}
    };

    $scope.newContentToggle = function() {
        $scope.newContentToggleVar = !$scope.newContentToggleVar;
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
        var index = $scope.content.map(function(obj){return obj.id}).indexOf(item.id);
        $scope.content[index].showReply = !$scope.content[index].showReply
    };

    $scope.search = function(){};

}])

.controller( 'MemberFollowersCtrl', ['$sailsSocket', '$scope', '$stateParams', 'config', 'FollowerModel', 'followers', 'lodash', 'titleService', function MemberFollowersController($sailsSocket, $scope, $stateParams, config, FollowerModel, followers, lodash, titleService) {
    $scope.currentUser = config.currentUser;
    titleService.setTitle($scope.member.username + ' | Followers | CRE8.XYZ');
    $scope.followers = followers;

    $scope.search = function(){};

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

    $scope.search = function(){};

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

.controller( 'MemberLedgerCtrl', ['$location', '$sailsSocket', '$scope', '$stateParams', 'config', 'lodash', 'member', 'titleService', 'transactionsFrom', 'transactionsTo', function MemberLedgerController($location, $sailsSocket, $scope, $stateParams, config, lodash, member, titleService, transactionsFrom, transactionsTo) {
    
    $scope.assetSet = 'CRE8';
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
            id: 'Combination',
            type: 'area',
            name: 'Asset Balance',
            data: [],
        },{
            id: 'Expense',
            type: 'area',
            name: 'Expense',
            data: [],
        },{
            id: 'Revenue',
            type: 'area',
            name: 'Revenue',
            data: [],
        },{
            id: 'Revenue',
            type: 'area',
            name: 'Asset Flow',
            data: [],
        }],
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
            gridLineColor: 'grey',
            title: {
                text: null
            },
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



    //TAGS
    function countInArray(array, value) {
        return array.reduce(function(n, x){ return n + (x === value)}, 0);
    }

    function amountInArray(array, value) {
        return array.reduce(function(n, x){
            if (x.tag == value.tag){n+=parseFloat(x.amount)}
            return n;
        },0);
    }

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
    //TAGS
    //DO BY TAGS! SAME ..
    function sumFunction(obj){
        var sumArray = [];
        obj.reduce(function(a,b,i) {
            return $scope.sumArray[i] = parseFloat(a) + parseFloat(b.amount);
        }, 0);
        return sumArray;
    }
    //SERIES PER TAG
    //FOR X IN TAG -- SERIES.PUSH
        //SERIES[x].push(data)



    $scope.sumFlow = [];
    $scope.sumFrom = []
    $scope.sumTo = [];
    $scope.sumTransactions = [];
    $scope.transactions = $scope.transactions.sort(function(a,b) {return (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0);}).reverse(); 

    //CONCAT | sumTransactions
    $scope.transactions.reduce(function(a,b,i) {
        if(b.from == $scope.member.id){return $scope.sumTransactions[i] = [new Date(b.createdAt).getTime(), parseFloat(a[1])-parseFloat(b.amount)];}
        if(b.to == $scope.member.id){return $scope.sumTransactions[i] = [new Date(b.createdAt).getTime(), parseFloat(a[1])+parseFloat(b.amount)];}
    },[0,0]);

    //CONCAT | sumFrom
    $scope.transactions.reduce(function(a,b,i) {
        if(b.from == $scope.member.id){return $scope.sumFrom[i] = [new Date(b.createdAt).getTime(), parseFloat(a[1])+parseFloat(b.amount)];}
        else{return $scope.sumFrom[i] = [new Date(b.createdAt).getTime(), parseFloat(a[1])];}
    },[0,0]);

    //CONCAT | sumTo
    $scope.transactions.reduce(function(a,b,i) {
        if(b.to == $scope.member.id){return $scope.sumTo[i] = [new Date(b.createdAt).getTime(), parseFloat(a[1])+parseFloat(b.amount)];}
        else{return $scope.sumTo[i] = [new Date(b.createdAt).getTime(), parseFloat(a[1])];}
    },[0,0]);

    //CONCAT | sumFlow
    $scope.transactions.reduce(function(a,b,i) {
        if(b.from == $scope.member.id){return $scope.sumFlow[i] = [new Date(b.createdAt).getTime(), parseFloat(a[1])+parseFloat(b.amount)];}
        if(b.to == $scope.member.id){return $scope.sumFlow[i] = [new Date(b.createdAt).getTime(), parseFloat(a[1])+parseFloat(b.amount)];}
    },[0,0]);

    $scope.chart.series[0].data = $scope.sumTransactions;
    $scope.chart.series[1].data = $scope.sumFrom;
    $scope.chart.series[2].data = $scope.sumTo;
    //$scope.chart.series[3].data = $scope.sumFlow;



    $scope.selectExpense = function(){
        //ANIMATE
        //ADD IN TAG BASED GRAPHS WRT EXPENSE
        $scope.pie.series[0].data = [];
        for (x in $scope.sortedTransactionTags){
            $scope.pie.series[0].data.push({
                name: $scope.sortedTransactionTags[x].element,
                y: $scope.sortedTransactionTags[x].amount,
            });
        }
    };

    $scope.selectOverview = function(){
        $scope.pie.series[0].data = [];
        $scope.pie.series[0].data = [{
            name: 'Expense',
            y: $scope.sumFrom[$scope.sumFrom.length-1][1],
        }, {
            name: 'Revenue',
            y: $scope.sumTo[$scope.sumTo.length-1][1],
        }];
    };
    $scope.selectOverview();

    $scope.selectRevenue = function(){
        //ANIMATE
        $scope.pie.series[0].data = [];
        for (x in $scope.sortedTransactionTags){
            $scope.pie.series[0].data.push({
                name: $scope.sortedTransactionTags[x].element,
                y: $scope.sortedTransactionTags[x].amount,
            });
        }
    };






    //TODO
    $scope.createContent = function(content, type){};
    $scope.createReaction = function(content, type){};

    $scope.createTransaction = function(){
        $scope.newTransaction.project = $scope.project.id;
        $scope.newTransaction.user = $scope.currentUser.id;
        TransactionModel.create($scope.newTransaction).then(function(model){
            $scope.newTransaction = {};
        });
    };

    $scope.reply = function(activity){
        if ($scope.currentUser){
            var index = $scope.transactions.map(function(obj){return obj.id}).indexOf(activity.id);
            $scope.transactions[index].showReply = !$scope.transactions[index].showReply;
        }
        else{$location.path('/login')}
    };

    $scope.newTransactionToggle = function(){
        $scope.newTransactionToggleVar = $scope.newTransactionToggleVar ? false : true;
    };

}])

.controller( 'MemberPositionsCtrl', ['$location', '$sailsSocket', '$scope', '$stateParams', 'config', 'lodash', 'member', 'OrderModel', 'orders', 'titleService', function MemberPositionsController( $location, $sailsSocket, $scope, $stateParams, config, lodash, member, OrderModel, orders, titleService) {
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

    $scope.chart = {
        chart: {polar: true},
        series: [],
        title: {text: ''},
        xAxis: {
            title: {text: null},
            categories: [],
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
            enabled: true,
            align: 'left',
            verticalAlign: 'middle',
            layout: 'vertical'
        },
        tooltip: {
            shared: true,
        },
        credits:{enabled:false},
    };

    $scope.baseMarkets = ['Universal Token (onMint)', 'Universal Token (onTrade)', 'USD', 'CRE8', 'NOVO', 'LTC', 'BTC', 'ETH']
    $scope.markets = ['Education', 'Shelter', 'Food', 'Creation', 'Health', 'Security', 'Transparency', 'USD', 'ETH', 'BTC', 'STEEM', 'LTC', 'CRE8', 'onTime', 'onTimeStream', 'onReact', 'onPost','onOrder','onVote','onView','onValidate','onMine','NOVO','CONEX','DURHAM','ALCOA','MARYVILLE','CHAPEL HILL'];
    
    for (x in $scope.baseMarkets){

        var random1 = Math.floor(255*Math.random());
        var random2 = Math.floor(255*Math.random());
        var random3 = Math.floor(255*Math.random());

        $scope.chart.series.push({
            id: 'values'+x,
            type: 'area',
            name: $scope.baseMarkets[x],
            pointPlacement: 'on',
            data: [],
            color: 'rgba('+random1+','+random2+','+random3+',0.3)',
            fillOpacity: 0.3,
        });

    }
   
    for (x in $scope.markets){
        $scope.chart.xAxis.categories.push($scope.markets[x]);
        for (y in $scope.baseMarkets){
            $scope.chart.series[y].data.push((1+1*Math.random())/2);
        }
    }

    $scope.addMarket = function(type){
        //basemarket; market
    };

    $scope.newOrderToggle = function(){
        $scope.newOrderToggleVar = $scope.newOrderToggleVar ? false : true;
    };

    //TODO
    $scope.createContent = function(content, type){};

    $scope.createOrder = function() {
        if ($scope.currentUser){
            $scope.newOrder.user = $scope.currentUser.id;
            //TODO: PARSE INPUT
            //$scope.newOrder.amountSet = $scope.newOrder.amountSet.replace(/^(\d+(,\d+)*)?$/gm);
            //$scope.newOrder.amountSet1 = $scope.newOrder.amountSet1.replace(/^(\d+(,\d+)*)?$/gm);
            OrderModel.create($scope.newOrder).then(function(model) {
                $scope.orders.push($scope.newOrder);
                $scope.newOrder = {};
            });
        }
        else{$location.path('/login')}
    };

    //TODO
    $scope.createReaction = function(content, type){};

    $scope.reply = function(item){
        var index = $scope.orders.map(function(obj){return obj.id}).indexOf(item.id);
        $scope.orders[index].showReply = !$scope.orders[index].showReply
    };

    $scope.search = function(){};

}])


.controller( 'MemberTimeCtrl', ['$location', '$sailsSocket', '$scope', '$stateParams', 'config', 'lodash', 'member', 'titleService', 'work', function MemberTimeController( $location, $sailsSocket, $scope, $stateParams, config, lodash, member, titleService, work) {

    //based on tokens 
    //location mapping overtime
    //time mapping via actions ?  
    //CAL SCHED .. PROMISE

    //TODO VIEW --> CONSUMPTION
    //VIZ ON A DAY TIME
    //VIZ ON MONTH TIME

    $scope.work = work;
    $scope.work = work.map(function(obj){
        var endTime = new Date(obj.createdAt)
        obj.startTime = new Date(endTime.setSeconds(endTime.getSeconds() - obj.amount));
        obj.endTime = new Date(obj.createdAt);
        return obj
    });

    //TODO
    $scope.createContent = function(content, type){};

    //TODO
    $scope.createReaction = function(content, type){};

    $scope.reply = function(item){
        var index = $scope.work.map(function(obj){return obj.id}).indexOf(item.id);
        $scope.work[index].showReply = !$scope.work[index].showReply
    };

    $scope.search = function(){};

}]);


