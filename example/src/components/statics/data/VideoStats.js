import React from 'react';
import { Table } from 'antd';
import CSSModules from 'react-css-modules';
import styles from './VideoStats.scss';
import axios from 'axios';
import 'antd/dist/antd.css';
import _ from 'lodash';
import { Button } from 'antd';
import { calculateBufferingEventsRate, calculateBufferRatio } from '../../../utilities/stats';

const API_SERVER = 'http://5b9249cb4c818e001456e8f5.mockapi.io/video-metrics/v1/'

const networkState = {
  0: 'NETWORK_EMPTY',
  1: 'NETWORK_IDLE',
  2: 'NETWORK_LOADING',
  3: 'NETWORK_NO_SOURCE'
}

class VideoStats extends React.Component {
  constructor() {
        super();
        this.state = {
            records: [],
            snapshots: [],
            fetching: false,
            sortedInfo: null,
            innerSort: null,
        };
    }

  componentDidMount = () => {
    this._getMetrics();
  }

  _getMetrics = () =>  {
    const _self = this;
    this.setState({
      ...this.state,
      fetching: true
    }, () => {
      axios({
        method: 'get',
        url: API_SERVER + 'metrics',
      }).then(res => {

         if(res.data && res.data.length > 0){
           let totalMetrics = [];

           res.data.forEach(metric => {
             _self._getSnapshotById(metric.id).then(res => {
                if(res.data && res.data.length > 0){
                  totalMetrics.push({
                    ...metric,
                    snapshots: res.data,
                  });
                  _self.setState({
                    records : totalMetrics
                  })
                }
             }).catch(networkError => {
                 throw networkError;
             });
           })
         }
      }).catch(networkError => {
          throw networkError;
      });
    })

    this.setState({
      ...this.state,
      fetching: false
    });

  }

  _getSnapshotById = (metricId) =>  {
    return  axios({
        method: 'get',
        url: API_SERVER + 'metrics/' + metricId +  '/snaphots',
      })
  }

  _getSnapshotsByetricId = metricId => _.filter(this.state.snapshots, {'metricId': metricId});

  _deleteSnapshot = (snapshots, metricId) => {
    this.state.snapshots.forEach((snapshot) => {
      axios({
        method: 'DELETE',
        url: API_SERVER + 'metrics/' + metricId + '/snaphots/' + snapshot.id ,
      }).then(res => {
      }).catch(networkError => {
          throw networkError;
      });
    });
  }

  _deleteAllRecords = () => {
    const _self = this;
    this.state.records.forEach((record) => {
      const metricId = record.id;
      axios({
        method: 'DELETE',
        url: API_SERVER + 'metrics/' + metricId,
      }).then(res => {
          const currentSnapshots = this._getSnapshotsByetricId(metricId);
          this._deleteSnapshot(currentSnapshots, metricId)
      }).catch(networkError => {
          throw networkError;
      });
    })

    this.setState({
      records:[],
      snapshots:[]
    })
  }

  _handleGetMetrics = () => {
    this._getMetrics();
  };

  _getHeaderContent = () => {
    return (
      <div className={'stats-header'}>
      <Button
         size={'large'}
         type={'primary'}
         onClick={this._handleGetMetrics}>{'Load Metrics'}</Button>
      <Button
         className={'clean'}
         type={'primary'}
         disabled={!this.state.records || this.state.records.length <= 0}
         onClick={this._deleteAllRecords}>{'Clean Table'}</Button>
      </div>
    )
  }

  _renderTimesRanges = (ranges, arg2, arg3) => {
    return  Array.isArray(ranges) ? (
        <ul>
          {ranges.map((range, index) => <li className='table-times-range' key={index}>{`Start: ${range.start} - End: ${range.end}`}</li>)}
        </ul>
    ) : ( <span>{' N/D '}</span>)
  }

