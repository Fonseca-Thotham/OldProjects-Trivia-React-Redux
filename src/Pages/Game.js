/* eslint-disable max-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Header from '../Components/Header';
import { updateScore } from '../redux/actions';
import '../style/Game.css';

const correctAnswer = 'correct-answer';

class Game extends React.Component {
state = {
  questions: {},
  hashValidate: true,
  questionsIndex: 0,
  loading: true,
  correctBackground: 'white',
  incorrectBackground: 'white',
  answers: [],
  disableButtons: false,
  seconds: 30,
  isHidden: true,
  stopTimer: false,
};

  componentDidMount = async () => {
    await this.request();
    this.setState({
      loading: false,
    });
    this.answers();
    const timer = 1000;
    this.scoreTimer = setInterval(() => {
      this.setState((prevState) => ({ seconds: prevState.seconds - 1 }));
    }, timer);
  }

  componentDidUpdate = () => {
    const { seconds, stopTimer } = this.state;
    if (seconds === 0 || stopTimer) {
      clearInterval(this.scoreTimer);
      this.timerOut();
    }
  }

  timerOut = () => {
    const { correctBackground, stopTimer } = this.state;
    this.setState({ stopTimer: false, seconds: 30 });
    if (correctBackground === 'white' && !stopTimer) {
      this.setState({ correctBackground: 'rgb(0,48,36)',
        incorrectBackground: 'red',
        disableButtons: true,
        isHidden: false });
    }
  }

  onClick = (obj) => {
    const { scoreAction } = this.props;
    const { seconds } = this.state;
    this.setState({ correctBackground: 'rgb(0,48,36)',
      incorrectBackground: 'red' });
    const { questionsIndex, questions } = this.state;
    const { difficulty } = questions.results[questionsIndex];
    const pontoFixo = 10;
    const hard = 3;
    if (obj.testId === correctAnswer) {
      let valorFinal = 0;
      if (difficulty === 'hard') {
        valorFinal += pontoFixo + (hard * seconds);
      } else if (difficulty === 'medium') {
        valorFinal += pontoFixo + (seconds * 2);
      } else {
        valorFinal += pontoFixo + seconds;
      }
      scoreAction(valorFinal);
      this.updateStorage(valorFinal);
    }
    this.setState({ isHidden: false });
  }

  updateStorage = (score) => {
    const { name } = this.props;
    const ranking = JSON.parse(localStorage.getItem('ranking'));
    const playerInfo = ranking.find((player) => player.name === name);
    const rankingClone = [...ranking];
    const sumAssertion = playerInfo.assertions + 1;
    const sumScore = playerInfo.score + score;
    const playerIndex = rankingClone.indexOf(playerInfo);
    rankingClone[playerIndex] = { ...playerInfo,
      assertions: sumAssertion,
      score: sumScore };
    localStorage.setItem('ranking', JSON.stringify(rankingClone));
  }

  nextClick = () => {
    let { questionsIndex } = this.state;
    this.setState({
      questionsIndex: questionsIndex += 1,
      correctBackground: 'white',
      incorrectBackground: 'white',
      seconds: 30,
      disableButtons: false,
      isHidden: true,
      stopTimer: true,
    }, () => {
      this.answers();
      const timer = 1000;
      this.scoreTimer = setInterval(() => {
        this.setState((prevState) => ({ seconds: prevState.seconds - 1 }));
      }, timer);
    });
  }

  request = async () => {
    const { token } = this.props;
    const URL = `https://opentdb.com/api.php?amount=5&token=${token}`;
    const requisicao = await fetch(URL);
    const requisicaoJson = await requisicao.json();
    this.setState({ questions: requisicaoJson });
    const tres = 3;
    if (requisicaoJson.response_code === tres || token === '') {
      localStorage.removeItem('token');
      this.setState({ hashValidate: false });
    }
  }

  // a seguinte função consultamos do stackOverFlow: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  answers = () => {
    const { questions, questionsIndex } = this.state;
    const qstSelect = questions.results ? (
      questions.results?.find((qst, index) => (index === questionsIndex))
    ) : '';
    const respostas = [...qstSelect?.incorrect_answers, qstSelect.correct_answer];
    const respostasNew = [];
    respostas.forEach((resposta, index) => {
      const value = resposta === qstSelect.correct_answer ? (correctAnswer)
        : `wrong-answer-${index}`;
      const obj = { resposta, testId: value };
      respostasNew.push(obj);
    });
    this.shuffleArray(respostasNew);
    this.setState({ answers: respostasNew });
  }

  blinker = () => {
    const { seconds } = this.state;
    const alertTime = 10;
    if (seconds <= alertTime) {
      return 'blinker';
    }
  }

  colorDecider(string) {
    if (string === 'correct-answer') {
      return '6px solid rgb(110,218,44)';
    }
  }

  // Essa função foi disponibilizada por Jessy Damasceno no slack para corrigir o problema das questões serem exibidas sem os caracteres especiais. Obrigado, Jessy!
  decodeEntity(inputStr) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = inputStr;
    return textarea.value;
  }

  render() {
    const lastQuestion = 4;
    const { hashValidate, questions,
      questionsIndex, loading, correctBackground, incorrectBackground, answers,
      disableButtons, isHidden, seconds } = this.state;
    const qstSelect = !loading ? (
      questions.results?.find((qst, index) => (index === questionsIndex))) : '';
    return (
      <div className="login-background">
        {
          !hashValidate && <Redirect to="/" />
        }
        <Header />
        {
          !loading && (
            <div className="text-center game-screen d-flex flex-column">
              <h1
                className="title-category"
                data-testid="question-category"
                style={ { color: 'white' } }
              >
                {qstSelect?.category}
              </h1>
              <h2 data-testid="timer" className={ this.blinker() }>{ seconds }</h2>
              <div className="questions-board">
                <h3 data-testid="question-text">
                  {this.decodeEntity(qstSelect?.question)}
                </h3>
              </div>

              <ul
                className="d-flex flex-column justify-content-center ask-board"
                data-testid="answer-options"
              >
                {answers?.map((resp, index) => {
                  const value = resp.testId === correctAnswer ? (
                    correctBackground) : incorrectBackground;
                  return (
                    <button
                      className="btn btn-outline-dark"
                      data-testid={ resp.testId }
                      style={ { fontWeight: 'bolder',
                        border: value !== 'white' && this.colorDecider(resp.testId),
                        color: value !== 'white' && 'white',
                      } }
                      key={ index }
                      type="button"
                      onClick={ () => this.onClick(resp) }
                      disabled={ disableButtons }
                    >
                      {this.decodeEntity(resp.resposta)}
                    </button>
                  );
                })}
              </ul>
              { !isHidden && questionsIndex < lastQuestion && (
                <button
                  className="btn btn-light next"
                  type="button"
                  data-testid="btn-next"
                  onClick={ this.nextClick }
                >
                  Next
                </button>
              )}
              <Link to="/feedback">
                { questionsIndex === lastQuestion && (
                  <button
                    className="btn btn-light next"
                    type="button"
                    data-testid="btn-next"
                  >
                    Next
                  </button>
                )}
              </Link>
            </div>
          )
        }
      </div>
    );
  }
}

Game.propTypes = {
  token: PropTypes.string.isRequired,
  scoreAction: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.player.token,
  name: state.player.name,
});

const mapDispatchToProps = (dispatch) => ({
  scoreAction: (numero) => dispatch(updateScore(numero)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
