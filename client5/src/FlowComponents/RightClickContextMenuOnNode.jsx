import styled from 'styled-components';
import {useCallback} from "react";
import {useReactFlow} from "@xyflow/react";
import {v4 as uuidv4} from "uuid";



export const ContextMenu = ({ setMenuVisible, nodes, position, rfInstance }) => {


    const StyledContextMenu = styled.div`
      position: absolute;
      top: ${props => position.y}px;
      left: ${props => position.x}px;
      z-index: 1000;
      background-color: #fff;
      border: 1px solid #ccc;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      // Additional styles...
    `;

    const { getNodes, setNodes, addNodes, setEdges, screenToFlowPosition} = useReactFlow();


    const addTask = useCallback((evt) => {
        console.log("adding a task")

        const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

        const newNode = {
            id: ''+ uuidv4(),
            position,
            type: "TASK_NODE",

            data: {
                name: "New Task!",
                description: "",
                assigned_to: "",
                state: "",
            },
        }
        console.log(newNode)
        setNodes([ ...nodes, newNode ])
        setMenuVisible(false);

    }, [ setNodes]);


    const addInitiative = useCallback((evt) => {
        console.log("adding a initiative")

        const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

        const newNode = {
            id: ''+ uuidv4(),
            position,
            type: "INITIATIVE_NODE",

            data: {
                name: "Great You have a new Initiative!",
                description: "",
                visibility: "company",
                assigned_to: "",
                state: "",
                labels: [""],
                kpis:[
                    {
                        'name': '',
                        'description': '',
                        'ref': ''
                    }
                ]
            },

        }
        console.log(newNode)
        setNodes([ ...nodes, newNode ])
        setMenuVisible(false);

    }, [ setNodes]);

    const addObjective = useCallback((evt) => {
        console.log("adding an Objective")

        const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

        const newNode = {
            id: ''+ uuidv4(),
            position,
            type: "OBJECTIVE_NODE",

            data: {
                name: "Great You have a new Goal!",
                description: "",
                assigned_to: "",
                state: "",
                labels: [""],
                kpis:[
                    {
                        'name': '',
                        'description': '',
                        'ref': ''
                    }
                ]
            },

        }
        console.log(newNode)
        setNodes([ ...nodes, newNode ])
        setMenuVisible(false);

    }, [ setNodes]);

    return (

        <StyledContextMenu position={position}>
            <menu>
                <div>
                    <div className="menu-item"
                         sx={{
                             width: 150,
                             height: 150,
                             bgcolor: 'primary.main',
                             '&:hover': {
                                 bgcolor: 'primary.dark',
                             },
                         }}
                    >
                        {/*<button onClick={addInitiative}>Add New Initiative</button>*/}
                    </div>
                    <div>
                        <button onClick={addObjective}>Add New Goal</button>
                    </div>
                    <div>
                        <button onClick={addTask}>Add New Task</button>
                    </div>
                </div>
            </menu>
        </StyledContextMenu>
    );
};