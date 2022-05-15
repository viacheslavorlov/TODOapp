//creating database structure

const db = new Dexie("Todo App");
db.version(2).stores({ todos: "++id, todo, date" });

const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input"),
    dateTime = document.querySelector('#new-task-input-date');
const list_el = document.querySelector("#tasks");

//add todo
form.onsubmit = async (event) => {
    event.preventDefault();
    const todo = input.value;
    const date = dateTime.value;
    console.log(todo);
    await db.todos.add({ todo, date });
    await getTodos();
    form.reset();
};

//display todo
const getTodos = async () => {
    const allTodos = await db.todos.reverse().toArray();
    list_el.innerHTML = allTodos
        .map(
            (todo) =>
                `
                    <div class="task" ${new Date() > new Date(todo.date) ? 'style="background-color: red"' : ''}>
                    <div class="content">
                    <div id="edit" class="text">${todo.todo}, ${todo.date.replace(/T/g, ' ')}</div>
                    </div>
                    <div class="actions">
                    <button class="delete" onclick="deleteTodo(event, ${todo.id})" ${new Date() > new Date(todo.date) ? 'style="color: black"' : ''}>
                    Delete
                    </button>
                    </div>
                    </div>
                `
            )
        .join("");

};
window.onload = getTodos;

//delete todo
const deleteTodo = async (event, id) => {
    await db.todos.delete(id);
    await getTodos();
};