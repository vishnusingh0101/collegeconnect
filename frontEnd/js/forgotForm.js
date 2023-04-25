document.getElementById('formSubmit').onclick = async function (e) {
    e.preventDefault();
    
    const mail = document.getElementById('email').value;
    console.log(mail);
    const obj = {
        mail
    }
    const forgotPassword = await axios.post('http://localhost:3000/password/forgotpassword', obj);
    console.log(forgotPassword);
    document.getElementById('outputMsg').innerHTML = forgotPassword.data.message;
    setTimeout(() => {
        document.getElementById('outputMsg').innerHTML = '';
        window.location.href = "file:///C:/Users/Vishnu/Desktop/web%20devlopment/expenceTracker/frontEnd/html/login.html";
    }, 4000);
    document.getElementById('email').value = '';
}