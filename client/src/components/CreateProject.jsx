import{useEffect, useState} from "react";

function CreateProject({onProjectCreated}){
    //store form inputs and users
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Planning");
    const [projectLead, setProjectLead] = useState("");
    const [users, setUser] = useState([]);
    const [message, setMessage] = useState("");

    //get users from backend
    async function loadUsers(){
        try {
            const response = await fetch("http://localhost:9000/users");
            if (!response.ok) throw new Error("Couldnt load users");
            const data = await response.json();
            setUser(data);
        } catch (error) {
            setMessage(error.message);
        }
    }

    useEffect(() => {loadUsers()}, []);//load users when component renders

    async function handleSubmit(event){//send data to express on submit
        event.preventDefault();
        setMessage("");
        try{
            const response = await fetch("http://localhost:9000/projects", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, description, status, project_lead_id: projectLead})
            });
            const data = await response.json();//get response from backend
            if (response.ok){//clear form on successful submission
                setMessage("Successfully created project");
                setName("");
                setDescription("");
                setStatus("Planning");
                setProjectLead("");
                onProjectCreated();//refresh other components
            }
            else{
                setMessage(data.message);
            }
        }
        catch(error){
            setMessage("couldnt connect to server");
        }
    }

    return (
        <div>
            <h2>Create Project</h2>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>Project Name:</label>
                    <input value = {name} onChange={(e) => setName(e.target.value)} required />
                </p>
                <p>
                    <label>Description:</label>
                    <input value = {description} onChange={(e) => setDescription(e.target.value)} required />
                </p>
                <p>
                    <label>Status:</label>
                    <select value = {status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="Planning">Planning</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                </p>
                <p>
                    <label>Project Lead:</label>
                    <select value = {projectLead} onChange={(e) => setProjectLead(e.target.value)} required>
                        <option value="">select a user</option>
                        {users.map((user) => (
                            <option value={user._id} key={user._id}>
                                {user.username}
                            </option>
                            ))}
                        </select>
                    <button type="button" onClick={loadUsers}>
                        Refresh users
                    </button>
                </p>
                <button type="submit">Create Project</button>
            </form>
            <p>{message}</p>
        </div>
    );
}
export default CreateProject;