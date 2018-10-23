var express = require('express');
var app = express();
var request = require('request');
var mongoose = require('mongoose');
var session = require('express-session')
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt')
var multer = require('multer');
     
const APIKEY = '&key='
app.use(session({secret: 'madebyPeterLin'}));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/Geek/src/assets/uploads')      //you tell where to upload the files,
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({storage: storage,
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...')
    },
});


var fs = require('fs');
var path = require('path');
// Setting our Static Folder Directory

mongoose.connect('mongodb://localhost/geek');
var UserSchema = new mongoose.Schema({
	username: {type: String, required: true, minlength: 6, unique: true},
	password: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	birthday: {type: String, required: true},
	likes: {type: Array, default: []},
	location: {type: String},
	gender: {type: String, required: true},
	administrator: {type: Boolean, required: false},
	picture:{ data: Buffer, contentType: String},
	description: {type: String},

})

var EventSchema = new mongoose.Schema({
	name: {type: String, required: true},
	location: {type: String, required: true},
	lat: { type: Number, required: true},
	long: { type: Number, required: true},
	date: {type: String, required: true},
	description: {type: String, required: true},
	capacity: { type: Number, required: true},
	image: {type: String, required: true },
	attending: {type: Array, default: []},
	imageBuffer: {data: Buffer, contentType: String},
})

var User = mongoose.model('User', UserSchema)
var Event = mongoose.model('Event', EventSchema)

// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.use(bodyParser.json())
app.use(express.static( __dirname + '/Geek/dist' ));


app.post('/users/login', function(req, res){


	User.findOne({username: req.body.username.toLowerCase()}, function(err, user){
		if(err || !user){
			res.json({message:"error", details: "Incorrect username or password"})
		}
		else{
			bcrypt.compare(req.body.password, user.password, function(err, res2){
				if(res2){
					req.session.userid = user._id
					console.log("logged in")
					if(user.administrator == true)
						res.json({message:"success", administrator: "true"})
					else{
						res.json({message:"success", administrator: "false"})
					}
				}
				else{
					res.json({message:"error", details: "Incorrect username or password"})
				}
			})
		}
	})
})

app.get('/loggedin', function(req, res){
	if(req.session.userid){
		res.json({message:"true", user:req.session.userid})
	}
	else{
		res.json({message:"false"})
	}
})

app.post('/users/logout', function(req, res){
	req.session.destroy();
	res.json({message:"success"})
})

app.get('/getUsers:id', function(req, res){
	if(req.session.userid){
		Event.findOne({_id: req.params.id}, function(err, event){
			if(err){
				res.json({message:"error retrieving users"})
			}
			else if(event){
			}
		})
	}
})


app.get('/details/:id', function(req, res){

	if(req.session.userid){
		User.findOne({_id: req.params.id}, function(err, user){
			if(err){
				console.log("Error retrieving user id: ", req.params.id)
				res.json({message:"error"})
			}
			else if(user){
				console.log(user)
				var difference = Date.now() - Date.parse(user.birthday)
				
				var newDate = new Date(difference)
				
				var age = newDate.getUTCFullYear() - 1970
				
				res.json({
					message: "success",
					username: user.username,
					gender: user.gender,
					likes: user.likes,
					picture: user.picture,
					//to be changed
					age: age,
					description: user.description,

				})

			}
			else{
				console.log("Error, no user found with id", req.params.id)
				res.json({message:"error"})
			}
		})
	}
	else{
		res.json({message:"not logged in"})
	}
	
	
	
})

app.get('/isadmin', function(req, res){
	
	if(req.session.userid){

		User.findOne({_id: req.session.userid}, function(err, user){
			if(user){
				
				if(user.username == "administrator" || user.administrator == true){
					user.administrator = true;
					user.save()
					res.json({message: 'true'})
				}
				else{
					res.json({message: 'false'})
				}
			}
			else{
				res.json({message: 'false'})
			}
		})
	}
	else{
		res.json({message: 'false'})
	}

})


