import { useEffect, useState } from "react"
import { completeChore, getMyChores } from "../../managers/choreManager"
import { Button, Table } from "reactstrap"

export default function MyChores ({ loggedInUser }) {
    const [chores, setChores] = useState([])

    const getAllChores = () => {
        getMyChores(loggedInUser.id).then(setChores)
    }

    useEffect(() => {
        getAllChores()
    }, [])

    const handleCompleteButton = (e, choreId) => {
        e.preventDefault()

        completeChore(choreId, loggedInUser.id)
        .then(() => getAllChores())
    }

    return (
        <>
        <h2>My Chores</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>{"Difficulty (1-5)"}</th>
                        <th>{"Frequency (days between completions)"}</th>
                        <th>Complete Chore</th>
                    </tr>
                </thead>
                <tbody>
                    {chores.map((c) => (
                        c.chore.overdue == true 
                        ? <tr key={c.chore.id}>
                            <td>{c.chore.name}</td>                            
                            <td>{c.chore.difficulty}</td>
                            <td>{c.chore.choreFrequencyDays}</td>
                            <td>
                                <Button
                                    color="success"
                                    onClick={(e) => handleCompleteButton(e, c.chore.id)}
                                >
                                Complete
                                </Button>
                            </td>
                        </tr>
                        : <></>
                    ))}
                </tbody>
            </Table>
        </>
    )
}