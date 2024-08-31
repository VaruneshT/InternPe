document.getElementById('add-button').addEventListener('click', function() {
    const taskText = document.getElementById('todo-input').value;
    if (taskText.trim() === '') {
        alert('Please enter a task.');
        return;
    }

    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', function() {
        this.parentElement.remove();
    });

    li.appendChild(deleteButton);

    li.addEventListener('click', function() {
        this.classList.toggle('completed');
    });

    document.getElementById('todo-list').appendChild(li);

    document.getElementById('todo-input').value = '';
});
