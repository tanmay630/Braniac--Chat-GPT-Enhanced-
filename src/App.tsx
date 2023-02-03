import { useState, useEffect }from 'react';
import './App.css';
import BraniacLogo from '../src/braniac.png';
import MonkeyLogo from '../src/monkey.png';
  
const App: React.FC = () => {

  useEffect(() => {       
         
     const fetchmodels = async () => {
           try {
              const response = await fetch("http://localhost:3080/models");
              const data = await response.json();
              setmodels(data.models);

           } catch(error) {
            console.log(error);
           }
     }
      fetchmodels();
   }

 ,[])

   const [input, setinput] = useState<string>("");
   const [models, setmodels] = useState<any[]>([]);
   const [chatlog, setchatlog] = useState<any[]>([{     
    user: "gpt",
    message: "how can i help you"
   },{
    user: "me",
    message: "i want to use chatgpt today"
   }]);
   const [currentmodel, setcurrentmodel] = useState<string>("");
   const [currentTemperature, setcurrentTemperature] = useState<number[]>([0,0.5,1]); 
   
      
                
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
       event.preventDefault();      
        let ChatLogNew = [...chatlog, { user: "me", message: `${input}`}]
       setinput("");
       setchatlog(ChatLogNew) 
       const messages =   ChatLogNew.map((message)  => message.message).join("\n")   
  const response = await fetch('http://localhost:3080', {
       method: "POST",
       headers: {
        "content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages, currentmodel
      })
    });
      const data = await response.json(); 
      setchatlog([...ChatLogNew, { user: "gpt", message: `${data.message}`}])       
      console.log(data.message);      
  }

   const clearchat = () => {
       setchatlog([]);
   }

  return (    
    <div className='App'>
       <aside className='side-menu'>
       <div className='side-menu-button' onClick={clearchat}>
           <span>+</span>
            New Chat   
        </div>
         <div className='models'>
         <label className='model-label'>Models</label>
            <select onChange={(e) => {
                setcurrentmodel(e.target.value);
            }}  className="option-selector" >
            {models.map((model, index) => (
                <option key={model.id} value={model.id}>{model.id}</option>
               ))}
            </select>
            <div className='engine-desc-container'>
               <div className='smart-davinci'>Smart-Davinci</div>
               <div className='code-crushman'>Code-Crushman</div>
                <p>The model parameter controls the engine used to generate the response. Davinci produces best results </p>
            </div>
            <div className='temperature'>
                <label>Temperature</label>
                <select className='option-temp-selector' onChange={() => {
                  setcurrentTemperature(currentTemperature);
                }}>
                  {currentTemperature.map((temp) => (
                    <option>{temp}</option>
                  ))}
                </select>
                <div className='temperature-desc-container'>
                  <div className='temp-0-logical'>0 - Logical</div>
                  <div className='temp-0-5-balanced'>0.5 - Balanced</div>
                  <div className='temp-1-creative'>1 - Creative</div>
                  <p>The temperature parameter controls the randomness of the model,0 is the most logical, 1 is the most creative  </p>
                </div>
            </div> 
         </div>
       </aside>
               
    <section  className='chat-box'>
       <div className='chat-log'>          
             {chatlog.map((message, index) => (
                <Chatmessage key={index} message={message}/>
             ))}    
       </div>
 
       <div className='chat-input-container'>  
         <form onSubmit={handleSubmit}>  
            <input value={input} onChange={(e) => setinput(e.target.value)}  className='chat-input-texter'></input>
         </form>    
       </div>
                    
    </section>

    </div>

  )

}

const Chatmessage = ({message}: any) => {
return (
   
  <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
            <div className='chat-message-center'>
                 <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
                   {message.user === "gpt" && <img src={BraniacLogo} className="braniac-logo" alt=''/>}
                   {message.user === "me" && <img src={MonkeyLogo} alt="" className='monkey-logo'/>
                   }
                 </div>
               <div className='message'>
                   {message.message}
                 </div>
              </div> 
  </div>

)
}


export default App;
