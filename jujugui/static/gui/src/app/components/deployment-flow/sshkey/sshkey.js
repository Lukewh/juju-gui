/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

/**
  This component allows users to provide their public SSH keys.
  Providing SSH keys when creating a model is important as it allows accessing
  the machines provisioned on that model, via "juju ssh" or similar. On Azure,
  providing SSH keys is even more important as, at least for the time being, no
  machines can be provisioned otherwise.
*/

// Define the Azure cloud type.
const AZURE_CLOUD_TYPE = 'azure';

class DeploymentSSHKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addSource: 'github',
      SSHkeys: [],
      error: null,
      buttonDisabled: true
    };
  }

  /**
    Handle keyboard input to listen for return key.

    @param {Object} evt The keyboard event.
  */
  _onKeyUp(evt) {
    if (evt.which === 13) {
      this._handleAddMoreKeys(null);
    }
    const hasValue = (this.sshKey && this.sshKey.value) ||
      (this.githubUsername && this.githubUsername.value)
    this.setState({
      buttonDisabled: hasValue ? false : true
    });
  }

  /**
    Split a Manual Key into its parts.

    @param {String} sshkey In the format `{type} {key}` eg. `ssh-rsa ad122...`
   */
  _validateAndSplitKey(sshKey) {
    if (sshKey.indexOf(' ') > -1) {
      const splitKey = sshKey.split(' ');
      if (splitKey.length >= 2) {
        return {
          'body': splitKey[1],
          'text': sshKey,
          'type': splitKey[0],
          'id': 0 // To conform to the schema of the github api
        };
      }
    }
    this.setState({error: (<span>Key is invalid. Please
    ensure you have copied the key correctly.
      <br />The key should be in the format&nbsp;
      <code>ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAvvy/8OHTchL2XhNxE0Fu5...</code>
    </span>)});
    return false;
  }

  /**
    Check if an sshkey exists to avoid duplication.

    @param {Object} key The key object to check.
    @return {Boolean}
  */
  _keyExists(key) {
    return this.state.SSHkeys.
      findIndex(knownKey => knownKey.body === key.body) !== -1;
  }

  /**
    Handle adding github username.

    @param {String} error The error returned.
    @param {Array} keys The returned keys.
  */
  _addGithubKeysCallback(error, keys) {
    if (error) {
      const message = 'could not get SSH keys';
      this.props.addNotification({
        title: message,
        message: `${message}: ${error}`,
        level: 'error'
      });
      console.error(message, error);
      this.setState({error: error});
      return;
    }

    if (keys.length === 0) {
      this.setState({error:
        (<span>No keys found. <a className="link"
          href="https://github.com/settings/keys" target="_blank">
          Create an SSH Key</a>.</span>)});
      return;
    }

    let SSHkeys = this.state.SSHkeys;
    keys.forEach(key => {
      if (!this._keyExists(key)) {
        SSHkeys.push(key);
      }
    });
    this.props.setSSHKeys(SSHkeys);
    this.setState({SSHkeys: SSHkeys, buttonDisabled: true});
    this.githubUsername.value = '';
    this.githubUsername.focus();
  }

  /**
    Handle clicking AddMoreKeys.
  */
  _handleAddMoreKeys() {
    if (this.state.buttonDisabled) {
      return;
    }
    const source = this.sshSource.value;
    this.setState({error: null});
    if (source === 'github') {
      const githubUsername = this.githubUsername.value;
      this.props.getGithubSSHKeys(
        new this.props.WebHandler,
        githubUsername,
        this._addGithubKeysCallback.bind(this)
      );
    } else if (source === 'manual') {
      const manualKey = this.sshKey.value;
      const key = this._validateAndSplitKey(manualKey);
      if (key) {
        this.props.setSSHKeys([key]);
        let SSHkeys = this.state.SSHkeys;
        if (!this._keyExists(key)) {
          SSHkeys.push(key);
        }
        this.setState({SSHkeys: SSHkeys, buttonDisabled: true});
        this.sshKey.value = '';
        this.sshKey.focus();
      }
    }
  }

  /**
    Handle source change.
  */
  _handleSourceChange() {
    const source = this.sshSource.value;
    this.setState({addSource: source, buttonDisabled: true});
  }

  /**
    Remove key from table.

    @param {Number} keyId The key's ID.
  */
  _removeKey(keyId) {
    const newSSHkeyList = this.state.SSHkeys.filter(key => {
      return key.id !== keyId;
    });
    this.setState({SSHkeys: newSSHkeyList});
    // For now, we only support import all or none.
    if (!newSSHkeyList.length) {
      this.props.setSSHKeys([]);
    }
  }

  /**
    Create the added keys section.

    @return {Object} The React list of keys.
  */
  _generateAddedKeys() {
    const SSHkeys = this.state.SSHkeys;
    const stringLengths = 30;

    if (Object.keys(SSHkeys).length === 0) {
      return false;
    }

    let listBody = [];
    SSHkeys.forEach((key, i) => {
      let uniqueKey = key.id + i;
      let body = key.body;

      if (body.length >= stringLengths * 2) {
        const bodyStart = key.body.substring(0, stringLengths);
        const bodyEnd = key.body.substring(key.body.length - stringLengths);
        body = `${bodyStart}...${bodyEnd}`;
      }
      listBody.push(
        <li className="deployment-flow__row twelve-col" key={uniqueKey}>
          <div className="two-col">{key.type}</div>
          <div className="nine-col added-keys__key-value" title={key.body}>
            {body}
          </div>
          <div className="one-col last-col">
            <span className="added-keys__key-remove right" title="Remove key"
              role="button"
              onClick={this._removeKey.bind(this, key.id)}>
              <juju.components.SvgIcon
                name="close_16" size="16" />
            </span>
          </div>
        </li>
      );
    });

    return (
      <ul className="deployment-machines__list clearfix">
        <li className="deployment-flow__row-header twelve-col" >
          <div className="two-col">Type</div>
          <div className="ten-col last-col">Key</div>
        </li>
        {listBody}
      </ul>
    );
  }

  /**
    Create the added keys section.

    @return {Object} The React input for either github or manual keys.
  */
  _generateAddKey() {
    const cloud = this.props.cloud;
    if (!cloud) {
      return false;
    }

    if (this.state.addSource === 'github') {
      return (
        <div className="three-col last-col no-margin-bottom">
          <juju.components.DfInput
            label="GitHub username"
            id="githubUsername"
            parentRef={(ele) => {this.githubUsername = ele}}
            onKeyUp={this._onKeyUp.bind(this)}
          />
        </div>
      );
    } else if (this.state.addSource === 'manual') {
      return (
        <div className="seven-col no-margin-bottom">
          <juju.components.DfInput
            label="Enter your SSH key (typically found at ~/.ssh/id_rsa.pub)"
            id="sshKey"
            parentRef={(ele) => {this.sshKey = ele}}
            onKeyUp={this._onKeyUp.bind(this)}
          />
        </div>
      );
    }
  }

  /**
    Create the added key button.

    @return {Object} The React button element.
  */
  _generateAddKeyButton() {
    const title = this.state.addSource === 'github' ? 'Add Keys' : 'Add Key';
    const disabled = this.state.buttonDisabled;
    return (<div className="right">
      <juju.components.GenericButton
        action={this._handleAddMoreKeys.bind(this)}
        disabled={disabled}
        type="neutral">
        {title}
      </juju.components.GenericButton>
    </div>);
  }

  /**
    Generate select options for the available sources.

    @return {Array} The sshkey source options.
  */
  _generateSourceOptions() {
    return [
      {
        label: 'GitHub',
        value: 'github'
      },
      {
        label: 'Manual',
        value: 'manual'
      }
    ];
  }

  /**
    If an error occurs, generate it.

    @return {Object} Notification component.
  */
  _generateError() {
    if (this.state.error) {
      const content = <span><b>Error:</b> {this.state.error}</span>;
      return (<juju.components.Notification
        content={content}
        type="negative" />);
    }
    return false;
  }

  render() {
    const cloud = this.props.cloud;
    if (!cloud) {
      return null;
    }
    const isAzure = cloud.cloudType === AZURE_CLOUD_TYPE;

    let message = (
      <p>
        Keys will allow you SSH access to the machines provisioned by Juju
        for this model.
      </p>
    );
    if (isAzure) {
      message = (
        <p>
          Keys will allow you SSH access to the machines provisioned on Azure.
        </p>
      );
    }


    return (
      <div className="deployment-ssh-key">
        {message}
        {this._generateAddedKeys()}
        {this._generateError()}
        <div className="twelve-col">
          <div className="three-col no-margin-bottom">
            <juju.components.DfSelect
              label="Source"
              id="sshSource"
              parentRef={(ele) => {this.sshSource = ele}}
              onChange={this._handleSourceChange.bind(this)}
              options={this._generateSourceOptions()}
            />
          </div>
          {this._generateAddKey()}
          {this._generateAddKeyButton()}
        </div>
      </div>
    );
  }
};

DeploymentSSHKey.propTypes = {
  WebHandler: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  cloud: PropTypes.object,
  getGithubSSHKeys: PropTypes.func.isRequired,
  setSSHKeys: PropTypes.func.isRequired
};

YUI.add('deployment-ssh-key', function() {
  juju.components.DeploymentSSHKey = DeploymentSSHKey;
}, '0.1.0', {
  requires: [
    'deployment-flow2-df-input',
    'deployment-flow2-df-select',
    'inset-select',
    'notification',
    'generic-input',
    'generic-button',
    'svg-icon'
  ]
});
