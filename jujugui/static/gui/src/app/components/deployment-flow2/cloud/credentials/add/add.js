/* Copyright (C) 2017 Canonical Ltd. */

'use strict';


class AddCredentials extends React.Component {
  _renderNotification() {
    const content = (<span>
      <b>Info:</b> Credentials are stored securely on our servers.
    </span>);
    return (<juju.components.notification
      content={content} />);
  }

  _handleAdd() {
    const name = this.credName.refs.field.value;
    const accessKey = this.credAccessKey.refs.field.value;
    const secretKey = this.credSecretKey.refs.field.value;

    if (!name || name.trim().length === 0) {
      console.error('Provide a name for the credentials');
      return;
    }
    if (!accessKey || accessKey.trim().length === 0) {
      console.error('Provide an access key');
      return;
    }
    if (!secretKey || secretKey.trim().length === 0) {
      console.error('Provide a secret key');
      return;
    }

    this.props.addCredentials(name, accessKey, secretKey);
  }

  _renderAWS() {
    return (<div>
      <h2>Provide your Amazon Web Services credentials</h2>
      <a href="">Sign up for Amazon Web Services</a>

      <div className="six-col">
        <juju.components.GenericInput
          label="Credential name"
          multiLine={false}
          required={true}
          ref={(ele) => {this.credName = ele}}
          type="text" />
      </div>
      <div className="twelve-col">
        <h3>Enter credentials</h3>
      </div>1
      <div className="six-col">
        <p>Need help? Read more about credentials in general or setting up AWS credentials.</p>
        <juju.components.GenericInput
          label="EC2 Access key"
          multiLine={false}
          required={true}
          ref={(ele) => {this.credAccessKey = ele}}
          type="text" />
        <juju.components.GenericInput
          label="EC2 Secret key"
          multiLine={false}
          required={true}
          ref={(ele) => {this.credSecretKey = ele}}
          type="text" />
      </div>
      <div className="six-col last-col">
        <p>Credentials are stored securely on our servers and we will notify you by email whenever they are changed or deleted. You can see where they are used and manage or remove them via the account page.</p>
      </div>
      <button className="button--positive"
        onClick={this._handleAdd.bind(this)}>Add cloud credentials</button>
    </div>);
  }

  render() {
    return (
      <div className="deployment-flow2-add-credentials">
        {this[`_render${this.props.selectedCloud.toUpperCase()}`]()}
      </div>
    );
  }
}

AddCredentials.propTypes = {
  selectedCloud: PropTypes.string.isRequired,
  addCredentials: PropTypes.func.isRequired
};

YUI.add('deployment-flow2-add-credentials', function() {
  juju.components.AddCredentials = AddCredentials;
}, '0.1.0', {
  requires: [
    'generic-button',
    'generic-input',
    'notification',
    'svg-icon'
  ]
});
