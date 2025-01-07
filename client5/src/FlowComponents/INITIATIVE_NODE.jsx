import React, {memo, useCallback, useEffect, useState} from "react";
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';

import {Handle, NodeResizeControl, NodeResizer, Position, useReactFlow} from "@xyflow/react";
import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent, DrawerFooter,
    DrawerHeader,
    DrawerOverlay, FormControl, FormLabel, Input,
    useDisclosure
} from "@chakra-ui/react";
import customFetch from "../utils/customFetch.js";
import {toast} from "react-toastify";
import {Form, redirect, useNavigate} from "react-router-dom";

export default function INITIATIVE_NODE({data,rfInstance}) {

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

    const navigate = useNavigate()
    const setOnOpenModal =useCallback ((event) => {
        event.preventDefault();
        console.log("opening modal")
        //Make an REST call to get data of this node.
        //export const getNodeDataByTypeAndName=(document, type, nodeId)=> {
        customFetch.get("/flow-test/"+data.name+"/"+data.id)
            .then((response) => {
                onOpen()
                console.log(response.data.data);

                setNodeFormData(response.data.data);
                data = nodeFormData;
            })
            .catch(error => console.error(error));
        //Make an REST call to get data of this node.
        // fetch('http://127.0.0.1:5000/project/'+project_name+'/task/'+id)
        //     .then(response => response.json())
        //     .then(data => {setNodeFormData(data.data); console.log(data)})
        //     .catch(error => console.error(error));
    },[onOpen,setNodeFormData,nodeFormData])
    const controlStyle = {
        background: 'transparent',
        border: 'none',
    };

    const formSubmit = async (event) => {
        console.log("START");
        const formData = new FormData(event.currentTarget);
        event.preventDefault();
        console.log(formData)

        console.log(JSON.stringify(Object.fromEntries(formData)))

        try {
            const putData = await customFetch.put("/flow-test/"+data.name+"/"+data.id,
                Object.fromEntries(formData))
            console.log(Object.fromEntries(formData));

            toast.success('Initiative updated successfully!');
            //return redirect('/dashboard/');
            onClose();
            return redirect('/dashboard/' + data.name);
            navigate("/dashboard/"+data.name);
        } catch (error) {
            toast.error(error?.response?.data?.message);
            return errors;
        }
    };

    return (
        <div onClick={setOnOpenModal}>

            <NodeResizeControl style={controlStyle} minWidth={150} minHeight={100} maxHeight={132} maxWidth={170} onOpen={setOnOpenModal}>
                <ResizeIcon />
            </NodeResizeControl>
            <ThemeProvider
                theme={{
                    palette: {
                        primary: {
                            main: '#df72ed',
                            dark: '#edc2f2',
                        },
                    },
                }}
            >
                <div className="circle">
                    <Box
                        sx={{
                            width: 550,
                            height: 550,
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                        }}
                    >
                        <div className="textCircle" style={{padding: 3}}><h5>{`${data.name}`}</h5></div>
                        <Handle type={"source"} position={Position.Right}
                                style={{
                                    background: 'blue', color: 'darkblue', width: 14,
                                    height: 14,
                                }}
                        />

                    </Box>
                </div>
            </ThemeProvider>

            <Drawer size={"md"}   isOpen={isOpen} onClose={() => onClose()}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader ></DrawerHeader>
                    <DrawerCloseButton />
                    <DrawerBody>

                        <form method="post" onSubmit={formSubmit}>
                            <FormControl>
                                <FormLabel htmlFor='name'>Initiative name**</FormLabel>
                                <Input name="name" id="name" label="name" readOnly defaultValue={nodeFormData.name}
                                       >
                                </Input>

                                <FormLabel htmlFor='name'>Initiative Description</FormLabel>
                                <Input name="description" id="description" label="description"
                                       defaultValue={nodeFormData.description}
                                       >
                                </Input>

                                <FormLabel htmlFor='name'>Assigned to:</FormLabel>
                                <Input name="assigned_to" id="assigned_to" label="assigned_to"
                                       defaultValue={nodeFormData.assigned_to}
                                       >
                                </Input>


                                <FormLabel htmlFor='name'>Labels</FormLabel>
                                <Input name="labels" id="labels" label="labels"
                                       defaultValue={nodeFormData.labels}
                                       >
                                </Input>

                                <FormLabel htmlFor='state'>Labels</FormLabel>
                                <Input name="state" id="state" label="state"
                                       defaultValue={nodeFormData.state}
                                       >
                                </Input>


                                <FormLabel htmlFor='kpis'>Kpis</FormLabel>
                                <Input name="kpis" id="kpis" label="kpis"
                                       defaultValue={nodeFormData.kpis}
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
            style={{position: 'absolute', right: 5, bottom: 5}}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <polyline points="16 20 20 20 20 16"/>
            <line x1="14" y1="14" x2="20" y2="20"/>
            <polyline points="8 4 4 4 4 8"/>
            <line x1="4" y1="4" x2="10" y2="10"/>
        </svg>
    );
}