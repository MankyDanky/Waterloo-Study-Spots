const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const path = require('path');
const mongoose = require("mongoose");
const emailValidator = require('deep-email-validator');
const imgur2 = require('imgur-node-api');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config()
console.log(process.env)
const uri = 'mongodb+srv://'+ process.env.MONGO_URI +'.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
imgur2.setClientID("14f716e7085c0fd")

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected")
  } catch (error) {
    console.error(error)
  }
}

connect()



const reviewSchema = new mongoose.Schema({
  rating: {type: Number, min: 0, max: 5},
  review: String,
  username: String,
});

const tagSchema = new mongoose.Schema({
  name: String
});
const Tag = mongoose.model('Tag', tagSchema);

const spotSchema = new mongoose.Schema({
  title: String,
  rating: {type: Number, min: 0, max: 5},
  tags: [String],
  reviews: [reviewSchema],
  icon: String,
  description: String
});
const Spot = mongoose.model('Spot', spotSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  icon: String
})
const User = mongoose.model('User', userSchema);

const PORT = process.env.PORT || 3001;

const app = express();
app.use(jsonParser);
app.use(express.static('public'));

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '/uploads/'))
 },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });



// Upload image to Imgur
app.post('/api/uploadImage', upload.single('file'), async (req, res) => {
  const clientId = "14f716e7085c0fd", auth = "Client-ID " + clientId;
  imgur2.upload(req.file.path, (err, resp) => {
    fs.unlink(req.file.path, (error) => {
      if (error) console.log(error);
    });
    return res.status(200).send(resp.data);
  })
});

// Test server
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Get top 3 spots
app.get("/api/getTop", async(req, res) => {
  const spots = await Spot.find({}).sort("-rating").limit(3);
  res.status(200).send(spots);
})

// Change user icon
app.post("/api/changeIcon", async(req, res) => {
  const iconChangeDetails = req.body;
  await User.updateOne({username: iconChangeDetails.username}, {icon: iconChangeDetails.icon});
  res.status(200).send({status: "success", message: "Profile picture changed"})
})

// Add review to spot
app.post("/api/addReview", async(req, res) => {
  const reviewDetails = req.body;
  const newReview = {username: reviewDetails.username, review: reviewDetails.review, rating: reviewDetails.rating}
  await Spot.updateOne({_id: reviewDetails.spotId}, {$push: {reviews: newReview}});
  const spot = await Spot.findOne({_id: reviewDetails.spotId})
  let newRating = 0
  for (let i = 0; i < spot.reviews.length; i++) {
    newRating += spot.reviews[i].rating;
  }
  newRating = Math.round(2*newRating/spot.reviews.length)/2;
  await Spot.updateOne({_id: reviewDetails.spotId}, {rating: newRating})
  res.status(200).json({status: "success"})
})

// Delete review from spot
app.post("/api/deleteReview", async(req, res) => {
  const reviewDetails = req.body;
  await Spot.findOneAndUpdate({_id: reviewDetails.spotId}, {$pull: {reviews: {username: reviewDetails.username}}});
  const spot = await Spot.findOne({_id: reviewDetails.spotId})
  let newRating = 0
  for (let i = 0; i < spot.reviews.length; i++) {
    newRating += spot.reviews[i].rating;
  }
  newRating = Math.round(2*newRating/spot.reviews.length)/2;
  await Spot.updateOne({_id: reviewDetails.spotId}, {rating: newRating})
  res.status(200).json({status: "success", message: "Review deleted"})
})

// Get tags
app.get("/api/getTags", async(req, res) => {
  const tags = await Tag.find({});
  res.status(200).json({tags: tags});
})

// Get user icon
app.post("/api/getUser", async(req, res) => {
  const body = req.body;
  const username = body.username;
  const user = await User.findOne({username: username});
  res.send({username: user.username, icon: user.icon, email: user.email});
})

// Get spot
app.get("/api/getSpot", async(req, res) => {
  const query = req.query;
  const id = query.id;
  const spot = await Spot.find({_id: id});
  res.send(spot);
})

// Get spots
app.get("/api/getSpots", async(req, res) => {
  const query = req.query;
  const search = query.search;
  const minRating = query.rating || 0;
  let tags;
  if (query.tags) {
    tags = query.tags.split(',')
  } else {
    tags = []
  }
  if (tags.length > 0) {
    const q = {rating: {$gte: minRating}, tags: {$all: tags}, title: {"$regex" : search || "", "$options" : "i"}};
    const spots = await Spot.find(q)
    res.send(spots);
  } else {
    const q = {rating: {$gte: minRating}, title: {"$regex" : search || "", "$options" : "i"}};
    const spots = await Spot.find({rating: {$gte: minRating}, title: {"$regex" : search || "", "$options" : "i"}})
    res.send(spots);
  }
})

// Add spot
app.post("/api/addSpot", async(req, res) => {
  try {
    const spotDetails = req.body;
    const newSpot = new Spot({tags: spotDetails.tags, title: spotDetails.title, description: spotDetails.description, icon: spotDetails.image, reveiws: [], rating: 0})
    await newSpot.save()
    for (let i = 0; i < spotDetails.tags.length; i++) {
      const existingTag = await Tag.findOne({name: spotDetails.tags[i]})
      if (!existingTag) {
        const newTag = new Tag({name: spotDetails.tags[i]});
        await newTag.save();
      }
    }
    res.status(200).json({
      status: "success",
      message: "Spot created"
    })
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: 'Database error: ' + err.message
    })
  }
})

// Access user for login
app.post("/api/accessUser", async(req, res) => {
  const registrationDetails = req.body;
  const existingUser = await User.findOne({username: registrationDetails.username})

  if (existingUser) {
    if (existingUser.password == registrationDetails.password) {
      return res.status(200).send({
        status: 'success',
        message: 'Logged in',
        account: existingUser
      });
    } else {
      return res.status(401).send({
        status: 'error',
        message: 'Incorrect password'
      });
    }
  } else {
    return res.status(401).send({
      status: 'error',
      message: 'No such user'
    });
  }
})

// Create user for sign up
app.post("/api/createUser", async (req, res) => {
  const registrationDetails = req.body;
  const emailValidationResults = await emailValidator.validate({email: registrationDetails.email, validateSMTP: false});
  if (registrationDetails.username == "" || registrationDetails.password == "") {
    return res.status(400).send({
      status: 'error',
      message: 'All fields must be filled'
    });
  }

  if (!emailValidationResults.valid) {
    return res.status(400).send({
      status: 'error',
      message: 'Enter a valid email'
    });
  }

  if (registrationDetails.password != registrationDetails.confirmPassword) {
    return res.status(400).send({
      status: 'error',
      message: 'Passwords do not match'
    });
  }

  try {
    const existingEmail = await User.findOne({ email: registrationDetails.email});
    if (existingEmail) {
        return res.status(409).json({
            status: 'error',
            message: 'Email already in use, please login'
        });
    }

    const existingUser = await User.findOne({ username: registrationDetails.username});
    if (existingUser) {
        return res.status(409).json({
            status: 'error',
            message: 'Username taken'
        });
    }
    const newUser = new User({ email: registrationDetails.email, password: registrationDetails.password, username: registrationDetails.username, icon: "https://i.imgur.com/s7lkvLq.jpg"});
    await newUser.save();
    res.status(201).json({
        status: 'success',
        message: 'User registered'
    });
  } catch (err) {
    res.status(500).json({
        status: 'error',
        message: 'Database error: ' + err.message
    });
  }
});

// Listen to port for server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});