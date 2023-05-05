document.getElementById('formSubmit').onclick = async function (e) {
    e.preventDefault();
    
    const mail = document.getElementById('email').value;
    console.log(mail);
    const obj = {
        mail
    }
    const forgotPassword = await axios.post('http://54.206.104.57:3000/password/forgotpassword', obj);
    console.log(forgotPassword);
    document.getElementById('outputMsg').innerHTML = forgotPassword.data.message;
    setTimeout(() => {
        document.getElementById('outputMsg').innerHTML = '';
        window.location.href = "./login.html";
    }, 4000);
    document.getElementById('email').value = '';
}