import mongoose from 'mongoose'
 
const PostSchema = new mongoose.Schema(
    {
        username: { type: String },
        authorAvatar: { type: String, default: '' },
        title: { type: String, required: true },
        text: { type: String, required: true },
        imgUrl: { type: String, default: '', String, required: true },
        views: { type: Number, default: 0 },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        tags: [{ type: String }], 
    },
    { timestamps: true },
)
export default mongoose.model('Post', PostSchema)
