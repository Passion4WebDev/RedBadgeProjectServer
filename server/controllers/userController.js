const router = require('express').Router();  
const { UserModel } = require('../models')   
const { UniqueConstraintError } = require('sequelize/lib/errors')  
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');  

router.post('/register', async (req, res) => {
  let{ email, password } = req.body.user;
  try {
    let User = await UserModel.create({
      email,
      password: bcrypt.hashSync(password, 7)
    });

    let token = jwt.sign({id:User.id}, process.env.JWT_SECRET, {expiresIn: '1d'});

    res.status(201).json({
      message: "User Created",
      user: User,
      sessionToken: token
    });

  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Please Choose Another email"
      });
    } else {
      console.log(err)
      res.status(500).json({
        message: 'Register failed',
        error: err
      });
    }
  }
});

//Login

router.post('/login', async (req, res) => {
  let { email, password } = req.body.user;
  try{
    let loginUser = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if(loginUser) {
      let passwordComparison = await bcrypt.compare(password, loginUser.password);

      if(passwordComparison){
        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.status(200).json({
          message: "User Authenticated",
          sessionToken: `Bearer ${token}`
        });

        // const token = jwt.sign(
        //   {id: newUser.id,},
        //   process.env.JWT_SECRET,
        //   {expiresIn: 60 * 60 * 12}
        //   )
          
      } else {
        res.status(401).json({
          message: "Incorrect email or password"
        });
      }
    } else {
      res.status(401).json({
        message: "Incorrect email or password"
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
       message: "Login Failed"
    })
  }
});

module.exports = router;