app.post('/register', function(req, res){
	// console.log(req.body)
	var ofage = false;

	// BIRTHDAY CHECK
	var curDate = new Date()
	var today = curDate.toISOString();
	today = today.substring(0,10)
	// console.log(today)

	var parsedDate = req.body.birthday.split("-")
	var bYear = parseInt(parsedDate[0])
	var bMonth = parseInt(parsedDate[1])
	var bDay = parseInt(parsedDate[2])
	var parsedToday = today.split("-")
	var tYear = parseInt(parsedToday[0])
	var tMonth = parseInt(parsedToday[1])
	var tDay = parseInt(parsedToday[2])


	if(tYear - bYear > 18){
		ofage = true
	}
	else if( tYear - bYear == 18){
		if(tMonth > bMonth){
			ofage = true
		}
		else if(tMonth == bMonth){
			if(tDay >= bDay){
				ofage = true
			}
		}

	}

	if(ofage){
		let hash = bcrypt.hash(req.body.password, 10, function(err, hash){
		var newUser = new User();
		newUser.username = req.body.username.toLowerCase();
		newUser.password = hash;
		newUser.email = req.body.email;
		newUser.birthday = req.body.birthday;
		newUser.gender = req.body.gender;
		if(newUser.username == "administrator"){
			newUser.administrator = true;
		}
		newUser.save(function(err){
			if(err){
				if(err.code == 11000){
					if(err.errmsg.includes("Username")){
						res.json({message: "error", details: "Username is already taken"})
					}
					else{
						res.json({message: "error", details: "Email is already in use"})
					}
				}
				
			}
			else{
				req.session.userid = newUser._id
				res.json({message: "success", user: newUser})
			}
		})
		})
	}
	else{
		res.json({message: "error", details: "You must be 18 years or older"})
	}



})

app.get('/events', function(req, res){
	Event.find({}, function(err, events){
		if(!err){
			res.json({"events": events})
		}
		else{
			res.json({"error": "error"})
		}
	})
})

// Date and Time need work
app.put('/modify/:id', upload.single('file'), function(req, res){
	hasImage = false;
	if(req.file){
		console.log("theres an image")
		hasImage = true;
	}
	console.log(req.body)

	console.log(req.params.id)

	Event.findOne({_id: req.params.id}, function(err, event){
		if(err){
			res.json({message: "error"})
		}
		else{
			url = 'https://maps.googleapis.com/maps/api/geocode/json?address=?'
			console.log(req.body)
			if(req.body.location){
				User.findOne({_id: req.session.userid}, function(err, user){
					if(user.administrator){
						var re = /\s*(,|$)\s*/;
						var address = req.body.location
						var addrArray = address.split(" ");

						for(var i = 0; i < addrArray.length; i++){
							url += '+'
							url += addrArray[i];
						}
						url += APIKEY;

						request(url, function(error, response, body) {
							if(error){
								console.log(error)
							}
							else{
								var result = JSON.parse(body)
								console.log(result)
								console.log(result.results[0].geometry.location.lat)
								console.log(result.results[0].geometry.location.lng)
								event.name = req.body.name;
								event.location = req.body.location;
								event.date = req.body.date;
								event.capacity = req.body.capacity;
								event.description = req.body.description;
								event.lat = result.results[0].geometry.location.lat;
								event.long = result.results[0].geometry.location.lng;

								if(hasImage){
									event.imageBuffer.data = fs.readFileSync(req.file.path);
									fs.unlink(req.file.path, function(err){
										if(err){
											console.log("error deleting image", req.file.path)
										}
										else{
											console.log("deleted image", req.file.path)
										}
									})
								}

								event.save(function(err){
									if(err){
										console.log(err)
										res.json({message: "error"})				
									}
									else{									
										res.json({message: "success"})
									}
								})
							}
						})				
					}
					else{
						res.json({message: "not allowed"})
					}
				})
			}
			else{
				res.json({message: "no location"})
			}
			
		}
	})

})


app.post('/photo', upload.single('file'), function(req, res){
	if(req.session.userid){
		User.findOne({_id: req.session.userid}, function(err, user){
			if(err){
				res.json({message:"error during upload photo"})
			}
			else if(user){
				user.picture.data = fs.readFileSync(req.file.path);
				user.picture.contentType = 'image/png';

				fs.unlink(req.file.path, function(err){
					if(err){
						console.log("error deleting image", req.file.path)
					}
					else{
						console.log("deleted image", req.file.path)
					}
				})
				user.save(function(err){
					if(err){
						res.json({message:"error saving photo"})
					}
					else{
						res.json({message:"success"})
					}
				})

			}
			else{
				res.json({message:"error during upload photo"})
			}

		})
	}
	else{
		res.json({message:"not logged in"})
	}
	
})

