export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const createDataTree = (dataset) => {
  let hashTable = Object.create(null);

  dataset.forEach((a) => {
    hashTable[a.id] = { ...a, childNodes: [] };
  });

  let dataTree = [];

  dataset.forEach((a) => {
    if (a.parentId) {
      hashTable[a.parentId].childNodes.push(hashTable[a.id]);
    } else {
      dataTree.push(hashTable[a.id]);
    }
  });
  return dataTree;
};
