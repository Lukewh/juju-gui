/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

class DeploymentFlow2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      completeSections: [],
      estimatedCost: {
        jaasHosting: 25.50,
      },
      isLoggedIn: false,
      openSection: 'modelName',
      sectionsComplete: 0,
      sectionsTotal: 7,
      visitedSections: ['modelName']
    };

    this.sectionOrder = [
      'modelName',
      'cloud',
      'supportLevel',
      'jaasHosting',
      'total',
      'payment',
      'deploy'
    ];
  }

  componentWillMount() {
    if (this.props.ddData) {
      this._getDirectDeployEntity(this.props.ddData.id);
    }
  }

  componentDidMount() {
    this.props.setPageTitle('Deploy your model');
  }

  setEstimatedCost(name, cost) {
    let estimatedCost = this.state.estimatedCost;

    estimatedCost[name] = parseInt(cost);

    this.setState({
      estimatedCost: estimatedCost
    });
  }

  getEstimatedCost() {
    let cost = 0;
    Object.keys(this.state.estimatedCost).forEach(key => {
      cost += this.state.estimatedCost[key];
    });

    return cost.toFixed(2);
  }

  _handleClose() {
    console.log('close');
  }

  _generateProgressBar() {
    const width = Math.ceil((this.state.sectionsComplete /
      this.state.sectionsTotal)
       * 100);
    return (<div className="deployment-flow2__progress">
      <div className="deployment-flow2__progress-bar"
        style={{width: `${width}%`}}></div>
    </div>);
  }

  _generateHeader() {
    if (!this.state.isLoggedIn && this.props.ddData) {
      return (
        <div className="deployment-panel__header deployment-panel__header--dark">
          <div className="deployment-panel__header-logo">
            <juju.components.SvgIcon
              className="svg-icon"
              height="35"
              name="juju-logo-light"
              width="90" />
          </div>
        </div>);
    } else {
      return (<div className="deployment-panel__header">
        <div className="deployment-panel__header-logo">
          <juju.components.SvgIcon
            className="svg-icon"
            height="35"
            name="juju-logo"
            width="90" />
        </div>
        <div className="inner-wrapper">
          <div className="deployment-panel__header-name">
            Deploy your model
          </div>
          <div className="deployment-panel__header-cost">
            Estimated monthly cost:
            <span className="deployment-panel__header-cost-value">
              ${this.getEstimatedCost()}
            </span>
          </div>
          {this._generateProgressBar()}
        </div>
      </div>);
    }
  }

  _goToSection(sectionName) {
    this.setState({
      openSection: sectionName
    });
    let visitedSections = this.state.visitedSections;
    if (!visitedSections.includes(sectionName)) {
      visitedSections.push(sectionName);
      this.setState({
        visistedSections: visitedSections
      });
    }
  }

  _goToVisitedSection(sectionName) {
    if (this.state.visitedSections.includes(sectionName)) {
      this._goToSection(sectionName);
    }
  }

  _completeSection() {
    const currentSectionIndex = this.sectionOrder
      .indexOf(this.state.openSection);
    const nextSection = currentSectionIndex + 1;

    let completeSections = this.state.completeSections;
    if (!completeSections
      .includes(this.sectionOrder[currentSectionIndex])) {
      completeSections.push(this.sectionOrder[currentSectionIndex]);
      this.setState({
        completeSections: completeSections,
        sectionsComplete: this.state.sectionsComplete + 1
      });
    }

    this._goToSection(this.sectionOrder[nextSection]);
  }

  _login() {
    this.setState({
      isLoggedIn: true
    });
  }

  /**
    Fetches the supplied entity in a directDeploy deployment flow.
    @param {String} entityId The entity id to fetch.
  */
  _getDirectDeployEntity(entityId) {
    const props = this.props;
    props.getEntity(entityId, (error, data) => {
      if (error) {
        console.error('unable to fetch entity: ' + error);
        props.addNotification({
          title: 'Unable to fetch entity',
          message: `Unable to fetch entity: ${error}`,
          level: 'error'
        });
        return;
      }
      this.setState({ddEntity: this.props.makeEntityModel(data[0])});
    });
  }

  _generateDirectDeploy() {
    if (this.props.ddData) {
      const props = this.props;
      const state = this.state;
      // As long as we're not loading the entity then pass what data we do have
      // through to the DirectDeploy component and have it determine what to
      // render.
      return (
        <juju.components.DeploymentDirectDeploy
          addNotification={props.addNotification}
          changeState={props.changeState}
          ddData={props.ddData}
          entityModel={state.ddEntity}
          generatePath={props.generatePath}
          getDiagramURL={props.getDiagramURL}
          renderMarkdown={props.renderMarkdown}
        />
      );
    }
    return null;
  }

  _generateSignup() {
    if (!this.state.isLoggedIn && this.props.ddData) {
      return (
        <juju.components.DeploymentLogin
          addNotification={() => {}}
          callback={() => {}}
          gisf={false}
          isDirectDeploy={true}
          loginToController={this._login.bind(this)}
          showLoginLinks={true}
        />
      );
    }
  }

  _generateSections() {
    if (this.state.isLoggedIn || !this.props.ddData) {
      const openSection = this.state.openSection;
      return (
        <div>
          <juju.components.ModelName
          isComplete={this.state.completeSections.includes('modelName')}
          isLoggedIn={this.state.isLoggedIn}
          isOpen={openSection === 'modelName'}
          isVisited={this.state.visitedSections.includes('modelName')}
          goToVisitedSection={this._goToVisitedSection.bind(this)}
          completeSection={this._completeSection.bind(this)}
          login={this._login.bind(this)} />
        <juju.components.Cloud
          isComplete={this.state.completeSections.includes('cloud')}
          isOpen={openSection === 'cloud'}
          isVisited={this.state.visitedSections.includes('cloud')}
          goToVisitedSection={this._goToVisitedSection.bind(this)}
          completeSection={this._completeSection.bind(this)}
          getGithubSSHKeys={this.props.getGithubSSHKeys}
          WebHandler={this.props.WebHandler} />
        <juju.components.SupportLevel
          isComplete={this.state.completeSections.includes('supportLevel')}
          isOpen={openSection === 'supportLevel'}
          isVisited={this.state.visitedSections.includes('supportLevel')}
          goToVisitedSection={this._goToVisitedSection.bind(this)}
          completeSection={this._completeSection.bind(this)}
          setEstimatedCost={this.setEstimatedCost.bind(this)}
          getEstimatedCost={this.getEstimatedCost.bind(this)} />
        <juju.components.JaasHosting
          isComplete={this.state.completeSections.includes('jaasHosting')}
          isOpen={openSection === 'jaasHosting'}
          isVisited={this.state.visitedSections.includes('jaasHosting')}
          goToVisitedSection={this._goToVisitedSection.bind(this)}
          completeSection={this._completeSection.bind(this)} />
        <juju.components.Total
          isComplete={this.state.completeSections.includes('total')}
          isOpen={openSection === 'total'}
          isVisited={this.state.visitedSections.includes('total')}
          goToVisitedSection={this._goToVisitedSection.bind(this)}
          completeSection={this._completeSection.bind(this)}
          getEstimatedCost={this.getEstimatedCost.bind(this)} />
        <juju.components.Payment
          isComplete={this.state.completeSections.includes('payment')}
          isOpen={openSection === 'payment'}
          isVisited={this.state.visitedSections.includes('payment')}
          goToVisitedSection={this._goToVisitedSection.bind(this)}
          completeSection={this._completeSection.bind(this)} />
        <juju.components.Deploy
          isComplete={this.state.completeSections.includes('deploy')}
          isOpen={openSection === 'deploy'}
          isVisited={this.state.visitedSections.includes('deploy')}
          goToVisitedSection={this._goToVisitedSection.bind(this)}
          completeSection={this._completeSection.bind(this)} />
      </div>);
    }
  }

  render() {
    return (
      <juju.components.Panel
        instanceName="deployment-flow2-panel"
        visible={true}>
        <div className="deployment-panel">
          {this._generateHeader()}
          <div className="deployment-panel__content">
            {this._generateDirectDeploy()}
            {this._generateSignup()}
            {this._generateSections()}
          </div>
        </div>
      </juju.components.Panel>
    );
  }
}

DeploymentFlow2.propTypes = {
  addNotification: PropTypes.func,
  changeState: PropTypes.func,
  ddData: PropTypes.object,
  generatePath: PropTypes.func,
  getDiagramUrl: PropTypes.func,
  getEntity: PropTypes.func,
  getGithubSSHKeys: PropTypes.func,
  makeEntityModel: PropTypes.func,
  renderMarkdown: PropTypes.func,
  setPageTitle: PropTypes.func,
  WebHandler: PropTypes.func
};

YUI.add('deployment-flow2', function() {
  juju.components.DeploymentFlow2 = DeploymentFlow2;
}, '0.1.0', {
  requires: [
    'deployment-direct-deploy',
    'deployment-login',
    'deployment-flow2-model-name',
    'deployment-flow2-cloud',
    'deployment-flow2-support-level',
    'deployment-flow2-jaas-hosting',
    'deployment-flow2-total',
    'deployment-flow2-payment',
    'deployment-flow2-deploy',
    'panel'
  ]
});
