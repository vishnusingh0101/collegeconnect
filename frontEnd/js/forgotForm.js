document.getElementById('formSubmit').onclick = async function (e) {
    e.preventDefault();
    const mail = document.getElementById('email').value;
    console.log(mail);
    const obj={
        mail
    }
    const forgotPassword = await axios.post('http://localhost:3000/password/forgotpassword', obj);
    console.log(forgotPassword);
    document.getElementById('email').value = '';

}