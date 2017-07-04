/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2017 Canonical Ltd.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3, as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

YUI.add('post-deployment', function() {
  juju.components.PostDeployment = React.createClass({
    displayName: 'PostDeployment',

    propTypes: {
      closeModal: React.PropTypes.func.isRequired,
      entityId: React.PropTypes.string.isRequired,
      renderMarkdown: React.PropTypes.func.isRequired,
    },

    _getContent: function() {
      return this.props.renderMarkdown(
        `---
## Get [kubectl](https://kubernetes.io/docs/user-guide/kubectl/)

You need the Kubectl CLI to control workloads at your cluster.

1. \`$ sudo snap install kubectl --classic\`
2. Verify with:
\`$ kubectl\`
3. Setup *kubectl* – make a directory for the credentials:
\`$ mkdir -p ~/.kube\`
4. Copy them down:
\`$ juju scp kubernetes-master/0:config ~/.kube/config\`
You'll be prompted to enter your SSH passphrase.

---

## Connect to you cluster

1. Establish a proxy and copy the IP it reports:
\`$ kubectl proxy\`
2. Visit that address, in a browser:
**xxx.xxx.xxx.xxx:8001/ui**.
(Note the trailing \`/ui\`).
3. Bypass any ”Not secure” warnings, and login.
The username is **admin**, and the password is also **admin**.
[About Kubernetes security](link)
4. Use the **Kubernetes Dashboard**.

---

### First workload?
Try the [Microbots example](link) in the full tutorial, section 4

### What next?

* [GPUs for Kubernetes](https://medium.com/intuitionmachine/how-we-commoditized-gpus-for-kubernetes-7131f3e9231f).
* [A transcoding platform](https://github.com/deis/workflow).
* [Your ownprivate PaaS](https://insights.ubuntu.com/2017/03/27/job-concurrency-in-kubernetes-lxd-cpu-pinning-to-the-rescue/).
        `
      );
    },

    _renderIntro: function() {
      return (<div className="content">
        <h2>The Canonical Distrubution of Kubernates</h2>
        <ul>
          <li><a href="" className="link external">The long version</a> of this tutorial</li>
          <li><a href="" className="link external">Full release notes</a></li>
          <li>Official site: <a href="https://kubernetes.io" className="link external">Kubernetes</a></li>
          <li>Get involved: <a href="https://kubernetes.io/comunity/" className="link external">Kubernetes community</a>
          </li>
        </ul>
      </div>);
    },

    _renderExplaination: function() {
      return (
        <juju.components.AccordionItem
          title="What are Juju and JAAS?"
          showTick={false}>
          <p><b>Juju</b> runs your Kubernetes cluster, as a <em>model</em>, in the cloud.</p>
          <p><b>JAAS</b> is the hosted version of Juju,\
           hosted by Canonical, the makers of Ubuntu</p>
          <p>Read more: <a href="https://jujucharms.com/docs/stable/getting-started">getting started with Juju</a>.</p>
        </juju.components.AccordionItem>);
    },

    _renderFirstTime: function() {
      return (
        <juju.components.AccordionItem
          title="Fist-time JAAS and Juju user?"
          showTick={false}>
          <ol>
            <li>
              <code>sudo snap install juju --classic</code>
              <br />(This assumes you have <a href="">Snappy</a>)
            </li>
            <li>
              As a test, run:<br />
              <code>juju</code>
            </li>
            <li>
              Register with the JAAS controller<br />
              <code>juju register jimm.jujucharms.com</code>
            </li>
            <li>Authorise using Ubuntu SSO.</li>
            <li>Name the controller. We suggest <em>jaas</em>.</li>
            <li>Import your SSH key from Github. <a href="">SSH Help</a>.<br />
              <code>juju import-ssh-key gh:&lt;username&gt;</code></li>
            <li>Check it's working:<br />
              <code>juju run --machine 0 -- date</code></li>
          </ol>
        </juju.components.AccordionItem>);
    },

    render: function() {
      if (this.props.entityId.indexOf('bundle/canonical-kubernetes') > -1) {
        return (
          <div className="modal modal--right post-deployment">
            <div className="twelve-col no-margin-bottom">
              <h2 className="post-deployment__title">QuickStart</h2>
              <span className="close" tabIndex="0" role="button"
                onClick={this.props.closeModal}
                >
                <juju.components.SvgIcon name="close_16"
                  size="16" />
              </span>
            </div>
            <div className="content p-strip--light">
              <p className="no-margin-bottom">For <em>Ubuntu</em>. Switch to <a href="" className="link">CentOS</a>, <a href="" className="link">other Linux distributions</a>, <a href="" className="link">macOS</a> or <a href="" className="link">Windows</a></p>
            </div>
            {this._renderIntro()}
            <juju.components.Accordion>
              {this._renderExplaination()}
              {this._renderFirstTime()}
            </juju.components.Accordion>
            <div className="content"
              dangerouslySetInnerHTML={{__html: this._getContent()}} />
          </div>
        );
      } else {
        return null;
      }
    }

  });

}, '0.1.0', { requires: [
  'svg-icon',
  'accordion',
  'accordion-item'
]});
