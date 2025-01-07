import React, {useEffect, useState} from 'react'
import {ReactFlow, ReactFlowProvider} from "@xyflow/react";
import CoreFlow2 from "./CoreFlow2.jsx";
import {ChakraProvider} from "@chakra-ui/react";
import {useLoaderData, useNavigate, useParams, useSearchParams} from "react-router-dom";
import customFetch from "../utils/customFetch.js";
import {toast} from "react-toastify";
import {json} from "@remix-run/router";

export const loader = async ({params})=> {
    // try {
    //     //TBD: below 2 to be done in parallel as descibed here: https://stackoverflow.com/questions/74719956/can-i-handle-multiple-loaders-for-a-single-url-in-remix
    //
    //     const {data} = await customFetch.get("/flow-test/"+params.initiative);
    //     const {allInitiativeData} = await customFetch.get("/flow-test");
    //     return json({data,allInitiativeData});
    // } catch (error) {
    //     toast.error(error?.response?.data?.message);
    //     return error;
    // }

    try {
        const [data, allInitiativeData] = await Promise.all([
            await customFetch.get("/flow-test/"+params.initiative),
            await customFetch.get("/flow-test")
        ]);
        return json({ data, allInitiativeData });
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return error;
    }
}


export default function SelectInitiative() {
    const { initiative } = useParams();
    //console.log(initiative);

    const [searchParams, setSearchParams] = useSearchParams();

    const zoomNodeName = searchParams.get("zoomNodeName");
    //console.log("Matching...")
    //console.log(zoomNodeName)


    const navigate = useNavigate()
    const [initiativesFromDB, setInitiativesFromDB] = useState([initiative]);
    const [toBeZoomedNode, setToBeZoomedNode] = useState()


    const {data,allInitiativeData}  = useLoaderData()

    let toBeZoomedNodeId = ""

    useEffect(() => {
        let initialInitiatives = []

        allInitiativeData.data.data.map((d)=>{
            d.nodes.map((n)=>{
                if(n.type==="INITIATIVE_NODE"){
                    initialInitiatives.push(n.data.name);
                    //console.log(n.data.name);
                }
                //console.log(n.data.name , zoomNodeName)
                if(n.data.name===zoomNodeName) {
                    toBeZoomedNodeId = n.id
                    //console.log("MATCH FOUND")
                }
            })
        })
        setInitiativesFromDB(initialInitiatives);

        setToBeZoomedNode(toBeZoomedNodeId);
        //console.log(toBeZoomedNodeId)

        //console.log(initiativesFromDB);
    },[setToBeZoomedNode])


    function handleOnChange(event){
        //console.log(event.target.value);
        navigate(`/dashboard/${event.target.value}`);
    }

    //const [initiativeData, setInitiativeData] = useState(null);
    // useEffect( () => {
    //     // declare the data fetching function
    //     const fetchData = async () => {
    //         if(initiative) {
    //             try {
    //                 const {data} = await customFetch.get("/flow-test/"+initiative)
    //                 setInitiativeData(data)
    //             } catch (error) {
    //                 toast.error(error?.response?.data?.message);
    //             }
    //         }
    //     }
    //     // call the function
    //     fetchData().catch((error)=>{
    //         console.log(error)
    //         toast.error(error?.response?.data?.message);
    //     });
    // }, []);
    //
    return (
        <ChakraProvider>
            <div className="Row">
                <div className="Column">
                    <select onChange={handleOnChange}>
                        {initiativesFromDB.map((d,key)=> <option key={key} value={d}>{d}</option>)}
                    </select>
                </div>

                <div className="Column">
                    <input type="checkbox" id="to-do" name="to-do" value="to-do"/>
                    <label htmlFor="to-do"> To Do's</label><br/>
                </div>

                <div className="Column">
                    <input type="checkbox" id="in-progress" name="in-progress" value="in-progress"/>
                    <label htmlFor="in-progress"> In Progress</label><br/>
                </div>


                <div className="Column">
                    <input type="checkbox" id="in-review" name="in-review" value="in-review"/>
                    <label htmlFor="in-review"> In Review</label><br/>
                </div>

                <div className="Column">
                    <input type="checkbox" id="completed" name="completed" value="completed"/>
                    <label htmlFor="completed"> Completed</label><br/>
                </div>

                <div className="Column">
                    <input type="checkbox" id="stopped" name="stopped" value="stopped"/>
                    <label htmlFor="stopped"> Stopped/Archived</label><br/>
                </div>

            </div>
                <ReactFlowProvider>
                    <CoreFlow2 initiativeData={data.data} initiativeName={initiative}
                               toBeZoomedNodeId={toBeZoomedNode}
                               />
                </ReactFlowProvider>
        </ChakraProvider>
    )
}
SelectInitiative.loader = loader;