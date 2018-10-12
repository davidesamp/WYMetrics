import _ from 'lodash';

const calcTotalPlayedTime = (playedRanges) => {
  let totalPlayedTime = 0;
  for(let i = 0; i < playedRanges.length; i++ ){
     const start = playedRanges[i].start;
     const end = playedRanges[i].end;
     totalPlayedTime += ( end - start)
  }

  return totalPlayedTime;
}

export const calculateBufferingEventsRate = (played, numeEvents) => {
  const totalPlayedTime = calcTotalPlayedTime(played);

  return numeEvents / totalPlayedTime;
}

export const calculateBufferRatio = (played, rebufferingTime) => {
  let bufferRatio;
  const totalPlayedTime = calcTotalPlayedTime(played) * 1000; //convert to milliseconds
  const totalSessionTime = totalPlayedTime + rebufferingTime;
  bufferRatio = (rebufferingTime / totalSessionTime) * 100;

  return bufferRatio;
}

export const calculateAverageBitRate = (snapshots) => {
  const ciccia =  _.meanBy(snapshots, (p) => p.decodedBytes);
  console.log('average --> ', ciccia);
  return ciccia;
}
