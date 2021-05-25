const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verifyToken = require('../middleware/auth');




//@route GET api/posts 
router.get('/',verifyToken, async (req,res) => {
    try {
        const posts = await Post.find({ user : req.userId }).populate('user', ['username'])
        res.json({ success: true, posts });
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ success : false, message:err.message}) 
    }
});


//@route POST api/posts 

router.post('/',verifyToken,async (req,res) => {
    const { title, description, url, status } = req.body;

    if(!title) return res.status(400).json({ success: false, message: 'Title is required' });
    try {
        const newPost = new Post({
             title, 
             description,
             url :(url.startsWith('https://') ? url : `https://${url}`),
            status : status || 'TO LEARN' ,
            user: req.userId
        })

        await newPost.save();
        res.json({ success:true, message:'Happy learning', post: newPost})
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ success : false, message:err.message})
    }
})


//@route PUT api/posts/:id

router.put('/:id',verifyToken,  async (req,res) => {
    const { title, description, url, status } = req.body;
    
    if(!title) return res.status(400).json({ success: false, message: 'Title is required' });
    try {
        let updatedPost = {
             title, 
             description : description || '',
             url :(url.startsWith('https://') ? url : `https://${url}` || ''),
            status: status || 'TO LEARN'  
            
        }

        const postUpdateCondition = {_id: req.params.id, user: req.userId }   ;

        updatePost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, { new : true });

        if(!updatePost) return res.status(401).json({ success : false, message : 'Post not found or user not authorized'});

        res.json({ success : true, message : 'Updated successfully', post: updatePost })
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ success : false, message:err.message})
    }
});

//@route DELETE api/posts/:id
router.delete('/:id',verifyToken,  async (req,res) => {
    try {
        const postDeleteCondition = { _id: req.params.id, user : req.userId }
        const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

        if(!deletedPost) return res.status(401).json({ success : false, message: " Post not found or user not authorised"})
        res.json({ success : true, post : deletedPost })
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ success : false, message:err.message})
    }
})
module.exports = router;
