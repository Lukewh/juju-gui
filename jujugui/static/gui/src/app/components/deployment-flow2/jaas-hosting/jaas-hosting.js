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
          $25.20
        </span>
      </span>);
    }

    render() {
      return super.render(<div>
        Jaas hosting
        <button className="button--positive"
          onClick={this._completeSection.bind(this)}>JAAS hosting</button>
      </div>);
    }
  }

  JaasHosting.propTypes = {};

  juju.components.JaasHosting = JaasHosting;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section'
  ]
});
