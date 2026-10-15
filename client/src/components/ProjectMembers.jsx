import {useEffect,useState} from "react";

function ProjectMembers({refreshKey}){
    const [projects,setProjects] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedProject,setSelectedProject] = useState("");
    const [selectedUser,setSelectedUser] = useState("");
    const [members,setMembers] = useState([]);
    const [message,setMessage] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const projectResponse = await fetch("http://localhost:9000/projects");
                const userResponse = await fetch("http://localhost:9000/users");
                if (!projectResponse.ok || !userResponse.ok){
                    throw new Error("Couldnt load data");
                }
                const projectData = await projectResponse.json();
                const userData = await userResponse.json();

                setProjects(projectData);
                setUsers(userData);
                setSelectedProject(current =>
                    projectData.some(p => p._id === current) ? current: (projectData[0]?._id || ""));
            }
            catch(error){
                setMessage(error.message);
            }
        }
        loadData();
    },[refreshKey]);


    async function loadMembers(projectId) {//get all members for project
        if (!projectId){
            setMembers([]);
            return;
        }
        try {
            const response = await fetch(`http://localhost:9000/projects/${projectId}/members`);
            const data = await response.json();
            if (response.ok) {
                setMembers(data);
            }
            else{
                setMessage(data.message);
            }
        }
        catch(error){
            setMessage("Could not load members");
        }
    }

    useEffect(() => {loadMembers(selectedProject);},[selectedProject, refreshKey]);//refresh member list on project change

    async function addMember(){//add selected user to project
        if (!selectedProject || !selectedUser){
            setMessage("Select a project and user");
            return;
        }
        try{
            const response = await fetch(//send user id to express
                `http://localhost:9000/projects/${selectedProject}/members`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({user_id: selectedUser})
                }
            );
            const data = await response.json();
            setMessage(data.message);
            if (response.ok){//clear and reload members on reload
                setSelectedUser("");
                await loadMembers(selectedProject);
            }
        }
        catch(error){
            setMessage("Could not add member");
        }
    }

    async function removeMember(userId){//remove member from project
        try {
            const response = await fetch(
                `http://localhost:9000/projects/${selectedProject}/members/${userId}`,
                { method: "DELETE" }
            );
            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                await loadMembers(selectedProject);
            }
        }
        catch(error){
            setMessage("Could not remove member");
        }
    }
    const currentProject = projects.find(project => project._id === selectedProject);//find cur project to get lead

    return(
        <div>
            <h2>Manage Project Members</h2>
            <p>
                <label>Select Project:</label>
                <select value={selectedProject} onChange={(e) => {
                    setSelectedProject(e.target.value);setMessage("");
                    setMembers([]);
                    }}
                >
                    {projects.length === 0 && (
                        <option value="">
                            No projects available
                        </option>
                    )}
                    {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </p>
            <h3>Current Members</h3>
            {members.length === 0 &&<p>No members found.</p>}
            {members.map((member) => {
                const isLead = member._id === currentProject?.project_lead_id;
                return (
                    <div key={member._id}>
                        {member.username}
                        {isLead ? (<span> (Project Lead)</span>): (
                            <button type="button" onClick={() => removeMember(member._id)}>
                                Remove
                            </button>
                        )}
                    </div>
                );
            })}
            <h3>Add Member</h3>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">
                    Select a user
                </option>
                {users.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.username}
                    </option>
                ))}
            </select>
            <button type="button" onClick={addMember} disabled={!selectedProject}>
                Add Member
            </button>
            <p>{message}</p>
        </div>
    );
}
export default ProjectMembers;