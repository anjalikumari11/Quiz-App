import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function Quiz() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isGameStart, setIsGameStart] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [apiData, setApiData] = useState();
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        if (isGameStart && !showResult) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev >= 30) {
                        clearInterval(timer);
                        setShowResult(true);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isGameStart, showResult]);




    const startGame = () => {
        setIsGameStart(true);

    }

    const handleNext = () => {
        if (currentQuestionIndex < apiData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResult(true);
        }
    };
    const fetchData = () => {
        // Change your api url here...
        fetch("./quiz.json")
            .then(res => res.json())
            .then((data) => setApiData(data));
    };

    const checkAns = (qs, isCorrect, option) => {
        setAnswers([{
            id: qs,
            index: option,
            correct: isCorrect
        }, ...answers]);
        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
        }
    };

    return apiData != null ? (
        <div className='container'>
            {
                !isGameStart ? (<div className='GameStartOverlay'>
                    <h1>{apiData.title}</h1>
                    <p style={{ marginBottom: 20, }}>Click on start quiz button to play the quiz</p>
                    <button onClick={startGame} style={{
                        backgroundColor: "rgba(80, 71, 255,1)",
                        color: "white"
                    }}>Start Quiz</button>
                </div>) : (<div />)
            }
            <h1>{apiData.title}</h1>
            <hr />
            {
                !showResult ? (<div className="timer">
                    <progress id="progress" value={timeLeft} max="30"> {timeLeft} </progress>
                </div>) : (<div />)
            }

            <hr />
            {showResult ? (
                <div className='result-screen'>
                    <h2 style={{ marginBottom: 10 }}>Quiz Completed! 🎉</h2>
                    <div style={{ width: 200, height: 200, marginBottom: 10 }}>
                        <CircularProgressbar value={(score / apiData.questions.length) * 100} text={`${score} / ${apiData.questions.length}`} />
                    </div>
                    <button onClick={() => window.location.reload()}>Restart Quiz</button>
                </div>
            ) : (
                <div className='dabba'>
                    <h2 className='question'>{apiData.questions[currentQuestionIndex].description}</h2>
                    <div className="options">
                        {apiData.questions[currentQuestionIndex].options.map((op) => (
                            <h4
                                onClick={() =>
                                    answers.find((a) => a.id == apiData.questions[currentQuestionIndex].id)
                                        ? () => { }
                                        : checkAns(apiData.questions[currentQuestionIndex].id, op.is_correct, op.id)
                                }
                                style={{
                                    background: answers.find((a) => a.index == op.id)
                                        ? op.is_correct ? "rgb(42, 201, 74)" : "rgb(253, 94, 94)"
                                        : "rgba(128, 120, 254, 1)"
                                }}
                            >
                                {op.description}
                            </h4>
                        ))}
                    </div>
                </div>
            )}

            {!showResult && (
                <button className='next-ques' onClick={handleNext}>
                    {currentQuestionIndex < apiData.questions.length - 1 ? "Next" : "Finish"}
                </button>
            )}

        </div>
    ) : (
        <h1>Loading...</h1>
    );
}

export default Quiz;
