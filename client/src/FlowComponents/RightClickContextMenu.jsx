import styled from 'styled-components';
import {useCallback, useContext} from "react";
import {useReactFlow} from "@xyflow/react";
import {v4 as uuidv4} from "uuid";
import {useLoaderData} from "react-router-dom";
import {DashboardContext} from "../pages/DashboardLayout.jsx";




export const ContextMenu = ({ setMenuVisible, nodes, position,rfInstance }) => {
    //Get logged in user info
    const {user} = useContext(DashboardContext)
    console.log(user)

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

    const { setNodes, screenToFlowPosition} = useReactFlow();

    const addTask = useCallback((evt) => {
        console.log("adding a task")

        const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });
        let nodeid = ''+ uuidv4()
        const newNode = {
            id: nodeid,
            position,
            type: "TASK_NODE",
            deletable: false,

            data: {
                name: "New Task!",
                id: nodeid,
                description: [],
                assigned_to: "",
                state: "",
                effort_estimation: "",
                labels: [""],
                created_by: user._id
            },
        }
        console.log(newNode)
        setNodes([ ...nodes, newNode ])
        setMenuVisible(false);
    }, [ setNodes]);


    const addInitiative = useCallback((evt) => {
        console.log("adding a initiative")

        const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });
        let nodeid = ''+ uuidv4()
        const newNode = {
            id: nodeid,
            position,
            type: "INITIATIVE_NODE",
            deletable: false,
            data: {
                name: "Great You have a new Initiative!",
                id: nodeid,
                description: "",
                visibility: "company",
                assigned_to: user._id,
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
        let nodeid = ''+ uuidv4()
        const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });


        const newNode = {
            id: nodeid,
            position,
            type: "OBJECTIVE_NODE",
            deletable: false,
            data: {
                name: "Great You have a new Goal!",
                id: nodeid,
                description: "",
                assigned_to: user.id,
                effort_estimation: "",
                state: "",
                labels: [""],
                created_by: user.id,

                kpis:[
                    {
                        'name': '',
                        'description': '',
                        'ref': ''
                    }
                ]
            },

        }
        console.log("Creating new nodes")
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