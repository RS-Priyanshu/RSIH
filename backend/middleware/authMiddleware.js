import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied, token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Admins only" });
  next();
};

export const isSpoc = (req, res, next) => {
  if (req.user.role !== "SPOC") return res.status(403).json({ message: "SPOCs only" });
  next();
};

export const isTeamLeader = (req, res, next) => {
  if (req.user.role !== "TEAM_LEADER")
    return res.status(403).json({ message: "Team Leaders only" });
  next();
};
