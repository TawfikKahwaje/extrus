var Blog = require('./blogModel.js');
var Q = require('q');
// Promisify a few mongoose methods with the `q` promise library

var findAllBlogs = Q.nbind(Blog.find, Blog);



module.exports = {
	getAllBlogs : function(req,res){
		Blog.find()
		.sort({date: -1})
		.exec(function(error,blogs){
			if(error){
				res.status(500).send(error);
			} else {
				res.json(blogs);
			}
		});
	},

	newBlog : function(req,res,next){
		var newBlog = new Blog ({
			from : req.body.username,
			title : req.body.title,
			blog : req.body.blog
		});

		newBlog.save(function(err, newBlog){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(200).send(newBlog);
			};
		});
	},

	addLikes : function(req,res){
		var username = req.body.username;
		var blogId = req.params.id;

		Blog.findOne({_id:blogId})
		.exec(function (error, blog){
			if(error){
				res.status(500).send(error);
			}else{
				if(!blog.likes.includes(username)){
					blog.likes.push(username);
					blog.save(function (error, result) {
						if(error){
							res.status(500).send(error)
						}else{
							res.status(200).send("liked");
						}
					})
				}else{
					blog.likes.splice(blog.likes.indexOf(username),1);
					blog.save(function (error, result) {
						if(error){
							res.status(500).send(error)
						}else{
							res.status(200).send("unlike");
						}
					})
				}
			}
		})
	}
}