app.put('/updateProfile', function(req, res){
	if(req.session.userid){
		User.findOne({_id: req.session.userid}, function(err, user){
			if(err){
				res.json({message: "error updating profile"})
				console.log("error updating profile")
			}
			else if(user){
				console.log(req.body)
				user.likes = req.body.likes;
				user.description = req.body.description;

				user.save(function(err){
					if(err){
						res.json({message:"error saving profile"})
					}
					else{
						res.json({message:"success"})
					}
				})
			}
			else{
				res.json({message: "error updating profile"})
				console.log("error updating profile")
			}
		})
	}
	else{
		res.json({message:"not logged in"})
	}
})


app.post('/create', upload.single('file'),  function(req,res){
	url = 'https://maps.googleapis.com/maps/api/geocode/json?address=?'

	if(req.session.userid){
		if(req.body.location){
			var re = /\s*(,|$)\s*/;
			var address = req.body.location
			var addrArray = address.split(" ");
			console.log(addrArray)

			for(var i = 0; i < addrArray.length; i++){
				url += '+'
				url += addrArray[i];
			}
			url += APIKEY;

			request(url, function(error, response, body) {
				if(error){
					res.json(error)
				}
				else{
					var result = JSON.parse(body)
					console.log(result)
					console.log(result.results[0].geometry.location.lat)
					console.log(result.results[0].geometry.location.lng)
					User.findOne({_id: req.session.userid}, function(err, user){
						if(user){
							if( user.administrator == true){

								var newEvent = new Event();
								newEvent.name = req.body.name;
								newEvent.location = req.body.location;
								newEvent.date = req.body.date;
								newEvent.capacity = req.body.capacity;
								newEvent.description = req.body.description;
								newEvent.image = req.file.filename;
								newEvent.lat = result.results[0].geometry.location.lat;
								newEvent.long = result.results[0].geometry.location.lng;
								newEvent.imageBuffer.data = fs.readFileSync(req.file.path);
								
								newEvent.imageBuffer.contentType = 'image/png';

								fs.unlink(req.file.path, function(err){
									if(err){
										console.log("error deleting image", req.file.path)
									}
									else{
										console.log("deleted image", req.file.path)
									}
								})

								newEvent.save(function(err){
									if(err){
										console.log(err)
										res.json({message: "error"})				
									}
									else{									
										res.json({message: "success"})
									}
								})
							}
							else{
								res.json({message: "not allowed"})
							}
						}
						else{
							res.json({message: "not allowed"})
						}
					})
				}
			})
		}
	}
})

app.delete('/deleteEvent/:id', function(req, res){
	console.log("whee")
	if(req.session.userid){
		console.log("in delete")
		User.findOne({_id: req.session.userid}, function(err, user){
			if(user){
				if( user.administrator == true){
					Event.remove({_id: req.params.id}, function(err){
						if(!err){
							res.json({message: "success"})
						}
						else{
							res.json({message: "error while deleting"})
						}

					})
					

				}
				else{
					res.json({message: "restricted access"})
				}
			}
			else{
				res.json({message: "please log in"})
			}
		})

	}
	else{
		res.json({message: "not logged in"})
	}
})

app.post('/join', function(req, res){
	console.log(req.body)
	var attending = false;
	var location;
	if(req.session.userid != req.body.user){
		console.log("Cannot join for other people")
	}else if(req.body.user && req.body.event){
		User.findOne({_id:req.session.userid}, function(err, user){

			if(err){
				res.json({message:"error login"})
			}
			else{
				Event.findOne({_id:req.body.event}, function(err, event){
					if(!event){
						res.json({message: 'event not found'})
					}
					else{
						if(event.capacity > event.attending.length){
							for(var i = 0; i < event.attending.length; i++){
								if(event.attending[i].id == req.body.user){
									attending = true;
									location = i;
								}
							}
							if(!attending){
								event.attending.push({id: req.session.userid, username: user.username})
							}
							else if(attending){
								event.attending.splice(location, 1)
							}

							event.save(function(err){
								console.log("saving")
								if(err){
									res.json({message:"error saving"})
								}
								else{
									res.json({message:"success"})
								}
							})					
						}
						else{
							res.json({message:"maximum capacity reached"})
						}


					}

				})

			}
			
		})

	}
	
})


app.all("*", (req,res,next) => {
  res.sendFile(path.resolve("./Geek/dist/index.html"))
});

app.listen(8000, function() {
    console.log("listening on port 8000");
})


