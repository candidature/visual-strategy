import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react'
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background, Controls, MiniMap,
    Panel,
    ReactFlow, ReactFlowProvider,
    useEdgesState,
    getOutgoers,
    useNodesState, useReactFlow, getIncomers
} from "@xyflow/react";
import customFetch from "../utils/customFetch.js";
import {toast} from "react-toastify";
import {redirect, useLoaderData, useParams} from "react-router-dom";

import '@xyflow/react/dist/style.css';
import {Box, ChakraProvider} from "@chakra-ui/react";
//import Box from '@mui/material/Box';
import { Button } from "@chakra-ui/react"



import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge'
// You can give any name to your edge types
// https://reactflow.dev/docs/api/edges/custom-edges/
const edgeTypes = {
    smart: SmartBezierEdge
}

import {ContextMenu} from "../FlowComponents/RightClickContextMenu.jsx"

import INITIATIVE_NODE from "../FlowComponents/INITIATIVE_NODE.jsx";
import TASK_NODE from "../FlowComponents/TASK_NODE.jsx";
import OBJECTIVE_NODE from "../FlowComponents/OBJECTIVE_NODE.jsx";
import STORY_NODE from "../FlowComponents/STORY_NODE.jsx";






const initialNodes = [];
const initialEdges = [];

