/**
* Task.js
*/

module.exports = {

    attributes: {
        title: {
            type: 'string',
            required: true,
            unique: true
        },
        content: {
            type: 'string',
        },
        status: {
            type: 'string',
            defaultsTo:'Pending'
        },
        location: {
            type: 'string',
        },
        members: {
            type: 'string',
        },
        parent: {
            model: 'task',
        },
        tags:{
            type: 'string',
        },
        project: {
            model: 'project',
        },
        user: {
            model: 'user',
            required: true
        },







        //TODO: ORDER
        completeBountySet: {
            type: 'string',
        },
        completeIdentifierSet: {
            type: 'string',
        },
        timeBountySet: {
            type: 'string',
        },
        timeIdentifierSet: {
            type: 'string',
        },
        timeStreamBountySet: {
            type: 'string',
        },
        timeStreamIdentifierSet: {
            type: 'string',
        },
        verificationBountySet: {
            type: 'string',
        },
        verificationIdentifierSet: {
            type: 'string',
        },



    },

};

