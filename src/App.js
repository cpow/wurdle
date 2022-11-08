import './App.scss';
import {useState} from "react";
import {useKey} from "react-use";
import styled from "styled-components";

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
      newGuesses.push({key, guessType: 'none', row: currentRow, column: currentColumn});

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

  function guessForRow(row) {
    const newGuesses = [...guesses].map((guess) => {
      if (guess.row === row) {
        if (word.at(guess.column - 1) === guess.key) {
          return {...guess, guessType: 'correct'};
        } else if (word.includes(guess.key)) {
          return {...guess, guessType: 'partial'};
        } else {
          return {...guess, guessType: 'incorrect'};
        }
      } else {
        return {...guess};
      }
    });

    setGuesses(newGuesses);

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
  }

  function checkWinnerAndMoveDown() {
    // const wordFromGuesses = guesses.reduce((acc, guess) => {
    //   if (guess.row === currentRow) {
    //     acc.push(guess.key);
    //     return acc;
    //   } else {
    //     return acc;
    //   }
    // }, []).join('');
    //
    //
    // if (wordFromGuesses === word) {
    //   setWinner(true);
    // }

    if (currentRow < 6) {
      setCurrentColumn(1);
      guessForRow(currentRow);
      setCurrentRow(currentRow + 1);
    }
  }

  function GridItem({coords}) {
    const matchingGuess = guesses.find((guess) => {
      return (guess.row === coords[0] && guess.column === coords[1]);
    });

    const text = matchingGuess ? matchingGuess.key : '';

    if (matchingGuess && matchingGuess.guessType !== 'none') {
      if (currentRow - 1 === matchingGuess.row  && guesses[guesses.length - 1].row === matchingGuess.row) {
        return (
          <AlreadyGuessedGridItem guessType={matchingGuess.guessType}>
            {text}
          </AlreadyGuessedGridItem>
        );
      }
      return (
        <GuessedGridItem guessType={matchingGuess.guessType}>
          {text}
        </GuessedGridItem>
      );
    }

    if (coords[0] === currentRow && coords[1] === currentColumn - 1) {
      return (
        <ActiveGridItem>
          {text}
        </ActiveGridItem>
      );
    }

    return (
      <BaseGridItem>
        {text}
      </BaseGridItem>
    );
  }

  function Row({row}) {
    return (
      <div className="row">
        {[1,2,3,4,5].map((column) => {
          return (
            <GridItem coords={[row, column]} />
          );
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

const BaseGridItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  font-weight: bold;
  font-size: 24px;
  text-transform: capitalize;
  border: 2px solid #D3D3D3;
`;

const  AlreadyGuessedGridItem = styled(BaseGridItem)`
  color: white;
  background: ${(props) => {
    console.log(props);
    if (props.guessType === 'correct') {
      return '#75975e';
    }
    if (props.guessType === 'partial') {
      return '#e6b400';
    }
    return '#36454F';
  }};

  @keyframes flip {
    0% {
      transform: perspective(800px) rotateY(0);
      animation-timing-function: ease-out;
    }
    40% {
      transform: perspective(800px) translateZ(150px) rotateY(170deg);
      animation-timing-function: ease-out;
    }
    50% {
      transform: perspective(800px) translateZ(150px) rotateY(190deg) scale(1);
      animation-timing-function: ease-in;
    }
    80% {
      transform: perspective(800px) rotateY(360deg) scale(.95);
      animation-timing-function: ease-in;
    }
    100% {
      transform: perspective(800px) scale(1);
      animation-timing-function: ease-in;
    }
  }

  animation-name: flip;
  animation-duration: 0.5s;
`;

const GuessedGridItem = styled(AlreadyGuessedGridItem)`
  animation: none;
`;

const  ActiveGridItem = styled(BaseGridItem)`
  @keyframes pop-in {
    0% {}
    50% {border: 4px solid #282c34;}
    100% {border: 2px solid #282c34;}
  }
  animation-name: pop-in;
  animation-duration: .25s;
`;

export default App;
