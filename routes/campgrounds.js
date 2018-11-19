const express     = require('express');
const router      = express.Router();
const Campground  = require('../models/campground');
const middleware	= require('../middleware');

// INDEX - show all campgrounds
router.get('/', function (req, res) {
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	});
});

// CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function (req, res) {
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let newCampground = {
		name: name,
		image: image,
		description: desc,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	};
	Campground.create(newCampground, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			console.log(newlyCreated);
			res.redirect('/campgrounds');
		}
	});
});

// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function (req, res) {
	res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', function (req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
	Campground.findById(req.params.id, function (err, foundCampground) {
		res.render('campgrounds/edit', {campground: foundCampground});
	});
});

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
	// redirect somewhere (show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
	Campground.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;