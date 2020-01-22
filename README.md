# Aries Cloud Agent - Python (ACA-py) Demo Controllers

Web controllers for the [Aries Cloud Agent - Python (ACA-Py)](https://github.com/hyperledger/aries-cloudagent-python) agent [demo](https://github.com/hyperledger/aries-cloudagent-python/tree/master/demo#the-alicefaber-python-demo) aimed primarily at business or first-time Aries developers.

## Table of Contents

- [Running With Docker](#running-with-docker)
- [Running Locally](#running-locally)
    - [Prerequisites](#prerequisites)'
        - [ACA-py Agents](#aca-py-agents)
        - [VON Network](#von-network)
    - [Running Controllers](#running-controllers)
- [Demo Walkthrough](#demo-walkthrough)
    1. [Alice graduates from Faber College](#1-alice-graduates-from-faber-college)
    2. [Alice accepts an invitation from Faber for her Degree](#2-alice-accepts-an-invitation-from-faber-for-her-degree)
    3. [Faber issues a Degree credential to Alice](#3-faber-issues-a-degree-credential-to-alice)
    4. [Alice applies for a job at Acme](#4-alice-applies-for-a-job-at-acme)
    5. [Acme agrees to interview Alice](#5-acme-agrees-to-interview-alice)
    6. [Acme requests a proof of education from Alice](#6-acme-requests-a-proof-of-education-from-alice)
- [Note to Developers](#note-to-developers)

### Running With Docker

This will be the easiest setup option. Please see the [Docker Web Demo](./demo/README_web.md) documentation for instructions.

### Running Locally

#### Prerequesites

##### ACA-py Agents

Controllers are dependent on their respective cloud agents. Please follow instructions for [running agents locally](https://github.com/hyperledger/aries-cloudagent-python/tree/master/demo#running-locally) or [running agents in docker](https://github.com/hyperledger/aries-cloudagent-python/tree/master/demo#running-in-docker) as controllers wont do anything if agents are not running.

##### VON Network

The web demo also relies on running a Hyperledger Indy Node network. Is is recommended to use the [VON Network](https://github.com/bcgov/von-network), developed as a portable Indy Node Network implementation for local development. Instructions for setting up the `von-network` can be viewed [here](https://github.com/bcgov/von-network#running-the-network-locally) or [here](./demo/README_web.md#von-network).

**Note: the web demo will not work without a local VON Network running.**

#### Running Controllers

Please see the [Controller](./demo/controllers/README.md) documentation for instructions on how to run controllers in your local environment.

### Demo Walkthrough

This part will take you through the specific steps of the Faber-Alice-Acme workflow.

[Faber](./demo/controllers/faber-controller/README.md), [Alice](./demo/controllers/alice-controller/README.md) and [Acme](./demo/controllers/acme-controller/README.md) are each tailored to perform specific functions and are each built with a different web framework.

_See [Note to Developers](#note-to-developers) for information on the specific codebases._

#### 1. Alice graduates from Faber College
<TODO>

#### 2. Alice accepts an invitation from Faber for her Degree
<TODO>

#### 3. Faber issues a Degree credential to Alice
<TODO>

#### 4. Alice applies for a job at Acme
<TODO>

#### 5. Acme agrees to interview Alice
<TODO>

#### 6. Acme requests a proof of education from Alice
<TODO>

### Note to Developers

 The controllers are intended to further demonstrate the versatility of agents. Controllers can be built using any web or mobile framework/technology of your choosing.

If you are interested in studying/extending the [Faber](./demo/controllers/faber-controller/README.md), [Alice](/demo/controllers/alice-controller/README.md) or [Acme](/demo/controllers/acme-controller/README.md) controller codebases, each controller contains documentation with specific implementation details and how-tos for setting up development and debugging environments.