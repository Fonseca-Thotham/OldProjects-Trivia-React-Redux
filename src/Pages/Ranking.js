import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Ranking.css';

class Ranking extends React.Component {
    state = {
      ranking: [],
    }

    componentDidMount() {
      this.rankingContent();
    }

    rankingContent = () => {
      const ranking = JSON.parse(localStorage.getItem('ranking'));
      const rankingClone = [...ranking];
      rankingClone.sort((a, b) => b.score - a.score);
      this.setState({ ranking: rankingClone });
    }

    render() {
      const { ranking } = this.state;
      return (
        <div className="ranking">
          <h1 data-testid="ranking-title">Ranking</h1>
          {
            ranking[0] && (
              ranking.map((player, index) => (
                <div
                  className="ranking-card"
                  key={ player.name }
                >
                  <img
                    style={ { borderRadius: '15px' } }
                    src={ player.picture }
                    alt="userImg"
                  />
                  <span
                    className="card-text"
                    data-testid={ `player-name-${index}` }
                  >
                    {player.name}
                  </span>
                  <span data-testid={ `player-score-${index}` }>{player.score}</span>
                </div>
              ))
            )
          }
          <Link to="/">
            <button
              className="home-button"
              type="button"
              data-testid="btn-go-home"
            >
              Inicio
            </button>
          </Link>
        </div>
      );
    }
}

export default Ranking;
