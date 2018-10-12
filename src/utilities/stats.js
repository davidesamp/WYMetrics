import _ from 'lodash';

export const calculateAverageBitRate = (snapshots) => {
  const ciccia =  _.meanBy(snapshots, (p) => p.decodedBytes);
  console.log('average --> ', ciccia);
  return ciccia;
}
