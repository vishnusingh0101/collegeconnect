async function validateUser(event) {
    event.preventDefault();
    const signBody = document.getElementById('signBody');
    const output = document.getElementById('outputMsg');
    const obj={
        mail: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    try{
        const user = await axios.post('http://localhost:3000/user/login', obj);

        if(user) {
            console.log(user);
            localStorage.setItem('token', user.data.token);
            if(user.data.message == "Log in Success") {
                window.location.href = "file:///C:/Users/Vishnu/Desktop/web%20devlopment/expenceTracker/frontEnd/html/index.html"
            }
            console.log(output);
        }
    }catch(err){
        console.log(err);
        output.innerText = err;
    }
    setTimeout(()=> {
        signBody.removeChild(output);
    }, 5000);
}