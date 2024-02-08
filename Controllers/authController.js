import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

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
    try {
        
    } catch (error) {
        
    }
}