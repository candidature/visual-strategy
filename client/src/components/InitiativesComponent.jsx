import React from 'react'
import InitiativeComponent from "./InitiativeComponent.jsx";
import Wrapper from "../assets/wrappers/JobsContainer.js";
import {useAllInitiativesContext} from "../pages/AllInitiatives.jsx";


export default function InitiativesComponent() {
    const data = useAllInitiativesContext()
    console.log(data)
    //
    // const {initiatives} = data
    // console.log(initiatives)
    if(data.length === 0){
        return (<Wrapper>
            <h2>No initiative to display</h2>
        </Wrapper>)
    }


    return (
        <Wrapper>
            <div className="jobs">
                {data.map(initiative => {
                    return <InitiativeComponent key={initiative.id} {...initiative} />
                })}

                {/*{data.data.map((document) => {*/}
                {/*    return document.nodes.map((node) => {*/}
                {/*    if(node.type === "INITIATIVE_NODE" && node.visibility === "company"){*/}
                {/*        //visibility*/}
                {/*        console.log(node.data.name);*/}
                {/*        return <InitiativeComponent key={node.id} nodeData={node.data} />*/}
                {/*    }*/}
                {/*    //console.log(initiative.data)*/}
                {/*})*/}
                {/*})}*/}
            </div>
        </Wrapper>
    )
}
