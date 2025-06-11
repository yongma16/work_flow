export const customUUID = () => {
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
  console.log('customUUID()', str);
  return str;
};

export const initialNodes = [
  {
    id: 'A',
    type: 'group',
    data: { label: null },
    position: { x: 0, y: 0 },
    style: {
      width: 1600,
      height: 800
    },
    draggable: false
  },
  {
    id: 'B',
    type: 'input',
    data: { label: 'child node 1' },
    position: { x: 10, y: 10 },
    parentId: 'A',
    extent: 'parent'
  },
  {
    id: 'C',
    data: { label: 'child node 2' },
    position: { x: 10, y: 90 },
    parentId: 'A',
    extent: 'parent'
  },
  {
    id: 'add_node',
    type: 'AddNode',
    position: { x: 500, y: 100 },
    data: { label: 'add_node' },
    parentId: 'A',
    extent: 'parent'
  },
  {
    id: '1',
    position: { x: 1000, y: 400 },
    data: { label: '1' },
    type: 'textUpdater',
    parentId: 'A',
    extent: 'parent'
  },
  {
    id: '2',
    position: { x: 1000, y: 600 },
    data: { label: '2' },
    parentId: 'A',
    extent: 'parent'
  }
];
export const initialEdges = [{ id: 'e1-2', source: '1', target: '2', label: 'to the', type: 'customAddEdge' }];
