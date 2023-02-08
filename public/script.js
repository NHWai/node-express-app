"use strict";

const main = document.querySelector(".main");
const usrName = document.querySelector("#usrName");
const usrEmail = document.querySelector("#usrEmail");
const usrPwd = document.querySelector("#usrPwd");
const usrId = document.querySelector("#usrId");
const formSubmit = document.querySelector(".formSubmit");
const formEl = document.querySelector(".formEl");
const usersList = document.querySelector(".usersList");

const uploadImgForm = document.querySelector(".uploadImgForm");
const uploadBtn = document.querySelector(".uploadBtn");
const fileEl = document.querySelector("#file");
let closeElArr;
let editElArr;
let cardElArr;

const getUsrs = async function () {
  const res = await fetch("http://localhost:3000/users");
  const data = await res.json();
  renderUsers(data);
  return;
};

const renderUsers = function (usrs) {
  let innerEl = "";
  for (const el of usrs) {
    innerEl += `
    <div style='user-select: none;' class='cardEl'>
      <div class='d-flex justify-content-end'>
        <div class='editCard'>
            <ion-icon class='text-success'
            style="cursor: pointer; margin-right: 0.2rem"
            name="create-outline"></ion-icon>
        </div>
        <div data-doc=${usrs.indexOf(el)} class='closeCard'>   
            <ion-icon class='text-danger'
              style="cursor: pointer"
              name="close-outline"
            ></ion-icon>
        </div>
      </div>
      <div><span> Name : </span> <span  style='margin-left:0.3rem'> </span></div>
      <div> <span>Email : </span>  <span  style='margin-left:0.3rem' ></span></div>
      <div> <span>Password : </span> <span style='margin-left:0.3rem'></span></div>
    </div>
    `;
  }

  usersList.innerHTML = innerEl;

  cardElArr = [...document.querySelectorAll(".cardEl")];

  //assigning textContent instead of directly putting the element's content
  //This is to protect xss attack
  for (let i = 0; i < cardElArr.length; i++) {
    cardElArr[i].childNodes[3].childNodes[2].textContent = usrs[i].fName;
    cardElArr[i].childNodes[5].childNodes[3].textContent = usrs[i].email;
    cardElArr[i].childNodes[7].childNodes[3].textContent = usrs[i].pwd;
  }

  closeElArr = [...document.querySelectorAll(".closeCard")];
  editElArr = [...document.querySelectorAll(".editCard")];

  //listening delete events
  for (const card of closeElArr) {
    card.addEventListener("click", () => delCard(card.dataset.doc));
  }

  //listening edit events
  for (let i = 0; i < editElArr.length; i++) {
    editElArr[i].addEventListener("click", async () => {
      //making sure rest of the cards are not blurred
      const filteredCard = cardElArr.filter((el, idx) => idx !== i);
      for (const eachCard of filteredCard) {
        eachCard.style = " user-select: none;";
      }

      //blur the card which is in edit form
      cardElArr[i].style = "filter: blur(2px); user-select: none;";

      //getting the specific user's data to edit
      const res = await fetch(`http://localhost:3000/users/${i}`);
      const [data] = await res.json();
      const currCard = {
        fName: data.fName,
        email: data.email,
        pwd: data.pwd,
      };
      editCard(i, currCard);
    });
  }

  return;
};

const handleForm = function () {
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = {
      fName: usrName.value,
      email: usrEmail.value,
      pwd: usrPwd.value,
    };
    const id = usrId.textContent;
    formEl.reset();
    usrId.textContent = "";

    if (id.length === 0) {
      //create new card

      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        usrName.value = user.fName;
        usrEmail.value = user.email;
        usrPwd.value = user.pwd;
      } else {
        renderUsers(data);
      }
    } else {
      // edit existing card

      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        usrName.value = user.fName;
        usrEmail.value = user.email;
        usrPwd.value = user.pwd;
        usrId.textContent = id;
      } else {
        renderUsers(data);
      }
    }
    return;

    // catch (err) {
    //   alert("Invalid input");
    //   usrName.value = user.fName;
    //   usrEmail.value = user.email;
    //   usrPwd.value = user.pwd;
    //   getUsrs();
    //   return;
    // }
  });
};

const delCard = async function (id) {
  try {
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    window.location.href = data.redirect;
  } catch (err) {
    console.log(err);
  }
  return;
};

const editCard = function (id, card) {
  //
  usrName.value = card.fName;
  usrEmail.value = card.email;
  usrPwd.value = card.pwd;
  usrId.textContent = id;
  return;
};

const postFile = async function (content) {
  console.log("in post file =>", content);
  const res = await fetch("http://localhost:3000/fileupload", {
    method: "POST",
    body: content,
  });
  const data = await res.json();
  console.log("data =>", data);
  return;
};

uploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const incomingFile = fileEl.files[0];
  uploadImgForm.reset();
  postFile(incomingFile);
});

getUsrs();
handleForm();
