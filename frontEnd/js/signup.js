async function addToDatabase(event) {
    event.preventDefault();
    const signBody = document.getElementById('signBody');
    const output = document.getElementById('outputMsg');
    const obj = {
        name: document.getElementById('userName').value,
        mail: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    try{
        const user = await axios.post('http://localhost:3000/user/signUp', obj);
        console.log(user);
        if(user.data.message == "Successfuly create new user") {
            window.location.href = "file:///C:/Users/Vishnu/Desktop/web%20devlopment/expenceTracker/frontEnd/html/signin.html";
        }
        }catch(err) {
        console.log(err);
        output.innerText = err;
    };
    console.log(output);
    setTimeout(()=> {
        signBody.removeChild(output);
    }, 5000);
    document.getElementById('userName').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
}