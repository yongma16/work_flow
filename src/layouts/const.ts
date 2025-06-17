import dagre from '@dagrejs/dagre';
import { ReactFlow, Background, MarkerType } from '@xyflow/react';
declare global {
  interface Date {
    Format(fmt: string): string;
  }
}
// @ts-ignore
Date.prototype.Format = function(fmt: string) {
  // author: meizz
  var o: any = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  return fmt;
};
// 获取布局元素
export const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 300;
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, nodesep: 200, edgesep: 100, ranksep: 50 });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};
// 生成UUID
export const customGenUuid = () => {
  const hex = '0123456789abcdef';
  let uuid = [];
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) uuid[i] = '-';
    else if (i === 14) uuid[i] = '4';
    // 版本标识
    else uuid[i] = hex[Math.floor(Math.random() * 16)];
  }
  uuid[19] = hex[(parseInt(uuid[19], 16) & 0x3) | 0x8]; // 变体标识

  const str = uuid.join('');
  console.log('customGenUuid()', str);
  return str;
};
// 初始节点
export const initialNodes = [
  {
    id: 'start_id',
    position: { x: 0, y: 0 },
    data: { label: `开始节点_${new Date().Format('yyyy-MM-dd hh:mm:ss')}`, customDataType: 'start' },
    type: 'baseNode'
  },
  {
    id: 'test_id',
    position: { x: 0, y: 0 },
    data: { label: `测试节点_${new Date().Format('yyyy-MM-dd hh:mm:ss')}`, customDataType: 'test' },
    type: 'baseNode'
  },
  {
    id: 'end_id',
    position: { x: 0, y: 0 },
    data: { label: `结束节点_${new Date().Format('yyyy-MM-dd hh:mm:ss')}`, customDataType: 'end' },
    type: 'baseNode'
  }
];
// // 初始边
export const initialEdges = [
  {
    id: 'e1-1',
    source: 'start_id',
    target: 'test_id',
    label: 'start',
    type: 'customAddEdge',
    markerEnd: {
      type: MarkerType.Arrow
    }
  },
  {
    id: 'e1-2',
    source: 'test_id',
    target: 'end_id',
    label: 'to the',
    type: 'customAddEdge',
    markerEnd: {
      type: MarkerType.Arrow
    }
  }
];

// 添加基础节点
export const addBaseNode = (config: { curEdgeId: string; nodes: any[]; edges: any[] }) => {
  const { curEdgeId, nodes, edges } = config;
  console.log('addBaseNode curEdgeId', curEdgeId);
  // 当前边的节点
  const curEdge = edges.find(edge => edge.id === curEdgeId);
  if (!curEdge) {
    console.error('Edge not found for id:', curEdgeId);
    return { nodes, edges };
  }
  // 创建新的节点 基础节点
  const virtualNode = {
    id: customGenUuid(),
    position: { x: 0, y: 0 },
    data: { label: `普通节点_${new Date().Format('yyyy-MM-dd hh:mm:ss')}`, customDataType: 'test' },
    type: 'baseNode'
  };
  // 新节点
  const newNodes: any[] = [];
  // 遍历节点添加  按顺序加入
  nodes.forEach(node => {
    if (node.id === curEdge.source) {
      // 在当前边的源节点后面添加新节点
      newNodes.push(virtualNode);
    }
    newNodes.push(node);
  });
  // 添加新边
  const newEdges: any[] = [];
  edges.forEach(edge => {
    // 如果是当前边，则添加新边  source和target 中间添加一个节点 补充一条边
    if (edge.id === curEdgeId) {
      // 在当前边后面添加新边
      newEdges.push({
        id: customGenUuid(),
        source: curEdge.source,
        // 链接当前节点
        target: virtualNode.id,
        type: 'customAddEdge',
        markerEnd: {
          type: MarkerType.Arrow
        }
      });
      // 在当前边后面添加新边
      newEdges.push({
        id: customGenUuid(),
        source: virtualNode.id,
        // 链接当前节点
        target: curEdge.target,
        type: 'customAddEdge',
        markerEnd: {
          type: MarkerType.Arrow
        }
      });
    } else {
      // 其他边不变
      newEdges.push(edge);
    }
  });

  return {
    newNodes: newNodes,
    newEdges: newEdges
  };
};

// 添加分支节点  默认添加左分支
export const addBranchNode = (config: { curEdgeId: string; nodes: any[]; edges: any[]; direction: string }) => {
  const { curEdgeId, nodes, edges, direction } = config;
  console.log('addBaseNode curEdgeId', curEdgeId);
  // 当前边的节点
  const curEdge = edges.find(edge => edge.id === curEdgeId);
  if (!curEdge) {
    console.error('Edge not found for id:', curEdgeId);
    return { nodes, edges };
  }
  // 创建新的节点 基础节点
  const virtualLeftNode = {
    id: customGenUuid(),
    position: { x: 0, y: 0 },
    // 左边分支 节点
    data: { label: `分支节点_${new Date().Format('yyyy-MM-dd hh:mm:ss')}`, customDataType: 'test', branchDirection: 'left' },
    type: 'baseNode'
  };
  // 右边分支节点
  const virtualRightNode = {
    id: customGenUuid(),
    position: { x: 0, y: 0 },
    // 左边分支 节点
    data: { label: `分支节点_${new Date().Format('yyyy-MM-dd hh:mm:ss')}`, customDataType: 'test', branchDirection: 'right' },
    type: 'baseNode'
  };
  // 新节点
  const newNodes: any[] = [];
  // 遍历节点添加  按顺序加入
  nodes.forEach(node => {
    if (node.id === curEdge.source) {
      // 在当前边的源节点后面添加新节点  先添加左边在添加右边的节点
      if (direction === 'left') {
        newNodes.push(virtualLeftNode);
        newNodes.push(virtualRightNode);
      } else {
        // 右边分支
        newNodes.push(virtualRightNode);
        newNodes.push(virtualLeftNode);
      }
    }
    newNodes.push(node);
  });
  // 添加新边
  const newEdges: any[] = [];
  edges.forEach(edge => {
    // 如果是当前边，则添加新边  source和target 中间添加一个节点 补充一条边
    if (edge.id === curEdgeId) {
      // 在当前边后面添加新边
      newEdges.push({
        id: customGenUuid(),
        source: curEdge.source,
        // 链接当前节点
        target: direction === 'left' ? virtualLeftNode.id : virtualRightNode.id,
        data: {
          branchDirection: 'right'
        },
        type: 'customAddEdge',
        markerEnd: {
          type: MarkerType.Arrow
        }
      });
      // 在当前边后面添加新边
      newEdges.push({
        id: customGenUuid(),
        source: direction === 'left' ? virtualLeftNode.id : virtualRightNode.id,
        // 链接当前节点
        target: curEdge.target,
        data: {
          branchDirection: 'right'
        },
        type: 'customAddEdge',
        markerEnd: {
          type: MarkerType.Arrow
        }
      });
      // 添加右侧分支边
      newEdges.push({
        id: customGenUuid(),
        source: curEdge.source,
        // 链接当前节点
        target: direction === 'left' ? virtualRightNode.id : virtualLeftNode.id,
        type: 'customAddEdge',
        data: {
          branchDirection: 'right'
        },
        markerEnd: {
          type: MarkerType.Arrow
        }
      });
    } else {
      // 其他边不变
      newEdges.push(edge);
    }
  });

  console.log('addBranchNode newNodes', {
    newNodes: newNodes,
    newEdges: newEdges
  });

  return {
    newNodes: newNodes,
    newEdges: newEdges
  };
};
