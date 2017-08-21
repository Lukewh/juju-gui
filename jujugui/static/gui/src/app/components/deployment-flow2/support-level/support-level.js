/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-support-level', function() {
  class SupportLevel extends juju.components.Section {
    constructor(props) {
      super(props, {}, 'supportLevel');
    }

    _generateHeaderContent() {
      return (<span>
        <span className="deployment-flow2__section-header-left">
          Support level &bull; Application plans
        </span>
        <span className="deployment-flow2__section-header-right">
          $0.00
        </span>
      </span>);
    }

    render() {
      return super.render(<div>
        Support level
        <button className="button--positive"
          onClick={this._completeSection.bind(this)}>Support level</button>
      </div>);
    }
  }

  SupportLevel.propTypes = {};

  juju.components.SupportLevel = SupportLevel;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section'
  ]
});
