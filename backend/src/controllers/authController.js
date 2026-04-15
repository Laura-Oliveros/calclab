const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByUsername, findUserById } = require("../models/userModel");

function createToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        message: "Usuario y contraseña son obligatorios",
      });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: "Ese usuario ya existe",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(username, passwordHash);
    const token = createToken(user);

    res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        message: "Usuario y contraseña son obligatorios",
      });
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas",
      });
    }

    const token = createToken(user);

    res.json({
      ok: true,
      message: "Login correcto",
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
}

async function me(req, res) {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
}

module.exports = {
  register,
  login,
  me,
};