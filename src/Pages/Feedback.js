import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import '../style/Feedback.css';
import { resetState } from '../redux/actions/index';

class Feedback extends React.Component {
  render() {
    const { assertions, score, onClick } = this.props;
    const couldBeBetter = 3;
    return (
      <div className="master-div">
        <Header />
        <div className="feedback-div">
          <main className="feedback-main">
            {
              assertions < couldBeBetter ? (
                <h3 className="bad-feedback" data-testid="feedback-text">
                  Could be better...
                </h3>
              ) : (
                <h3 className="good-feedback" data-testid="feedback-text">
                  Well done!
                </h3>
              )
            }
            <div>
              <p data-testid="feedback-total-score">{`Score: ${score}`}</p>
              <p data-testid="feedback-total-question">{`Assertions: ${assertions}`}</p>
            </div>
            <Link to="/">
              <button
                className="btn btn-outline-dark"
                type="button"
                data-testid="btn-play-again"
                onClick={ onClick }
              >
                Play Again
              </button>
            </Link>
            <Link to="/ranking">
              <button
                className="btn btn-outline-dark"
                type="button"
                data-testid="btn-ranking"
              >
                Ranking
              </button>
            </Link>
          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
});

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(resetState()),
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
