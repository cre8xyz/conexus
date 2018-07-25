/**
* Stream.js
*/

module.exports = {

	attributes: {
        title: {
            type: 'string',
        },
        workValidation: {
            type: 'string',
        },
        videoUrl: {
            type: 'string',
            defaultsTo: 'https://www.bidio.co/v/597c55e56833048165c6720c'
        },
        project: {
            model: 'project'
        },
        task: {
            model: 'task'
        },
        user: {
            model: 'user'
        },
    },

};

