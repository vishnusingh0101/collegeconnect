
window.onload = async () => {
    try{
        const exp = await axios.get('http://localhost:3000/allExpence');
        const allExpence = exp.data;
        for(expence of allExpence) {
            console.log(expence);
            setValueInUi(expence, expence.id);
        }
    }catch(err) {
        console.log(err);
    };
}

async function saveToLocal(event) {
    event.preventDefault();
    const amount = event.target.amt.value;
    const description = event.target.desp.value;
    const category = event.target.expence.value;
    let obj = {
        amount,
        description,
        category
    }
    const exp = await axios.post('http://localhost:3000/add-expence', obj);
    try{
        const id = exp.data.id;
        // localStorage.setItem(obj.desp, JSON.stringify(obj));
        setValueInUi(obj, id);
    }
    catch(err) {
        console.log(err);
    }
}
function setValueInUi(obj, id) {
    console.log(obj);
    var parentElement = document.getElementById('expList');
    var del = document.createElement('input');
    del.className = 'btn delete btn-danger';
    del.type = 'button';
    del.value = 'Delete';
    del.style.marginLeft = '10px';
    var edit = document.createElement('input');
    edit.className = 'btn edit btn-primary';
    edit.type = 'button';
    edit.value = 'edit';
    edit.style.marginLeft = '10px';
    del.onclick = () => {
        const exp = axios.delete('http://localhost:3000/delete/'+ id);
        try{
            console.log(exp);
            // localStorage.removeItem(obj.desp);
            parentElement.removeChild(childElement);
        }catch(err) {
            console.log(err);
        };
    };

    let amt = document.getElementById('amount');
    let desp = document.getElementById('descp');
    let expence = document.getElementById('expence');
    
    edit.onclick = () => {
        desp.value = obj.description;
        amount.value = obj.amount;
        expence.value = obj.category;
        del.click();
        // localStorage.removeItem(obj.desp);
        // parentElement.removeChild(childElement);
    }
    let childElement = document.createElement('li');
    childElement.textContent = 'Amount: '+obj.amount+' Description : '+obj.description+' Category: '+obj.category;
    childElement.appendChild(del);
    childElement.appendChild(edit);
    parentElement.appendChild(childElement);
    amt.value = '';
    desp.value = '';
    expence.value = '';
}