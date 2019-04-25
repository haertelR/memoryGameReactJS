import React, { Component } from 'react';
import Card from '../card/card';
import cardController from '../card/cardController';
import 'bootstrap/dist/css/bootstrap.css';

class Game extends Component {
  constructor(props) {
    super(props);
    this.onCardClicked = this.onCardClicked.bind(this);
    this.onPlayAgain = this.onPlayAgain.bind(this);
    this.cardController = new cardController();
    this.rank = [];
  }

  componentWillMount() {
    this.initGame();
  }

  initGame() {
    this.cardController.generateCardSet();
    this.setState({
      name: '',
      turnNo : 1,
      pairsFound : 0,
      numClicksWithinTurn : 0,
      firstId : undefined,
      secondId : undefined,
      rank: []
    });
  }

  getCards() {
    let cards = [];
    let onClick = this.onCardClicked;
    this.cardController.cards.forEach(c => {
      let card = <Card key={c.id} 
          id={c.id} 
          image={c.image}
          imageUp = {c.imageUp}
          matched = {c.matched} 
          onClick={onClick}/>;
          cards.push(card);
    });
    return cards;
  }

  clearCards(id1,id2) {
    if (this.state.numClicksWithinTurn !== 2) {
      return;
    }
    this.cardController.flipCard(this.state.firstId, false);
    this.cardController.flipCard(this.state.secondId, false);
    this.setState({
      firstId: undefined,
      secondId: undefined,
      numClicksWithinTurn: 0,
      turnNo : this.state.turnNo+1
    });
  }

  onCardClicked(id,image) {
    if (this.state.numClicksWithinTurn === 0 || this.state.numClicksWithinTurn === 2) {
      if (this.state.numClicksWithinTurn === 2) {
        clearTimeout(this.timeout);
        this.clearCards(this.state.firstId, this.state.secondId);        
      }
      this.cardController.flipCard(id, true);
      this.setState({
        firstId : id,
        numClicksWithinTurn : 1
      });
    } else if (this.state.numClicksWithinTurn === 1) {
      this.cardController.flipCard(id, true);
      this.setState({
        secondId : id,
        numClicksWithinTurn : 2
      });

      if (this.cardController.cardsHaveIdenticalImages(id, this.state.firstId)) {
        this.cardController.setCardAsMatched(this.state.firstId, true);
        this.cardController.setCardAsMatched(id, true);
        this.setState({
          pairsFound: this.state.pairsFound+1,
          firstId: undefined,
          secondId: undefined,
          turnNo : this.state.turnNo+1,
          numClicksWithinTurn: 0
        });

      } else {
        this.timeout = setTimeout(() => { 
          this.clearCards(this.state.firstId, this.state.secondId);
        },2000); 
      }

    }
  }

  nameOnBlur = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  onPlayAgain() {
    this.initGame();
  }

  addToRanking = (name, turns) => {
    this.setState(prevstate => ({
      rank: [...prevstate.rank, {'name': name, 'turns': turns}]
    }))
  }

  render() {
    let cards = this.getCards();
    let gameStatus = <div className='Game-status'>
                      <div>Turno: {this.state.turnNo - 1}</div>
                      <div>Pares encontrados: {this.state.pairsFound}</div>
                    </div>;

    if (this.state.pairsFound === this.cardController.NUM_IMAGES) {
      this.rank.push({'name': this.state.name, 'turns': this.state.turnNo-1})
      this.rank.sort((playA, playB) => playA['turns'] - playB['turns'])
      gameStatus = <div className='Game-status'>
                    <div>Parabéns! Jogo completo.</div>
                    <div>Voce terminou em {this.state.turnNo-1} turnos.</div>
                    <div><button onClick={this.onPlayAgain}>Jogar Novamente?</button></div>
                    </div>;
    }

    let name = <div>
                <p>Favor informar seu nome para jogar.</p>
                <input type='text' onBlur={this.nameOnBlur}></input>
              </div>


    return (
      <div className='Game'>
        <header className='Game-header'>
          <div className='Game-title'>Jogo de memória do trampo novo.</div>
        </header>
        <div>
          {gameStatus}
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col-9'>
              <div className='row'>
                { this.state.name === '' ? name : cards}
              </div>
            </div>
            <div className='col-3'>
              <p>Ranking:</p>
              {this.rank.map((play) => <li>Nome: {play['name']} Turnos: {play['turns']} </li>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