export default function CoreFlow5({originDocumentId,historyDocumentId, general_labels}) {

    const { initiative } = useParams();

    const [initiativeName, setInitiativeName] = useState(initiative)
    const [initiativeData, setInitiativeData] = useState({})
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [isHistory, setIsHistory] = useState(false);

    const [debuggingMode, setDebuggingMode] = useState("WARN")
    //TBD
    //there can be 3 savings mode, prevision i.e. save every move. = PRECISION
    //On node add/modify.  <--- make this as default = ACTION
    //Time interval based.
    //This should be from global settings.
    const [savingMode, setSavingMode] = useState("ACTION")

    const proOptions = {
        // passing in the account property will enable hiding the attribution
        // for versions < 10.2 you can use account: 'paid-enterprise'
        // in combination with the account property, hideAttribution: true will remove the attribution
        account: 'paid-pro',
        hideAttribution: true,
      };
      const fitViewOptions = {
        padding: 0,
      };

    const onNodeDragStop = async (event, node) => {
        console.log("drag stop", node);
        if (!isHistory) {
            if(savingMode === "PRECISION") {
                await onSave()
            } else if(debuggingMode==="INFO") {
                toast.info("not saving in non prevision mode")
            }
        } else if(debuggingMode==="INFO") {
            toast.info("Not saving as you are in history")
        }

        //Haha.. this is so bad, but actually this can save position for objective, story and task in a single call.
        //We need to eventually consolidate all of this in a single api... but for now we will use objective api.

        //localhost:5100/api/v1/initiative2/INIT001/objective

        try {
            const putData = await
            
                customFetch.put("/initiative2/"+initiativeName+"/position-size/"+node.id,
                    {"measured" : node.measured, "position": node.position}
                ).catch((error)=>{console.log(error)})
                .then((data)=>{
                    console.log("Saved size & position data " + data)
                })
                .catch((error)=>{
                    console.log("Failed "+ error)
                })
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message);
        }

        // changes.map((node)=> {
        //     if(change.type==="position") {
        //         console.log(change.id)
        //         console.log(change.position)
        //     }
        // })
    }

    const { fitView, addNodes } = useReactFlow();

    const [menu, setMenu] = useState(null);
    const ref = useRef(null);


    //Needed to save/restore the flow
    const [rfInstance, setRfInstance] = useState(null);


    const onEdgesChange = useCallback(
        async (changes) => {
            console.log(changes)
            changes.map((change)=>{
                if(change.type==="remove") {
                    //localhost:5100/api/v1/initiative2/initiative/INIT001/edge
                    console.log("deleteing "+ JSON.stringify(change))
                    customFetch.delete("/initiative2/initiative/"+initiative+"/edge/"+change.id)
                    .then((data)=>{
                        console.log(data)
                    })
                    .catch((error)=>{
                        console.log(error)
                    })
                }
            })
            setEdges((eds) => applyEdgeChanges(changes, eds))
            //await onSave()
            setNewConnection(true)
        },
        [setEdges,rfInstance],
    );
    // console.log("change in the edge")
    // await onSave()
    //const { getEdges, getNodes } = useReactFlow();

    const onConnect = useCallback(
        async (params) =>  {
            console.log(params)
            toast.info("Saving Source: " + params.source + " Target: " + params.target)
            //"xy-edge__xp7JHkYA3Hh-UALQT8Ruk-dd9w6s5dttJ5NxAr1l281"
            //router.route('/initiative/:initiative/edge/').post(authMiddleware,createNewEdge);

            console.log("id would be xy-edge__"+params.source+"-"+params.target)
            //
            const edge = {
                ...params,
                animated: true,
                style:{strokeWidth:5}
            };
            console.log(params);

            setEdges((eds) =>
                addEdge(edge, eds)
            )
            //await onSave()
            customFetch.post("/initiative2/initiative/"+initiative+"/edge/",params).then((data)=>{
                console.log(data)
            })
            .catch((error)=>{
                console.log(error)
            })
            setNewConnection(true)
        },
        [setEdges,rfInstance],
    );


    //For drag save
    const onNodesChange = useCallback(
        async (changes) => {

            //Checking if this is  new node,
            // When node is newly added it has "dimensions as a default type.
            //
            if(changes) {
                if(changes[0]?.type==="dimensions") {
                    //console.log(changes)
                    if ( savingMode==="PRECISION") {
                        await onSave()
                    } else if(debuggingMode==="INFO"){
                        toast.info("Not saving every change in non-prevision mode")
                    }
                console.log(changes)
                }
            }

            // changes.map((change)=> {
            //     if(change.type==="position") {
            //         console.log(change.id)
            //         console.log(change.position)
            //     }
            // })
        

            setNodes((nds) => applyNodeChanges(changes, nds))
            console.log("Node changed")

        }, [setNodes,rfInstance],
    );


    const [newConnection, setNewConnection] = useState(false);
    const nodeTypes = useMemo(
        () => ({
            "INITIATIVE_NODE": (props)=> {
                if(newConnection) {
                    setNewConnection(!newConnection)
                }
                return <INITIATIVE_NODE rfInstance={rfInstance} nodes={nodes} edges={edges}  {...props} />
            },

            "TASK_NODE": (props)=> {
                if(newConnection) {
                    setNewConnection(!newConnection)
                }
                return <TASK_NODE  originDocumentId={originDocumentId} 
                historyDocumentId={historyDocumentId} rfInstance={rfInstance} nodes={nodes} edges={edges}  {...props} />
            },

            "OBJECTIVE_NODE": (props)=> {
                // if(props.data.state) {
                // }
                if(newConnection) {
                    setNewConnection(!newConnection)
                }
                return <OBJECTIVE_NODE  originDocumentId={originDocumentId} 
                        historyDocumentId={historyDocumentId}
                        rfInstance={rfInstance} nodes={nodes} edges={edges} {...props} />

            },


            "STORY_NODE": (props)=> {
                // if(props.data.state) {
                // }
                if(newConnection) {
                    setNewConnection(!newConnection)
                }
                return <STORY_NODE  originDocumentId={originDocumentId} 
                historyDocumentId={historyDocumentId} rfInstance={rfInstance} nodes={nodes} edges={edges} {...props} />

            }
        }),
        [rfInstance, newConnection],
    );


    const onSave = useCallback(async () => {

        if (rfInstance) {


            let myFlow = await rfInstance.toObject();

            //console.log("Saving flow for ..", myFlow.nodes[0].data.name)
            let initiativeName=myFlow.nodes[0].data.name
            //console.log(myFlow);
            if(myFlow) {

                //await customFetch.put('flow-test/'+initiativeName, myFlow)
                myFlow._id = initiativeData.data._id
                //localhost:5100/api/v1/util/common-save
                await customFetch.put('/util/common-save', myFlow)
                    .then((response) => {
                    console.log(response);
                    toast.success('Saved successfully!',{autoClose: 1,});
                }).catch(error => console.error(error));
            }

        } else {
            console.log("Saving... but no rfInstance found.");
        }
    }, [rfInstance]);
    //
    // //https://www.dhiwise.com/post/how-to-implement-context-menu-react-a-comprehensive-guide
    const [menuVisible, setMenuVisible] = useState(false);
    const [contextMenuPositions, setContextMenuPositions] = React.useState({ x: 0, y: 0 });

    const { screenToFlowPosition, setViewport, zoomIn, zoomOut, getNode  } = useReactFlow();



    const handleOnRightClick = useCallback((event)=>{
        console.log("right clicked")
        event.preventDefault();
        if(historyDocumentId==="NONE" || historyDocumentId === originDocumentId) {
            setMenuVisible(true);
        } else {
            //toast.warn("Can not modify the hisotry!")
        }
        
        setContextMenuPositions({ x: event.pageX, y: event.pageY });
    })


    const onNodeContextMenu = useCallback(
        (event) => {
            // Prevent native context menu from showing
            event.preventDefault();
            const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
            setMenu(position);
        },
        [setMenu],
    );


    // Close the context menu if it's open whenever the window is clicked.
    const onPanelClick = useCallback(() => {
        setMenuVisible(false);
        console.log("left clicked")
    }, [setMenuVisible]);


    
    const refresh = async ()=>{
        if(historyDocumentId!=="NONE" && originDocumentId!==historyDocumentId ) {
            //localhost:5100/api/v1/history/documentId/675de5e6147abd4ab5806689
            customFetch.get("/history/documentId/"+ historyDocumentId)
            .then((data)=>{
                //setInitiativeData(data.data)
                setNodes(data.data.nodes || []);
                setEdges(data.data.edges || []);
                setIsHistory(true)
            }).catch((error)=>{
                console.log("Error while fetching data for history " + initiativeName + error)
                toast.error("Error while fetching data for history " + initiativeName + error)
            })
        } else {
            const fetchData =  () => {
                customFetch.get("initiative2/"+initiativeName)
               .then((data)=>{
                if(general_labels) {
                    data.data.nodes.map((node)=>{
                        console.log("General labels on item ", node.data.general_labels)
                        console.log("General labels to be selected ", general_labels)

                        //TBD //Below needs to be modified
                        //split node general label 
                        //split general_labels in the filter.
                        //check if any of the general_labels is on node/objective/task/sp
                        //after that set initiativeData, nodes and edges

                        setInitiativeData(data.data)
                        setNodes(data.data.nodes || []);
                        setEdges(data.data.edges || []);

                    })
                } else {
                    setInitiativeData(data.data)
                    setNodes(data.data.nodes || []);
                    setEdges(data.data.edges || []); 
                }
               
            }).catch((error)=>{
                   console.log("Error while fetching data for " + initiativeName + error)
                   toast.error("Error while fetching data for " + initiativeName + error)
               })
           }
           fetchData()
        }
    }

    useEffect(() => {
        //historyDocumentId
        refresh()
        
        
    }, [initiativeName,historyDocumentId,isHistory ]);
    
    
    return (
        <>
        {isHistory? <>History - Save Disabled!</>:<Button onClick={onSave}>Save</Button>}
    
        {menuVisible && <ContextMenu nodes={nodes}
                                     setMenuVisible={setMenuVisible}
                                     position={contextMenuPositions} initiativeName={initiativeName}/>}
        <Box height="90vh" width="160vh"
             overflowX="auto" onContextMenu={handleOnRightClick}
             onClick={()=>setMenuVisible(false)}>

            <ReactFlow
                nodes={nodes}
                edges={edges}

                selectionOnDrag={true}
                panOnDrag={true}
                onPaneClick={onPanelClick}
                onNodeContextMenu={onNodeContextMenu}

                //onPaneContextMenu={addNode}
                onNodesChange={onNodesChange}

                onEdgesChange={onEdgesChange}

                onConnect={onConnect}

                onInit={setRfInstance}

                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}

                //This needs to be worked on TBD.https://github.com/tisoap/react-flow-smart-edge
                edgeTypes={edgeTypes}
                preventScrolling={false}
                //minZoom={0.001}
                
                minZoom={0.05}
                maxZoom={11}

                defaultViewport={{
                    x: typeof window !== 'undefined' ? window.innerWidth / 6 : 0,
                    y: typeof window !== 'undefined' ? window.innerHeight / 6 : 0,
                    zoom: 0.25,
                  }}
                fitView
                proOptions={proOptions}
                fitViewOptions={fitViewOptions}
            >
            <Controls   orientation="horizontal"/>
                <MiniMap/>
            </ReactFlow>
            </Box>
        </>
    )
}

