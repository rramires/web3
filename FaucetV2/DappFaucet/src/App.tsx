import { useState } from 'react';
import { mint } from './web3Service'

function App() {

  const [message, setMessage] = useState("");

  function onBtnClick(){
    setMessage("Requesting your tokens, please wait.");
    mint()
      // Retuned transaction hash
      .then(tx => setMessage("Your tokens were sent. Tx: " + tx))
      .catch(err => setMessage(err.message));
  }

  return (
    <>      
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="mb-auto">
          <div>
            <h3 className="float-md-start mb-0">SampleCoin Faucet</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a className="nav-link fw-bold py-1 px-0 active" aria-current="page" href="#">Home</a>
              <a className="nav-link fw-bold py-1 px-0" href="#">About</a>
            </nav>
          </div>
        </header>

        <main className="px-3">
          <h1>Get your SampleCoins</h1>
          <p className="lead">Once a daym earn 50 coins for free, just connect your MetaMask or similar wallet below.</p>
          <p className="lead">
            <a href="#" onClick={onBtnClick} className="btn btn-lg btn-light fw-bold border-white bg-white">
              <img id="mm-logo" src="assets/MetaMaskLogo.svg" alt="MetaMask Logo" />
              Connect to MetaMask
            </a>
          </p>
          <p className="lead max-error-message">
            {message}
          </p>
        </main>

        <footer className="mt-auto text-white-50">
          <p>Build by <a href="https://flexbr.com/" className="text-white">FlexBr</a></p>
        </footer>
      </div>
    </>
  );
}

export default App;
