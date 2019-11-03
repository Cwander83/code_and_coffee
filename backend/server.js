import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';

const chalk = require('chalk');

// require all models
import Store from './models/Store';
import Comments from './models/Comments';

// initialize Express
const app = express();
const router = express.Router();

// configure middleware

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/codeandcoffee', {
  useNewUrlParser: true,
  useCreateIndex: true,
});

// connect to mongodb
const connection = mongoose.connection;

connection.once('open', () => {
  console.log(
    chalk.yellow('MongoDB database connection established successfully'),
  );
});



/*############## 
                  find all store
                                  #########*/
router.route('/stores').get((req, res) => {
  Store.find({})
    .then(dbStore => {
      console.log(chalk.green(dbStore));
      res.json(dbStore);
    })
    .catch(error => {
      console.log(chalk.red(error));
    });
});

/*############## 
                  find single store 
                                    ############*/
router.route('/stores/:id').get((req, res) => {
  Store.findById({ _id: req.params.id })
    .then(dbStore => {
      console.log(chalk.green(dbStore));
      res.json(dbStore);
    })
    .catch(error => {
      console.log(chalk.red(error));
    });
});

/*############## 
                  add new store
                                ##########*/
router.route('/add_store').post((req, res) => {
  let store = new Store(req.body);
  store
    .save()
    .then(store => {
      res.status(200).json({ store: 'Added successfully' });
    })
    .catch(err => {
      res.status(400).send(chalk.red('Failed to create new record'));
    });
});

/*############## 
                  add new comment
                                  ##########*/
router.route('/add_comment_to_store/:id').post((req, res) => {
  let comment = new Comments(req.body);
  comment
    .save()
    .then(comment => {
      return Store.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { comments: comment._id } },
        { new: true },
      );
    })
    .then(store => {
      Store.findOne({ _id: store._id })
        .populate('comments')
        .then((dbstore, err) => {
          if (err) console.log(chalk.red(err));
          else {
            let totalWifi = 0;
            let totalCoffee = 0;
            let totalSeating = 0;
            let totalOverall = 0;
            for (let i = 0; i < dbstore.comments.length; i++) {
              totalWifi += dbstore.comments[i].wifiRating;
              totalCoffee += dbstore.comments[i].coffeeRating;
              totalSeating += dbstore.comments[i].seatingRating;
            }

            const wifiAverage = totalWifi / dbstore.comments.length;
            const coffeeAverage = totalCoffee / dbstore.comments.length;
            const seatingAverage = totalSeating / dbstore.comments.length;

            totalOverall = wifiAverage + coffeeAverage + seatingAverage;
            const overallAverage = totalOverall / 3;

            Store.findOneAndUpdate(
              { _id: dbstore._id },
              {
                $set: {
                  totalRating: overallAverage,
                  wifiTotalRating: wifiAverage,
                  coffeeTotalRating: coffeeAverage,
                  seatingTotalRating: seatingAverage,
                },
              },
              (err, feedback) => {
                if (err) {
                  console.log(chalk.red(err));
                } else {
                  return;
                }
              },
            );
          }
        });

      res.json({ store: 'update successful' });
    })

    .catch(err => {
      res.status(400).send('Failed to create new record');
    });
});

/*##############
                  find store with comments
                                            ##########*/
router.route('/store_and_comments/:id').get((req, res) => {
  Store.findById({ _id: req.params.id })
    .populate('comments')
    .then(dbStore => {
      console.log(chalk.green(dbStore));
      res.json(dbStore);
    })
    .catch(error => {
      console.log(chalk.red(error));
    });
});

/*##############
                  updating info on the store
                                              ##########*/
router.route('/update_store_data/:id').put((req, res) => {
  Store.findOneAndUpdate(req.params.id, (err, store) => {
    if (!store) {
      return next(new Error('Could not load Document'));
    } else {
      store.name = req.body.name;
      store.address = req.body.address;
      store.phoneNumber = req.body.phoneNumber;

      store
        .save()
        .then(store => {
          res.json(chalk.yellow('Update done'));
        })
        .catch(err => {
          res.status(400).send(chalk.red('Update failed'));
        });
    }
  });
});

/*##############
                  delete a comment
                                              ##########*/
router.route('/remove_comment/:id').get((req, res) => {
  Comments.findOneAndDelete(req.params.id, err => {
    if (err) {
      res.json(chalk.red(err));
    } else {
      res.json(chalk.yellow('Removed successfully'));
    }
  });
});
/*##############
                  delete a store
                                              ##########*/
router.route('/delete_store/:id').get((req, res) => {
  Store.findOneAndDelete(req.params.id, err => {
    if (err) {
      res.json(chalk.red(err));
    } else {
      res.json(chalk.yellow('Removed successfully'));
    }
  });
});

router.route('/findPlaces').get((req, res) => {});

app.use('/', router);

// start the server
app.listen(4000, () =>
  console.log(chalk.bgRed(`Express server running on port 4000`)),
);
