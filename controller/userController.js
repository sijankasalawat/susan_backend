const Users =require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const createUser = async (req,res) => {
    // step 1 : Check if data is coming or not
    console.log(req.body);
    console.log(req.body);
    const {fName,lName,email,phoneNumber,password}=req.body;

    if(!fName || !lName || !email || !phoneNumber || !password){
        return res.json({
            success:false,
            message:"Plese Enter All Fields"
        } 
        )
    }

    // step 4 : try catch block
    try {
        // step 5 : Check existing user
        const existingUser = await Users.findOne({email: email})
        if(existingUser){
            return res.json({
                success: false,
                message: "User already exists."
            })
        }

        // password encryption
        const randomSalt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password,randomSalt)

        // step 6 : create new user
        const newUser = new Users({
            // fieldname : incoming data name
            fName : fName,
            lName : lName,
            email : email,
            phoneNumber:phoneNumber,
            password : encryptedPassword,
        })

        // step 7 : save user and response
        await newUser.save();
        res.status(200).json({
            success: true,
            message: "User created successfully."
        })
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")
    } 
}
const loginUser = async (req, res)=>{
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({
          success : false,
          message : "Please enter all fields."
        });
      } try{
        const exisitingUser = await Users.findOne({ email: email });
      if (!exisitingUser) {
        return res.json({
          success : false,
          message: "User does not exixts"
        });
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        exisitingUser.password
      );
      if (!isPasswordCorrect) {
        return res.json({
          success : false,
          message: "Invalid credentials"
        });
      }
      const token = await jwt.sign(
        { id: exisitingUser._id, isAdmin:exisitingUser.isAdmin },
        process.env.JWT_SECRET
      );
      res.status(200).json({
        success : true,
        message: "User logged in successfully.",
        token: token,
        userData: exisitingUser,
      });

      }catch(error){
        res.json({
            success : false,
            message: "Server Error",
          });

      }

}


module.exports={
    createUser,loginUser
}