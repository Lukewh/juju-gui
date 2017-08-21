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
          $25.20
        </span>
      </span>);
    }

    render() {
      return super.render(<div>
        Total
        <button className="button--positive"
          onClick={this._completeSection.bind(this)}>Total</button>
      </div>);
    }
  }

  Total.propTypes = {};

  juju.components.Total = Total;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section'
  ]
});
