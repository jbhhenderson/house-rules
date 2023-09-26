import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label, ListGroup, ListGroupItem, Table } from "reactstrap";
import { assignChore, getChore, unassignChore, updateChore } from "../../managers/choreManager";
import { getUserProfiles } from "../../managers/userProfileManager";

export default function ChoreDetails ({ loggedInUser }) {
    const { id } = useParams();
    const [chore, setChore] = useState({})
    const [users, setUsers] = useState([])
    const [name, setName] = useState("")
    const [difficulty, setDifficulty] = useState(0)
    const [frequency, setFrequency] = useState(0)
    const navigate = useNavigate()
    
    const getThisUser = () => {
        getChore(parseInt(id)).then(setChore)
    }

    const handleUserCheckbox = (e, user) => {
        const { checked } = e.target
        const promise = checked
          ? assignChore(chore.id, user.id)
          : unassignChore(chore.id, user.id)
        
        promise.then(() => getThisUser())
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const newChore = {
            name: name ? name : chore.name,
            difficulty: difficulty ? difficulty : chore.difficulty,
            choreFrequencyDays: frequency ? frequency : chore.choreFrequencyDays
        }

        updateChore(newChore)
        .then(() => navigate("/chores")) 
    }

    useEffect(() => {
        getThisUser()
        getUserProfiles().then(setUsers)
    }, [])

    if (chore === null)
    {
        return <p>No chore found</p>
    }

    return (
        <>
            <h2>Current Chore Details</h2>
            <ListGroup>
                <ListGroupItem>
                    Current Name: {chore.name}
                </ListGroupItem>
                <ListGroupItem>
                    Current Difficulty: {chore.difficulty}
                </ListGroupItem>
                <ListGroupItem>
                    Current Frequency of Days: {chore.choreFrequencyDays}
                </ListGroupItem>
            </ListGroup>
            <p></p>
            <h2>Assign Chore</h2>
            {
                users.map((u) => (
                    <>
                        <label htmlFor="users">{u.firstName} {u.lastName}</label>
                        <input
                            type="checkbox"
                            name="users"
                            checked={!!chore?.choreAssignments?.find((c) => c.userProfileId === u.id)}
                            onChange={(e) => handleUserCheckbox(e, u)}
                        ></input>
                    </>
                ))
            }
            <p></p>
            <ListGroup>
                <ListGroupItem>
                    Most Recent Completion: {chore?.choreCompletions?.length > 0
                    ? chore.choreCompletions[chore.choreCompletions.length - 1].completedOn.split("T")[0] 
                    // ? new Date(Math.max.apply(null, chore.choreCompletions.map((cc) => { return new Date(cc.completedOn)})))
                    : "Never completed"
                    }
                </ListGroupItem>
            </ListGroup>
            <p></p>
            <h2>Update Chore Details</h2>
            <Form>
                <FormGroup>
                    <Label>Name</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Difficulty</Label>
                    <Input
                        type="select"
                        value={difficulty}
                        onChange={(e) => {
                            setDifficulty(parseInt(e.target.value))
                        }}
                    >
                        <option value={0}>Choose a Difficulty</option>                        
                        <option value={1}>1</option>                        
                        <option value={2}>2</option>                        
                        <option value={3}>3</option>                        
                        <option value={4}>4</option>                        
                        <option value={5}>5</option>                        
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label>Frequency</Label>
                    <Input
                        type="select"
                        value={frequency}
                        onChange={(e) => {
                            setFrequency(parseInt(e.target.value))
                        }}
                    >
                        <option value={0}>Choose a Frequency</option>                        
                        <option value={1}>Every Day</option>                        
                        <option value={3}>Every 3 Days</option>                        
                        <option value={7}>Weekly</option>                        
                        <option value={14}>Bi-Weekly</option>                        
                        <option value={30}>Monthly</option>                        
                    </Input>
                </FormGroup>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </Form>
        </>
    )
}