var request = require("request");
var cheerio = require("cheerio");
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

module.experts = function (app) {
	app.get("/", function(req, res){
		// res.redirect('/articles')
		res.render("index")
	});
//*************ROUTING FOR SCRAPING HTML****************
	app.get("/scrape", function (res, res){
		request("https://otakumode.com/news"), function (error, response, html) {
			var $ = cheerio.load(html);
			$("p-article-list__body").each(function(i, element){
				var title = $(this)
					.children ("h3")
					.children("a")
					.text();

				var link = $(this)
					.children ("h3")
					.children ("a")
					.attr("href")

				if (title && link) {
					var result = {};
					result.title = title;
					result.link = link;

					Article.create(result, function(err, doc){
						if(err){
							console.log(err)
						}else {
							console.log(doc);
						}
					});
				}
			});
		}
	});
	res.redirect("/")

//*************Scrape from MongoDB***********************
	app.get('/articles', function(req, res) {
		Article.find({}, function (err, doc){
			if(err) {
				console.log(err)
			} else {
				res.render("index", {result: doc});
			}
		}).sort ({'_id': -1});
	});

//***********Grab artible by ObjectID****************
	app.get('/article/:id', function (req, res){
		Article.findOne ({'_id': req.param.id}).populate('comment').exec(function(error, doc){
			if (error){console.log(error)}
			else{res.render('comments', {result: doc});}
		});
	});
//***********Create Comment***********************

	app.post("/articles/:id", function (req, res){
		Comment.create(req.body, function(error, doc){
				if(error){console.log(error)}
				else{Article.findOneAndUpdate({
					"_id": req.params.id
				}, {$push: {"comment": doc._id}},
				{
					safe: true,
					upsert: true,
					new: true
				}). exec(function(err, doc){
					if (err){console.log(err)}
					else{res.redirect('back')}
				});
			}
		});
	});
}

