const express = require("express");
const router = express.Router();

const users = [
  {
    fName: "kog",
    email: "nayd@gmail.com",
    pwd: "kk",
  },
  {
    fName: "kog",
    email: "nays@gmail.com",
    pwd: "kk",
  },
  {
    fName: "bog",
    email: "n@gmail.com",
    pwd: "kk",
  },
];

const validateEmail = (email) => {
  //checking email pattern
  const emailPattern = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );

  return emailPattern ? true : false;
};

const isUniqueEmail = (arr, currEmail) =>
  !arr.some((usr) => usr.email === currEmail);

const validateFormData = (formData) => {
  const { fName, email, pwd } = formData;

  if (
    typeof fName === "string" &&
    fName.length > 0 &&
    validateEmail(email) &&
    typeof pwd === "string" &&
    pwd.length > 0
  ) {
    return true;
  } else {
    return false;
  }
};

// using middleware to parse json request body
router.use(express.json());

// define the home page route
router.get("/", (req, res) => {
  res.send(users);
});

// creating a user
router.post("/", (req, res) => {
  const { fName, email, pwd } = req.body;

  try {
    //validate fName
    if (typeof fName !== "string" || fName.length === 0) {
      throw new Error("invalid Name");
    }

    //validate email
    if (!validateEmail(email) || !isUniqueEmail(users, email)) {
      throw new Error("invalid Email");
    }

    //validate pwd
    if (typeof pwd !== "string" || pwd.length === 0) {
      throw new Error("invalid password");
    }

    users.push(req.body);
    res.send(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//returning a specific user according to id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  try {
    if (
      typeof id !== "number" ||
      id > users.length ||
      id < 0 ||
      users.slice(id, id + 1).length === 0
    ) {
      throw new Error("invalid id");
    }
    res.send(users.slice(id, id + 1));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//editing the user
router.put("/:id", (req, res) => {
  const { fName, email, pwd } = req.body;
  const id = Number(req.params.id);

  try {
    if (typeof id !== "number" || id > users.length || id < 0) {
      throw new Error("invalid id");
    }

    const restUsers = users.filter((_, idx) => idx !== id);

    //validate fName
    if (typeof fName !== "string" || fName.length === 0) {
      throw new Error("invalid Name");
    }

    //validate email
    if (!validateEmail(email) || !isUniqueEmail(restUsers, email)) {
      throw new Error("invalid Email");
    }

    //validate pwd
    if (typeof pwd !== "string" || pwd.length === 0) {
      throw new Error("invalid password");
    }

    users.splice(id, 1, req.body);
    res.send(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//deleting the card
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  try {
    if (
      typeof id !== "number" ||
      id > users.length ||
      id < 0 ||
      users.slice(id, id + 1).length === 0
    ) {
      throw new Error("invalid id");
    }
    users.splice(id, 1);
    res.send(JSON.stringify({ redirect: "/" }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
