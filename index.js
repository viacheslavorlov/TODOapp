import {Dexie} from "dexie";

document.addEventListener('DOMContentLoaded', () => {

	//creating database structure

	const db = new Dexie("Todo App");
	db.version(3).stores({todos: "++id, todo, date, done"});

	const form = document.querySelector("#new-task-form"),
		input = document.querySelector("#new-task-input"),
		dateTime = document.querySelector('#new-task-input-date'),
		submit = document.querySelector('#new-task-submit'),
		listEl = document.querySelector("#tasks");

	//add task
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
		if (todo) {
			db.todos.add({todo, date, done});
		await getTodos();
		form.reset();
		}
		
	});

	// функция для формирования листа задач
	function formTodoList(todoList) {
		listEl.innerHTML = todoList.map(
			(todo) =>
				`
                <div class="task" ${new Date() > new Date(todo.date)?
					'style="background-color: red"':
					(new Date(todo.date) - new Date() <= 3600 * 24 * 1000) ?
					'style="background-color: green"' : ''}>
                <div class="content ${todo.done === true ? 'task-done' : ''}">
                <div class="text edit" ${new Date() > new Date(todo.date) ? 'style="color: black"' : ''}>${todo.todo}
                    <p>${todo.date.slice(-5)}</p>
                    <p>${todo.date.slice(0, -6).split('-').reverse().join('-')}</p>
                </div>
                </div>
                <div class="actions">
                <button class="done" id="${todo.id}" ${new Date() > new Date(todo.date) ? 'style="color: black"' : ''}>
                ${todo.done === true ? 'not done' : 'done'}
                </button>
                <button class="delete" id="${todo.id}" ${new Date() > new Date(todo.date) ?
					 'style="color: black"' : ''}>
                Delete
                </button>
                </div>
                </div>
            `
		).join("");
	}


	// отображать
	const getTodos = async () => {
		const allTodos = await db.todos.reverse().toArray();
		allTodos.sort((a, b) => {
			return new Date(a.date) - new Date(b.date); // сортировка задач по датам.
		});
		formTodoList(allTodos.filter(item => !item.done));
	};
    getTodos();
	//     const doneTodos = allTodos.filter(item => item.done); //сделанные задачи
	//     const notDoneTodos = allTodos.filter(item => !item.done); //не сделанные задачи
	//     console.log(allTodos, doneTodos, notDoneTodos);

//delete todo
	listEl.addEventListener('click', (e) => {
		if (e.target.classList.contains('delete')) {
			db.todos.delete(parseInt(e.target.id, 10));
			console.log(e.target.parentElement.parentElement);
			e.target.parentElement.parentElement.remove();
		}
		if (e.target.classList.contains('done')) {
			e.target.parentElement.previousElementSibling.classList.toggle('task-done');
            if (e.target.innerText === 'DONE') {
                e.target.innerText = 'NOT DONE';
                db.todos.update((parseInt(e.target.id)), {done: true});
            } else {
                e.target.innerText = 'done';
                db.todos.update((parseInt(e.target.id)), {done: false});
            }
		}
	});

	//смена списков задач
	const showBtns = document.querySelector('#show-buttons');
	const allButtons = document.querySelectorAll('.buttons');
	showBtns.querySelector('#show-not-done').classList.add('done-btn');

	
	showBtns.addEventListener('click', async (e) => {
		allButtons.forEach(item => item.classList.remove('done-btn'));
		const allTodos =  await db.todos.reverse().toArray();
		allTodos.sort((a, b) => {
			return new Date(a.date) - new Date(b.date); // сортировка задач по датам.
		});
		if (e.target.id === 'show-not-done') {
			formTodoList(allTodos.filter(item => !item.done));
			e.target.classList.add('done-btn');
		}
		if (e.target.id === 'show-done') {
			formTodoList(allTodos.filter(item => item.done));
			e.target.classList.add('done-btn');
		}
		if (e.target.id === 'show-all') {
			formTodoList(allTodos);
			e.target.classList.add('done-btn');
		}
	});
});
