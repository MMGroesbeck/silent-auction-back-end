const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../api/secrets');

const Bidders = require("./bidders-model");
const Users = require("../users/users-model");
const Auctions = require("../auctions/auctions-model")
const 
const generateToken = require("../api/token-gen");

//endpoints for /api/bidders

router.get("/:id", (req, res) => {
    let select = [];
    let filter = {id: req.params.id};
    if(req.decodedToken && (req.decodedToken.id == req.params.id)) {
        select = ["id", "username", "email", "role"];
    } else {
        select = ["id", "username", "role"];
    };
    Users.findBy(filter, select)
        .then(bidder => {
            res.status(200).json(bidder);
        })
        .catch(error => {
            res.status(500).json({ errorMessage: error.message });
        });
});

router.get("/:id/bids", (req, res) => {
    if (req.decodedToken && (req.decodedToken.id == req.params.id)) {
        Bidders.getBids(req.params.id)
            .then(bids => {
                res.status(200).json(bids);
            })
            .catch(error => {
                res.status(500).json({ errorMessage: error.message });
            });
    } else {
        res.status(400).json({ message: "Bid list only available for logged-in user." });
    }
})

router.post("/:id/bids", (req, res) => {
    const newBid = {
        user_id: req.params.id,
        auction_id: req.body.auction_id,
        bid_amount: req.body.bid_amount
    };
    Auctions.getLatest(newBid.auction_id)
        .then(latest => {
            if(newBid.bid_amount > latest.bid_amount){
                Bidders.addBid(newBid)
                    .then(id => {
                        res.status(201).json({message: "Bid accepted."});
                    })
                    .catch(err => {
                        res.status(500).json({errorMessage: err.message});
                    });
            } else {
                res.status(400).json({ message: "New bid must be higher." });
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: err.message});
        });
})

module.exports = router;