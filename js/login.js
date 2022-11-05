
let botonRegistro = document.getElementById("rgstr_btn");
let botonLogin = document.getElementById("login_btn");

 
 
 
 


const store = ()=>{
    let nombre = document.getElementById('name');
    let email = document.getElementById("mail");
    let pass = document.getElementById('pw');
    let rePass = document.getElementById("rePw");
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g;
    let numbers = /[0-9]/g;

    if(email.value.length == 0){
        alert('Ingrese un correo');

    }else if(pass.value.length == 0){
        alert('Agregue una contraseña');

    }else if(email.value.length == 0 && pass.value.length == 0){
        alert('Rellene el correo y la contraseña');

    }else if(pass.value.length > 8){
        alert('maximo 12 caracteres');

    }else if(!pass.value.match(numbers)){
        alert('Agregue un numero');

    }else if(!pass.value.match(upperCaseLetters)){
        alert('Agregue 1 mayuscula');

    }else if(!pass.value.match(lowerCaseLetters)){
        alert('Agregue 1 minuscula');

    }else if(pass.value != rePass.value){
        alert("Las contraseñas deben coincidir");
    }else{
        localStorage.setItem('email', (email.value));
        localStorage.setItem('pass', (pass.value));
        localStorage.setItem("name", (nombre.value));
        alert('Se creo su cuenta');
    }
     
    
}

//checking
const check = ()=>{
    
    let storedName = localStorage.getItem('email');
    let storedPw = localStorage.getItem('pass');
    let userName = document.getElementById('userName').value;
    let userPw = document.getElementById('userPw').value;
   

    if((userName === storedName) && (userPw === storedPw)){
        //  alert(`Hola bienvenido`);//Aca esta el tema del redireccionamiento//
        document.location.href="index.html";

    }else{
        alert('Error al logearse');
    }

};

botonLogin.addEventListener("click", check);
botonRegistro.addEventListener("click", store);