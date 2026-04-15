const express = require("express");
const router = express.Router();

const { resolveLimit } = require("../controllers/mathController");
const derivativeController = require("../controllers/derivativeController");
const successiveDerivativeController = require("../controllers/successiveDerivativeController");
const productDerivativeController = require("../controllers/productDerivativeController");
const quotientDerivativeController = require("../controllers/quotientDerivativeController");

router.post("/limit", resolveLimit);
router.post("/derivative", derivativeController.resolveDerivative);
router.post(
  "/derivative-successive",
  successiveDerivativeController.resolveSuccessiveDerivatives
);
router.post(
  "/derivative-product",
  productDerivativeController.resolveProductDerivative
);
router.post(
  "/derivative-quotient",
  quotientDerivativeController.resolveQuotientDerivative
);

module.exports = router;