/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-cloud', function() {
  class Cloud extends juju.components.Section {
    constructor(props) {
      const state = {
        selectedCloud: null,
        hasCredentials: null,
        view: 'clouds'
      };
      super(props, state, 'cloud');
    }

    _generateHeaderContent() {
      return (<span>Cloud</span>)
    }

    _selectCloud(cloud) {
      this.setState({
        selectedCloud: cloud
      });
    }

    _switchView() {
      this.setState({
        view: this.state.view === 'clouds' ? 'creds' : 'clouds'
      });
    }

    _renderCloudSelection() {
      return (
        <div className="deployment-flow2-cloud__list">
          <div className="four-col">
            <div className="p-card--highlighted"
              onClick={this._selectCloud.bind(this, 'aws')}>
              <juju.components.SvgIcon name="complete" size="16" /> AWS
            </div>
          </div>
          <div className="four-col">
            <div className="p-card--highlighted is-disabled">
              <juju.components.SvgIcon name="complete" size="16" /> GCE
            </div>
          </div>
          <div className="four-col last-col">
            <div className="p-card--highlighted is-disabled">
              <juju.components.SvgIcon name="complete" size="16" /> Azure
            </div>
          </div>
          <juju.components.GenericButton action={this._switchView.bind(this)}
            disabled={this.selectedCloud}>
            Provide your credentials...
          </juju.components.GenericButton>
        </div>
      );
    }

    _renderCredentialsSection() {
      if (this.state.selectedCloud) {
        return (
          <juju.components.Credentials
            completeSection={this._completeSection.bind(this)}
            getGithubSSHKeys={this.props.getGithubSSHKeys}
            selectedCloud={this.state.selectedCloud}
            switchView={this._switchView.bind(this)}
            WebHandler={this.props.WebHandler} />);
      }
      return null;
    }

    render() {
      const content = this.state.view === 'clouds' ?
        this._renderCloudSelection() :
        this._renderCredentialsSection();
      return super.render(content);
    }
  }

  Cloud.propTypes = {
    getGithubSSHKeys: PropTypes.func.isRequired,
    WebHandler: PropTypes.func.isRequired
  };

  juju.components.Cloud = Cloud;
}, '0.1.0', {
  requires: [
    'deployment-flow2-credentials',
    'deployment-flow2-section',
    'svg-icon',
    'generic-button'
  ]
});
