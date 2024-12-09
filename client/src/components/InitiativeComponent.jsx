import React, {useEffect} from 'react'
import Wrapper from '../assets/wrappers/Job';

import {FaLocationArrow, FaBriefcase, FaCalendarAlt, FaBusinessTime, FaTimes, FaEye} from 'react-icons/fa';
import { Link, Form } from 'react-router-dom';
import InitiativeInfoComponent from './InitiativeInfoComponent';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

day.extend(advancedFormat);

export default function InitiativeComponent(nodeData) {


    const date = day(nodeData.createdAt).format('MMM Do, YYYY');
    console.log("========================");
    //console.log(_id)
    console.log(nodeData)


    return (
        <Wrapper>
            <header>

                <div className="main-icon">{nodeData.name}</div>
                <div className="info">
                    <h5>{nodeData.name}</h5>
                </div>
            </header>

            <div className="content">
                <div className="content-center">
                    <InitiativeInfoComponent icon={<FaBriefcase/>} text={nodeData.name}/>
                    <InitiativeInfoComponent icon={<FaBusinessTime/>} text={nodeData.description}/>
                    {/*<InitiativeInfoComponent icon={<FaTimes/>} text={nodeData.nodeData.kpis}/>*/}
                    <InitiativeInfoComponent icon={<FaEye/>} text={nodeData.labels}/>
                    <InitiativeInfoComponent icon={<FaCalendarAlt/>} text={date}/>
                    <div className={`status ${nodeData.state}`}>{nodeData.state}</div>
                </div>
                <footer className="actions">
                    <Link className="btn edit-btn" to={`/dashboard/${nodeData.name}`}>View Dashboard</Link>

                    <Link className="btn edit-btn" to={""}>Edit</Link>
                    <Form>
                        <button type="submit" className="btn delete-btn">Save</button>
                    </Form>
                </footer>
            </div>
        </Wrapper>
    )
}
