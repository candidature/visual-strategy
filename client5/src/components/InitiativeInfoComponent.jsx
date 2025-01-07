import React from 'react'
import Wrapper from "../assets/wrappers/JobInfo.js";
import { Tooltip } from '@mui/material';


export default function InitiativeInfoComponent({icon, text, tooltip}) {
    return (
        <Wrapper>
            <span className="job-icon">
                {icon}
            </span>

            <span className="job-text">
                <Tooltip title={tooltip}>
                    {text}
                </Tooltip>
            </span>

        </Wrapper>
    )
}
