import jwt from "jsonwebtoken";

export const singToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.usuario,
      phone: user.telefono,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
