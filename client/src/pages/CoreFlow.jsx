import { initialEdges, initialNodes } from '../FlowComponents/InitialNodes'
import {Box} from "@chakra-ui/react";
import {
    ReactFlow,
    useEdgesState,
    useNodesState,
    addEdge, Background, BackgroundVariant, useReactFlow, ConnectionLineType, useViewport, Controls, Panel, StepEdge,
} from "@xyflow/react";
import { v4 as uuidv4 } from 'uuid';


import '@xyflow/react/dist/style.css';
import {useCallback, useEffect, useRef, useState} from "react";


import {ProOptions} from "@xyflow/react";
import  {useUndoRedo}  from '../FlowComponents/useUndoRedo';
import {OnNodeDrag} from "@xyflow/react";
import {SelectionDragHandler} from "@xyflow/react";
import {OnNodesDelete} from "@xyflow/react";
import {OnEdgesDelete} from "@xyflow/react";

import {EdgeChange} from "@xyflow/react";
import useCursorStateSynced from '../FlowComponents/useCursorStateSynced';
import useNodesStateSynced from '../FlowComponents/useNodesStateSynced';
import useEdgesStateSynced from '../FlowComponents/useEdgesStateSynced';
import Cursors from '../FlowComponents/Cursor';

import io from 'socket.io-client'; // Import the socket.io client library
const socket = io.connect('http://localhost:3000');


// const initialNodes = [
//     { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//     { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const nodeTypes = {
    'PROJECT-START': Pstart,
    'TASK': Task,
}

const nodeOrigin = [0.5, 0];

const proOptions = { account: 'paid-pro', hideAttribution: false };


