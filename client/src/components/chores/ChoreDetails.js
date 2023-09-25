import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListGroup, ListGroupItem, Table } from "reactstrap";
import { getChore } from "../../managers/choreManager";

export default function ChoreDetails ({ loggedInUser }) {
    const { id } = useParams();
    const [chore, setChore] = useState({})
    
    const getThisUser = () => {
        getChore(parseInt(id)).then(setChore)
    }

    useEffect(() => {
        getThisUser()
    }, [])

    if (chore === null)
    {
        return <p>No chore found</p>
    }

    return (
        <>
            <h2>Chore Details</h2>
            <ListGroup>
                <ListGroupItem>
                    Name: {chore.name}
                </ListGroupItem>
                <ListGroupItem>
                    Difficulty: {chore.difficulty}
                </ListGroupItem>
                <ListGroupItem>
                    Frequency of Days: {chore.frequency}
                </ListGroupItem>
            </ListGroup>
            <p></p>
            <Table>
                <thead>
                    <tr>
                      <th>Assigned To</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        chore?.choreAssignments?.length > 0
                        ? chore.choreAssignments?.map(c => (
                            <tr key={c.id}>
                                <td>{c.userProfile?.firstName} {c.userProfile?.lastName}</td>
                            </tr>
                            
                        ))
                        : <tr><td>No one assigned</td></tr>
                    }
                </tbody>
            </Table>
            <ListGroup>
                <ListGroupItem>
                    Most Recent Completion: {chore?.choreCompletions?.length > 0
                    ? chore.choreCompletions[0].completedOn.split("T")[0] 
                    : "Never completed"
                    }
                </ListGroupItem>
            </ListGroup>
        </>
    )
}