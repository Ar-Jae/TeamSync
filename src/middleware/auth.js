
const jwt = require('jsonwebtoken');
const User = require('../models/User');
let Admin;
try {
  Admin = require('../models/Admin');
} catch (e) {
  Admin = null;
}

const JWT_SECRET = process.env.JWT_SECRET;
console.log('DEBUG: JWT_SECRET at middleware load:', JWT_SECRET);


const authMiddleware = async (req, res, next) => {
  console.log("--------------------sessionValidation Started--------------------");

  try {
    if (req.method === "OPTIONS") return next();
        
    const authHeader = req.headers.authorization;
    console.log("AuthHeader:", authHeader ? "SET" : "NOT SET");
        
    if (!authHeader) throw new Error("Forbidden");

    const authToken = authHeader.includes("Bearer")
      ? authHeader.split(" ")[1]
      : authHeader;

    console.log("authToken:", authToken ? "SET" : "NOT SET");
        
    const payload = jwt.verify(authToken, JWT_SECRET);
  const foundUser = await User.findById(payload.id);
  console.log('DEBUG: foundUser:', foundUser);
    let foundAdmin = null;
    if (Admin) {
      foundAdmin = await Admin.findById(payload.id);
    }

    if (!foundUser && !foundAdmin) {
      throw new Error("Unauthorized");
    }

    console.log("User:", foundUser ? "FOUND" : "NOT FOUND");
    console.log("Admin:", foundAdmin ? "FOUND" : "NOT FOUND");
        
    req.User = {
      id: foundUser ? foundUser.id : null, 
      email: foundUser ? foundUser.email : null,
      isAdmin: foundUser ? foundUser.isAdmin : false,  
    };

    console.log("User in Request:", req.User);

    req.Admin = {
      id: foundAdmin ? foundAdmin.id : null, 
      email: foundAdmin ? foundAdmin.email : null,
      isAdmin: foundAdmin ? true : false,  
    };
    console.log("Admin in Request:", req.Admin);

    next();

  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
  console.log("--------------------sessionValidation Completed--------------------");
};

module.exports = authMiddleware;

