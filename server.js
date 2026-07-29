const express = require("express");
const supabase = require("./supabase");

const app = express();
app.use(express.json());

const port = process.env.port || 3000; 


app.get("/" , (req,res) => {
  res.json({ message: "Hello, World!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});