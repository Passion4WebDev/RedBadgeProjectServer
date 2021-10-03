const Express = require('express');
const router = Express.Router();
let validateJWT = require('../middleware/validate-jwt');
const { RatingModel } = require('../models');

router.post('/create', validateJWT, async (req, res) => {
  const { blog, date, entry } = req.body.rating;
  const { id } = req.user;
  const ratingEntry = {
    blog,
    date,
    entry,
    owner: id
  }
  try {
    const newRating = await RatingModel.create(ratingEntry);
    res.status(200).json(newRating);
  } catch (err) {
    res.status(500).json({ error: err });
    RatingModel.create(ratingEntry)
  }
});


router.get('/all', async (req, res) => {
  try {
    const rating = await RatingModel.findAll();
    res.status(200).json(rating);
  } catch(err) {
    res.status(500).json({ error: err })
  }
});


router.get('/', validateJWT, async (req, res) => {
  let { id } = req.user;
  try {
    const userRating = await RatingModel.findAll({
      where: {
        owner: id
      }
    });
    res.status(200).json(userRating);
  } catch (err) {
    res.status(500).json({ error: err })
  }
});


router.put('/update/:id', validateJWT, async (req, res) => {
  const { blog, date, entry} = req.body.rating;
  const ratingId = req.params.id;
  const userId = req.user.id;

  const query = {
    where: {
      id: ratingId,
      owner: userId
    }
  };

  const updatedRating = {
    blog: blog,
    date: date,
    entry: entry
  };

  try {
    const update = await RatingModel.update(updatedRating, query);
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({ error: err })
  }
});


router.delete('/delete/:id', validateJWT, async (req, res) => {
  const ownerId = req.user.id;
  const ratingId = req.params.id;

  try {
    const query = {
      where: {
        id: ratingId,
        owner: ownerId
      }
    };
    await RatingModel.destroy(query);
    res.status(200).json({message: 'Rating Deleted'})
  } catch (err) {
    res.status(500).json({error: err})
  }
})

module.exports = router;