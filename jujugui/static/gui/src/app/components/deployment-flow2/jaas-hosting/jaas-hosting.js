/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-jaas-hosting', function() {
  class JaasHosting extends juju.components.Section {
    constructor(props) {
      super(props, {}, 'jaasHosting');
    }

    _generateHeaderContent() {
      return (<span>
        <span className="deployment-flow2__section-header-left">
          JAAS hosting
        </span>
        <span className="deployment-flow2__section-header-right">
          $25.50
        </span>
      </span>);
    }

    render() {
      return super.render(<div className="deployment-flow2__section-jaas">
        <h2 className="deployment-flow2__section-title">JAAS is Juju-as-a-Service</h2>
        <p className="left">Canonical hosts and manages the Juju controllers that run your model.
        &nbsp;<em>$0.005 per machine-hour</em></p>
        <p className="right"><b>$25.20</b></p>
        <div>
          <button className="button--inline-positive right"
            onClick={this._completeSection.bind(this)}>Next</button>
        </div>
      </div>);
    }
  }

  JaasHosting.propTypes = {
  };

  juju.components.JaasHosting = JaasHosting;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section'
  ]
});
