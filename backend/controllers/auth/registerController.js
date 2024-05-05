import { hashPassword } from "../../helper/authHelper.js";
import userModel from "../../models/userModel.js";

// POST REGISTER
export const registerController = async (req, res) => {
    try {
        const { name, email, phone, password, address, isSeller } = req.body;

        // Setup validations
        if (!name) return res.status(400).send({ message: "Name is required" });
        if (!email) return res.status(400).send({ message: "Email is required" });
        if (!password) return res.status(400).send({ message: "Password is required" });
        if (!phone) return res.status(400).send({ message: "Phone No. is required" });
        if (!address) return res.status(400).send({ message: "Address is required" });

        // Check for existing users
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: "Email already registered!",
                errorType: "emailConflict",
            });
        }

        // Register User
        const hashedPassword = await hashPassword(password);

        const user = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            role: isSeller ? 1 : 0,
        });

        console.log("user", user);
        await user.save();

        res.status(201).send({
            success: true,
            message: "User registered successfully!",
            user: user,
        });
    } catch (error) {
        console.error("Error in Registration:", error.message);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
        });
    }
};
