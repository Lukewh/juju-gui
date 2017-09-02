/* Copyright (C) 2017 Canonical Ltd. */

'use strict';


class AddCredentials extends React.Component {
  _handleAdd() {
    const name = this.credName.value;
    const accessKey = this.credAccessKey.value;
    const secretKey = this.credSecretKey.value;

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
    const notificationContent = (<span>
      <b>Info:</b> Credentials are stored securely on our servers and we will notify you by email whenever they are changed or deleted. You can see where they are used and manage or remove them via the&nbsp;
      <a href="/gui" target="_blank">account page</a>.
    </span>);
    return (<div className="deployment-flow2__section-add-creds">
      <div className="six-col">
        <juju.components.DfInput
          label="Credential name"
          hint="e.g. 'My personal credentials'"
          id="credentialsName"
          parentRef={(ele) => {this.credName = ele}}
        />
      </div>
      <div className="six-col last-col">
        <a href="https://aws.amazon.com/" target="_blank" className="external">Sign up for Amazon Web Services</a>
      </div>
      <div className="six-col">
        <h3 className="deployment-flow2__section-add-creds-h3">Enter credentials</h3>
        <p>Need help? Read more about <a href="https://jujucharms.com/docs/stable/credentials" target="_blank">credentials in general</a> or <a href="https://jujucharms.com/docs/stable/help-aws" target="_blank">setting up AWS credentials</a>.</p>
        <juju.components.DfInput
          label="EC2 Access key"
          id="credentialsAccess"
          parentRef={(ele) => {this.credAccessKey = ele}}
        />
        <juju.components.DfInput
          label="EC2 Secret key"
          id="credentialsSecret"
          parentRef={(ele) => {this.credSecretKey = ele}}
        />
      </div>
      <div className="six-col last-col">
        <juju.components.Notification
          type="information"
          extraClasses="deployment-flow2__section-add-creds-notification"
          content={notificationContent}
        />
      </div>
      <div className="right deployment-flow2__section-add-creds-complete">
        <juju.components.SvgIcon
          name="padlock_16"
          width="12"
          height="16" />&nbsp;SSL encrypted&nbsp;
        <button className="button--inline-positive"
          onClick={this._handleAdd.bind(this)}>Add cloud credentials</button>
      </div>
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
  addCredentials: PropTypes.func.isRequired,
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
