import React from 'react'
import Wrapper from "../assets/wrappers/JobsContainer.js";
import {useAllInitiativesContext} from "../pages/AllInitiatives.jsx";
import InitiativeComponent from "./InitiativeComponent"

export default function InitiativeSearchResultComponent() {
    const {data} = useAllInitiativesContext()
    const {initiatives} = data

    if(initiatives.length === 0){
        return (
            <Wrapper>
                <h2>No initiative to display</h2>
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            <div className="jobs">
                {initiatives.map(initiative => {
                        return <InitiativeComponent key={initiative._id} {...initiative} />
                    }
                )}

            </div>
        </Wrapper>
    )

}
