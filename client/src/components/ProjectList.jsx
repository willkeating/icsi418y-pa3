import {useEffect, useState} from "react";

function ProjectList({refreshKey }){
    const [projects,setProjects] = useState([]);
    const [message,setMessage] = useState("");

    useEffect(() => {//load proejcts when the component starts up or when the key changes
        async function loadProjects(){
            try{
                const response = await fetch("http://localhost:9000/projects");//get all proj. from express
                if (!response.ok) {
                    throw new Error("Could not load projects");
                }
                const data = await response.json();//conv. response to an array and update state
                setProjects(data);
                setMessage("");
            }
            catch(error){
                setMessage(error.message);
            }
        }
        loadProjects();
    }, [refreshKey]);

    return (
        <div>
            <h2>Project List</h2>
            {message && <p>{message}</p>}
            {projects.length === 0 && <p>No projects found.</p>}
            {projects.map((project) => (
                <div key={project._id}>
                    <h3>{project.name}</h3>
                    <p>Description: {project.description}</p>
                    <p>Status: {project.status}</p>
                    <p>Project Lead: {project.project_lead_name}</p>
                    <br/>
                </div>
            ))}
        </div>
    );
}
export default ProjectList;