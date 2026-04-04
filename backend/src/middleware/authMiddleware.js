const jwt = require("jsonwebtoken");
const { httpError } = require("../utils/httpError");

function authMiddleware(req, _res, next) {
  try {
    const authorization = req.headers.authorization || "";
    if (!authorization.startsWith("Bearer ")) {
      throw httpError(401, "Authentication required");
    }

    const token = authorization.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET || "replace-this-in-production");

    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      role: payload.role,
      fullName: payload.fullName
    };

    next();
  } catch (error) {
    next(error.status ? error : httpError(401, "Invalid or expired session"));
  }
}

module.exports = { authMiddleware };
