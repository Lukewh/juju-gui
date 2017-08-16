/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

/** Status React component used to display Juju status. */
class Status extends React.Component {
  /**
    Return an element class name suitable for the given value.
    @param {String} value The provided value.
    @returns {String} The class name ('ok', 'error' or '').
  */
  _getClass(value) {
    switch (value) {
      case 'active':
      case 'idle':
      case 'started':
        return 'ok';
      case 'blocked':
      case 'down':
      case 'error':
        return 'error';
    }
    return '';
  }

  /**
    Sort by the key attribute.
    @param {Object} a The first value.
    @param {Object} b The second value.
    @returns {Array} The sorted array.
  */
  _byKey(a, b) {
    if (a.key < b.key)
      return -1;
    if (a.key > b.key)
      return 1;
    return 0;
  }

  /**
    Generate the current model status.
    @returns {Object} The resulting element.
  */
  _generateStatus() {
    const elements = [];
    const db = this.props.db;
    const model = this.props.model;
    if (!model.environmentName) {
      // No need to go further: we are not connected to a model.
      return 'Cannot show the status: the GUI is not connected to a model.';
    }
    elements.push(this._generateModel(model));
    if (db.remoteServices.size()) {
      elements.push(this._generateRemoteApplications(db.remoteServices));
    }
    if (db.services.size()) {
      elements.push(
        this._generateApplications(db.services),
        this._generateUnits(db.services)
      );
    }
    if (db.machines.size()) {
      elements.push(this._generateMachines(db.machines));
    }
    if (db.relations.size()) {
      elements.push(this._generateRelations(db.relations));
    }
    return elements;
  }

  /**
    Generate the model fragment of the status.
    @param {Object} model The model attributes.
    @returns {Object} The resulting element.
  */
  _generateModel(model) {
    return (
      <juju.components.BasicTable
        headers={[{
          content: 'Model',
          columnSize: 3
        }, {
          content: 'Cloud/Region',
          columnSize: 3
        }, {
          content: 'Version',
          columnSize: 3
        }, {
          content: 'SLA',
          columnSize: 3
        }]}
        key="model"
        rows={[{
          columns: [{
            columnSize: 3,
            content: model.environmentName
          }, {
            columnSize: 3,
            content: `${model.cloud}/${model.region}`
          }, {
            columnSize: 3,
            content: model.version
          }, {
            columnSize: 3,
            content: model.sla
          }],
          key: 'model'
        }]} />);
  }

  /**
    Generate the remote applications fragment of the status.
    @param {Object} remoteApplications The remote applications as included in
      the GUI db.
    @returns {Object} The resulting element.
  */
  _generateRemoteApplications(remoteApplications) {
    const rows = remoteApplications.map(application => {
      const app = application.getAttrs();
      const urlParts = app.url.split(':');
      return {
        columns: [{
          columnSize: 3,
          content: app.service
        }, {
          columnSize: 3,
          content: app.status.current
        }, {
          columnSize: 3,
          content: urlParts[0]
        }, {
          columnSize: 3,
          content: urlParts[1]
        }],
        key: app.url
      };
    });
    return (
      <juju.components.BasicTable
        headers={[{
          content: 'SAAS',
          columnSize: 3
        }, {
          content: 'Status',
          columnSize: 3
        }, {
          content: 'Store',
          columnSize: 3
        }, {
          content: 'URL',
          columnSize: 3
        }]}
        key="remote-applications"
        rows={rows}
        sort={this._byKey} />);
  }

  /**
    Generate the applications fragment of the status.
    @param {Object} applications The applications as included in the GUI db.
    @returns {Object} The resulting element.
  */
  _generateApplications(applications) {
    const urllib = this.props.urllib;
    const rows = applications.map((application, i) => {
      const app = application.getAttrs();
      const charm = urllib.fromLegacyString(app.charm);
      const store = charm.schema === 'cs' ? 'jujucharms' : 'local';
      const revision = charm.revision;
      // Set the revision to null so that it's not included when calling
      // charm.path() below.
      charm.revision = null;
      return {
        columns:[{
          columnSize: 2,
          content: app.name
        }, {
          columnSize: 2,
          content: app.workloadVersion
        }, {
          columnSize: 2,
          content: (
            <span className={this._getClass(app.status.current)}
              key={'status' + i}>
              {app.status.current}
            </span>)
        }, {
          columnSize: 1,
          content: app.units.size()
        }, {
          columnSize: 2,
          content: charm.path()
        }, {
          columnSize: 2,
          content: store
        }, {
          columnSize: 1,
          content: revision
        }],
        key: app.name
      };
    });
    return (
      <juju.components.BasicTable
        headers={[{
          content: 'Application',
          columnSize: 2
        }, {
          content: 'Version',
          columnSize: 2
        }, {
          content: 'Status',
          columnSize: 2
        }, {
          content: 'Scale',
          columnSize: 1
        }, {
          content: 'Charm',
          columnSize: 2
        }, {
          content: 'Store',
          columnSize: 2
        }, {
          content: 'Rev',
          columnSize: 1
        }]}
        key="applications"
        rows={rows}
        sort={this._byKey} />);
  }

