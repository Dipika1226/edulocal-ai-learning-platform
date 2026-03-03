import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id: userId }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
