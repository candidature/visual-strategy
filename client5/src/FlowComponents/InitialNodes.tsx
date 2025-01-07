import {Edge, Node} from '@xyflow/react';

export const initialNodes: Node[] = [
    //{ id: '1', position: { x: 0, y: 0 }, data: { title: 'PROJECT-START' }, type: 'PROJECT-START' , deletable: false },
    //{ id: '2', position: { x: 10, y: 10 }, data: { title: 'TASK' }, type: 'TASK' },
    //{ id: '3', position: { x: 20, y: 20 }, data: { title: 'TASK' }, type: 'TASK' },
    //{ id: '4', position: { x: 20, y: 20 }, data: { title: 'TASK' }, type: 'TASK' },

];
export const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' , reconnectable: true}];
