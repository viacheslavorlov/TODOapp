import {Dexie} from 'dexie';

document.addEventListener('DOMContentLoaded', () => {

	//creating database structure

	const db = new Dexie("Todo App");
	db.version(4).stores({todos: "++id, todo, date, time, done"});

	const form = document.querySelector("#new-task-form"),
		input = document.querySelector("#new-task-input"),
		dateTime = document.querySelector('#new-task-input-date'),
		submit = document.querySelector('#new-task-submit'),
		listEl = document.querySelector("#tasks");
	let currentlist;

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
		let styleList = todoList.map((todo) => {
			let style = Date.parse(todo.date) < new Date() ? 'crimson' : '#14dcdc';
			if (style !== 'crimson' && Date.parse(todo.date) < (+(new Date()) + (3600 * 24 * 1000))) {
				style = 'linear-gradient(to right, var(--pink), var(--purple))';
			}
			if (todo.done === true) {
				style = 'green';
			}
			console.log(Date.parse(todo.date));
			return style;
		});
		console.log(styleList);
		console.log();

		listEl.innerHTML = todoList.map(
			(todo, i) => {
				return `
                <div class="task" style="background: ${styleList[i]}">
					<div class="content ">
						<div class="text edit">${todo.todo}
							<p>${todo.date.slice(-5)}</p>
							<p>${todo.date.slice(0, -6).split('-').reverse().join('-')}</p>
						</div>
					</div>
					<div class="actions">
						<button class="done" id="${todo.id}">${todo.done === false ? 'DONE' : 'NOT DONE'}</button> 
						</button>
						<button class="delete" id="${todo.id}" >
						Delete
						</button>
					</div>
                </div>
            `
			}
		).join("");

	}


	// отображать
	const getTodos = async () => {
		const allTodos = await db.todos.reverse().toArray();
		allTodos.sort((a, b) => {
			return new Date(a.date) - new Date(b.date); // сортировка задач по датам.
		});
		formTodoList(allTodos.filter(item => !item.done));
		currentlist = 'not done';
	}
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
			// e.target.parentElement.previousElementSibling.classList.toggle('task-done');
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


	// function styleDoneTasks(){
	// 	document.querySelectorAll('.task').forEach(item => {
	// 		if(Date.parse(item.date) > new Date()) {
	// 			item.style.backgroundColor = 'rgb(40, 132, 236)';
	// 		} else {
	// 			item.style.backgroundColor = 'red';
	// 		}
	// 		console.log(Date.parse(item.date));
	// 	});
	// }

	showBtns.addEventListener('click', async (e) => {
		allButtons.forEach(item => item.classList.remove('done-btn'));
		const allTodos = await db.todos.reverse().toArray(); //сортировка задач по датам в обратном порядке
		allTodos.sort((a, b) => {
			return new Date(a.date) - new Date(b.date); // сортировка задач по датам.
		});
		if (e.target.id === 'show-not-done') {
			formTodoList(allTodos.filter(item => !item.done));
			e.target.classList.add('done-btn');
			currentlist = 'not done';
		}
		if (e.target.id === 'show-done') {
			formTodoList(allTodos.filter(item => item.done));
			document.querySelectorAll('.task').forEach(item => item.style.backgroundColor = 'green');
			e.target.classList.add('done-btn');
			currentlist = 'done';
		}
		if (e.target.id === 'show-all') {
			formTodoList(allTodos);
			e.target.classList.add('done-btn');
			currentlist = 'all';
		}
	});
});
