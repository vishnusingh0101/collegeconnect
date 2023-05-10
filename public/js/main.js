const dropdown = document.getElementById('quantity');
dropdown.addEventListener('change', () => {
    localStorage.setItem('itemsPerPage', document.getElementById('quantity').value);
    location.reload();
});

window.onload = async () => {
    const token = localStorage.getItem('token');
    try {
        const objUrlParams = new URLSearchParams(window.location.search);
        const page = objUrlParams.get("page") || 1;
        const selectedValue = localStorage.getItem("itemsPerPage") || 5;
        if (selectedValue) {
            dropdown.value = selectedValue;
        }
        const quantity = selectedValue;
        const premium = axios.get('http://3.104.206.49:3000/premium/ispremium', { headers: { "Authorization": token } });
        const exp = axios.get(`http://3.104.206.49:3000/user/allExpence?page=${page}&items=${quantity}`, { headers: { "Authorization": token } });

        await Promise.all([premium, exp])
            .then(([premium, exp]) => {
                const ispremium = premium.data.ispremium;
                if (ispremium === true) {
                    displayForPremium();
                }
                console.log(exp.data.expences);
                const allExpence = exp.data.expences;
                if (exp.data.success == true) {
                    for (let i=allExpence.length-1; i>=0; i--) {
                        setValueInUi(allExpence[i], allExpence[i].id);
                    }
                    showPagenation(exp.data.pagedata);
                } else {
                    document.getElementById('outputMsg').innerText = exp.error;
                    setTimeout(() => {
                        document.getElementById('outputMsg').innerText = '';
                    }, 4000);
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
    const exp = await axios.post('http://3.104.206.49:3000/user/addExpence', obj, { headers: { "Authorization": token } });
    try {
        const id = exp.data.id;
        setValueInUi(obj, id);
        if (numOfExp > 5) {
            let li = document.getElementsByTagName('li');
            console.log(li);
            expList.removeChild(li[li.length-1]);
        }
    }
    catch (err) {
        console.log(err);
    }
}

let numOfExp = 0;
function setValueInUi(obj, id) {
    numOfExp++;
    var expList = document.getElementById('expList');

    //delete button here
    var del = document.createElement('input');
    del.className = 'btn delete btn-danger';
    del.type = 'button';
    del.value = 'Delete';
    del.style.marginLeft = '10px';
    del.style.marginRight = 'auto';

    //edit button here
    var edit = document.createElement('input');
    edit.className = 'btn edit btn-primary';
    edit.type = 'button';
    edit.value = 'edit';
    edit.style.marginLeft = '10px';
    edit.style.marginRight = '10px';



    //delete onclick function
    del.onclick = () => {
        const token = localStorage.getItem('token');
        const exp = axios.delete('http://3.104.206.49:3000/user/delete/' + id + '/' + obj.amount, { headers: { "Authorization": token } });
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
                console.log(newObj);
                const exp = axios.post('http://3.104.206.49:3000/user/edit', newObj, { headers: { "Authorization": token } });
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
    
    expList.insertBefore(li, expList.firstChild);
    amt.value = '';
    desp.value = '';
    expence.value = '';
}

//pagenation
function showPagenation(pagedata) {
    console.log('it worked');
    const currentPage = pagedata.currentPage;
    const hasNextPage = pagedata.hasNextPage;
    const nextPage = pagedata.nextPage
    const hasPreviousPage = pagedata.hasPreviousPage
    const previousPage = pagedata.previousPage
    const lastPage = pagedata.lastPage
    const pagiInside = document.getElementById('pagiInside');

    {
        pagiInside.innerHTML = '';
        if (hasPreviousPage) {
            const btn2 = document.createElement('button');
            btn2.innerHTML = previousPage;
            btn2.addEventListener('click', () => getProducts(previousPage))
            pagiInside.appendChild(btn2);
        }

        const btn1 = document.createElement('button');
        btn1.innerHTML = `<h3>${currentPage}<h3/>`;
        btn1.addEventListener('click', () => getProducts(currentPage))
        pagiInside.appendChild(btn1);

        if (hasNextPage) {
            const btn1 = document.createElement('button');
            btn1.innerHTML = nextPage;
            btn1.addEventListener('click', () => getProducts(nextPage))
            pagiInside.appendChild(btn1);
        }
    };

}

async function getProducts(page) {
    const token = localStorage.getItem('token');
    const quantity = document.getElementById('quantity').value;
    try {
        const exp = await axios.get(`http://3.104.206.49:3000/user/allExpence?page=${page}&items=${quantity}`, { headers: { "Authorization": token } });
        if (exp.data.success == true) {
            document.getElementById('expList').innerHTML = '';
            const allExpence = exp.data.expences;
            for (expence of allExpence) {
                setValueInUi(expence, expence.id);
            }
            showPagenation(exp.data.pagedata);
        } else {
            document.getElementById('outputMsg').innerText = exp.error;
            setTimeout(() => {
                document.getElementById('outputMsg').innerText = '';
            }, 4000);
        }
    } catch (err) {
        console.log(err);
    }
}

document.getElementById('rzpButton').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://3.104.206.49:3000/premium/premiummembership', { headers: { "Authorization": token } });
    console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post('http://3.104.206.49:3000/premium/updateTransactionStatus', {
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
    leaderBord.className = 'premiumpageBtn btn-success';
    leaderBord.innerText = 'Show Leaderbord';

    //Download report button
    const downloadexpence = document.createElement('button');
    downloadexpence.id = 'downloadexpense';
    downloadexpence.className = 'premiumpageBtn btn-success';
    downloadexpence.innerText = 'Download report';

    //Download report button
    const totalReport = document.createElement('button');
    totalReport.id = 'totalReport';
    totalReport.className = 'premiumpageBtn btn-success';
    totalReport.innerText = 'Report History';

    //adding to DOM
    document.getElementById('premiumButton').appendChild(h4);
    document.getElementById('premiumButton').appendChild(leaderBord);
    document.getElementById('premiumButton').appendChild(downloadexpence);
    document.getElementById('premiumButton').appendChild(totalReport);

    let leaderBordDisplayed = false;

    //onclick feature for leaderBord
    document.getElementById('leaderbordShow').onclick = async function (e) {
        if (leaderBordDisplayed === false) {
            e.preventDefault();
            let leaderBordList = document.getElementById('leaderbord');

            const getUser = await axios.get('http://3.104.206.49:3000/premium/showleaderbord');
            try {
                const users = getUser.data.leaderborddata;

                for (let i = 0; i < users.length; i++) {
                    let li = document.createElement('li');
                    li.textContent = 'Name: ' + users[i].name + '  ' + ' TotalExpence: ' + users[i].totalExpence;
                    leaderBordList.appendChild(li);
                }
                leaderBordDisplayed = true;
                leaderBord.innerText = 'Hide Leaderbord';
                leaderBord.id = 'leaderbordHide';
                document.getElementById('leaderbordList').style.width = '40%';
            } catch (err) {
                console.log(err);
            }
        }

    }

    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'leaderbordHide') {
            e.preventDefault();
            leaderBordDisplayed = false;
            leaderBord.innerText = 'Show Leaderbord';
            leaderBord.id = 'leaderbordShow';
            let leaderBordul = document.getElementById('leaderbord');
            leaderBordul.innerHTML = '';
            document.getElementById('leaderbordList').style.width = '0%';
        }
    });


    //onclick feature for report
    downloadexpence.onclick = async () => {
        const token = localStorage.getItem('token');
        console.log(token);
        axios.get('http://3.104.206.49:3000/user/download', { headers: { "Authorization": token } })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    //the bcakend is essentially sending a download link
                    //  which if we open in browser, the file would download
                    var a = document.createElement("a");
                    a.href = response.data.fileURL;
                    a.download = 'myexpense.csv';
                    a.click();
                } else {
                    throw new Error(response.data.message)
                }

            })
            .catch((err) => {
                console.log(err);
            });
    }
    totalReport.onclick = () => {
        window.location.href = "../html/report.html";
    }

}

