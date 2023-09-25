import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../../managers/userProfileManager";
import { ListGroup, ListGroupItem, Table } from "reactstrap";

export default function UserProfileDetails ({ loggedInUser }) {
    const { id } = useParams();
    const [userProfile, setUserProfile] = useState({})
    
    const getThisUser = () => {
        getUserProfile(parseInt(id)).then(setUserProfile)
    }

    useEffect(() => {
        getThisUser()
    }, [])

    if (userProfile === null)
    {
        return <p>No profile found</p>
    }

    return (
        <>
            <h2>User Profile Details</h2>
            <ListGroup>
                <ListGroupItem>
                    Name: {userProfile.firstName} {userProfile.lastName}
                </ListGroupItem>
                <ListGroupItem>
                    Email: {userProfile.identityUser?.email}
                </ListGroupItem>
                <ListGroupItem>
                    Address: {userProfile.address}
                </ListGroupItem>
            </ListGroup>
            <p></p>
            <Table>
                <thead>
                    <tr>
                      <th>Chore</th>
                      <th>Completed On</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userProfile.choreAssignments?.map(c => (
                            <tr key={c.id}>
                                <td>{c.chore.name}</td>
                                <td>{c.chore.choreCompletions[0]?.completedOn.split("T")[0]}</td>
                            </tr>
                            
                        ))
                    }
                </tbody>
            </Table>
        </>
    )
}