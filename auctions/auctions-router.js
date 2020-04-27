const router = require("express").Router();

const Auctions = require("./auctions-model.js");

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

router.get("/seller", (req, res) => {
    Auctions.findBy({user_id: req.decodedToken.id})
    .then((auct) => {
      res.status(200).json(auct);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
})

module.exports = router;
