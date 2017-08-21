/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-deploy', function() {
  class Deploy extends juju.components.Section {
    constructor(props) {
      super(props, {}, 'deploy');
    }

    _generateHeaderContent() {
      return (<span>Deploy</span>)
    }

    render() {
      return super.render(<div>Deploy</div>);
    }
  }

  Deploy.propTypes = {};

  juju.components.Deploy = Deploy;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section'
  ]
});
