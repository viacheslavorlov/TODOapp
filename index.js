//creating database structure

const db = new Dexie("Todo App");
db.version(3).stores({ todos: "++id, todo, date, done" });

const form = document.querySelector("#new-task-form"),
    input = document.querySelector("#new-task-input"),
    dateTime = document.querySelector('#new-task-input-date'),
    submit = document.querySelector('#new-task-submit'),
    list_el = document.querySelector("#tasks");

//add todo
    /*form.onsubmit = async (event) => {
        event.preventDefault();
        const todo = input.value;
        const date = dateTime.value;
        console.log(todo);
        await db.todos.add({ todo, date });
        await getTodos();
        form.reset();
    };*/
submit.addEventListener('click', async (e) => {
    e.preventDefault();

    const todo = input.value;
    const date = dateTime.value;
    const done = false;
    console.log(todo);
    db.todos.add({ todo, date, done });
    await getTodos();
    form.reset();

})


//display todo
const getTodos = async () => {
    const allTodos = await db.todos.reverse().toArray();
    allTodos.sort((a, b) => {
        return new Date(a.date) - new Date(b.date); // сортировка задач по датам.
    });
    const doneTodos = allTodos.filter(item => item.done)
    console.log(allTodos, doneTodos);
    list_el.innerHTML = allTodos/*.filter(item => item.done === false)*/.map(
        (todo) =>
            `
                <div class="task" ${new Date() > new Date(todo.date) 
                ? 'style="background-color: red"'
                : (new Date(todo.date) - new Date() <= 3600 * 24 * 1000) ?
                'style="background-color: green"' : ''}>
                <div class="content">
                <div class="text edit" ${new Date() > new Date(todo.date) ? 'style="color: black"' : ''}>${todo.todo}
                    <p>${todo.date.slice(-5)}</p>
                    <p>${todo.date.slice(0,-6).split('-').reverse().join('-')}</p>
                </div>
                </div>
                <div class="actions">
                <button class="done" id="${todo.id}" ${new Date() > new Date(todo.date) ? 'style="color: black"' : ''}>
                Done
                </button>
                <button class="delete" id="${todo.id}" ${new Date() > new Date(todo.date) ? 'style="color: black"' : ''}>
                Delete
                </button>
                </div>
                </div>
            `
            )
        .join("");
    /*const done = document.querySelectorAll('.done:checked');
    done.forEach(item => {
        if (item.checked) {
            item.parentElement.style.backgroundColor = 'green';
        }
    });*/
};
window.onload = getTodos;

//delete todo
list_el.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        db.todos.delete(parseInt(e.target.id, 10));
        console.log(e.target.parentElement.parentElement);
        e.target.parentElement.parentElement.remove();
    }
    if (e.target.classList.contains('done')) {
        db.todos.update((parseInt(e.target.id)), {done: true});
        console.log(e.target.parentElement.parentElement);
        /*e.target.parentElement.closest('.edit').classList.add('task-done');*/
        e.target.parentElement.previousElementSibling.classList.add('task-done');
    }
});

/*const deleteTodo = async (event, id) => {
    await db.todos.delete(id);
    await getTodos();
};*/
