import React from 'react';
import Grid from './components/grid';
import Intro from './components/intro';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    const rows = 10, col = 5;
    this.state = {
      isGameOver: false,
      isInputSubmit: false,
      isWon: false,
      stepCount: 0,
      totalMines: 10,
      rows: 10,
      cols: 11
    }
  }

  processInputs = (event, rows, cols) => {
    event.preventDefault();
    rows = parseInt(rows);
    cols = parseInt(cols);
    if (rows < 5 || rows >40 || cols < 5 || cols > 40) {
      alert('please select value more than 5 and lesser than 40');
    } else {
      const totalMines = Math.floor(0.15 * (rows*cols));
      this.setState({
        rows, cols, totalMines, isInputSubmit: true 
      }) 
    }   
  }

  setGameOver = () => {
    this.setState({
      isGameOver: true
    })
  }

  setStepCount = (count, isWon = false) => {
    this.setState({
      stepCount: count,
      isWon: isWon
    })
  }

  render() {
    const { rows, cols, totalMines, stepCount, isWon, isGameOver, isInputSubmit } = this.state;
    return (
      <div className="App">
        {/* <header className="App-header"></header> */}
        <div className="game-grid-container">
          <p>Minesweeper</p>
          {
            !isInputSubmit ? <Intro processInputs={this.processInputs}/> : <>
              <div className="game-board">
                {this.state.isGameOver ? <p>GAME OVER</p> : isWon ? <p>CONGRATULATIONS! YOU WON</p> : <p>Bombs: {totalMines}</p>}
                <p>Score: {this.state.stepCount}</p>
              </div>
              <Grid className="game-grid" rows={rows} cols={cols} setGameOver={this.setGameOver} stepCount={stepCount} setStepCount={this.setStepCount} isGameOver={isGameOver} totalMines={totalMines} />

            </>
          }
        </div>
      </div>
    );
  }
}

export default App;
