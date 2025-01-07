import React, {useEffect,useRef} from 'react'
import Wrapper from '../assets/wrappers/Job';

import {FaLocationArrow, FaBriefcase, FaCalendarAlt, FaBusinessTime, FaTimes, FaEye} from 'react-icons/fa';
import { Link, Form } from 'react-router-dom';
import InitiativeInfoComponent from './InitiativeInfoComponent';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useState } from 'react';
import customFetch from "../utils/customFetch.js";

import { PieChart } from '@mui/x-charts/PieChart';


day.extend(advancedFormat);

export default function InitiativeComponent(nodeData) {

    const mounted = useRef(0);
    const [objectives, setObjectives] = useState(0);
    const [completedObjectives, setCompletedObjectives] = useState(0);
    const [tasks, setTasks] = useState(0);
    const [tasksCompleted, setTasksCompleted] = useState(0);

    const [user, setUser] = useState("");


    const date = day(nodeData.createdAt).format('MMM Do, YYYY');
    

    useEffect(()=>{
        customFetch.get("/util/user-info/"+nodeData.nodes[0].created_by)
        .then(({data})=> {
            setUser(data)
        })
        
        
        if (mounted.current === 0) {
            let objectivesCounter = 0
            let completedObjectiveCounter=0;
            let tasksCounter =0;
            let completedTasksCounter = 0;

             nodeData.nodes.map((node)=>{ 
                if(node.type==="OBJECTIVE_NODE") {
                    objectivesCounter = objectivesCounter+1
                }
                if(node.type==="OBJECTIVE_NODE" && node.data.state==="COMPLETED") {
                    completedObjectiveCounter = completedObjectiveCounter+1
                }
                    
            //         setObjectives(tmp+1)
            });
            setObjectives(objectivesCounter)
            setCompletedObjectives(completedObjectiveCounter)
        }
    },[setUser])
    
    return (
        <Wrapper>
            <header>

                <div className="main-icon">{nodeData.nodes[0].data.name}</div>
                <div className="info">
                    <h5>{nodeData.nodes[0].data.name}   {completedObjectives}/{objectives}</h5> 
                    <InitiativeInfoComponent icon={<FaBriefcase/>} text={nodeData.nodes[0].data.description}/>
                    
                </div>
                
            </header>

            
            <div className="content">
                <div className="content-center">
                    
                    <InitiativeInfoComponent icon={<FaBusinessTime/>} text={user.name||nodeData.nodes[0].created_by} tooltip={user.email}/>
                    <InitiativeInfoComponent icon={<FaTimes/>} text={`assigned to: ${nodeData.nodes[0].data.assigned_to}`}/>
                    <InitiativeInfoComponent icon={<FaEye/>} text={`General Labels: ${nodeData.nodes[0].data.general_labels}`}/>
                    <InitiativeInfoComponent icon={<FaCalendarAlt/>} text={`Access Labels: ${nodeData.nodes[0].data.access_labels}`}/>
                    {/* State: <div className={`status ${nodeData.state}`}>{nodeData.nodes[0].data.state}</div> */}
                    <div>{`State: ${nodeData.nodes[0].data.state}`}</div>

                    {/* <PieChart
                        series={[
                            {
                            data: [
                                { id: 0, value: 10, label: 'series A' },
                                { id: 1, value: 15, label: 'series B' },
                                { id: 2, value: 20, label: 'series C' },
                            ],
                            },
                        ]}
                        width={220}
                        height={100}
                    /> */}
                </div>
                <footer className="actions">
                    <Link className="btn edit-btn" to={`/dashboard/${nodeData.nodes[0].data.name}?originDocumentId=${nodeData._id}&historyDocumentId=NONE`}>View Dashboard</Link>

                    <Link className="btn edit-btn" to={""}>Edit</Link>
                    <Form>
                        <button type="submit" className="btn delete-btn">Save</button>
                    </Form>
                </footer>
            </div>
        </Wrapper>
    )
}
