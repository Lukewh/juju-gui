/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

/** Profile React component used to display user details. */
class Profile extends React.Component {

  render() {
    const sectionsMap = Profile.sectionsMap;
    let section = sectionsMap.get(this.props.activeSection);
    let mapEntry;
    if (section === undefined) {
      // Grab the first element in the sectionsMap if the provided
      // activeSection does not exist.
      mapEntry = sectionsMap.entries().next().value;
      // The value of the Map entry.
      section = mapEntry[1];
    }

    return (
      <juju.components.Panel
        instanceName="profile"
        visible={true}>
        <juju.components.ProfileHeader />
        <div className="profile__content">
          <juju.components.ProfileNavigation
            // Use supplied activeSection or the key from the first map entry.
            activeSection={this.props.activeSection || mapEntry[0]}
            changeState={this.props.changeState}
            sectionsMap={sectionsMap}/>
          {section.getComponent(this)}
        </div>
      </juju.components.Panel>
    );
  }

};

Profile.sectionsMap = new Map([
  ['models', {
    label: 'Models',
    getComponent: component => {
      return (
        <juju.components.ProfileModelList
          acl={component.props.acl}
          addNotification={component.props.addNotification}
          changeState={component.props.changeState}
          clearCanvasInfo={component.props.clearCanvasInfo}
          facadesExist={component.props.facadesExist}
          destroyModels={component.props.destroyModels}
          listModelsWithInfo={component.props.listModelsWithInfo}
          switchModel={component.props.switchModel}
          userInfo={component.props.userInfo} />);
    }
  }],
  ['charms', {
    label: 'Charms',
    getComponent: context => 'Charms'
  }],
  ['bundles', {
    label: 'Bundles',
    getComponent: context => 'Bundles'
  }],
  ['credentials', {
    label: 'Cloud Credentials',
    getComponent: context => 'Cloud Credentials'
  }]
]);

Profile.propTypes = {
  acl: PropTypes.object,
  activeSection: PropTypes.string,
  addNotification: PropTypes.func.isRequired,
  changeState: PropTypes.func.isRequired,
  clearCanvasInfo: PropTypes.func.isRequired,
  destroyModels: PropTypes.func.isRequired,
  facadesExist: PropTypes.bool.isRequired,
  listModelsWithInfo: PropTypes.func.isRequired,
  switchModel: PropTypes.func.isRequired,
  // userInfo must have the following attributes:
  // - external: the external user name to use for retrieving data, for
  //   instance, from the charm store. Might be null if the user is being
  //   displayed for the current user and they are not authenticated to
  //   the charm store;
  // - isCurrent: whether the profile is being displayed for the currently
  //   authenticated user;
  // - profile: the user name for whom profile details must be displayed.
  userInfo: PropTypes.object.isRequired
};

YUI.add('profile', function() {
  juju.components.Profile = Profile;
}, '', {
  requires: [
    'panel-component',
    'profile-navigation',
    'profile-header',
    'profile-model-list'
  ]
});
