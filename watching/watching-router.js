// *GET /api/watching/				list of auctions logged-in user has saved
// *POST /api/watching/:id			add auction to watchlist
// *DELETE /api/watching/:id			remove auction from watchlist

const express = require('express');

const Watching = require('./watching-model.js');

const router = express.Router();

router.get('/', (req, res) => {
    Watching.find(req.headers.authorization)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to get data' });
        });
});

router.post('/:id', (req, res) => {
    const { id } = req.params;
    Watching.add(req.headers.authorization, id)
        .then(watch =>{
            res.status(201).json(watch);
        })
        .catch (err => {
            res.status(500).json({ message: 'Failed to add in a watch list' });
        });
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
  
    Watching.remove(id)
        .then(deleted => {
            if (deleted) {
                res.json({ removed: deleted });
            } else {
                res.status(404).json({ message: 'Could not delete information' });
            }
        })
        .catch(err => {
             res.status(500).json({ message: 'Failed to delete information' });
        });
});

module.exports = router;