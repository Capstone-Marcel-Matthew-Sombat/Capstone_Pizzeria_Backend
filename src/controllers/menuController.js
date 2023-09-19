const pool = require("../../db");
const jwt = require("jsonwebtoken");

const getMenus = (req, res) => {
  //   res.send("we're in the admin controller");
  pool.query("Select * from menuitems", (error, results) => {
    if (error) {
      throw error;
    } else {
      console.log(results);
      return res.status(200).json(results.rows);
    }
  });
};

const getSingleMenu = (req, res) => {
  pool.query(
    "Select * from menuitems where item_id = $1",
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

const createMenus = (req, res) => {
  const { category_id, name, description, price } = req.body;
  if (!category_id || !name || !description || !price) {
    return res.status(400).json("You're missing a field.");
  }
  const bearer = req.headers.authorization.indexOf("Bearer");
  if (bearer > -1 && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.WEB_TOKEN);

      pool.query(
        "select * from menuitems where name = $1",
        [name],
        (error, results) => {
          if (error) {
            throw error;
          }

          if (results.rows.length > 0) {
            return res
              .status(400)
              .json("Menu item with the same name is already exist.");
          } else {
            const insert = `insert into menuitems(category_id, name, description, price) values('${category_id}', '${name}', '${description}', '${price}')`;

            pool.query(insert, async (error, results) => {
              if (error) {
                return res.status(400).json(error["detail"]);
              } else {
                return res.status(200).send("Insert into table");
              }
            });
          }
        }
      );
    } catch (error) {
      return res.status(400).json(error.message);
    }
  } else {
    return res.status(400).json("Error");
  }
};

const editSingleMenu = (req, res) => {
  const bearer = req.headers.authorization;
  if (bearer) {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res.status(400).send("You are missing data");
    }
    console.log(req.body);
    pool.query(
      `update menuitems set name = '${name}', description = '${description}', price = '${price}' where item_id = ${req.params.id}`,
      (error, results) => {
        if (error) {
          throw error;
        } else {
          console.log(results.rows);
          res.status(200).send(`${name} has been updated`);
        }
      }
    );
  } else {
    res.status(400).send("Item not found");
  }
};

module.exports = { getMenus, getSingleMenu, createMenus, editSingleMenu };
