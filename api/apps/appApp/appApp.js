//CRE8.APP.ALPHA
//SET OF TYPES / PROTOCOLS 
//WORK ON TYPE COMPOSITION
//var Self = {
module.exports = {
	//IMPORTS ARE APP-APP CONNECTIONS
	import:{
		Q: require('q'),
		crypto: require('crypto')
	},


	//RECURSIVE DEPENDENCIES 
	//BUILDER REDUCES THE TREE . . .
	//PUT ALL APPS IN THE [MONGO] DB FOR FUN 
	//META MODEL , , , ,
	attributes: {
        model: {type: 'string', defaultsTo: 'APP'},
		title: {type: 'string'},
		description: {type: 'json'},
		information: {type: 'json'},
        data: {type: 'json'},
        protocols: {type: 'json'},
        associatedModels: {type: 'json'},
        creator: {model: 'user'},
    },

    //DATA :)
    //COMPOSTABILITY ... 
    //db: await orbitdb.docs('CRE8.APP'),
    //init: async function(){
    //	await AppApp.db.load();
    //},

	connections:[
		{
			//APP ID ?
			type: 'APP', 
			//id: --> REDUCTION DESIRED ~~ HASH ID 
			attributes:{
		    }
		}
	],

	//THIS FILE
	//THE PEER IS SELF
	//self.connections.connections;

	//self.connections.connections.association;
	//self.connections.connections.association.validation;

	//self.connections.connections.validation.association = {find:function(model){}};

	//self.connections.connections.association['TOKEN STAKED'];

	//appApp.connections.app.find();
	//self.connections.app.find(); --> 

	//GOOD FOR NOW 
		//SOON CORE APP
        //INIT(GET DATA (INIT-CORE BUILD)) --> RETURNS DYNAMIC FUNCTIONS TO BE RUN BY COMPOSTABLE FUNCTION API [CRE*] --> WASM
        //for (x in apps){}
        //CREATE OBJECT
        //INIT JSON OBJ // THE ENVIRONMENT WE ARE IN 
        //RUN INIT FXN 

	//TODO
	get: async function(req){
		//const records = AppApp.db.get('');
		var deferred = appApp.import.Q.defer();
		var limit = parseInt(req.query.limit) || 1;
		var skip = parseInt(req.query.skip) || 0;
		var sort = req.query.sort;
		var id = req.query.id;
		console.log('GET APP', req.query);
		if(req.query.id){
			var apps = await App.find({id:id}).limit(limit).skip(skip).sort(sort);
			//-->IMPORT TRIE . . . :P
			App.subscribe(req, [apps[0].id]);
			//TODO: MANY-MANY RELATIONSHIP; SEE NOTIFICATIONS . . . 
			var models = await associationApp.get(apps[0]);
			console.log(models);
			deferred.resolve(models);
		}
		else{
			var apps = await App.find({}).limit(100).skip(skip).sort(sort);
			App.subscribe(req, apps.map(function(obj){return obj.id}));
			deferred.resolve(apps);
		}
		return deferred.promise;
	},

	create: async function(req){

		var model = {
			model: 'APP',
			title: req.param('title'),
			description: req.param('description'),
			information: req.param('information'),
			data: req.param('data'),
			protocols: req.param('protocols'),
			context: req.param('context'),
			creator: req.param('creator'),
			data:{apps:{reactions: {plus:0,minus:0}, attention:{general:0}}}
		};
		model.hash = appApp.import.createHmac('sha256', 'CRE8').update(JSON.stringify(model)).digest('hex');
		console.log('CREATE APP', model);
		
		var newApp = await App.create(model);
		await AppApp.db.put({_id:Math.random() ,string:Math.random()});

		App.publish([model.id], {verb: 'create', data: model});
		eventApp.create(newApp);
		validationApp.createLegacy(newApp);
		return App.find({hash:model.hash});

	},
	tokens:{
		get: function(model){
			var tokens = [
				'CRE8', 
				'CRE8+APP', 
				'CRE8+APP+'+model.title.toUpperCase(), 
			];
			return tokens;
		},
		create:async function (model){
			var tokens = Self.tokens.get(model);	
		},
	},
	
};
//modlue.exports = Self;