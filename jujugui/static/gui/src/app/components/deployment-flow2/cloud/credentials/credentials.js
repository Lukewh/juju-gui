/* Copyright (C) 2017 Canonical Ltd. */

'use strict';


class Credentials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdd: !this.props.credentials
    };
  }

  /**
    Generate the list of credential options.

    @method _generateCredentials
    @returns {Array} The list of credential options.
  */
  _generateCredentials() {
    let options = [];
    const stateCredentials = this.props.credentials;
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
      this.props.selectCredentials(value);
    }
  }

  completeSection() {
    this.props.setState({
      selectedCredentials: this.credential.value
    });
    this.props.completeSection();
  }

  _generateSelection() {
    return (
      <div className="deployment-flow2-choose-credentials">
        <form className="deployment-credential__form">
          <div className="three-col deployment-flow2-choose-credentials__image">
            <juju.components.SvgIcon
              height="60"
              width="234"
              name="aws" />
          </div>
          <div className="four-col">
            <juju.components.DfSelect
              label="Credential"
              onChange={this._handleCredentialChange.bind(this)}
              options={this._generateCredentials()}
              parentRef={(ele) => {this.credential = ele}}
              value={this.state.selectedCredentials}
            />
          </div>
          <div className="four-col last-col">
            <juju.components.DfSelect
              label="Region"
              onChange={this.props.setRegion}
              options={[
                {label: 'eu-west-1', value: 'eu-west-1'}
              ]}
              value="eu-west-1"
            />
          </div>

          <div className="twelve-col deployment-flow2__section-sshkeys">
            <h2 className="deployment-flow2__section-title">Add SSH keys (optional)</h2>
            <juju.components.DeploymentSSHKey
              getGithubSSHKeys={this.props.getGithubSSHKeys}
              WebHandler={this.props.WebHandler}
              addNotification={()=>{}}
              cloud={{}}
              setSSHKeys={()=>{}}
            />
          </div>
          <div className="twelve-col">
            <button className="button--inline-positive right"
              onClick={this.completeSection.bind(this)}>Confirm</button>
          </div>
        </form>
      </div>
    );
  }

  addCredentials(name, key, secret) {
    this.setState({
      showAdd: false
    });
    this.props.addCredentials(name, key, secret);
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
        <span className="link right" role="button" onClick={this.props.switchView}>
          Change cloud
        </span>
        <h2 className="deployment-flow2__section-title">Provide your Amazon Web Services credentials</h2>
        <div className="deployment-flow2-credentials__machines">
          <juju.components.AccordionSection
            startOpen={false}
            title={accordionTitle}>
          <table className="df-table">
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
        {content}
      </div>
    );
  }
}

Credentials.propTypes = {
  addCredentials: PropTypes.func.isRequired,
  completeSection: PropTypes.func.isRequired,
  credentials: PropTypes.any,
  getGithubSSHKeys: PropTypes.func.isRequired,
  setState: PropTypes.func,
  selectedCloud: PropTypes.string.isRequired,
  selectCredentials: PropTypes.func.isRequired,
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
