import { useState } from 'react';
import './App.css';

const tacos = [
  {
    tacoId: 0,
    src: '/images/taco1.jpg',
    alt: 'Taco 1',
    isTacoBell: false
  },
  {
    tacoId: 1,
    src: '/images/taco2.jpg',
    alt: 'Taco 2',
    isTacoBell: false
  },
  {
    tacoId: 2,
    src: '/images/taco3.jpg',
    alt: 'Taco 3',
    isTacoBell: false
  }
]

function App() {
  const [responses, setResponses] = useState([]);
  const [activeTaco, setActiveTaco] = useState(0);
  const [tastinessScore, setTastinessScore] = useState(3);

  async function handleSubmit(event) {
    event.preventDefault();

    const taco = tacos[activeTaco];
    const newResponses = [
      ...responses,
      { tacoId: taco.tacoId, tastinessScore, isTacoBell: taco.isTacoBell }
    ]
    // save current taco id and rating
    setResponses(newResponses);
    // then, check if last taco
    if (activeTaco === tacos.length - 1) {
      await fetch('/.netlify/functions/hasura-add-response', {
        method: 'POST',
        body: JSON.stringify({ responses : newResponses })
      });
      // TODO: implement submission
      console.log('save responses');
      console.log(newResponses);
      return;
    }
    // if not, show next taco
    setActiveTaco(activeTaco + 1);
    setTastinessScore(3);
    // if so, save response to db
  }

  const taco = tacos[activeTaco];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Learn with Jason Taco App</h1>
      </header>
      <main>
        <div className="current-vote">
          <img src={taco.src} alt={taco.alt} />
          <form onSubmit={handleSubmit}>
            <h2>Rate this taco!</h2>
            <label htmlFor="amount">
              Choose 1 for "trash" and 5 for "God level"
            </label>
            <input id="amount" type="range" min={1} max={5} onChange={(event) => setTastinessScore(parseInt(event.target.value))} list="tickmarks" value={tastinessScore} />
            <datalist id="tickmarks">
              <option value="1" label="1"></option>
              <option value="2"></option>
              <option value="3" label="3"></option>
              <option value="4"></option>
              <option value="5" label="5"></option>
            </datalist>
            <button>Save and rate the next taco</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
