const router = require("express").Router();

const Auctions = require("./auctions-model.js");

const authenticator = require("../api/authenticator.js");

router.get("/:id/bids", authenticator, (req, res) => {
    Auctions.findBy({id: req.params.id})
        .then(auct => {
            if (auct.length == 0) {
                res.status(404).json({ message: "Auction not found." });
            } else {
                if (auct[0].user_id == req.decodedToken.id){
                    Auctions.bidsNoNames(req.params.id)
                        .then(bids => {
                            res.status(200).json(bids);
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(500).json({ errorMessage: error.message });
                          });
                } else {
                    res.status(400).json({ message: "Only seller can see list of bids." })
                }
            }
        })
})

router.get("/:id", (req, res) => {
    Auctions.findBy({id: req.params.id})
    .then((auct) => {
      res.status(200).json(auct);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

router.get("/seller", authenticator, (req, res) => {
    Auctions.findBy({user_id: req.decodedToken.id})
    .then((auct) => {
      res.status(200).json(auct);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

router.get("/", (req, res) => {
    Auctions.findBy()
      .then((auct) => {
        res.status(200).json(auct);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ errorMessage: error.message });
      });
  });

module.exports = router;
