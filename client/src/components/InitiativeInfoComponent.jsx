import React from 'react'
import Wrapper from "../assets/wrappers/JobInfo.js";


export default function InitiativeInfoComponent({icon, text}) {
    return (
        <Wrapper>
            <span className="job-icon">
                {icon}
            </span>

            <span className="job-text">
                {text}
            </span>

        </Wrapper>
    )
}
