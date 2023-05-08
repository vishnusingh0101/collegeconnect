
async function validateUser(event) {
    event.preventDefault();
    const signBody = document.getElementById('signBody');
    const output = document.getElementById('outputMsg');
    const obj={
        mail: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    try{
        const user = await axios.post('process.env.BACKEND_API/login', obj);

        if(user) {
            console.log(user);
            localStorage.setItem('token', user.data.token);
            console.log('ispremium>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+user.data.ispremiumuser);
            localStorage.setItem('premium', user.data.ispremium);
            if(user.data.message == "Log in Success") {
                window.location.href = "../html/index.html";
            }
        }
    }catch(err){
        console.log(err);
        output.innerText = err;
    }
    setTimeout(()=> {
        signBody.removeChild(output);
    }, 5000);
}