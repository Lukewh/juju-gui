/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-model-name', function() {
  class ModelName extends juju.components.Section {
    constructor(props) {
      super(props, {}, 'modelName');
    }

    _setName() {
      if (this.modelNameInput.valueOf().dataset.isvalid === 'true') {
        this.props._setState({
          modelName: this.modelNameInput.valueOf().value
        });
        this._completeSection();
      }
    }

    _generateHeaderContent() {
      if (this.state.isComplete) {
        return (<span>Deploying <b>{this.props._state.modelName}</b> &bull; Signed in as <b>{this.props.getUserName().split('@')[0]}</b></span>);
      } else {
        return (<span>Model name</span>);
      }
    }

    _loginCallback() {
      console.log('logged in');
    }

    _generateLoggedOut() {
      return (
        <div>
          <div className="six-col">
            {this._generateLeftSide()}
          </div>
          <div className="six-col last-col">
            <h2 className="deployment-flow2__section-title">Login to Ubuntu SSO</h2>
            <p>JAAS requires an Ubuntu One identity (Ubuntu SSO). Learn more at
              &nbsp;<a href="https://login.ubuntu.com" target="_blank">
                https://login.ubuntu.com
              </a>
            </p>
            <p>Don't have an account? <a href="">Sign up</a></p>
          </div>

          <juju.components.USSOLoginLink
            addNotification={this.props.addNotification}
            gisf={this.props.gisf}
            callback={this._loginCallback.bind(this)}
            displayType="text"
            suppressHover={true}
            loginToController={this.props.loginToController}>
            <button className="button--inline-positive right">Log in</button>
          </juju.components.USSOLoginLink>
        </div>);
    }

    _generateLoggedIn() {
      return (
        <div>
          <div className="six-col">
            {this._generateLeftSide()}
          </div>
          <div className="six-col last-col u-align--right">
            <p>Logged in as <b>{this.props.getUserName().split('@')[0]}</b>. <a href="">
              Login as a different user
            </a></p>
          </div>
          <button className="button--inline-positive right"
            onClick={this._setName.bind(this)}>Name model</button>
        </div>);
    }

    _generateLeftSide() {
      return (
        <div className="deployment-flow2__model-name">
          <h2 className="deployment-flow2__section-title">Name your model</h2>

          <juju.components.DfInput
            hint="Lower case letters, numbers and hyphens (-) only"
            id="model-name"
            parentRef={(input) => {this.modelNameInput = input}}
            value={this.props._state.modelName || 'my-model'}
            validation={[{
              regex: /\S+/,
              error: 'This field is required.'
            }, {
              regex: /^([a-z0-9]([a-z0-9-]*[a-z0-9])?)?$/,
              error: 'This field must only contain lowercase ' +
                'letters, numbers, and hyphens. It must not start or ' +
                'end with a hyphen.'
            }]}
          />
        </div>
      );
    }

    render() {
      const content = this.props.isLoggedIn ?
        this._generateLoggedIn() : this._generateLoggedOut();
      return super.render(content);
    }
  }

  ModelName.propTypes = {
    _setState: PropTypes.func.isRequired,
    _state: PropTypes.object.isRequired,
    addNotification: PropTypes.func.isRequired,
    getUserName: PropTypes.func.isRequired,
    gisf: PropTypes.bool,
    login: PropTypes.func.isRequired,
    loginToController: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  };

  juju.components.ModelName = ModelName;
}, '0.1.0', {
  requires: [
    'deployment-flow2-df-input',
    'deployment-flow2-section',
    'svg-icon',
    'usso-login-link'
  ]
});
