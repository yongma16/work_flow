import {
    BaseEdge,
    EdgeLabelRenderer,
    getStraightPath,
    getSmoothStepPath,
    getSimpleBezierPath,
    Position,
    useReactFlow,
} from '@xyflow/react';

import './style.scss'
import React, { useState } from 'react';

export default function CustomAddEdge(props: any) {
    const { id, sourceX, sourceY, targetX, targetY, data } = props;

    console.log('CustomAddEdge props', props);
    console.log('CustomAddEdge props data', data);


    const [isShowAddPanel, setIsShowAddPanel] = useState(false);

    const [isSelectEdge, setIsSelectEdge] = useState(false);
    const [path,] = getSimpleBezierPath({
        sourceX: sourceX,
        sourceY: sourceY,
        // sourcePosition: Position.Top,
        targetX: targetX,
        targetY: targetY,
        // targetPosition: Position.Bottom,
    });
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <BaseEdge id={id} path={path} />
            <circle r="10" fill="#ff0073">
                <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
            </circle>
            <EdgeLabelRenderer>

                <button
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                        borderRadius: '50px',
                        cursor: 'pointer',
                    }}
                    className="add-button"
                    onClick={() => {
                        setIsSelectEdge(true)
                        console.log('add button clicked', props);
                        setIsShowAddPanel(!isShowAddPanel);
                    }}
                >
                    +
                    <div style={{
                        display: isShowAddPanel ? 'block' : 'none',

                    }} className='add-button-edge-panel-container'>
                        <div >
                            <button onClick={() => {
                                console.log('添加普通节点');
                                data?.onAddBaseNode?.({
                                    curEdgeId: id
                                });
                            }} className='add-button-edge-panel'>添加普通节点</button>
                        </div>
                        <div>
                            <br></br>
                        </div>
                        <div >
                            <button onClick={() => {
                                console.log('添加分支节点 left');
                                data?.onAddBranchNode?.({
                                    curEdgeId: id,
                                    direction: 'left'
                                });
                            }} className='add-button-edge-panel'>添加分支 保留左边</button>
                        </div>
                        <div>
                            <br></br>
                        </div>
                        <div >
                            <button onClick={() => {
                                console.log('添加分支节点 right');
                                data?.onAddBranchNode?.({
                                    curEdgeId: id,
                                    direction: 'right'
                                });
                            }} className='add-button-edge-panel'>添加分支 保留右边</button>
                        </div>
                    </div>
                </button>


            </EdgeLabelRenderer>

        </>
    );
}