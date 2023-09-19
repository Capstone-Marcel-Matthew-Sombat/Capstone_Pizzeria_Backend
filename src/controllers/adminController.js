const pool = require("../../db");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const getAdmin = (req, res) => {
  //   res.send("we're in the admin controller");
  pool.query("Select * from admin", (error, results) => {
    if (error) {
      throw error;
    } else {
      res.status(200).json(results.rows);
    }
  });
};

const getSingleAdmin = (req, res) => {
  pool.query(
    "Select * from admin where admin_id = $1",
    [req.params.id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        return res.status(200).json(results.rows);
      }
    }
  );
};

const newAdmin = async (req, res) => {
  const { admin_username, admin_password, first_name, last_name } = req.body;
  if (!admin_username || !admin_password || !first_name || !last_name) {
    return res.status(400).send("A required field is missing");
  }
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

  //use bcrype to hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(admin_password, salt);

  if (!re.exec(admin_username)) {
    return res.status(400).send("Email is invalid!");
  }
  const insert = `insert into admin(admin_username, admin_password, first_name, last_name) values('${admin_username}', '${hashPassword}', '${first_name}', '${last_name}')`;
  //   return res.send(insert);
  pool.query(insert, (error, results) => {
    if (error) {
      return res.status(400).json(error["detail"]);
    } else {
      return res.status(200).json("Inserted into the table");
    }
  });
  //   return res.send(admin_username);
};

const login = (req, res) => {
  const { admin_username, admin_password } = req.body;
  if (!admin_username || !admin_password) {
    return res.status(400).send("Missing username or password");
  }
  const select = `select * from admin where admin_username = '${admin_username}'`;
  let password = "";

  pool.query(select, async (error, results) => {
    if (error) {
      return res.status(400).json(error.detail);
    } else {
      //   console.log(results.rows[0].admin_password); //return hash password of the login admin
      password = results.rows[0].admin_password;
    }
    const match = await bcrypt.compare(admin_password, password); //compare hash to real password, will get true if match
    if (match) {
      const accessToken = jwt.sign(
        {
          admin_username,
        },
        process.env.WEB_TOKEN,
        { expiresIn: "15m" }
      );
      return res.status(200).send(accessToken);
    } else {
      return res.status(400).send("Your password or email is incorrect");
    }
  });
};

module.exports = { getAdmin, getSingleAdmin, newAdmin, login };
