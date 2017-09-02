/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-cloud', function() {
  class Cloud extends juju.components.Section {
    constructor(props) {
      super(props, {}, 'cloud');
    }

    _generateHeaderContent() {
      if (this.props.selectedCredentials) {
          return(<span>Cloud: <b>AWS</b> &bull; Credentials <b>{this.props.selectedCredentials}</b> &bull; Machines: <b>7</b></span>);
      }
      return (<span>Cloud</span>)
    }

    _selectCloud(cloud) {
      this.props.setState({
        selectedCloud: cloud
      });
      this._switchView();
    }

    _switchView() {
      this.setState({
        view: this.state.view === 'clouds' ? 'creds' : 'clouds'
      });
    }

    _renderCloudSelection() {
      return (
        <div>
          <h2 className="deployment-flow2__section-title">Choose a cloud to deploy to</h2>
          <div className="deployment-flow2-cloud__list">
            <div className="four-col">
              <div className="p-card--highlighted"
                onClick={this._selectCloud.bind(this, 'aws')}>
                <juju.components.SvgIcon
                  height="150"
                  width="156"
                  name='aws' />
              </div>
            </div>
            <div className="four-col">
              <div className="p-card--highlighted is-disabled">
                <juju.components.SvgIcon
                  height="150"
                  width="156"
                  name='google' />
              </div>
            </div>
            <div className="four-col last-col">
              <div className="p-card--highlighted is-disabled">
                <juju.components.SvgIcon
                  height="150"
                  width="156"
                  name='azure' />
              </div>
            </div>
          </div>
        </div>
      );
    }

    addCredentials(name, key, secret) {
      let credentials = this.props.credentials || {};
      if (credentials[name]) {
        console.error('Credentials already exist with that name');
        return;
      }
      credentials[name] = {
        key: key,
        secret: secret
      };

      this.props.setState({
        credentials: credentials
      });
    }

    selectCredentials(name) {
      this.props.setState({
        selectedCredentials: name
      });
    }

    _renderCredentialsSection() {
      if (this.props.selectedCloud) {
        return (
          <juju.components.Credentials
            addCredentials={this.addCredentials.bind(this)}
            completeSection={this._completeSection.bind(this)}
            credentials={this.props.credentials}
            getGithubSSHKeys={this.props.getGithubSSHKeys}
            selectedCloud={this.props.selectedCloud}
            selectCredentials={this.selectCredentials.bind(this)}
            setState={this.props.setState}
            switchView={this._switchView.bind(this)}
            WebHandler={this.props.WebHandler} />);
      }
      return null;
    }

    render() {
      let content;
      if (this.props.selectedCredentials || this.props.selectedCloud) {
        content = this._renderCredentialsSection()
      } else {
        content = this._renderCloudSelection();
      }
      return super.render(content);
    }
  }

  Cloud.propTypes = {
    getGithubSSHKeys: PropTypes.func.isRequired,
    WebHandler: PropTypes.func.isRequired,
    selectedCredentials: PropTypes.string,
    selectedCloud: PropTypes.string,
    credentials: PropTypes.object
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
