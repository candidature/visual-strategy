import React, {memo, useCallback, useEffect, useState} from "react";
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import {Handle, Position, NodeResizer, useReactFlow, getOutgoers, NodeResizeControl} from "@xyflow/react";

import {
    Drawer, EditableInput,
    DrawerBody,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerContent, DrawerFooter,
    DrawerHeader,
    useDisclosure, FormControl, FormLabel, Input
} from "@chakra-ui/react";
import {Button} from "@mui/base";
import customFetch from "../utils/customFetch.js";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export default function TASK_NODE({originDocumentId, historyDocumentId, data, setNeedRefresh, rfInstance,nodes, edges}) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [nodeFormData, setNodeFormData] = useState(data);

    const [nodeState, setNodeState] = useState(data.state);
    const [effortEstimation, setEffortEstimation] = useState(data.effort_estimation);

    const [size, setSize] = useState(0);

    const [showCompleted, setShowCompleted] = useState(true);

    const [showToDo, setShowToDo] = useState(true);

    const [showInProgress, setShowInProgress] = useState(true);

    const [showInReview, setShowInReview] = useState(true);

    const [flagNode, setFlagNode] = useState(false);

    const [stats, setStats] = useState({
        "remaining": Number
    });

    const {getNode, getInternalNode} = useReactFlow()
    const navigate = useNavigate()

    const [stateStyle, setStateStyle] = useState({
        primary: {
            main: '#7295ed',
            dark: '#4568ed',
        },
    });

    let initiativeName
    if(rfInstance) {
        let myFlow = rfInstance.toObject();
        initiativeName = myFlow.nodes[0].data.name
    }

    const getStats = async (id) => {
        let node = getNode(id)

        const outgoers = getOutgoers( node, nodes, edges );
        //console.log("Outgoing stats for ", outgoers)

        let hasDepNotCompleted=false;
        let filteredOutgoers = outgoers.filter((n)=>{
            if(n.data.state!=="COMPLETED"){
                hasDepNotCompleted=true;
            }
            if(node.data.state === "COMPLETED" && hasDepNotCompleted) {
                setFlagNode(true);
            } else {
                setFlagNode(false);
            }
            setStats({"remaining" : n.data.state !== "COMPLETED"})
            return n.data.state !== "COMPLETED";
        })


        //console.log(filteredOutgoers)

        setSize(filteredOutgoers.length)
    }

    useEffect(() => {

        if(historyDocumentId==="NONE" || historyDocumentId === originDocumentId) {
            customFetch.get("/initiative2/"+initiativeName+"/objective/task/"+data.id)
            .then( ({data}) => {
                setNodeFormData(data.data);
            })
            .catch(error => console.error(error));
        } else {
            toast.warn("Can not modify the hisotry!")
            return;
        }

        if(showCompleted && nodeState ==="COMPLETED") {
            //node.hidden=false
            setStateStyle({
                primary: {
                    main: '#169509',
                    dark: '#0b9f66',
                }
            })
        } else if(showInProgress && nodeState ==="IN_PROGRESS") {
            //node.hidden=false
            setStateStyle({
                primary: {
                    main: '#47ff33',
                    dark: '#45edad',
                }
            })
        } else if(showInReview && nodeState ==="IN_REVIEW") {
            //node.hidden=false
            setStateStyle({
                primary: {
                    main: '#f1ebeb',
                    dark: '#e1acac',
                }
            })
        } else if(showToDo && nodeState ==="TODO") {
            //node.hidden=false
            setStateStyle({
                primary: {
                    main: '#dde87c',
                    dark: '#c1cf3f',
                }
            })
        }
        else {
            setStateStyle({
                primary: {
                    main: '#7295ed',
                    dark: '#4568ed',
                }
            })
        }
        getStats(data.id)

    },[showCompleted,nodeState])

    const formSubmit = async (event) => {
        console.log("START");
        const formData = new FormData(event.currentTarget);
        event.preventDefault();
        console.log(formData)

        console.log(JSON.stringify(Object.fromEntries(formData)))

        try {
            const putData = await
                customFetch.put("/initiative2/"+initiativeName+"/objective/task",
                Object.fromEntries(formData)).catch((error)=>{console.log(error)})
                .then((data)=>{
                    console.log("Saved " + data)
                })
                .catch((error)=>{
                    console.log("Failed "+ error)
                })

            setNodeFormData(Object.fromEntries(formData));

            console.log(Object.fromEntries(formData).state)

            setNodeState(Object.fromEntries(formData)?.state)
            setEffortEstimation(parseInt(Object.fromEntries(formData).effort_estimation))

            getStats(data.id)
            //console.log(nodeFormData)
            toast.success('Story updated successfully!');
            //return redirect('/dashboard/');
            onClose();
            setNeedRefresh(true)
            //?originDocumentId=675de4023cef1e7fdb0232fd&historyDocumentId=NONE
            //navigate("/dashboard/"+initiativeName+"?originDocumentId="+ originDocumentId+ "&historyDocumentId="+historyDocumentId);
            //return redirect('/dashboard/' + initiativeName);
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message);
        }
    };



    const setOnOpenModal =useCallback (async (event) => {
        event.preventDefault();
        //console.log("opening modal", initiativeName+"/"+data.id)

        if(historyDocumentId==="NONE" || historyDocumentId === originDocumentId) {
            await customFetch.get("/initiative2/"+initiativeName+"/objective/task/"+data.id)
            .then( ({data}) => {
                setNodeFormData(data.data);
                onOpen()
            })
            .catch(error => console.error(error));
        } else {
            toast.warn("Can not modify the hisotry!")
            return;
        }

        

    },[onOpen,nodeFormData])

    const controlStyle = {
        background: 'transparent',
        border: 'none',
    };

    if(nodeState==="COMPLETED" && !showCompleted) {
        let node = getInternalNode(data.id)
        node.hidden=true
        return (
            <></>
        )
    }

    return (
        <div onClick={setOnOpenModal}>

            <NodeResizeControl style={controlStyle} minWidth={200} minHeight={100} maxHeight={175} maxWidth={275} onOpen={setOnOpenModal}>
                <ResizeIcon/>
            </NodeResizeControl>
            <ThemeProvider
                theme={{
                    palette: {
                        primary: stateStyle.primary,
                    },
                }}
            >
                <div className="tooltip">
                    {nodeFormData?.description ?
                        <span className="tooltiptext">
                            {nodeFormData?.description}
                        </span>
                        : ''
                    }

                    <div >
                        <Box
                            sx={{
                                width: 200,
                                height: 100,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                        >
                            <div className={flagNode ? "textCircle blink_me" : "textCircle"}
                                 style={{padding: -2}}><h5>{`${nodeFormData?.name}`}</h5></div>
                            <div style={{padding: 7}}>{size} tasks</div>
                            <div>Effort: {effortEstimation}</div>

                        </Box>


                    </div>
                    <Handle type={"source"} position={Position.Right}
                            style={{

                                background: 'blue', color: 'darkblue', width: 14,
                                height: 14,
                            }}
                    />
                    <Handle type={"target"} position={Position.Left}
                            style={{
                                background: 'blue', color: 'darkblue', width: 14,
                                height: 14,
                            }}
                    />
                </div>

            </ThemeProvider>




            <Drawer size={"md"} isOpen={isOpen} onClose={() => onClose()}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerHeader></DrawerHeader>
                    <DrawerCloseButton/>
                    <DrawerBody>

                        <form method="post" onSubmit={formSubmit}>
                            <FormControl>

                            <Input type="hidden" id="id" name="id" value={nodeFormData?.id}></Input>


                                <FormLabel htmlFor='name'>Task name**</FormLabel>
                                <Input name="name" id="name" label="name" defaultValue={nodeFormData?.name}
                                >
                                </Input>

                                <FormLabel htmlFor='name'>Task Description</FormLabel>
                                <Input name="description" id="description" label="description"
                                       defaultValue={nodeFormData?.description}
                                >
                                </Input>

                                <FormLabel htmlFor='name'>Assigned to:</FormLabel>
                                <Input name="assigned_to" id="assigned_to" label="assigned_to"
                                       defaultValue={nodeFormData?.assigned_to}
                                >
                                </Input>


                                <FormLabel htmlFor='name'>Labels</FormLabel>
                                <Input name="labels" id="labels" label="labels"
                                       defaultValue={nodeFormData?.labels}
                                >
                                </Input>

                                <FormLabel htmlFor='state'>State</FormLabel>
                                <Input name="state" id="state" label="state"
                                       defaultValue={nodeFormData?.state}
                                >
                                </Input>

                                <FormLabel htmlFor='effort_estimation'>Effort Estimation</FormLabel>
                                <Input name="effort_estimation" id="effort_estimation" label="effort_estimation"
                                       defaultValue={nodeFormData?.effort_estimation}
                                >
                                </Input>

                                <FormLabel htmlFor='kpis'>Kpis</FormLabel>
                                <Input name="kpis" id="kpis" label="kpis"
                                       defaultValue={nodeFormData?.kpis}
                                >
                                </Input>

                            </FormControl>

                            <Input type="submit" value="Save"/>

                        </form>
                    </DrawerBody>

                    <DrawerFooter>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}


function ResizeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 14 14"
            strokeWidth="1"
            stroke="#ff0071"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', right: 5, bottom: 5 }}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="16 20 20 20 20 16" />
            <line x1="14" y1="14" x2="20" y2="20" />
            <polyline points="8 4 4 4 4 8" />
            <line x1="4" y1="4" x2="10" y2="10" />
        </svg>
    );
}
//
// export default memo(({ data, isConnectable, sourcePosition }) => {
//     return (
//         <>
//             <Handle
//                 type="source"
//                 position={sourcePosition}
//                 isConnectable={isConnectable}
//             />
//             {data.label && <div className="label-wrapper">{data.label}</div>}
//         </>
//     );
// });