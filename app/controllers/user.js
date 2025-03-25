const userModel = require('../model/user')
const redisClient = require('../../config/redis.config');

// exports.create = async (req, res) => {
//     try {

//         if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.phone) {
//             return res.status(400).json({ message: "All fields are required!" });
            
//         }
//         // Create a new user object
//         const user = new userModel({
//             email: req.body.email,
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             phone: req.body.phone
//         });
        
//         // Save the user to the database
//         const savedUser = await user.save();
        
//         // Respond with success message and the created user object
//      return res.status(201).json({
//             message: "User created successfully!",
//             user: savedUser
//         });
//     } catch (err) {
//         // Handle any errors that occur during user creation
//         console.error("Error creating user:", err);
//        return res.status(500).json({ message: "Internal server error" });
//     }
// };
//.................................................
// Find a single User with an id
// exports.findOne = async (req, res) => {
//     try {
//         const user = await UserModel.findById(req.body.id);
//         res.status(200).json(user);
//     } catch(error) {
//         res.status(404).json({ message: error.message});
//     }
// };
//.....................................
// Update a user by the id in the request
// exports.update = async (req, res) => {
//     try {
//         if (!req.body || Object.keys(req.body).length === 0) {
//             return res.status(400).json({ message: "Data to update cannot be empty!" });
//         }

//         const id = req.body.id;
//         const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true, useFindAndModify: false });

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         res.json({ message: "User updated successfully.", user: updatedUser });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
//.........................
// Delete a user with the specified id in the request
// exports.destroy = async (req, res) => {
//     try {
//         const data = await UserModel.findByIdAndRemove(req.body.id);
//         console.log("deleted data==>",data);
//         if (!data) {
//             res.status(404).send({
//                 message: `User not found.`
//             });
//         } else {
//             res.send({
//                 message: "User deleted successfully!"
//             });
//         }
//     } catch (err) {
//         res.status(500).send({
//             message: err.message
//         });
//     }
// };
//.....................
// Retrieve all users from the database.
// exports.findAll = async (req, res) => {
//     try {
//         const user = await userModel.find();
//        return res.status(200).json(user);
//     } catch(error) {
//          return res.status(500).json({message: error.message});
//     }
// };

// ===========================================redis apis===========================================//

exports.create = async (req, res) => {
    try {
        const { email, firstName, lastName, phone } = req.body;

        if (!email || !firstName || !lastName || !phone) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const user = new userModel({ email, firstName, lastName, phone });
        const savedUser = await user.save();

        // Cache the user data in Redis with key as user ID
        await redisClient.set(`user:${savedUser._id}`, JSON.stringify(savedUser), 'EX', 600); // Cache for 10 mins

        return res.status(201).json({
            message: "User created successfully!",
            user: savedUser
        });
    } catch (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.findOne = async (req, res) => {
    try {
        const userId = req.body.id;

        // Check Redis cache first
        const cachedUser = await redisClient.get(`user:${userId}`);

        if (cachedUser) {
            return res.status(200).json({
                message: "User fetched from cache",
                user: JSON.parse(cachedUser)
            });
        }

        // If not found in cache, fetch from MongoDB
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Cache the fetched user data for future requests
        await redisClient.set(`user:${userId}`, JSON.stringify(user), 'EX', 600); // Cache for 10 mins

        return res.status(200).json({
            message: "User fetched from database",
            user
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(404).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Data to update cannot be empty!" });
        }

        const userId = req.body.id;
        const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, { new: true, useFindAndModify: false });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update the cache with the new user data
        await redisClient.set(`user:${userId}`, JSON.stringify(updatedUser), 'EX', 300); // Refresh cache

        return res.json({ message: "User updated successfully.", user: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const userId = req.body.id;
        const deletedUser = await userModel.findByIdAndRemove(userId);

        if (!deletedUser) {
            return res.status(404).send({ message: "User not found." });
        }

        // Clear the user from Redis cache
        await redisClient.del(`user:${userId}`);

        return res.send({ message: "User deleted successfully!" });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const cacheKey = 'all_users';

        // Check cache first
        const cachedUsers = await redisClient.get(cacheKey);
        if (cachedUsers) {
            return res.status(200).json({
                message: "Fetched from cache",
                users: JSON.parse(cachedUsers)
            });
        }

        // Fetch from DB if not cached
        const users = await userModel.find();

        // Cache the result
        await redisClient.set(cacheKey, JSON.stringify(users)); // Cache for 5 mins

        return res.status(200).json({ message: "Fetched from Database", users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
