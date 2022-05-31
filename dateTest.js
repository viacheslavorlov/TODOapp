let body;
function formTodoList() {
	return Date.parse('2021-06-01T23:16') < new Date() ? 'missed-task' : 'not-missed-task'

}

console.log(formTodoList());