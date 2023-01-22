const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";

const nickname = localStorage.getItem(NICKNAME);

console.log(nickname);
if(nickname === null) {
  body.className = LOGGED_OUT;
} else {
  body.className = LOGGED_IN;
}

const handleFormSubmit = (e) => {
  e.preventDefault();
  const input = loginForm.querySelector("input");
  // console.log(input.value);
  const { value } = input;  // input.value
  //console.log(value);
  input.value = "";   //input에 작성하고 엔터치면 비워줌
  localStorage.setItem(NICKNAME, value); // localstorage에 nickname이 저장됨
}

if(loginForm){
  loginForm.addEventListener("submit", handleFormSubmit)
}