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


const initialNodes = [];
const initialEdges = [];

export default function CoreFlow2({initiativeData, toBeZoomedNodeId}) {


    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodeDragStop = async (event, node) => {
        console.log("drag stop", node);
        await onSave()
    }

    const { fitView, addNodes } = useReactFlow();

    const [menu, setMenu] = useState(null);
    const ref = useRef(null);


    //Needed to save/restore the flow
    const [rfInstance, setRfInstance] = useState(null);


    const onEdgesChange = useCallback(
        async (changes) => {
            await setEdges((eds) => applyEdgeChanges(changes, eds))
            console.log(changes)
            await onSave()
            setNewConnection(true)
        },
        [setEdges,rfInstance],
    );
    // console.log("change in the edge")
    // await onSave()
    //const { getEdges, getNodes } = useReactFlow();

    const onConnect = useCallback(
        async (params) =>  {

            //
            const edge = {
                ...params,
                animated: true,
                style:{strokeWidth:5}
            };
            console.log(params);

            await setEdges((eds) =>
                addEdge(edge, eds)
            )
            await onSave()
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
                    console.log(changes)
                    await onSave()
                }
            }
            await setNodes((nds) => applyNodeChanges(changes, nds))
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
                return <TASK_NODE  rfInstance={rfInstance} nodes={nodes} edges={edges}  {...props} />
            },

            "OBJECTIVE_NODE": (props)=> {
                // if(props.data.state) {
                // }
                if(newConnection) {
                    setNewConnection(!newConnection)
                }
                return <OBJECTIVE_NODE  rfInstance={rfInstance} nodes={nodes} edges={edges} {...props} />

            }
        }),
        [rfInstance, newConnection],
    );

    // const nodeTypes = {
    //     "INITIATIVE_NODE" :(props)=> <INITIATIVE_NODE rfInstance={rfInstance} {...props} />,
    //     //"INITIATIVE_NODE": INITIATIVE_NODE,
    //     "TASK_NODE": TASK_NODE,
    //     "OBJECTIVE_NODE" : OBJECTIVE_NODE,
    //     //"TASK_NODE": TASK_NODE,
    //     //textUpdater: NewNode ,
    // };

    const onSave = useCallback(async () => {

        if (rfInstance) {

            console.log(initiativeData.data._id)

            let myFlow = await rfInstance.toObject();

            console.log("Saving flow for ..", myFlow.nodes[0].data.name)
            let initiativeName=myFlow.nodes[0].data.name
            console.log(myFlow);
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
        setMenuVisible(true);
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



    useEffect(() => {
        //console.log(initiativeData)
        if (initiativeData) {
            //const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setNodes(initiativeData.data.nodes || []);
            setEdges(initiativeData.data.edges || []);
            //console.log(toBeZoomedNodeId)
            setNewConnection(!newConnection)

            if(toBeZoomedNodeId) {
                const n = getNode(toBeZoomedNodeId);
                console.log(toBeZoomedNodeId);
                console.log(n)
                fitView({nodes: [n], duration: 7000});
            }
        }
    }, [initiativeData,toBeZoomedNodeId,setViewport]);


    return (
        <>
        <Button onClick={onSave}>Save</Button>

        {menuVisible && <ContextMenu nodes={nodes}
                                     setMenuVisible={setMenuVisible} position={contextMenuPositions} />}
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

            >
            <Controls   orientation="horizontal"/>
                <MiniMap/>
            </ReactFlow>
            </Box>
        </>
    )
}