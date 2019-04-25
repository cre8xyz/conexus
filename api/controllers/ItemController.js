/**
 * ItemController
 */

module.exports = {

	getSome: function(req, res) {
		
		var limit = parseInt(req.query.limit) || 1;
		var skip = parseInt(req.query.skip) || 0;
		var sort = req.query.sort || 'createdAt DESC';
		
		console.log('GET ITEM', req.query);

		if(req.query.id){
			var id = req.query.id;
			Item.find({id:id})
			.limit(limit)
			.skip(skip)
			.sort(sort)
			.populate('user')  //TODO: OWNER
			.then(function(models){
				Item.subscribe(req, models);
				res.json(models[0])
			});
		}

		else if (req.query.tag){
			var tag = req.query.tag;
			Item.find({tags:{contains: tag}})
			.limit(limit)
			.skip(skip)
			.sort(sort)
			.populate('user') //TODO: OWNER
			.then(function(models) {
				Item.subscribe(req, models);
				res.json(models);
			});
		}

		//TODO: OWNER
		else if (req.query.user){
			var user = req.query.user;
			console.log(req.query)
			Item.find({user:user}) //TODO: OWNER
			.limit(limit)
			.skip(skip)
			.sort(sort)
			.populate('user')  //TODO: OWNER
			.then(function(models) {
				Item.subscribe(req, models);
				res.json(models);
			});
		}

		else{
			Item.find({})
			.limit(limit)
			.skip(skip)
			.sort(sort)
			.populate('user')  //TODO: OWNER
			.then(function(models){
				res.json(models)
			});
		}
		
	},

	create: function (req, res) {
		var model = {
			title: req.param('title'),
			associatedModels: req.param('associatedModels'),
			content: req.param('content'),
			tags: req.param('tags'),
			//info: req.param('info'),
			location: req.param('location'),
			amountSet: req.param('amountSet'),
			isGenerator: req.param('isGenerator'),
			//creator
			user: req.param('user'),
			//owner: req.param('owner'),
			//PATCH
			reactions: {plus:0,minus:0},
		};
		console.log('CREATE ITEM', model);
		Item.create(model)
		.exec(function(err, task) {
			if (err) {return console.log(err);}
			else {
				Item.publishCreate(task);
				res.json(task);
			}
		});
	},

	update: function (req, res) {},
	
};

