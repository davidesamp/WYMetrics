import _ from 'lodash';

export const calculateAverageBitRate = (snapshots) => {
  return _.meanBy(snapshots, (p) => p.decodedBytes);
}
