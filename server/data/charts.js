const data = require('./data.js');

const charts = [
  {
    title: 'Cume: Broadcast',
    class: 'square',
    type: 'line',
    width: '400',
    height: '300',
    data: data.cumeBroadcast.map(datapoint => datapoint.value),
    labels: data.cumeBroadcast.map(datapoint => datapoint.label)
  },
  {
    title: 'Cume: Digital Live Stream',
    class: 'square',
    type: 'bar',
    width: '400',
    height: '300',
    data: data.cumeDigitalLiveStream.map(datapoint => datapoint.value),
    labels: data.cumeDigitalLiveStream.map(datapoint => datapoint.label)
  },
  {
    title: 'SCPR.org Unique Visitors',
    class: 'square',
    type: 'bar',
    width: '400',
    height: '300',
    data: data.uniqueVisitors.map(datapoint => datapoint.value),
    labels: data.uniqueVisitors.map(datapoint => datapoint.label)
  },
  {
    title: 'SCPR.org Return Visitors',
    class: 'square',
    type: 'bar',
    width: '400',
    height: '300',
    data: data.returnVisitors.map(datapoint => datapoint.value),
    labels: data.returnVisitors.map(datapoint => datapoint.label)
  },
  {
    title: 'Facebook Followers',
    class: 'square',
    type: 'line',
    width: '400',
    height: '300',
    data: data.facebookFollowers.map(datapoint => datapoint.value),
    labels: data.facebookFollowers.map(datapoint => datapoint.label)
  },
  {
    title: 'Twitter Followers',
    class: 'square',
    type: 'line',
    width: '400',
    height: '300',
    data: data.twitterFollowers.map(datapoint => datapoint.value),
    labels: data.twitterFollowers.map(datapoint => datapoint.label)
  },
  {
    title: 'Total Listening Hours: Digital',
    class: 'square',
    type: 'line',
    width: '400',
    height: '300',
    data: data.totalListeningHoursDigital.map(datapoint => datapoint.value),
    labels: data.totalListeningHoursDigital.map(datapoint => datapoint.label)
  },
  {
    title: 'Podcast Downloads',
    class: 'square',
    type: 'line',
    width: '400',
    height: '300',
    data: data.podcastDownloads.map(datapoint => datapoint.value),
    labels: data.podcastDownloads.map(datapoint => datapoint.label)
  },
];

module.exports = charts;