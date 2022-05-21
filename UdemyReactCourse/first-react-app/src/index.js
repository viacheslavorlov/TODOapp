import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const header = 'заголовок';
const elem = (
	//СИНТАКСИС
	//должен быть корневой элемент
	//должен быть закрывающийся тэг или самозакрывающийся тэг
	// в {} нельзя вставлять объекты, содержимое {} превращается в строку
	//если в {} массив - то он конкатинируется в строку

	//ИСКЛЮЧЕНИЯ:
	// className htmlFor tabIndex
	<div>
		<h2>{header}</h2>
		<input className={'class'} type={"text"}/>
		<label htmlFor="class"></label>
		<button tabIndex={1}>Click!</button>
		<button className="class"></button>
	</div>
);




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    elem
  // <React.StrictMode>
  //     elem;
  //   <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
