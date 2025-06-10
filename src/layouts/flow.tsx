import React, { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import DevTools from './devTools/devTools';
import TextUpdaterNode from './customNode';
import AddNode from './customNode/addNode';
import './index.less';




export default function Flow() {


    const rfStyle = {
        backgroundColor: '#B8CEFF',
    };

    const initialNodes = [

        {
            id: 'A',
            type: 'group',
            data: { label: null },
            position: { x: 0, y: 0 },
            style: {
                width: 1600,
                height: 800,
            },
            draggable: false
        },
        {
            id: 'B',
            type: 'input',
            data: { label: 'child node 1' },
            position: { x: 10, y: 10 },
            parentId: 'A',
            extent: 'parent',
        },
        {
            id: 'C',
            data: { label: 'child node 2' },
            position: { x: 10, y: 90 },
            parentId: 'A',
            extent: 'parent',
        },
        {
            id: 'add_node', type: 'AddNode', position: { x: 500, y: 100 }, data: { label: 'add_node' }, parentId: 'A',
            extent: 'parent',
        },
        {
            id: '1', position: { x: 1000, y: 400 }, data: { label: '1' }, type: 'textUpdater', parentId: 'A',
            extent: 'parent',
        },
        {
            id: '2', position: { x: 1000, y: 600 }, data: { label: '2' }, parentId: 'A',
            extent: 'parent',
        },
    ];
    const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
    // we define the nodeTypes outside of the component to prevent re-renderings
    // you could also use useMemo inside the component
    const nodeTypes = useMemo(() => {
        return { textUpdater: TextUpdaterNode, AddNode: AddNode };
    }, [TextUpdaterNode, AddNode]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className='flow-container'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onConnect={onConnect}
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
                <DevTools />
            </ReactFlow>

        </div>
    );
}