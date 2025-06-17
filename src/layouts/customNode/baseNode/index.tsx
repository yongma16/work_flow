import { Handle, Position, NodeToolbar } from '@xyflow/react';
import React, { useEffect } from 'react';
import './style.scss';

const BaseNode = (props: any) => {

    const { data } = props;
    useEffect(() => {
        console.log('props', props);
    }
        , [props]);
    return (
        <div className="base-node">
            <NodeToolbar isVisible={data.toolbarVisible} position={Position.Top}>
                <button>toolbar 按钮</button>
            </NodeToolbar>

            <div style={{ padding: '10px 20px' }}>
                {data.label}
            </div>

            {/* {data.customDataType !== 'start' ? <Handle type="source" position={Position.Top} /> : ''} */}
              {data.customDataType !== 'end' ?<Handle type="source" position={Position.Bottom} />:""}


            {data.customDataType !== 'start' ? <Handle type="target" position={Position.Top} /> : ""}
        </div >
    );
};


export default BaseNode;