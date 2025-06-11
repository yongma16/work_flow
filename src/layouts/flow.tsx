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
import TextUpdaterNode from './customNode/textUpdateNode';
import AddNode from './customNode/addNode';
import CustomAddEdge from './customEdge/addButtonEdge';
import './index.less';

import { initialNodes, initialEdges } from './const';


export default function Flow() {


    const rfStyle = {
        backgroundColor: '#B8CEFF',
    };


    // we define the nodeTypes outside of the component to prevent re-renderings
    // you could also use useMemo inside the component
    const nodeTypes = useMemo(() => {
        return { textUpdater: TextUpdaterNode, AddNode: AddNode };
    }, [TextUpdaterNode, AddNode]);

    const edgeTypes = useMemo(() => {
        return { customAddEdge: CustomAddEdge };
    }, [CustomAddEdge]);

    const nodeColor = (node) => {
        console.log('nodeColor node', node);
        switch (node.type) {
            case 'input':
                return '#6ede87';
            case 'output':
                return '#6865A5';
            default:
                return '#ff0072';
        }
    };

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => {
            console.log('onConnect params', params);
            setEdges((eds) => addEdge(params, eds));
        },
        [setEdges]
    );

    return (
        <div className='flow-container'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}

            >
                <Controls />
                <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
                <Background variant="dots" gap={12} size={1} />
                <DevTools />
            </ReactFlow>

        </div>
    );
}