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

    _agreeTerms(ele) {
      this.props.setState({
        termsAgreed: ele.target.checked
      })
    }

    render() {
      return super.render(<div>
        <h2 className="deployment-flow2__section-title">Agree to terms and deploy</h2>

        <p>
        <label>
          <input type="checkbox" /> Please email me updates regarding feature announcements, performance suggestions, feedback surveys and special offers.
        </label>
        </p>
        <p>
        <label>
          <input type="checkbox"
            onChange={this._agreeTerms.bind(this)} /> I agree that my use of any service and related APIs is subject to my compliance with the applicable <a href="">Terms of service</a>
        </label>
        </p>
        <div>
          <button className="button--inline-positive right" disabled={!this.props.termsAgreed}>Deploy now</button>
        </div>
      </div>);
    }
  }

  Deploy.propTypes = {
    termsAgreed: PropTypes.bool,
    setState: PropTypes.func
  };

  juju.components.Deploy = Deploy;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section'
  ]
});
