const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const logSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
    log: {
        type: [{
            description: { type: String, required: true },
            duration: { type: Number, required: true },
            date: { type: String, required: true }
        }],
        default: []
    }
});

const UserLog = mongoose.model('UserLog', logSchema);

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post("/api/users", function(req, res) {
  let newUser = new UserLog({ username: req.body.username });
  newUser.save().then((savedUser) => {
    res.send({ "username": savedUser.username, "_id": savedUser._id });
  }).catch((error) => {
    res.status(500).send("Error saving user");
  });
});


app.post("/api/users/:_id/exercises", function(req, res) {
  UserLog.findById(req.params._id)
    .then((selectedUser) => {
      if (!selectedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      let dateVar = new Date(req.body.date);
      if (isNaN(dateVar.getTime())) {
        dateVar = new Date();
      }
      dateVar = dateVar.toDateString();

      const duration = parseInt(req.body.duration);

      selectedUser.log.push({
        description: req.body.description,
        duration: duration,
        date: dateVar
      });
      selectedUser.count += 1;

      return selectedUser.save();
    })
    .then((updatedUser) => {
      const latestLog = updatedUser.log[updatedUser.log.length - 1];
      const response = {
        _id: updatedUser._id,
        username: updatedUser.username,
        date: latestLog.date,
        duration: latestLog.duration,
        description: latestLog.description
      };
      console.log("Response:", JSON.stringify(response));
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});




app.get("/api/users", function(req, res) {
  //

  UserLog.find({}, {username: 1, _id: 1}).then((allUsers) => {
    if (!allUsers) {
      return res.status(404).json({ message: 'User not found' }); 
    }
    //Bc it will; also return a json in some scenarios
    return res.json(allUsers);
  }).catch((error) => {
    return res.status(500).json({error: error.message});
  })  
});

app.get("/api/users/:_id/logs", function(req, res) {
    UserLog.findById(req.params._id).then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' }); 
      }
      let from;
      if (!req.query.from) {
        /**
         * Thought it was best to set the date to initially be Jan 1st, 1970. There are definetly other ways people
         * could have solved this, but I liked this strategy
         */
          from = new Date("1970-01-01");
      } else {
        from = new Date(req.query.from);
      }
      let to = req.query.to;
      if (!req.query.to) {
        to = new Date();
      } else {
        to = new Date(req.query.to);
      }
      let filteredLogs = user.log.filter((exercise) => {
        exerciseDate = new Date(exercise.date);
        return exerciseDate >= from && exerciseDate <= to;
      });
      if (req.query.limit) {
        filteredLogs = filteredLogs.slice(0, parseInt(req.query.limit, 10));
      }
      return res.json({
        username: user.username,
        count: user.count,
        _id: user._id,
        log: filteredLogs
      })


    }).catch((error) => {
      res.status(500).json({message: error.message});
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
