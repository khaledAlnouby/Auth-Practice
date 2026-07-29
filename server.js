const express = require("express");
const supabase = require("./supabase");

const app = express();
app.use(express.json());

const PORT = process.env.port || 3000; 


app.get("/" , (req,res) => {
  res.json({ message: "Hello, World!" });
});

app.post("/auth/signup", async (req, res) => {
    try{
const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ user: data.user });

    } catch (error) {
        res.status(500).json({ error: " Server Error" });
    }
  
});

app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
            });
        if (error) {
            return res.status(401).json({ error: "Invalid Login credentials " });
        }
        res.status(200).json({ accessToken: data.session.access_token,
                               refreshToken: data.session.refresh_token });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(PORT, () => {
  console.log(`Server running and connected to Supabase at http://localhost:${PORT}`);
});