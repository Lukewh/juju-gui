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
      return super.render(<div>
        <h2><juju.components.SvgIcon name="complete"
          width="16" /> Agree to terms and deploy</h2>

        <input type="checkbox" /> Please email me updates regarding feature announcements, performance suggestions, feedback surveys and special offers.
        <input type="checkbox" defaultChecked /> I agree that my use of any service and related APIs is subject to my compliance with the applicable <a href="">Terms of service</a>
        <button className="button--positive">Deploy</button>
      </div>);
    }
  }

  Deploy.propTypes = {};

  juju.components.Deploy = Deploy;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section'
  ]
});
