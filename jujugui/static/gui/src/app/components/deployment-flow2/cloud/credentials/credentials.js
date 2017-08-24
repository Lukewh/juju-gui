/* Copyright (C) 2017 Canonical Ltd. */

'use strict';


class Credentials extends React.Component {
  constructor() {
    super();

    this.state = {
      credentials: null,
      selectedCredentials: null,
      showAdd: true
    };
  }

  addCredentials(name, key, secret) {
    let credentials = this.state.credentials || {};
    if (credentials[name]) {
      console.error('Credentipropsals already exist with that name');
      return;
    }
    credentials[name] = {
      key: key,
      secret: secret
    };

    this.setState({
      credentials: credentials,
      showAdd: false
    });
  }

  _setCredential(name) {
    this.setState({
      selectedCredentials: name
    });
  }

  /**
    Generate the list of credential options.

    @method _generateCredentials
    @returns {Array} The list of credential options.
  */
  _generateCredentials() {
    let options = [];
    const stateCredentials = this.state.credentials;
    Object.keys(stateCredentials).forEach(key => {
      options.push({
        label: key,
        value: key
      });
    });
    options.push({
      label: 'Add credential...',
      value: 'add-credential'
    });
    return options;
  }

  /**
    Set the credential value or navigate to the add credentails form.

    @method _handleCredentialChange
    @param {String} The select value.
  */
  _handleCredentialChange(value) {
    if (value === 'add-credential') {
      this.setState({
        showAdd: true
      });
    } else {
      this._setCredential(value);
    }
  }

  /**
    Generate a change cloud action if a cloud has been selected.

    @method _generateAction
    @returns {Array} The list of actions.
  */
  _generateSelect() {
    return (
      <form className="deployment-credential__form">
        <div className="prepend-two four-col">
          <juju.components.InsetSelect
            disabled={false}
            label="Credential"
            onChange={this._handleCredentialChange.bind(this)}
            options={this._generateCredentials()}
            ref="credential"
            value={this.state.selectedCredentials} />
        </div>
        <div className="four-col">
          <juju.components.InsetSelect
            disabled={false}
            label="Region"
            onChange={this.props.setRegion}
            options={[{label: 'eu-west-1', value: 'eu-west-1'}]}
            value="eu-west-1" />
        </div>

        <div>
          <juju.components.DeploymentSSHKey
            getGithubSSHKeys={this.props.getGithubSSHKeys}
            WebHandler={this.props.WebHandler}
            addNotification={()=>{}}
            cloud={{}}
            setSSHKeys={()=>{}}
          />
        </div>

        <button className="button--positive"
          onClick={this.props.completeSection}>Confirm</button>
      </form>);
  }

  _generateSelection() {
    return (
      <div className="deployment-flow2-choose-credentials">
        Logo
        {this._generateSelect()}
      </div>
    );
  }

  render() {
    let content;
    if (this.state.showAdd) {
      content = (<juju.components.AddCredentials
        addCredentials={this.addCredentials.bind(this)}
        selectedCloud={this.props.selectedCloud} />
      );
    } else {
      content = this._generateSelection();
    }
    const accordionTitle = (<span><b>7 machines</b> will be added on Amazon Web Services. This will incur a seperate charge.</span>);
    return (
      <div className="deployment-flow2-credentials">
        <span role="button" onClick={this.props.switchView}>
          Change cloud
        </span>
        {content}
        Machines
        <juju.components.AccordionSection
          startOpen={false}
          title={accordionTitle}>
        <table>
          <tbody>
            <tr>
              <th>4 machines</th>
              <td>1 x 1GHz</td>
              <td>8 GB RAM</td>
              <td>320 GB Storage</td>
              <td>Ubuntu 14.04</td>
            </tr>
            <tr>
              <th>3 machines</th>
              <td>2 x 2GHz</td>
              <td>16 GB RAM</td>
              <td>160 GB Storage</td>
              <td>Ubuntu 14.04</td>
            </tr>
          </tbody>
        </table>
        </juju.components.AccordionSection>
      </div>
    );
  }
}

Credentials.propTypes = {
  completeSection: PropTypes.func.isRequired,
  getGithubSSHKeys: PropTypes.func.isRequired,
  selectedCloud: PropTypes.string.isRequired,
  switchView: PropTypes.func.isRequired,
  WebHandler: PropTypes.func.isRequired
};

YUI.add('deployment-flow2-credentials', function() {
  juju.components.Credentials = Credentials;
}, '0.1.0', {
  requires: [
    'accordion-section',
    'deployment-ssh-key',
    'deployment-flow2-add-credentials',
    'inset-select'
  ]
});
