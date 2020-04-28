const router = require("express").Router();

const Auctions = require("./auctions-model.js");

const authenticator = require("../api/authenticator.js");
const sellerOnly = require("../api/seller-only.js");

router.get("/:id/bids", authenticator, (req, res) => {
    Auctions.findBy({id: req.params.id})
        .then(auct => {
            if (auct.length == 0) {
                res.status(404).json({ message: "Auction not found." });
            } else {
                if (auct[0].user_id == req.decodedToken.userId){
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
    Auctions.findBy({user_id: req.decodedToken.userId})
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

  router.post("/", authenticator, sellerOnly, (req, res) => {
      const newAuction = {
          name: req.body.name,
          description: req.body.description,
          image_url: req.body.image_url,
          start_datetime: req.body.start_datetime,
          end_datetime: req.body.end_datetime,
          user_id: req.decodedToken.userId
      };
      Auctions.addAuction(newAuction)
        .then(auct => {
            res.status(201).json({ message: "Auction posted", auct });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ errorMessage: error.message });
        });
  });

  router.put("/:id", authenticator, (req, res) => {
      Auctions.findBy({ id: req.params.id })
        .then(auct => {
            if(auct.user_id = req.decodedToken.userId){
                console.log (req.body);
                Auctions.updateAuction(req.body, req.params.id)
                    .then(resp => {
                        res.status(200).json({ message: "Updated.", resp});
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).json({ errorMessage: error.message });
                    });
            } else {
                res.status(400).json({ message: "Logged in user does not match auction seller." });
            }
        })
  });

  router.delete("/:id", authenticator, (req, res) => {
    Auctions.findBy({ id: req.params.id })
        .then(auct => {
            if(auct.user_id = req.decodedToken.userId){
                Auctions.deleteAuction(req.params.id)
                    .then(count => {
                        if (count) {
                            res.status(200).json({ message: "Canceled." });
                        } else {
                            res.status(404).json({ message: "Auction not found." });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).json({ errorMessage: error.message });
                    });
            } else {
                res.status(400).json({ message: "Logged in user does not match auction seller." });
            }
        })
  });

module.exports = router;