export const CoreFlow = () => {

    //Below is for websocket
    const [isPaused, setPause] = useState(false);
    const ws = useRef(null);
    const [receiveMessage, setReceiveMessage] = useState(""); // State to store received message


    const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();

    const reactFlowWrapper = useRef(null);
    const { fitView, addNodes } = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [rfInstance, setRfInstance] = useState(null);
    const { setViewport } = useReactFlow();

    const reactFlow = useReactFlow();
    const { x, y, zoom } = useViewport();

    const [nodeContextMenu, setNodeContextMenu] = useState(null);
    const [menu, setMenu] = useState(null);
    const [projectName, setProjectName] = useState("default");
    const [refreshState, setRefreshState] = useState(false);

    const [cursors, onMouseMove] = useCursorStateSynced();
    const { screenToFlowPosition } = useReactFlow();

    const id = ''+ uuidv4()


    const onNodeContextMenu = useCallback(
        (event, node) => {
            // Prevent native context menu from showing
            event.preventDefault();
            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            const pane = reactFlowWrapper.current.getBoundingClientRect();
            setMenu({
                id: node.id,
                top: event.clientY < pane.height - 200 && event.clientY,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom:
                    event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setMenu],
    );

    // Close the context menu if it's open whenever the window is clicked.
    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);




    const addNode = useCallback((evt) => {
        setMenu(null)
        evt.stopPropagation();
        evt.preventDefault();
        evt.returnValue = false;
        evt.cancelBubble = true;

        takeSnapshot();
        const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });
        const newNode = {
            id: id,
            position,
            data: {
                id: id,
                project_name: projectName,
                task_name: "New Task!",
                task_description: "",
                assigned_to:"",
                state: "",
                effort_estimate:"",
                notes: "",

            },
            type: "TASK",
        }


        if (rfInstance) {
            let myFlow = rfInstance.toObject();

            myFlow.nodes.push(newNode)
            console.log(projectName, JSON.stringify(myFlow));

            try {
                fetch('http://127.0.0.1:5000/project/' + projectName, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(myFlow)
                })
            } catch (error) {
                console.error(error);
            }


            //Below code adds it to the socket
            try {
                //ws.current.send(JSON.stringify(flow));
                socket.emit("send_message", {
                    senderId: "123",     // ID of the sender
                    receiverId: "456", // ID of the receiver
                    message: JSON.stringify(myFlow)   // The actual message content
                });

            } catch (e) {
                console.error(e);
                //ws.current.close();
                //setPause(false);
            } finally {

                console.log("finally");
            }
        }
        console.log(newNode);


        setNodes([ ...nodes, newNode ])

    }, [projectName,takeSnapshot, nodes, setNodes, onNodesChange, rfInstance, setEdges]);

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            console.log("flowKe", JSON.stringify(flow));

            try{
                fetch('http://127.0.0.1:5000/task/save_restore/'+projectName, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(flow)
                })
            } catch (error) {
                console.error(error);
            }
            //localStorage.setItem("flowKe", JSON.stringify(flow));
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            let flow;

            fetch('http://127.0.0.1:5000/task/save_restore/'+projectName)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    flow = data.project_data;
                    console.log(data.project_data)
                    if (flow) {
                        console.log("HERE IS FLOW", flow);
                        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                        setNodes(flow.nodes || []);

                        flow.nodes.map((node,i) => {
                            console.log(node);
                        })
                        setEdges(flow.edges || []);
                        setViewport({ x, y, zoom });
                    }
                })
                .catch(error => console.error(error));
            //const flow = JSON.parse(localStorage.getItem("flowKe"));
        };
        restoreFlow();
    }, [setNodes, setViewport]);

    const onConnect = useCallback(
        (params) =>  {

            const edge = {
                ...params,
                animated: true
            };
            takeSnapshot();
            setEdges((eds) => addEdge(edge, eds))
        },
        [setEdges, takeSnapshot],
    );

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event) => {
        event.preventDefault();

        const type = event.dataTransfer.getData('application/reactflow');
        const position = screenToFlowPosition({
            x: event.clientX - 80,
            y: event.clientY - 20,
        });
        const newNode = {
            id: `${Date.now()}`,
            type,
            position,
            data: { label: `${type}` },
        };

        setNodes((prev) => [...prev, newNode]);

    };
    // We are adding a blink effect on click that we remove after 3000ms again.
    // This should help users to see that a node was clicked by another user.
    const onNodeClick = useCallback(
        (_, clicked) => {
            setNodes((prev) =>
                prev.map((node) =>
                    node.id === clicked.id ? { ...node, className: 'blink' } : node
                )
            );

            window.setTimeout(() => {
                setNodes((prev) =>
                    prev.map((node) =>
                        node.id === clicked.id ? { ...node, className: undefined } : node
                    )
                );
            }, 3000);
        },
        [setNodes]);

    const onLoad = useCallback(() => {
        console.log("loading....");
    })

    useEffect(() => {
        // Listen for incoming messages from the server
        socket.on("receive_message", (data) => {
            console.log(data); // Log the received message data to the console
            let flow2 = JSON.parse(data.message) // Log the received message data to the console
            setReceiveMessage(JSON.parse(data.message)); // Set the received message data to state

            if (flow2) {
                console.log("HERE IS FLOW", flow2);
                const { x = 0, y = 0, zoom = 1 } = flow2.viewport;
                setNodes(flow2.nodes || []);

                flow2.nodes.map((node,i) => {
                    console.log(node);
                })
                setEdges(flow2.edges || []);
                setViewport({ x, y, zoom });
            }
        });
        // Cleanup the effect by removing the event listener when the component unmounts
        return () => {
            socket.off("receive_message");
        };
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    useEffect(() => {
        onRestore("default");
        fitView();
    }, [projectName,setNodes,refreshState]);


    const onNodeDragStart= useCallback(() => {
        // 👇 make dragging a node undoable
        takeSnapshot();
        // 👉 you can place your event handlers here
    }, [takeSnapshot]);

    const onSelectionDragStart = useCallback(() => {
        // 👇 make dragging a selection undoable
        takeSnapshot();
    }, [takeSnapshot]);

    const onNodesDelete = useCallback(() => {
        // 👇 make deleting nodes undoable
        takeSnapshot();
        console.log("Deleting node...")
    }, [takeSnapshot]);

    const onEdgesDelete= useCallback(() => {
        // 👇 make deleting edges undoable
        takeSnapshot();
    }, [takeSnapshot]);


    const onNodeDragStop = useCallback((event)=>{
        console.log("drag stop");



        let node_id=event.srcElement.offsetParent.dataset.id
        console.log(reactFlow.getNode(node_id))

        console.log(reactFlow.getNode())

        if (rfInstance) {
            const flow = rfInstance.toObject();

            try {
                //ws.current.send(JSON.stringify(flow));
                socket.emit("send_message", {
                    senderId: "123",     // ID of the sender
                    receiverId: "456", // ID of the receiver
                    message: JSON.stringify(flow)   // The actual message content
                });

            } catch (e) {
                console.error(e);
                //ws.current.close();
                //setPause(false);
            } finally {

                console.log("finally");
            }
            //localStorage.setItem("flowKe", JSON.stringify(flow));
        }

    }, [rfInstance])



    return (
        <>
            <Box height="90vh" width="160vh" overflowX="auto">
                <ReactFlow
                    onLoad={onLoad}
                    onConnect={onConnect}
                    nodes={nodes}
                    ref={reactFlowWrapper}
                    edges={edges}
                    proOptions={proOptions}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}


                    panOnScroll
                    fitView
                    onInit={setRfInstance}
                    fitViewOptions={{padding: 2}}
                    nodeOrigin={nodeOrigin}
                    onPaneContextMenu={addNode}

                    onNodeContextMenu={onNodeContextMenu}
                    onPaneClick={onPaneClick}

                    selectNodesOnDrag={false}
                    onNodeDragStart={onNodeDragStart}

                    onSelectionDragStart={onSelectionDragStart}
                    onNodesDelete={onNodesDelete}
                    onEdgesDelete={onEdgesDelete}
                    onNodeDragStop={onNodeDragStop}

                    onDragOver={onDragOver}

                    onNodeClick={onNodeClick}
                    onPointerMove={onMouseMove}
                >
                    {menu && <ContextMenu onClick={onPaneClick} {...menu} takeSnapshot={takeSnapshot} />}
                    <Background variant={BackgroundVariant.Lines} gap={10} color={"#f1f1f1"} id={"1"}/>
                    <Background variant={BackgroundVariant.Lines} gap={100} color={"#ccc"} id={"2"}/>

                    <Cursors cursors={cursors} />
                    <Controls orientation={"horizontal"} position={"top-right"}  />

                    <Panel position="top-left">
                        <button disabled={canUndo} onClick={undo}>
                            <span>⤴️</span> undo
                        </button>
                        <button disabled={canRedo} onClick={redo}>
                            redo <span>⤵️</span>
                        </button>
                        <div>
                            Nodes: {reactFlow.getNodes().length} <br/>
                        </div>
                        <button onClick={addNode}>NEW TASK</button>
                        <button onClick={addGoal}>NEW Goal</button>
                        <button onClick={onSave}>Save</button>
                        <button onClick={onRestore}>Restore</button>
                    </Panel>
                </ReactFlow>
            </Box>
        </>
    )
}