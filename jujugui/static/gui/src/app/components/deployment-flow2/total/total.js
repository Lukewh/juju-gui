/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-total', function() {
  class Total extends juju.components.Section {
    constructor(props) {
      super(props, {}, 'total');
    }

    _generateHeaderContent() {
      return (<span>
        <span className="deployment-flow2__section-header-left">
          Total &bull; budget
        </span>
        <span className="deployment-flow2__section-header-right">
          ${this.props.getEstimatedCost()}
        </span>
      </span>);
    }

    render() {
      return super.render(<div>
        <h2><juju.components.SvgIcon name="complete"
          width="16" /> Set your maximum monthly budget</h2>
        <p>Estimated monthly cost: ${this.props.getEstimatedCost()}</p>
        <p>Never charge me more than:  <input value="" /></p>

        <button className="button--positive"
          onClick={this._completeSection.bind(this)}>Set monthly budget</button>
      </div>);
    }
  }

  Total.propTypes = {
    getEstimatedCost: PropTypes.func
  };

  juju.components.Total = Total;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section',
    'svg-icon'
  ]
});
