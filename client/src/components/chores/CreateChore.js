import { useState } from "react"
import { createNewChore } from "../../managers/choreManager"
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function CreateChore () {
    const [name, setName] = useState("")
    const [difficulty, setDifficulty] = useState(0)
    const [frequency, setFrequency] = useState(0)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        const newChore = {
            name: name,
            difficulty: difficulty,
            choreFrequencyDays: frequency
        }

        createNewChore(newChore)
        .then(() => navigate("/chores"))
    }

    return (
        <>
            <h2>Create a new Chore</h2>
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