/**
* Post.js
*/

module.exports = {

	attributes: {
        content: {
            type: 'string',
            required: true
        },
        user: {
            model: 'user'
        },
        views: {
            type: 'integer',
            defaultsTo: 0,
        }
    },


    getOne: function(id) {
        return Post.findOne(id)
        .populate('user')
        .then(function (model) {
            return [model];
        });
    },

    afterCreate: function (post, next) {
        // set message.user = to appropriate user model
        User.getOne(post.user)
        .spread(function(user) {
            post.user = user;
            next(null, post);
        });
    },

    getAll: function() {
        return Post.find()
        .sort({createdAt: 'DESC'})
        .populate('user')
        .then(function (models) {
            return [models];
        });
    },

};

