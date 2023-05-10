window.onload = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://52.62.115.119:3000/premium/report', { headers: { "Authorization": token } });
        const reports = response.data.downloadedReport;
        console.log(reports);
        for(report of reports) {
            setValueInUi(report);
        }
    } catch (err) {
        console.log(err);
    };
}

function setValueInUi(obj) {
    const li = document.createElement('li');
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'liBtn';
    downloadBtn.type = 'button';
    downloadBtn.innerText = 'Download';
    downloadBtn.onclick = () => {
        downloadLink.click();
    }
    const downloadLink = document.createElement("a");
    downloadLink.className = 'liBtn'
    downloadLink.href = obj.link;
    downloadLink.download = true;

    downloadLink.appendChild(downloadBtn);

    li.innerText = 'Report Created at - '+ obj.createdAt;
    li.appendChild(downloadLink);

    const reportList = document.getElementById('reportList');
    reportList.appendChild(li);
}