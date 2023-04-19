async function validateUser(event) {
    event.preventDefault();
    const output = document.getElementById('outputMsg');
    const obj={
        mail: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    try{
        const user = await axios.post('http://localhost:3000/user/signIn', obj);

        if(user) {
            console.log(user);
            output.innerHTML = user.data.message;
            setTimeout(() => {
                
            }, 5000);

            console.log(output);
        }
    }catch(err){
        console.log(err)
    }
}