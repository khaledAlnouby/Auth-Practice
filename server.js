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

app.get("/public/info" , (req,res) =>{
    res.status(200).json({ message :  "Welcome stranger! This info is public."})
}); 

app.get("/protected/profile" , async (req,res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Access token required" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Access token required" });
        }
        const { data, error } = await supabase.auth.getUser(token);
        if (error) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        res.status(200).json({
             id: data.user.id, email: data.user.email , created_at: data.user.created_at
         });
    }
    catch (error) {
        console.error("Error during protected info access:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(PORT, () => {
  console.log(`Server running and connected to Supabase at http://localhost:${PORT}`);
});