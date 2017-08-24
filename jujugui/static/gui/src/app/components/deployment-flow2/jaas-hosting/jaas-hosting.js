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
          ${this.props.getEstimatedCost()}
        </span>
      </span>);
    }

    render() {
      return super.render(<div>
        <h2><juju.components.SvgIcon name="complete"
          width="16" /> JAAS hosting costs</h2>
        <p>Canonical hosts and manages the Juju controllers that run your model.
          <em>$0.005 per machine-hour</em></p>
        ${this.props.getEstimatedCost()}
        <button className="button--positive"
          onClick={this._completeSection.bind(this)}>Next</button>
      </div>);
    }
  }

  JaasHosting.propTypes = {
    getEstimatedCost: PropTypes.func
  };

  juju.components.JaasHosting = JaasHosting;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section'
  ]
});
