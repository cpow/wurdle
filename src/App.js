import './App.css';
import {useState} from "react";
import {useKey} from "react-use";

function App() {
  const [currentRow, setCurrentRow] = useState(1);
  const [currentColumn, setCurrentColumn] = useState(1);
  const [guesses, setGuesses] = useState([]);
  const [winner, setWinner] = useState(false);

  useKey(onlyAlpha, addGuess);
  useKey((event) => event.key === 'Backspace', removeGuess);
  useKey((event) => event.key === 'Enter', checkWinnerAndMoveDown)

  const word = 'fatso';

  function onlyAlpha(event) {
    const { key } = event;
    const onlyAlphaRegex = new RegExp(/[a-zA-Z]/);

    return onlyAlphaRegex.test(key) && key.length === 1;
  }

  function addGuess(event) {
    const { key } = event;

    if (currentColumn <= 5) {
      const newGuesses = [...guesses];
      newGuesses.push({key, row: currentRow, column: currentColumn});

      setGuesses(newGuesses);
      setCurrentColumn(currentColumn + 1);
    }
  }

  function removeGuess() {
    if (currentColumn === 1) return;

    const newGuesses = [...guesses];
    newGuesses.pop();

    setGuesses(newGuesses);
    setCurrentColumn(currentColumn - 1);
  }

  function checkWinnerAndMoveDown() {
    const wordFromGuesses = guesses.reduce((acc, guess) => {
      if (guess.row === currentRow) {
        acc.push(guess.key);
        return acc;
      } else {
        return acc;
      }
    }, []).join('');


    if (wordFromGuesses === word) {
      setWinner(true);
    }

    if (currentRow < 6) {
      setCurrentColumn(1);
      setCurrentRow(currentRow + 1);
    }
  }

  function GridItem({coords}) {
    const text = guesses.map((guess) => {
      if (guess.row === coords[0] && guess.column === coords[1]) {
        return guess.key;
      }
    });

    return (
      <div className="gridItem">
        {text}
      </div>
    )
  }

  function Row({row}) {
    return (
      <div className="row">
        {[1,2,3,4,5].map((column) => {
          return (
            <GridItem coords={[row, column]} />
          )
        })}
      </div>
    )
  }

  if (winner) {
    return (
      <h1>WINNER WINNER GOOD JOB FATSO</h1>
    )
  }

  return (
    <div className="App">
      {[1,2,3,4,5,6].map((row) => {
        return (
          <Row row={row} />
        )
      })}
    </div>
  );
}

export default App;
