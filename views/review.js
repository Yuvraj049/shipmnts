document.getElementById('confirmForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const tableRows = document.querySelectorAll('table tr');
    const data = [];
  
    for (let i = 1; i < tableRows.length; i++) {
      const cells = tableRows[i].querySelectorAll('td');
      data.push({
        'Company Name': cells[0].innerText,
        'Contact Number': cells[1].innerText,
      });
    }
  
    const response = await fetch('/confirm-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
  
    if (response.ok) {
      alert('Data uploaded successfully!');
    } else {
      alert('Error uploading data');
    }
  });
  