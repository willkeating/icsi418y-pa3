import {useState} from 'react';

function Signup(){//signup component
    const [fName, setFName] = useState(""); //grab first name entered
    const [lName, setLName] = useState("");//""
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(event){
        event.preventDefault();//need to perform separate ops than std. form sub
        console.log({fName, lName, username, password});//display vals to see if working right
        const response = await fetch("http://localhost:9000/signup",{//db server conn path
            method: "POST",
            headers: {
                "Content-Type": "application/json",//tell server we are sending json
            },
            body: JSON.stringify({//conv js obj. to json include keys
                f_name: fName,
                l_name: lName,
                username: username,
                password: password
            })
        });
        const data = await response.json();//make resonse a js obj
        setMessage(data.message);//grab msg and store in msg state
    }

    return(//return html for sign up, pretty much same as login
        <div>
            <h2>Sign up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder = "First Name" value = {fName} onChange={(e) => setFName(e.target.value)} />
                <input type="text" placeholder = "last name" value = {lName} onChange={(e) => setLName(e.target.value)} />
                <input type="text" placeholder = "username" value = {username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder = "password" value = {password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Sign up</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Signup;