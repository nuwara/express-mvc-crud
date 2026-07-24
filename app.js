import express from "express";
import ejs from "ejs";
import productRoutes from "./routes/products.js";
import dbSetup from "./model/Products.js";
import session from "express-session";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import crypto from "crypto";


const app = express();

// MySQL db config
dbSetup()
    .then(()=>console.log("MySQL database configuration is successfully"))
    .catch(err=>console.log(err));

// middlewares
app.use(express.urlencoded({extended: true}));

// session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// security middlewares
app.use(helmet());

// CORS: Configures Cross-Origin Resource Sharing
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend domain, or use '*' to allow all (not recommended for production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Required if you pass session cookies across origins
}));

// EXPRESS-RATE-LIMIT: Prevents brute-force and DoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiter globally
app.use(limiter);

// template engine setup
app.set("view engine", "ejs");

// csrf implementation
app.use((req, res, next) => {
    if (!req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString("hex");
    }
    res.locals.csrfToken = req.session.csrfToken;
    next();
});

app.get("/", (req, res)=>{  
  res.render("index");
});

app.use("/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`));
