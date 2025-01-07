import React from 'react'

export const getNodeName=(nodes, condition)=> {
    //console.log(nodes.data.nodes)
    return nodes.data.nodes.map((d) => {
        //console.log(d.id)
        if(condition===d.type) {
            console.log(d)
            return (d.data.name)
        }
    })
}


export const getNodeDataByTypeAndId=(document, type, nodeId)=> {
    console.log(document)
    if(!document) {
        return [{}]
    }
    //console.log(nodes.data.nodes)
    return document.data.nodes.map((node) => {
        console.log(node)
        //console.log(d.id)
        if(type===node.type && node.data.id===nodeId) {
            console.log(node.data)
            return (node.data)
        }
    })
}

