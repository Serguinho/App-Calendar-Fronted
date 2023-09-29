const { response } = require("express");

const bcrypt = require("bcryptjs");
const Usuario = require("../models/User");
const { generarJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  //console.log(req);
  const { email, password } = req.body;

  try {
    let user = await Usuario.findOne({ email });
    if (user) {
     return res.status(400).json({
        ok: false,
        msg: "Ese usuario ya existe",
      });
    } 

    user = new Usuario(req.body);

    //encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // Generar JWT
    const token = await generarJWT(user.id,user.name)

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el admnistrador",
    });
  }
};


const loginUser =async (req, res = response) => {
 
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({ email });
    if (!user) {
     return res.status(400).json({
        ok: false,
        msg: "El usuario no se encuentra registrado",
      });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
     return res.status(400).json({
        ok: false,
        msg: "El password es incorrecto",
      });
    }

    const token = await generarJWT(user.id,user.name)
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el admnistrador",
    });
  }
}



  const revalidateToken = async(req, res = response) => {
    
   // const uid=req.uid;
   //const name= req.name;
    const {uid,name} = req;
    const token= await generarJWT(uid,name);
    res.json({
      ok: true,
      token,
      uid,
      name
    });
  };
 



  module.exports = {
    createUser,
    loginUser,
    revalidateToken,
  };