  _handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    });
  }

  _handleInnerRowChange = (pagination, filters, sorter) => {
    this.setState({
      innerSort: sorter,
    });
  }

  _renderBitRate = (averageBitrate) =>  <span>{averageBitrate.toFixed(0)}</span>


  _renderFormattedDate = (stringDate) => <span>{new Date(stringDate).toLocaleString()}</span>

  _renderNetworState = networStatusCode => <span>{networkState[networStatusCode]}</span>

  _renderBufferEventsRate = (bufferedEvents, row, index) => {
        return (
          <span>{calculateBufferingEventsRate(row.playedRanges, bufferedEvents).toFixed(2)}</span>
        )
  }

  _renderBufferRatio = (rebufferingTime, row, index) => {
    return (
      <span>{calculateBufferRatio(row.playedRanges, rebufferingTime).toFixed(2)}</span>
    )
  }
  _getInnerRow = (record) => {
    let { innerSort } = this.state;
     innerSort = innerSort || {};
    const columns = [
    { title: 'Date', dataIndex: 'effectiveTime', key: 'effectiveTime', render: this._renderFormattedDate, sortOrder: innerSort.columnKey === 'effectiveTime' && innerSort.order, sorter: (a, b) => new Date(a.effectiveTime) - new Date(b.effectiveTime) },
    { title: 'Decoded Frames (fps)', dataIndex: 'decodedFrames', key: 'decodedFrames',sortOrder: innerSort.columnKey === 'decodedFrames' && innerSort.order, sorter: (a, b) => a.decodedFrames -b.decodedFrames },
    { title: 'Dropped frames (fps)', dataIndex: 'droppedFrames', key: 'droppedFrames', sortOrder: innerSort.columnKey === 'droppedFrames' && innerSort.order, sorter: (a, b) => a.droppedFrames -b.droppedFrames },
    { title: 'Video BitRate (b/s)', dataIndex: 'videoBitRate', key: 'videoBitRate', sortOrder: innerSort.columnKey === 'videoBitRate' && innerSort.order, sorter: (a, b) => a.videoBitRate -b.videoBitRate },
    { title: 'Audio BitRate (b/s)', dataIndex: 'audioBitRate', key: 'audioBitRate', sortOrder: innerSort.columnKey === 'audioBitRate' && innerSort.order, sorter: (a, b) => a.audioBitRate -b.audioBitRate },
    { title: 'Network State', dataIndex: 'networkState', key: 'networkState', render: this._renderNetworState, sortOrder: innerSort.columnKey === 'networkState' && innerSort.order, sorter: (a, b) => a.networkState -b.networkState },
  ];

    const currentSnapshots = record.snapshots;

    return (
      <Table
        columns={columns}
        dataSource={currentSnapshots}
        onChange={this._handleInnerRowChange}
      />
    )
  }

  render () {
    let { sortedInfo } = this.state;
     sortedInfo = sortedInfo || {};
    const columns = [
      { title: 'Start Time', dataIndex: 'startTime', key: 'startTime', render: this._renderFormattedDate, sortOrder: sortedInfo.columnKey === 'startTime' && sortedInfo.order, sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime), },
      { title: 'End Time', dataIndex: 'endTime', key: 'endTime', render: this._renderFormattedDate, sortOrder: sortedInfo.columnKey === 'endTime' && sortedInfo.order, sorter: (a, b) => new Date(a.endTime) - new Date(b.endTime), },
      { title: 'Decoded audio (Bytes)', dataIndex: 'decodedAudioBytes', key: 'decodedAudioBytes', align: 'center', width: 120, sortOrder: sortedInfo.columnKey === 'decodedAudioBytes' && sortedInfo.order, sorter: (a, b) => a.decodedAudioBytes - b.decodedAudioBytes },
      { title: 'Decoded Video (Bytes)', dataIndex: 'decodedBytes', key: 'decodedBytes', align: 'center', width: 120, sortOrder: sortedInfo.columnKey === 'decodedBytes' && sortedInfo.order, sorter: (a, b) => a.decodedBytes - b.decodedBytes },
      { title: 'Decoded Frames', dataIndex: 'decodedFrames', key: 'decodedFrames', align: 'center', width: 100, sortOrder: sortedInfo.columnKey === 'decodedFrames' && sortedInfo.order, sorter: (a, b) => a.decodedFrames - b.decodedFrames },
      { title: 'Dropped Frames', dataIndex: 'droppedFrames', key: 'droppedFrames', align: 'center', width: 100, sortOrder: sortedInfo.columnKey === 'droppedFrames' && sortedInfo.order, sorter: (a, b) => a.droppedFrames - b.droppedFrames  },
      { title: 'src', dataIndex: 'src', key: 'src', width: 120, align: 'center' },
      { title: 'ipAddress', dataIndex: 'ipAddress', key: 'ipAddress', align: 'center', width: 120,},
      { title: 'Buffered Times Ranges (Seconds)', dataIndex: 'bufferedRanges',  key: 'bufferedRanges', render: this._renderTimesRanges},
      { title: 'Played Times Ranges (Seconds)', dataIndex: 'playedRanges',  key: 'playedRanges', render: this._renderTimesRanges},
      { title: 'Average Bit Rate (B/s)', dataIndex: 'averageBitrate',  key: 'averageBitrate', render: this._renderBitRate},
      { title: 'Joined Time (ms)', dataIndex: 'joinedTime', align: 'center', width: 100,  key: 'joinedTime'},
      { title: 'Buffer Ratio %', dataIndex: 'rebufferingTime',  key: 'rebufferingTime', align: 'center', render: this._renderBufferRatio},
      { title: 'Rebuffering Events', dataIndex: 'rebufferingEvents',  key: 'rebufferingEvents', align: 'center', render : this._renderBufferEventsRate},
    ];

    const datasource = this.state.records.map((record) => {
       record.src = record.src.split('?')[0];
       return record;
    })

    return (
       <div className={'stats-container'} style={{'margin': '40px'}}>
          {this._getHeaderContent()}
          <Table
          size={'small'}
          pagination={{position:'both'}}
          loading={this.state.fetching}
          bordered
          columns={columns}
          dataSource={datasource}
          onChange={this._handleChange}
          expandedRowRender={record => this._getInnerRow(record)}
          />
       </div>
    )

  }
}

export default CSSModules(VideoStats, styles);
