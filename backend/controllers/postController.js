const Post = require('../models/post');
const user = require('../models/user');


class postController{
    async createPost(req, res){
        try {
            const {title, content} = req.body
            const url = req.protocol + '://' + req.get("host");
            const post = new Post({
                title,
                content,
                imagePath: url + "/images/" + req.file.filename,
                creator: req.user.id
            })
            await post.save().then( createdPost => {
                res.status(200).json({
                    message:"Post added successfully",
                    post:{
                        ...createdPost,
                        id: createdPost._id
                    }
                })
            })
        } catch (error) {
            res.status(400).json({message: 'Creating post error'})
        }
    }

    async updatePost(req, res){
        try {
            const {id, title, content} = req.body
            let imagePath = req.body.imagePath;
            if(req.file){
                const url = req.protocol + "://" + req.get("host");
                imagePath = url + "/images/" + req.file.filename
            }
            const post = new Post({_id: id, title, content, imagePath, creator: req.user.id});
            Post.updateOne({_id: id, creator: req.user.id}, post).then(result => {
                if(result.matchedCount > 0){
                    res.status(200).json({ message: "Update successful!" });
                }else {
                    res.status(401).json({ message: "You have no rights" });
                }
              });
        
        } catch (error) {
            res.status(400).json({message: 'Update post error'})
        }
    }

    async findPosts(req, res){
        try {
            const pageSize = +req.query.pagesize;
            const currentPage = +req.query.page;
            const postQuery = Post.find()
            let fetchedPost;
            if (pageSize && currentPage){
                postQuery
                    .skip(pageSize * (currentPage - 1))
                    .limit(pageSize)
            }
            postQuery
                .then( document => {
                    fetchedPost = document;
                    return Post.count()
                })
                .then( count => {
                    res.status(200).json({
                        message: "Post fetched successfully",
                        posts: fetchedPost,
                        maxPosts: count
                    })    
                })
        } catch (error) {
            res.status(400).json({message: 'Searching post error'})
        }
    }

    async findById(req, res){
        try {
            const post = await Post.findById(req.params.id)
            if (post) {
                res.status(200).json(post);
              } else {
                res.status(404).json({ message: "Post not found!" });
              }
        } catch (error) {
            res.status(400).json({message: 'Searching post error'})
        }
    }

    async deletePost(req, res){
        try {
            Post.deleteOne({ _id: req.params.id, creator: req.user.id}).then( result => {
                console.log(result)
             
                if(result.deletedCount > 0){
                    res.status(200).json({ message: "Deletion successful!" });
                }else {
                    res.status(401).json({ message: "You have no rights" });
                }
            }
            );
        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Error delete"})
        }
    }
}

module.exports = new postController()