import {useState} from 'react';
import {ethers} from "ethers";
import './App.css';


const provider = new ethers.providers.Web3Provider(window.ethereum);
//const signer = provider.getSigner()

function App() {


  const [accountBalance, setAccountBalance] = useState();
  async function balance(address){ 
    try {
       const balance = await provider.getBalance(address);
       let numOfBalance = ethers.utils.formatEther(balance);
      return numOfBalance;
    } catch(error) {
      console.log("Failed");
    }
  }
  



  const [textInput, setTextInput] = useState({
    walletAddress1: "",
    walletAddress2: "",
    walletAddress: "",
    etherAmount: "",
    privateKey: "",
  });

  function handleChange(event){  
      const {name, value} = event.target;
      setTextInput(prevValues =>{
          return {
              ...prevValues,
              [name]: value,
          }
      });
  }
  function handleClick(event){
      event.preventDefault();
      if (event.target.name === "sendButton"){
        sendToken(textInput.walletAddress1,textInput.privateKey,textInput.walletAddress2,textInput.etherAmount);
/*         console.log(textInput.walletAddress1);
        console.log(textInput.privateKey);
        console.log(textInput.walletAddress2);
        console.log(textInput.etherAmount); */

        setTextInput(prevValues => {
          return {
            ...prevValues,
            walletAddress1: "",
            walletAddress2: "",
            etherAmount: "",
            privateKey: ""
          }
          
        }) 
      }else if(event.target.name === "checkButton"){
        balance(textInput.walletAddress).then(result =>{
          setAccountBalance(result);
        })
      }
  }

  function sendToken(senderAddress, privateKey, receiverAddress, value){
    let walletPrivateKey = new ethers.Wallet(privateKey);
    let walletSigner = walletPrivateKey.connect(provider);
    const tx = {
      from: senderAddress,
      to: receiverAddress,
      value: ethers.utils.parseEther(value)
    }
    try {
      walletSigner.sendTransaction(tx).then(() => alert("Transaction done."));
    }catch(error){
      alert("Failed transaction.");
    }
  }





  return (
    <div className="App">
      <h1>Your account balance is {accountBalance}</h1>
      <form>
        <input onChange={handleChange} name="walletAddress1" value={textInput.walletAddress1} placeholder="Address of the sender Wallet"></input>
        <input onChange={handleChange} name="privateKey" value={textInput.privateKey} placeholder="Your private key"></input>
        <input onChange={handleChange} name="walletAddress2" value={textInput.walletAddress2} placeholder="Address of the receiver Wallet"></input>
        <input onChange={handleChange} name="etherAmount" value={textInput.etherAmount} placeholder="Amount of ether to send"></input>
        <button onClick={handleClick} name="sendButton">Send</button>
      </form>
      <h1>Check account Balance</h1>
      <input onChange={handleChange} name="walletAddress" value={textInput.walletAddress} placeholder="Address to check Balance"></input>
      <button onClick={handleClick} name="checkButton">Check Address</button>
    </div>

  );
}

export default App;
