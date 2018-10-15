# video-metrics

> a Wyscout video profiler

[![NPM](https://img.shields.io/npm/v/video-metrics.svg)](https://www.npmjs.com/package/video-metrics) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @wyscout/video-metrics
```

## Usage

```jsx
import React, { Component } from 'react'

import { sniffVideoMetrics } from '@wyscout/video-metrics'

class Example extends Component {

  componentDidMount = () => {
    sniffVideoMetrics();
  }

  render () {
    return (
      <MyVideoPlayerToBeProfiled />
    )
  }
}
```

## License

MIT © [davidesamp](https://github.com/davidesamp)
