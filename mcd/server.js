const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:5173", 
      credentials: true, 
    })
  );
  

app.use(
    session({
      secret: "captcha-sec", 
      resave: false, 
      saveUninitialized: false, 
      cookie: { secure: false, httpOnly: true, maxAge: 3600000 }, 
    })
  );
  

app.use((req, res, next) => {
  if (!req.session.userData) {
    req.session.userData = {
      right: 0,
      wrong: 0,
      skip: 0,
    };
  }
  next();
});


function generateCaptcha() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 6;
  let captcha = ""; 
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

app.get("/captcha", (req, res) => {
    const generatedCaptcha = generateCaptcha();
    req.session.captcha = generatedCaptcha;
    
  
    const imageCaptcha = `data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60">
        <rect width="200" height="60" fill="#f4f4f4"/>
        <text x="50" y="35" font-size="24" fill="#333" font-family="Arial, sans-serif">${generatedCaptcha}</text>
      </svg>
    `).toString("base64")}`;
  
    res.json({
      captchaImage: imageCaptcha,
      captchaText: generatedCaptcha,
    });
  });
  
  app.post("/val-captcha", (req, res) => {
    const { answer } = req.body;
  
  
    const { captcha } = req.session;

  
    if (!captcha) {
    
      return res.status(400).send("Captcha not found in session");
    }
  
    if (captcha === answer) {
      req.session.userData.right += 1;
      req.session.captcha = null; 
      return res.json(req.session.userData);
    } else {
      req.session.userData.wrong += 1;
      return res.status(400).send("Wrong captcha");
    }
  });
  
  
  

app.post("/skip", (req, res) => {
  req.session.userData.skip += 1; 
  req.session.captcha = null; 
  res.json(req.session.userData);
});


const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
