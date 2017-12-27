var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema ({
	
	name: {
		type: String,
		require: true
	},

	body: {
		type: String.
		require: true
	}

})

var Comment = mongoose.model("Comment", CommentSchema)
module.exports = Comment;