  /**
    Generate the units fragment of the status.
    @param {Object} applications The applications as included in the GUI db.
    @returns {Object} The resulting element.
  */
  _generateUnits(applications) {
    const formatPorts = ranges => {
      if (!ranges) {
        return '';
      }
      return ranges.map(range => {
        if (range.from === range.to) {
          return `${range.from}/${range.protocol}`;
        }
        return `${range.from}-${range.to}/${range.protocol}`;
      }).join(', ');
    };
    const rows = [];
    applications.each(application => {
      application.get('units').each((unit, i) => {
        rows.push({
          columns: [{
            columnSize: 2,
            content: unit.displayName
          }, {
            columnSize: 2,
            content: (
              <span className={this._getClass(unit.workloadStatus)}
                key={'workload' + i}>
                {unit.workloadStatus}
              </span>)
          }, {
            columnSize: 2,
            content: (
              <span className={this._getClass(unit.agentStatus)}
                key={'agent' + i}>
                {unit.agentStatus}
              </span>)
          }, {
            columnSize: 1,
            content: unit.machine
          }, {
            columnSize: 2,
            content: unit.public_address
          }, {
            columnSize: 1,
            content: formatPorts(unit.portRanges)
          }, {
            columnSize: 2,
            content: unit.workloadStatusMessage
          }],
          key: unit.id
        });
      });
    });
    if (!rows.length) {
      return null;
    }
    return (
      <juju.components.BasicTable
        headers={[{
          content: 'Unit',
          columnSize: 2
        }, {
          content: 'Workload',
          columnSize: 2
        }, {
          content: 'Agent',
          columnSize: 2
        }, {
          content: 'Machine',
          columnSize: 1
        }, {
          content: 'Public address',
          columnSize: 2
        }, {
          content: 'Ports',
          columnSize: 1
        }, {
          content: 'Message',
          columnSize: 2
        }]}
        key="units"
        rows={rows.sort(this._byKey.bind(this, 0))}
        sort={this._byKey} />);
  }

  /**
    Generate the machines fragment of the status.
    @param {Object} machines The machines as included in the GUI db.
    @returns {Object} The resulting element.
  */
  _generateMachines(machines) {
    const rows = machines.map((machine, i) => {
      return {
        columns: [{
          columnSize: 2,
          content: machine.displayName
        }, {
          columnSize: 2,
          content: (
            <span className={this._getClass(machine.agent_state)}
              key={'agent' + i}>
              {machine.agent_state}
            </span>)
        }, {
          columnSize: 2,
          content: machine.public_address
        }, {
          columnSize: 2,
          content: machine.instance_id
        }, {
          columnSize: 2,
          content: machine.series
        }, {
          columnSize: 2,
          content: machine.agent_state_info
        }],
        key: machine.id
      };
    });
    return (
      <juju.components.BasicTable
        headers={[{
          content: 'Machine',
          columnSize: 2
        }, {
          content: 'State',
          columnSize: 2
        }, {
          content: 'DNS',
          columnSize: 2
        }, {
          content: 'Instance ID',
          columnSize: 2
        }, {
          content: 'Series',
          columnSize: 2
        }, {
          content: 'Message',
          columnSize: 2
        }]}
        key="machines"
        rows={rows.sort(this._byKey.bind(this, 0))}
        sort={this._byKey} />);
  }

  /**
    Generate the relations fragment of the status.
    @param {Array} relations The relations as included in the GUI db.
    @returns {Object} The resulting element.
  */
  _generateRelations(relations) {
    const rows = relations.map(relation => {
      const rel = relation.getAttrs();
      let name = '';
      let provides = '';
      let consumes = '';
      let scope = '';
      rel.endpoints.forEach(endpoint => {
        const application = endpoint[0];
        const ep = endpoint[1];
        switch (ep.role) {
          case 'peer':
            name = ep.name;
            provides = application;
            consumes = application;
            scope = 'peer';
            return;
          case 'provider':
            name = ep.name;
            consumes = application;
            scope = 'regular';
            break;
          case 'requirer':
            provides = application;
            break;
        }
      });
      return {
        columns: [{
          columnSize: 3,
          content: name
        }, {
          columnSize: 3,
          content: provides
        }, {
          columnSize: 3,
          content: consumes
        }, {
          columnSize: 3,
          content: scope
        }],
        key: rel.id
      };
    });
    return (
      <juju.components.BasicTable
        headers={[{
          content: 'Relation',
          columnSize: 3
        }, {
          content: 'Provides',
          columnSize: 3
        }, {
          content: 'Consumes',
          columnSize: 3
        }, {
          content: 'Type',
          columnSize: 3
        }]}
        key="relations"
        rows={rows.sort(this._byKey.bind(this, 0))}
        sort={this._byKey} />);
  }

  render() {
    return (
      <juju.components.Panel
        instanceName="status-view"
        visible={true}>
        <div className="status-view__content">
          {this._generateStatus()}
        </div>
      </juju.components.Panel>
    );
  }
};

Status.propTypes = {
  db: shapeup.shape({
    machines: shapeup.shape({
      map: PropTypes.func.isRequired,
      size: PropTypes.func.isRequired
    }).isRequired,
    relations: shapeup.shape({
      map: PropTypes.func.isRequired,
      size: PropTypes.func.isRequired
    }).isRequired,
    remoteServices: shapeup.shape({
      map: PropTypes.func.isRequired,
      size: PropTypes.func.isRequired
    }).isRequired,
    services: shapeup.shape({
      each: PropTypes.func.isRequired,
      map: PropTypes.func.isRequired,
      size: PropTypes.func.isRequired
    }).isRequired
  }).frozen.isRequired,
  model: shapeup.shape({
    cloud: PropTypes.string,
    environmentName: PropTypes.string,
    region: PropTypes.string,
    sla: PropTypes.string,
    version: PropTypes.string
  }).frozen.isRequired,
  urllib: shapeup.shape({
    fromLegacyString: PropTypes.func.isRequired
  }).frozen.isRequired
};

YUI.add('status', function() {
  juju.components.Status = Status;
}, '', {
  requires: [
    'basic-table',
    'panel-component'
  ]
});
