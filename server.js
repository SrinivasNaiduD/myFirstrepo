// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }))
// //extended: true: Allows nested objects
// app.use(bodyParser.json())
// const userRoute = require('./app/routes/user.js')
// app.use('/',userRoute)
// const dbConfig = require('./config/database.config.js');
// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.connect(dbConfig.url, {
//     useNewUrlParser: true
// }).then(() => {
//     console.log("Databse Connected Successfully!!");
// }).catch(err => {
//     console.log('Could not connect to the database', err);
//     process.exit();
// });
// app.get('/', (req, res) => {
//     res.json({"message": "Hello Crud Node Express"});
// });
// app.listen(4002, () => {
//     console.log("Server is listening on port 4002");
// });

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const redisClient = require('./config/redis.config');  // Import Redis client

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRoute = require('./app/routes/user.js');
app.use('/', userRoute);

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.get('/', async (req, res) => {
    const cachedMessage = await redisClient.get('welcome_message');

    if (cachedMessage) {
        return res.json({ message: cachedMessage, source: 'cache' });
    }

    const message = "Hello CRUD Node Express";
    await redisClient.set('welcome_message', message, 'EX', 60); // Cache for 60 seconds

    res.json({ message, source: 'server' });
});

app.listen(4002, () => {
    console.log("Server is listening on port 4002");
});
// we can install redis directly in our windows or we can install redis image throug docker(having docker commands for install)
/*Data will primarily be stored in MongoDB (permanent storage).
Redis will serve as a cache to improve read performance, storing frequently accessed data temporarily.
You should manage cache expiry and invalidation strategies to keep data in both systems consistent.
Client Request → Check Redis Cache → If Cache Miss → Fetch from MongoDB → Store in Redis → Return to Client
*/
// In Redis, the maximum expiration time you can set for a key using the EX (expire in seconds)
//  or PX (expire in milliseconds) options is based on the maximum value of a 32-bit signed integer for EX and a 64-bit signed integer for PX.
// Maximum Time: 2,147,483,647 seconds (approximately 68 years)
// await redisClient.set('key', 'value', 'EX', 2147483647);=>This will keep the data for 68 years.
// await redisClient.set('key', 'value');=>If you don’t set an expiry time, the key will persist indefinitely until manually deleted:
/*Important Considerations
Memory Limits: Redis is an in-memory database. Data will be lost if Redis restarts unless you're using persistence features like RDB or AOF.
Use Cases:
Short-lived Data: Use EX (sessions, tokens, etc.)
// Long-lived/Permanent Data: Use no expiration or persist with AOF/RDB*/
// app.use(bodyparser.json());
// This middleware allows your Express app to parse incoming JSON request bodies.
// It ensures that when a client sends JSON data in a request (like POST or PUT), Express can access it via req.body.
//if client send
// {
//   "name": "John",
//   "email": "john@example.com"
// }
//the client sent become this with.json()==> {
//   name: "John",
//   email: "john@example.com"
// }
//bodyparser.urlencoded({ extended: true })==>Parses form data & allows nested objects
//mongoose.connect()==>connects nodejs to mongodb

// const express = require("express");
// const bodyparser = require("body-parser");
// const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;
// const app = express();
// const config = require("./config/database.config");
// const router = require("./app/routes/user");
// app.use("/", router);
// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: true }));
// mongoose
//   .connect(config.url, {
//     useNewUrlParser: true,
//   })
//   .then(() => {
//     console.log("db connected successfully");
//   })
//   .catch((err) => {
//     console.log("error occured", err);
//   });
// app.listen(4002, () => {
//   console.log("server is listening on 4002");
// });
