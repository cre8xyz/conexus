
//CRE8.EVENT.ALPHA
module.exports = {

	//meta

	//APP-APP CONNECTION 
	import: { 
		request: require('request'),
		Q: require('q'),
		//socket:require('socket')
	},

	attributes: {
        type: {type: 'string'},
        data: {type: 'json'},
        model: {type: 'json'},        
    },

    //STATEMENT AS ARRAY
    //TODO 
	types:[
		{
			type:'EVENT', 
			//id: --> REDUCTION DESIRED ~~ HASH ID 
			attributes:{
	        	type: {type: 'string'},
		        data: {type: 'json'},		   

		        //PLACE OF STUDY
		        	//CONSENSUS PLUGIN
		        	//VALIDATION MESH WHICH PROVIDES EVENT HISTORY AND CONTEXT 
		        		//TRUTH TREES s
		        truthForestHashSet:{type:'json'}  

		    }
		}
	],

    //CONNECTIONS ARE THE LANGUAGE 
    //-- THIS IS WIP FOR FUN
    connections:[
		{
			//id:'self', 
			type:'connection', 	
			connections:[{
				//id:'self',
				type:'EVENT',
				attributes:{
					//DATA MODEL 
					// EVENT IS AN OBJECT WITH CONSENSUS INFO
					id:'', //HASH OF THE DATA OBJECT

					//COULD BE FOR PLUGIN CONSENSUS APP . . . 
					//THE RESPECTIVE FOSET HASHES
						//MULTI MERKEL ROOTS
						//VARIENT CONSENSUS

						//TODO: 
						//CONSENSUS MECHENISM IS WRITTEN IN CREATE
						//PARSE THE HASHES AND CONNECTION HASHES  . . .
							//RES{	
								//[]..score
							//}	

					//truth
					//MULTIDIMESNIONAL CONSENSUS
					connectionHashes:[],

					//MAPPING OF ALL ATTENTION / VALIDATIONS & ACTIONS ON EVENT  . . . 
					tokens:[],

					//event data 
					data:[],

				},

			}],
		}
	],

	//NOTE: TEXT NEEDS TO BE BIGGER FOR THE STREAM PPL

	//REDUCE INTO SELF CONECTION W CONTEXT
	language: 'Javascript',
	compiler:'V8',

	get: async function(req){
		//model.input, model.output, query . . 
		//BETTER GET . . . WE ARE ABSTRACTING THOUGH MONOGO. . . 
		//provide context hash
		//truth variance 
		var limit = parseInt(req.query.limit) || 1;
		var skip = parseInt(req.query.skip) || 0;
		var sort = req.query.sort || 'createdAt DESC';	
		//var event = await eventApp.find(req.query);
		//res.json(event);
		console.log('GET EVENT', req.query)	
		//TODO: AUDIT 
		if(req.query.id){return Event.find({id:req.query.id}).limit(limit).skip(skip).sort(sort);}
		else{return Event.find().limit(limit).skip(skip).sort(sort);}
	},

	//HEllO, Thanks for reading 
	create: async function(model){
		//model.input, model.output
		//SLOWLY PHASE OUT STATIC DEFINED MODELS --> EVENT HEADER 
		var eventModel = {
			//model:{
				//ERR: MONOO DOEST LIKE THE SHA-256 ID
				hashId:model.hash, // THIS IS AN UPDGRADE : RE THE PRESENT MOMENT DUPLICATION OF HASH AND IDS 
				type:model.type || model.model, //LEGACY :|
			//},

			//WE CAN REDUCE THIS TO MACHIENE VALIDATION (EVENT-(EVENT-EVENT..) ASSOCIATION) :
			//BETTER NEAME IS ? 
			truthForestHashSet:[],
			//TYPE DATA CHECKER? 
			data: model,

		};
		//EVENT IS DEFINED IN model/event . . . unify 
		//LEGACY BOOTSTRAPPING
			//TRIE ATTEMPT ~ REDUCE TO BINARY THX ~
		var newEvent = await Event.create(eventModel)
		console.log('CREATE EVENT', model);
		//REDUCE / SOCKET BROADCAST 
		Event.publish([newEvent.id], {verb: 'create', data: newEvent});
	},


	views:{

		//CARD TEMPLATE --> MULTI TYPES . . .

	}

};