const express = require('express');
require("./Db/config");
const cors = require("cors")
const app = express();
const productRoutes = require("./router/productRoute")


app.use(express.json());
app.use(cors())

let port = process.env.PORT || 3000
app.use(express.json());
app.use(cors());

// Product    api   route 
app.use(productRoutes)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
