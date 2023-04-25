
window.onload = async () => {
    const token = localStorage.getItem('token');
    try {
        const premium = axios.get('http://localhost:3000/premium/ispremium', { headers: { "Authorization": token } });
        const exp = axios.get('http://localhost:3000/allExpence', { headers: { "Authorization": token } });

        Promise.all([premium, exp])
        .then(([premium, exp]) => {
            const ispremium = premium.data.premium;
            if(ispremium === true) {
                displayForPremium();
            }
            const allExpence = exp.data;
            for (expence of allExpence) {
                console.log(expence);
                setValueInUi(expence, expence.id);
            }
        })
        .catch(err => console.log(err));
        
    } catch (err) {
        console.log(err);
    };
}

async function saveToLocal(event) {
    event.preventDefault();
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('descp').value;
    const category = document.getElementById('expence').value;
    const token = localStorage.getItem('token');
    let obj = {
        amount,
        description,
        category
    }
    const exp = await axios.post('http://localhost:3000/addExpence', obj, { headers: { "Authorization": token } });
    try {
        const id = exp.data.id;
        // localStorage.setItem(obj.desp, JSON.stringify(obj));
        setValueInUi(obj, id);
    }
    catch (err) {
        console.log(err);
    }
}
function setValueInUi(obj, id) {
    var expList = document.getElementById('expList');

    //delete button here
    var del = document.createElement('input');
    del.className = 'btn delete btn-danger';
    del.type = 'button';
    del.value = 'Delete';
    del.style.marginLeft = '10px';

    //edit button here
    var edit = document.createElement('input');
    edit.className = 'btn edit btn-primary';
    edit.type = 'button';
    edit.value = 'edit';
    edit.style.marginLeft = '10px';



    //delete onclick function
    del.onclick = () => {
        const token = localStorage.getItem('token');
        const exp = axios.delete('http://localhost:3000/delete/' + id + '/' + obj.amount, { headers: { "Authorization": token } });
        try {
            console.log(exp);
            expList.removeChild(li);
        } catch (err) {
            console.log(err);
        };
    };


    let amt = document.getElementById('amount');
    let desp = document.getElementById('descp');
    let expence = document.getElementById('expence');

    //edit onclick function
    edit.onclick = () => {
        var button = document.getElementById('submitBtn');
        const token = localStorage.getItem('token');
        if (button.innerHTML === 'Submit') {
            button.innerHTML = "Update";
            desp.value = obj.description;
            amount.value = obj.amount;
            expence.value = obj.category;
            button.onclick = (event) => {
                event.preventDefault();
                const amount = document.getElementById('amount').value;
                const description = document.getElementById('descp').value;
                const category = document.getElementById('expence').value;
                let newObj = {
                    id,
                    amount,
                    description,
                    category
                }
<<<<<<< HEAD
            console.log(newObj);
=======
                console.log(newObj);
>>>>>>> 5a619ac0b636be792b88d67f738ec8140a3106c7
                const exp = axios.post('http://localhost:3000/edit', newObj, { headers: { "Authorization": token } });
                try {
                    console.log(exp);
                    expList.removeChild(li);
                    setValueInUi(newObj, id);
                } catch (err) {
                    console.log(err);
                };
                button.innerHTML = "Submit";
                button.onclick = "saveToLocal(event)";
            }
        }

    }

    let li = document.createElement('li');
    li.textContent = 'Amount: ' + obj.amount + ' Description : ' + obj.description + ' Category: ' + obj.category;
    li.appendChild(del);
    li.appendChild(edit);
    expList.appendChild(li);
    amt.value = '';
    desp.value = '';
    expence.value = '';
}

document.getElementById('rzpButton').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/premium/premiummembership', { headers: { "Authorization": token } });
    console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post('http://localhost:3000/premium/updateTransactionStatus', {
                payment_id: response.razorpay_payment_id,
                order_id: options.order_id,
            }, { headers: { "Authorization": token } })
            alert('Welcome to the premium features');
            displayForPremium();
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed', (responce) => {
        console.log(responce);
        alert('Something went wrong')
    })
}

async function displayForPremium() {
    document.getElementById('premiumButton').removeChild(document.getElementById('rzpButton'));
    //premium confirmation through h4
    const h4 = document.createElement('h4');
    h4.innerHTML = "You are a premium user now";
    h4.style.color = 'Gold';

    //leaderBord buton
    const leaderBord = document.createElement('button');
    leaderBord.id = 'leaderbordShow';
    leaderBord.className = 'leaderbordbtn';
    leaderBord.innerText = 'Show Leaderbord';

    //adding to DOM
    document.getElementById('premiumButton').appendChild(h4);
    document.getElementById('premiumButton').appendChild(leaderBord);

    let leaderBordDisplayed = false;

    //onclick feature for leaderBord
    document.getElementById('leaderbordShow').onclick = async function (e) {
        if(leaderBordDisplayed === false){
            e.preventDefault();
            let leaderBordList = document.getElementById('leaderbord');
            
            const getUser = await axios.get('http://localhost:3000/premium/showleaderbord');
            try{
                const users = getUser.data;

                for(let i=0; i<users.length; i++) {
                    let li = document.createElement('li');
                    console.log(users[i]);
                    console.log(users[i].name, users[i].total_cost);
                    li.textContent = 'Name: ' + users[i].name +'  '+ ' TotalExpence: ' + users[i].total_cost;                    ;
                    leaderBordList.appendChild(li);
                }
                console.log(users);
                leaderBordDisplayed = true;
                leaderBord.innerText = 'Hide Leaderbord';
                leaderBord.id = 'leaderbordHide';
            }catch(err) {
                console.log(err);
            }
        }
        
    }

    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'leaderbordHide') {
          e.preventDefault();
          leaderBordDisplayed = false;
          leaderBord.innerText = 'Show Leaderbord';
          leaderBord.id = 'leaderbordShow';
          let leaderBordul = document.getElementById('leaderbord');
          leaderBordul.innerHTML = '';
        }
      });
}