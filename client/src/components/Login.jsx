import {useState} from "react";//give local state

function Login(){
    const [username, setUsername] = useState("");//make username and password feild vals
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");//login msg

    async function handleSubmit(event){//need await
        event.preventDefault();//dont do normal form sub
        const response = await fetch("http://localhost:9000/login",{//backend conn. fetch sends http request
            method: "POST",//Sending data, need to POST
            headers:{
                "Content-Type": "application/json",//tell server we are sending a JSON
            },
            body: JSON.stringify({username: username, password: password}) //stringify converts JS obj to JSON string, provide keys as well
        });
        const data = await response.json();//convert json response to js obj.
        setMessage(data.message);//grab msg and store in message state
    }

    return( //return the UI for the component, what we fill in App.jsx
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}> {/* commenting JSX is a pain */} {/* Run handleSubmit on submit */}
                {/* normal text field, input val is set to username, updates on everykeysroke */}
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                {/* type password will mask users input */}
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Login</button>
                {/*submit trigger*/}
            </form>
            {message && <p>{message}</p>}{/* print if theres a message */}
        </div>
    );
}

export default Login;