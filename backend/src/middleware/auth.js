import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    //not logged in
    return res.status(400).json({ status: "error", msg: "No token found." });
  }

  const token = req.headers["authorization"].replace("Bearer ", ""); //trim header
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET); //verify sign with secret = correct claims
      console.log("DECODED:", decoded);
      req.decoded = decoded; //attach for downstream handler
      next();
    } catch (e) {
      //if decoded expired or mismatched
      console.error(e.message);
      return res.status(401).json({ status: "error", msg: "Unauthorised" });
    }
  } else {
    //header exists but empty token
    console.error("Missing token");
    return res.status(403).json({ status: "error", msg: "Missing token" });
  }
};

export const authAdmin = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    //not logged in
    return res.status(400).json({ status: "error", msg: "No token found." });
  }

  const token = req.headers["authorization"].replace("Bearer ", ""); //trim header
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET); //verify sign with secret = correct claims
      if (decoded.role.toLowerCase() === "admin") {
        //match role
        req.decoded = decoded; //attach for downstream handler
        next();
      } else {
        //wrong role
        console.error("Unauthorised");
        return res.status(403).json({ status: "error", msg: "Unauthorised" });
      }
    } catch (e) {
      //if expired or mismatch
      console.error(e.message);
      return res.status(401).json({ status: "error", msg: "Unauthorised" });
    }
  } else {
    //with header, no token
    console.error("Missing token");
    return res.status(403).json({ status: "error", msg: "Missing token" });
  }
};
