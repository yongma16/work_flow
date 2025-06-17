import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import BaseNode from './customNode/baseNode';
import './index.less';

import { initialNodes, initialEdges, getLayoutedElements, addBaseNode, addBranchNode } from './const';


export default function Flow() {
    // instance
    const CurReactFlowInstance: any = useRef(null);

    const [isRunLayoutedElements, setIsRunLayoutedElements] = useState(false);
    const [runLayoutedCount, setRunLayoutedCount] = useState(0);

    // we define the nodeTypes outside of the component to prevent re-renderings
    // you could also use useMemo inside the component
    const nodeTypes = useMemo(() => {
        return { textUpdater: TextUpdaterNode, AddNode: AddNode, baseNode: BaseNode };
    }, [TextUpdaterNode, AddNode, BaseNode]);

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

    const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initialEdges);





    // 渲染边
    // 这里可以对边进行一些处理，比如添加样式等
    const renderEdges = useMemo(() => {
        return edges.map((edge) => {
            return {
                ...edge,
                // 这个data可以传递给自定义边组件
                data: {
                    // 添加基础节点
                    onAddBaseNode: (config: { curEdgeId: string }) => {
                        const { curEdgeId } = config;
                        console.log('onAddBaseNode source, target', curEdgeId);
                        const { newNodes, newEdges } = addBaseNode({
                            curEdgeId,
                            nodes,
                            edges
                        })
                        setNodes(newNodes);
                        setEdges(newEdges);
                        // 重新计算布局
                        setIsRunLayoutedElements(true);

                        CurReactFlowInstance.current?.updateNodeData()
                        CurReactFlowInstance.current?.updateEdgeData()

                        CurReactFlowInstance.current?.updateNodeData()
                        CurReactFlowInstance.current?.updateEdgeData()
                    },
                    // 添加分支节点
                    onAddBranchNode: (config: { curEdgeId: string, direction: string }) => {
                        const { curEdgeId, direction } = config;
                        const { newNodes, newEdges } = addBranchNode({
                            curEdgeId,
                            nodes,
                            edges,
                            direction
                        })
                        setNodes(newNodes);
                        setEdges(newEdges);

                        CurReactFlowInstance.current?.updateNodeData()
                        CurReactFlowInstance.current?.updateEdgeData()
                        // 重新计算布局
                        setIsRunLayoutedElements(true);


                    }
                },
            }
        })
    }, [edges, nodes, setEdges, setNodes]);
    //    // 连接事件
    const onConnect = useCallback(
        (params: any) => {
            console.log('onConnect params', params);
            setEdges((eds) => addEdge(params, eds));
        },
        [setEdges]
    );

    const onAutoRenderPostion = () => {
        const calResult = getLayoutedElements(nodes, edges)
        setNodes(calResult.nodes);
        setEdges(calResult.edges);
        if (CurReactFlowInstance.current) {


            if (runLayoutedCount === 0) {
                // 重新渲染
                CurReactFlowInstance.current.fitView();
            }
            else {
                const curNodeBounds = CurReactFlowInstance.current.getNodesBounds(calResult.nodes);
                // CurReactFlowInstance.current.setCenter({
                //     x: curNodeBounds.x + curNodeBounds.width / 2,
                //     y: curNodeBounds.y + curNodeBounds.height / 2,
                // })
                // 重新渲染
                CurReactFlowInstance.current.fitView();
            }
            // 计算次数+1
            setRunLayoutedCount(runLayoutedCount + 1);
        }
    }
    //  重新布局
    useEffect(() => {
        if (isRunLayoutedElements) {
            onAutoRenderPostion();
            setIsRunLayoutedElements(false);
        }
    }, [isRunLayoutedElements])
    // 初始化渲染完 执行布局
    useEffect(() => {
        // setIsRunLayoutedElements(true);
    }, []);

    return (
        <div className='flow-container'>
            <ReactFlow
                nodes={nodes}
                edges={renderEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onInit={(instance) => {
                    console.log('onInit instance', instance);
                    CurReactFlowInstance.current = instance;
                    // 初始化完成 
                    setIsRunLayoutedElements(true);
                }}

            >
                <Controls />
                <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
                <Background variant="dots" gap={12} size={1} />
                <DevTools />
            </ReactFlow>

        </div>
    );
}