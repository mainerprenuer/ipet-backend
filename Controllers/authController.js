import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

const generateToken = user => {
    return jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: "10d"
    })
}

export const register = async (req, res) => {

    const {
        email, 
        password, 
        name, 
        role, 
        photo,
        gender
    } = req.body

    try {
        let user = null

        if(role == 'pet_owner') {
            user = await User.findOne({email})
        }
        else if (role =='doctor') {
            user = await Doctor.findOne({email})
        }

        //check if user exist
        if (user) {
            return res.status(400).json({message:'User already exist'})
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        if (role == 'pet_owner') {
            user = new User ({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            })
        }

        if (role == 'doctor') {
            user = new Doctor ({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            })
        }

        await user.save()

        res.status(200).json({success:true, message:'User successfully created'})


    } catch (error) {
        res.status(500).json({success:false, message:'Internal server error, try again!'})

    }
}

export const login = async (req, res) => {

    const {email, password} = req.body

    try {

        let user = null

        const pet_owner = await User.findOne({email})
        const doctor = await User.findOne({email})

        if (pet_owner) {
            user = pet_owner
        }
        if (doctor) {
            user = doctor
        }

        //check if user exist or not
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        //compare password
        const isPasswordMatch = await bcryptjs.compare(req.body.password, user.password)

        if (!isPasswordMatch) {
            return res.status(400).json({status:false, message: "Invalid credentials"});

        }

        //get token
        const token = generateToken(user);

        const {password, role, appointments, ...rest} = user._doc
        res.status(200).json({status:true, message: "Successfull login", token, data:{...rest}, role });


    } catch (error) {
        res.status(500).json({status:false, message: "failed to login"});
    }
}