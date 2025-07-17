import User from "../models/user.js";
import {inngest} from "../inngest/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async(req, res) => {
    const {email, password, skills = []} = req.body

    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashed,
            skills
        })

        await inngest.send({
            name: "user/signup",
            data: {
                email
            }
        });

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id:user._id,
                email:user.email,
                skills: user.skills
            },
            token
        })

    } catch (error) {
        console.error("Error during user signup:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred during signup",
        });
    }
}

export const login = async(req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email})

        if(!user) {
            return res.status(401).json({
                error: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(401).json({
                error: "Invalid credentials"
            })
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id:user._id,
                email:user.email,
                skills: user.skills
            },
            token
        })

    } catch (error) {
        console.error("Error during user login:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
}

export const logout = async(req, res) => {
    try {
        const token = req.headers.authoriation?.split(" ")[1]
        if(!token) {
            return res.status(401).json({
                error: "Unauthorized"
            })
        }

        jwt.verify(token, processEnv.JWT_SECRET, (err) => {
            if(err){
                return res.status(401).json({
                    error: "Unauthorizrd"
                })
            }
        })

        res.status(201).json({
            success: true,
            message: "User logged out successfully"
        })

    } catch (error) {
        console.error("Error during user logout:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred during logout"
        });
    }
}

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;
  
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    await User.updateOne(
      { email },
      { skills: skills, role }
    );

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};


export const getUser = async(req, res) => {
    try {
        if(req.user?.role !== "admin") {
            return res.status(403).json({
                error: "Forbidden"
            });
        }

        const user = await User.find().select("-password");

        return res.status(201).json({
            success: true,
            user
        });
        
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching user"
        });
    }
}

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error in fetching users", details: error.message });
  }
};