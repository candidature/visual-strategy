import styled from 'styled-components';
import {useCallback, useContext} from "react";
import {useReactFlow} from "@xyflow/react";
import {v4 as uuidv4} from "uuid";
import {useLoaderData} from "react-router-dom";
import {DashboardContext} from "../pages/DashboardLayout.jsx";
import {toast} from "react-toastify";

import customFetch from "../utils/customFetch.js";



export const ContextMenu = ({ initiativeName, setMenuVisible, nodes, position,rfInstance }) => {
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

    
    const addTask = useCallback(async (evt) => {
        console.log("adding a task")

        const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });
        

        //localhost:5100/api/v1/initiative2/hurray3/objective/task
        console.log(initiativeName)
        const createdNode = await customFetch.post("/initiative2/"+initiativeName+"/objective/task",{position})
        .then( (data)=>{
            //toast.success("Created node ")
            //console.log(data)
            //console.log(nodes)
            //console.log(data.data.id)
            toast.success("Created node, please modify it!! " + data.data.id)
            setNodes([ ...nodes, data.data ])
        })
        .catch((error)=>{
            toast.error("Failed to create node " + error)
            console.log(error)
        })
        setMenuVisible(false);
    }, []);


    const addStory = useCallback(async (evt) => {
        console.log("adding a Story")

        const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });
        
        const createdNode = await customFetch.post("/initiative2/"+initiativeName+"/objective/story",{position})
        .then( (data)=>{
            //toast.success("Created node ")
            //console.log(data)
            //console.log(nodes)
            //console.log(data.data.id)
            toast.success("Created story node, please modify it!! " + data.data.id)
            setNodes([ ...nodes, data.data ])
        })
        .catch((error)=>{
            toast.error("Failed to create objective node " + error)
            console.log(error)
        })

        setMenuVisible(false);

    }, []);

    const addObjective = useCallback(async (evt) => {
        const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });
        console.log(initiativeName)

        const createdNode = await customFetch.post("/initiative2/"+initiativeName+"/objective",{position})
        .then( (data)=>{
            //toast.success("Created node ")
            //console.log(data)
            //console.log(nodes)
            //console.log(data.data.id)
            toast.success("Created objective node, please modify it!! " + data.data.id)
            setNodes([ ...nodes, data.data ])
        })
        .catch((error)=>{
            toast.error("Failed to create objective node " + error)
            console.log(error)
        })
        setMenuVisible(false);
    }, []);

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
                    <div className='menu'>
                        <button onClick={addObjective}>Add New Goal</button>
                    </div>
                    <hr className="dotted"/>

                    <div className='menu'>
                        <button onClick={addStory}>Add New Story</button>
                    </div>
                    <hr className="dotted"/>
                    <div className='menu'>
                        <button onClick={addTask}>Add New Task</button>
                    </div>

                </div>
            </menu>
        </StyledContextMenu>
    );
};