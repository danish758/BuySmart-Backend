const express = require("express");
const { addProduct, getProducts } = require("../controllers/productController");
const validateToken = require("../middleware/validateTokenHandler");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const d = new Date();
    let hour = d.getUTCHours().toString();
    let minutes = d.getUTCMinutes().toString();
    let date = d.getUTCDate().toString();
    let year = d.getUTCFullYear().toString();
    const uniqueSuffix = hour + minutes + date + year + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/", upload.single("image"), validateToken, addProduct);
router.get("/", getProducts);

module.exports = router;
