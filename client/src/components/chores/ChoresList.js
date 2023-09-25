import { useEffect, useState } from "react";
import { deleteChore, getChores } from "../../managers/choreManager";
import { Button, Table } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function ChoreList ({ loggedInUser }) {
    const [chores, setChores] = useState([])
    const navigate = useNavigate()

    const getAllChores = () => {
        getChores().then(setChores)
    }

    useEffect(() => {
        getAllChores()
    }, [])

    const handleDeleteButton = (e, choreId) => {
        e.preventDefault()

        deleteChore(choreId)
        .then(() => getAllChores())
    }

    const handleDetailsButton = (e, choreId) => {
        e.preventDefault()

        navigate(`/chores/${choreId}`)
    }

    const handleCreateButton = (e) => {
        e.preventDefault()
        navigate("/chores/create")
    }

    return (
        <>
        <h2>Chores</h2>
        <Button 
            color="primary"
            onClick={handleCreateButton}
            >
            Create New Chore
        </Button>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>{"Difficulty (1-5)"}</th>
                        <th>{"Frequency (days between completions)"}</th>
                        {loggedInUser.roles.includes("Admin") ? <th>Remove Chore</th> : <></>}
                        {loggedInUser.roles.includes("Admin") ? <th>Chore Details</th> : <></>}
                    </tr>
                </thead>
                <tbody>
                    {chores.map((c) => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.difficulty}</td>
                            <td>{c.choreFrequencyDays}</td>
                            {loggedInUser.roles.includes("Admin") 
                            ? <td>
                                <Button 
                                color="danger"
                                onClick={(e) => handleDeleteButton(e, c.id)}
                                >
                                Delete
                                </Button>
                            </td> 
                            : <></>
                            }
                            {loggedInUser.roles.includes("Admin") 
                            ? <td>
                                <Button
                                color="primary"
                                onClick={(e) => handleDetailsButton(e, c.id)}
                                >
                                Details
                                </Button>
                            </td> 
                            : <></>
                            }
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}