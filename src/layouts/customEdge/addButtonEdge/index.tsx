import {
    BaseEdge,
    EdgeLabelRenderer,
    getStraightPath,
    useReactFlow,
} from '@xyflow/react';

export default function CustomAddEdge(props: any) {
    console.log('CustomAddEdge props', props);
    const { id, sourceX, sourceY, targetX, targetY } = props;
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <EdgeLabelRenderer>
                <button
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                    onClick={() => {
                        setEdges((es) => es.filter((e) => e.id !== id));
                    }}
                >
                    add
                </button>
            </EdgeLabelRenderer>
        </>
    );
}