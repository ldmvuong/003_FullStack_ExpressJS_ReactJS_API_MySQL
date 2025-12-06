require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const { ApolloServer } = require('apollo-server-express'); 
// -------------------------------------

const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const { initDatabase } = require('./models/index');
const { typeDefs, resolvers } = require('./graphql/cartSchema');
const { getHomepage } = require('./controllers/homeController');

const app = express();
const port = process.env.PORT || 8080;

// 1. Cấu hình Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Quá nhiều request."
});

const startServer = async () => {
    // 2. Kết nối Database
    try {
        await initDatabase();
        console.log(">>> Connected to Database!");
    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
        return;
    }

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const token = req.headers.authorization || '';
            try {
                if (token.startsWith("Bearer ")) {
                    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
                    return { user: decoded };
                }
            } catch (e) {}
            return { user: null };
        }
    });

    // --- QUAN TRỌNG V3: Phải start() trước ---
    await server.start();

    // 4. Middleware chung
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    configViewEngine(app);

    // 5. Routes
    const webAPI = express.Router();
    webAPI.get("/", getHomepage);
    app.use('/', webAPI);

    app.use('/v1/api/', limiter, apiRoutes);

    server.applyMiddleware({ app }); 

    // 6. Start Server
    app.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}`);
        console.log(`🛒 GraphQL ready at http://localhost:${port}${server.graphqlPath}`);
    });
};

startServer();