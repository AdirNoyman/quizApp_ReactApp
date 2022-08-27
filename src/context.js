import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';

const table = {
	sports: 21,
	history: 23,
	politics: 24,
};

const API_ENDPOINT = 'https://opentdb.com/api.php?';

const tempUrl =
	'https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple';

let url = '';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
	// Waiting for the user to fill the form and only after that we will construct the url and activate the fetch
	const [waiting, setWaiting] = useState(true);
	// Loading the fetch response
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState([]);
	// index = what question are we asked
	const [index, setIndex] = useState(0);
	const [correct, setCorrect] = useState(0);
	const [error, setError] = useState(false);
	const [quiz, setQuiz] = useState({
		amount: 10,
		category: 'sports',
		difficulty: 'easy',
	});

	const [isModalOpen, setIsModalOpen] = useState(false);

	// fetch the questions after we got the form data from the user and contsructed the url (+query)
	const fetchQuestions = async url => {
		setLoading(true);
		setWaiting(false);

		const response = await axios(url).catch(err => {
			console.log('Error fetching the questions 😩: ' + err.message);
		});
		console.log(response);
		if (response) {
			const data = response.data.results;
			console.log(data);
			if (data.length > 0) {
				setQuestions(data);
				setLoading(false);
				setWaiting(false);
				setError(false);
			} else {
				setWaiting(true);
				setError(true);
			}
		} else {
			setLoading(false);
		}
	};

	const nextQuestion = () => {
		setIndex(oldIndex => {
			const nextIndex = oldIndex + 1;
			if (nextIndex > questions.length - 1) {
				openModal();
				return 0;
			} else {
				return nextIndex;
			}
		});
	};

	const checkAnswer = value => {
		if (value) {
			setCorrect(oldState => oldState + 1);
		}
		nextQuestion();
	};

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		// Wait for the user to enter a new quiz reuqest form
		setWaiting(true);
		// Reset correct answers score
		setCorrect(0);
		setIsModalOpen(false);
	};

	const handleChange = e => {
		const name = e.target.name;
		const value = e.target.value;
		console.log(name, value);
		setQuiz({ ...quiz, [name]: value });
	};

	const handleSubmmit = e => {
		e.preventDefault();
		const { amount, category, difficulty } = quiz;
		// Contsruct the url from the data we got from the user form
		url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;
		console.log(url);
		fetchQuestions(url);
	};

	// useEffect(() => {
	// 	fetchQuestions(tempUrl);
	// }, []);

	return (
		<AppContext.Provider
			value={{
				waiting,
				loading,
				questions,
				index,
				correct,
				error,
				isModalOpen,
				quiz,
				nextQuestion,
				checkAnswer,
				closeModal,
				handleChange,
				handleSubmmit,
			}}>
			{children}
		</AppContext.Provider>
	);
};
// make sure use
export const useGlobalContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider };
