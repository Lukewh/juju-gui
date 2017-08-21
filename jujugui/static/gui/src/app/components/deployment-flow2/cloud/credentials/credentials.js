/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-credentials', function() {
  class Credentials extends juju.components.Section {
    _renderNotification() {
      const content = (<span>
        <b>Info:</b> Credentials are stored securely on our servers.
      </span>);
      return (<juju.components.notification
        content={content} />);
    }

    _renderGCE() {
      return (<div>
        <h2>Provide your Google Compute Engine credentials</h2>
        <button className="button--positive"
          onClick={this.props.completeSection.bind(this)}>Cloud</button>
        {this._renderNotification()}
      </div>);
    }

    render() {
      return (
        <div className="deployment-flow2-credentials">
          <span role="button" onClick={this.props.switchView}>
            Change cloud
          </span>
          {this[`_render${this.props.selectedCloud.toUpperCase()}`]()}
          <juju.components.GenericInput
            />
          <small>Credentials name e.g. "My personal credentials"</small>

          <div className="deployment-flow2-credentials__file-drop">
            Drag and drop GCE auth files here or&nbsp;
            <span role="button">browse files</span>
          </div>

          <div className="four-col">
            <p>The GCE provider uses OAuth to authenticate.&nbsp;
              For more information see <a href="" target="_blank">
                https://cloud.google.com/compute/docs/api/how-tows/authorization
              </a>.</p>
          </div>
          <div className="four-col">
            <p>The key information can be downloaded as a JSON file,&nbsp;
              or copied from&nbsp;
              <a href="">
                https://console.developers.google.com/project/apiui/credentials
              </a>, and entered manually.</p>
          </div>
          <div className="twelve-col"></div>
        </div>
      );
    }
  }

  Credentials.propTypes = {
    completeSection: PropTypes.func.isRequired,
    selectedCloud: PropTypes.string.isRequired,
    switchView: PropTypes.func.isRequired
  };

  juju.components.Credentials = Credentials;
}, '0.1.0', {
  requires: [
    'generic-button',
    'generic-input',
    'notification',
    'svg-icon'
  ]
});
