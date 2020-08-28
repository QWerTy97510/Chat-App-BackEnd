const merge = (arr1, arr2) => {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] && arr2[j] && arr1[i].sentAt < arr2[j].sentAt) {
      result.push(arr1[i]);
      i++;
    }
    if (arr1[i] && arr2[j] && arr2[j].sentAt < arr1[i].sentAt) {
      result.push(arr2[j]);
      j++;
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
};

const mergeSort = (arr) => {
  if (arr.length < 2) return arr;
  let midPoint = Math.floor(arr.length / 2);
  let leftArr = arr.slice(0, midPoint);
  let rightArr = arr.slice(midPoint, arr.length);

  return merge(mergeSort(leftArr), mergeSort(rightArr));
};

module.exports = mergeSort;
