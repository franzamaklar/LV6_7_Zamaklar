const deleteButton = document.querySelector('.delete')

deleteButton.addEventListener('click', (id) => {
    fetch('/projects', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(res => {
          if(res.ok) return res.json()
      })
      .then(response => {
          if(response === 'No quote to delete!'){
              messageDiv.textContent = 'No Darth Vader quote to delete'
          }
          else {
              window.location.reload(true)
          }
      })
      .catch(error => console.error(error))
})