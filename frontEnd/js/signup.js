async function addToDatabase(event) {
    event.preventDefault();
    const obj = {
        userName: document.getElementById('userName').value,
        mail: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    try{
        const data = await axios.post('http://localhost:3000/addUser', obj);
        console.log(data);
    }catch(err) {
        console.log(err);
    }
    document.getElementById('userName').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
}