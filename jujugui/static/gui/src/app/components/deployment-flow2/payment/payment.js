/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-payment', function() {
  class Payment extends juju.components.Section {
    constructor(props) {
      super(props, {}, 'payment');
    }

    _generateHeaderContent() {
      return (<span>Payment</span>)
    }

    render() {
      return super.render(<div>
        Payment
        <button className="button--positive"
          onClick={this._completeSection.bind(this)}>Payment</button>
      </div>);
    }
  }

  Payment.propTypes = {};

  juju.components.Payment = Payment;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section'
  ]
});
