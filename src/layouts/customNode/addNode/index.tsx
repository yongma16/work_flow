import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import './style.scss'; // A
// ssuming you have some styles for the node
const handleStyle = { left: 10 };

function AddNode({ data, isConnectable }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    return (
        <div className="text-updater-node">
            add node
            {/* <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />
            <div>
                <label htmlFor="text">Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag" />
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="a"
                style={handleStyle}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                isConnectable={isConnectable}
            /> */}
        </div>
    );
}

export default AddNode;