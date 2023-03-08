function saveToLocal(event) {
    event.preventDefault();
    const amt = document.getElementById('amount').value;
    const desp = document.getElementById('descp').value;
    const expence = document.getElementById('expence').value;

    let obj = {
        amt,
        desp,
        expence
    }
    
    localStorage.setItem(obj.desp, JSON.stringify(obj));
    setValueInUi(obj);
}
function setValueInUi(obj) {
    var parentElement = document.getElementById('expList');
    var btn = document.createElement('input');
    btn.className = 'btn delete btn-danger';
    btn.type = 'button';
    btn.value = 'Delete';
    btn.style.marginLeft = '10px';
    var edit = document.createElement('input');
    edit.className = 'btn edit btn-primary';
    edit.type = 'button';
    edit.value = 'edit';
    edit.style.marginLeft = '10px';
    btn.onclick = () => {
        localStorage.removeItem(obj.desp);
        parentElement.removeChild(childElement);
    };

    
    let amt = document.getElementById('amount');
    let desp = document.getElementById('descp');
    let expence = document.getElementById('expence');
    
    edit.onclick = () => {
        desp.value = obj.desp;
        amount.value = obj.amt;
        expence.value = obj.expence;
        localStorage.removeItem(obj.desp);
        parentElement.removeChild(childElement);
    }
    let childElement = document.createElement('li');
    childElement.textContent = 'Amount: '+obj.amt+' Description : '+obj.desp+' Category: '+obj.expence;
    childElement.appendChild(btn);
    childElement.appendChild(edit);
    parentElement.appendChild(childElement);
    amt.value = '';
    desp.value = '';
    expence.value = '';
}