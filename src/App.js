import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import { useEffect, useState, Fragment, useRef } from "react";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [transactionStatus, setTranstacionStatus] = useState("");
  const ammountRef = useRef();

  useEffect(() => {
    const getManager = async () => {
      setManager(await lottery.methods.manager().call());
    };
    getManager();
    const getPlayers = async () => {
      setPlayers(await lottery.methods.getPlayers().call());
    };
    getPlayers();
    const getBalance = async () => {
      setBalance(
        (await web3.eth.getBalance(lottery.options.address)).toString()
      );
    };
    getBalance();
  }, []);

  const enterHandler = async (event) => {
    setTranstacionStatus("");
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    setTranstacionStatus("Waiting on transaction success...");
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(ammountRef.current.value.toString(), "ether"),
      });
      setTranstacionStatus(
        "Complited transaction successfully! You have been entered"
      );
    } catch (err) {
      setTranstacionStatus("Error!");
    }
  };

  const pickWinnerHandler = async () => {
    setTranstacionStatus("Waiting on transaction success...");
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    setTranstacionStatus(
      "Winner picked! Check you wallet to see if you won :)"
    );
  };

  return (
    <Fragment>
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {manager}</p>
        <p>
          There are currently {players.length} people entered, competing to win{" "}
          {web3.utils.fromWei(balance)} ether!
        </p>
      </div>
      <div>
        <form onSubmit={enterHandler}>
          <h3>Want to try luck?</h3>
          <p>Amount of ether to enter</p>
          <input type="text" ref={ammountRef}></input>
          <button type="submit">Enter</button>
        </form>
        <h3>{transactionStatus}</h3>
      </div>
      <div>
        <h3>Time to pick winner?</h3>
        <button onClick={pickWinnerHandler}>Pick winner</button>
        <h3>{} has won!</h3>
      </div>
    </Fragment>
  );
}

export default App;
