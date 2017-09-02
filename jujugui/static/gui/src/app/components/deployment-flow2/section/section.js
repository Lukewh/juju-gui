/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

class Section extends React.Component {
  constructor(props, state, name) {
    super(props);

    this.name = name;

    this.state = Object.assign(state, {
      isComplete: this.props.isComplete,
      isOpen: this.props.isOpen,
      isVisited: this.props.isVisited
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isComplete !== this.props.isComplete) {
      this.setState({
        isComplete: nextProps.isComplete
      });
    }
    if (nextProps.isOpen !== this.props.isOpen) {
      this.setState({
        isOpen: nextProps.isOpen
      });
    }
    if (nextProps.isVisited !== this.props.isVisited) {
      this.setState({
        isVisited: nextProps.isVisited
      });
    }
  }

  _generateHeaderContent() {
    return (<span>Section Header</span>);
  }

  _completeSection() {
    this.props.completeSection(this.name);
  }

  _goToVisitedSection() {
    this.props.goToVisitedSection(this.name);
  }

  _renderHeader() {
    return (<div className="deployment-flow2__section-header clearfix"
      onClick={this._goToVisitedSection.bind(this)}>
      <div className="inner-wrapper">
        {this._generateHeaderContent()}
      </div>
    </div>);
  }

  render(content) {
    content = (
      <div className="deployment-flow2__section-content clearfix">
        <div className="inner-wrapper">
          {content}
        </div>
      </div>);
    const contentOrHeader = this.state.isOpen ? content : this._renderHeader();
    const classes = classNames(
      'deployment-flow2__section',
      {
        'is-complete': this.state.isComplete,
        'is-visited': this.state.isVisited,
        'is-open': this.props.isOpen,
      }
    );
    return (
      <div className={classes}>
        {contentOrHeader}
      </div>
    );
  }
}

Section.propTypes = {
  isComplete: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isVisited: PropTypes.bool.isRequired,
  completeSection: PropTypes.func.isRequired,
  goToVisitedSection: PropTypes.func.isRequired
};

YUI.add('deployment-flow2-section', function() {
  juju.components.Section = Section;
}, '0.1.0', {
  requires: [
    'svg-icon'
  ]
});
