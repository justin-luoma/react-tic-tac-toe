import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={ props.winner ? 'square winner' : 'square' } onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let winner = (this.props.winners ? this.props.winners.includes(i) : null);
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                winner={winner}
                key={i}
            />
        );
    }

    render() {
        let jsx = [];
        for (let row = 0; row < 3; row++) {
            let itemsPerRow = (3 * (row + 1));
            let rowJSX = [];
            for (let square = (0 + row * 3); square < itemsPerRow; square++) {
                rowJSX.push(this.renderSquare(square));
            }
            jsx.push(<div className="board-row" key={row}>{rowJSX}</div>);
        }
        return <div>{jsx}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            reverseSort: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares)[0] || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    changeSort() {
        this.setState({
            reverseSort: !this.state.reverseSort
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerInfo = calculateWinner(current.squares);
        const winner = winnerInfo[0];
        const winnerSquares = winnerInfo[1];

        const moves = history.map((step, move) => {
            const desc = move ?
                "Go to move #" + move :
                "Go to game start" ;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={move === this.state.stepNumber ? 'currentMoveBtn' : 'moveBtn'}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = (winner === "draw" ? "Draw" : "Winner: " + winner);
        } else {
            status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
        }

        if(this.state.reverseSort) {
            moves.reverse();
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winners={winnerSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <button onClick={() => this.changeSort()}>Change Move Sort Order</button>
                    </div>
                    <ol reversed={this.state.reverseSort}>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    if (!squares.some((x) => {
        return x === null;
    })) {
        return ["draw", null];
    }
    return [null, null];
}