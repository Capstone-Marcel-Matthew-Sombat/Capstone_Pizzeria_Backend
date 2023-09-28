const pool = require("../../db");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

const getCustomers = (req, res) => {
  pool.query("Select * from customers", (error, results) => {
    if (error) {
      throw error;
    } else {
      console.log(results);
      return res.status(200).json(results.rows);
    }
  });
};

const getSingleCustomer = (req, res) => {
  pool.query(
    "Select * from customers where customer_id = $1",
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

const createCustomers = async (req, res) => {
  const {
    customer_username,
    customer_password,
    first_name,
    last_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
  } = req.body;
  if (
    !customer_username ||
    !customer_password ||
    !first_name ||
    !last_name ||
    !phone ||
    !address_line1 ||
    !city ||
    !state ||
    !postal_code
  ) {
    return res.status(400).send("A required field is missing");
  }
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

  //use bcrype to hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(customer_password, salt);

  if (!re.exec(customer_username)) {
    return res.status(400).send("Email is invalid!");
  }

  const insert = `insert into customers(customer_username, customer_password, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
  pool.query(
    insert,
    [
      customer_username,
      hashPassword,
      first_name,
      last_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
    ],
    (error, results) => {
      if (error) {
        return res.status(400).json(error["detail"]);
      } else {
        return res.status(200).json("Inserted into the table");
      }
    }
  );
};

const loginCustomer = (req, res) => {
  const { customer_username, customer_password } = req.body;
  if (!customer_username || !customer_password) {
    return res.status(400).send("Missing username or password");
  }
  const select = `select * from customers where customer_username = '${customer_username}'`;
  let password = "";

  pool.query(select, async (error, results) => {
    if (error) {
      return res.status(400).json(error.detail);
    } else {
      //   console.log(results.rows[0].admin_password); //return hash password of the logged in admin
      password = results.rows[0].customer_password;
    }
    const match = await bcrypt.compare(customer_password, password); //compare hash to real password, will get true if match
    if (match) {
      const accessToken = jwt.sign(
        {
          customer_username,
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

module.exports = {
  getCustomers,
  getSingleCustomer,
  createCustomers,
  loginCustomer,
};
