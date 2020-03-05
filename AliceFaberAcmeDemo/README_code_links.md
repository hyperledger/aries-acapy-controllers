# Links to code in the Alice-Faber-Acme Demo

List of common events in the AFA demo and links to code where these events are handled.

## Table of Contents

- [Links to code in the Alice-Faber-Acme Demo](#links-to-code-in-the-alice-faber-acme-demo)
    - [Table of Contents](#table-of-contents)
        - [Events](#events)
            - [Initialization](#initialization)
                - [Agents](#agents)
                - [Controllers](#controllers)
            - [Generate Invitation](#generate-invitation)
            - [Receive Invitation](#receive-invitation)
            - [Offer Credential (Faber)](#offer-credential-faber)
            - [Request Credential (Alice)](#request-credential-alice)
            - [Issue Credential (Faber)](#issue-credential-faber)
            - [Request Proof (Acme)](#request-proof-acme)
            - [Receive Proof Request / Send Proof (Alice)](#receive-proof-request-\/-send-proof-alice)
            - [Verify Proof (Acme)](#verify-proof-acme)
            - [WebHooks processing](#webhooks-processing)

### Events

The AFA demo is built using a static reference to agents in a [fork](https://github.com/petridishdev/aries-cloudagent-python/tree/openapi-demo) of the original [ACA-Py](https://github.com/hyperledger/aries-cloudagent-python) repository. This was specifically done to ensure that the demo web controllers do not break if the upstream demo agents are updated. Therefore, links to agent code may be different from the upstream repository over time. The demo code and accompanying links in this document will be updated as frequently as possible to remain as close to the upstream repository as possible.

#### Initialization

##### Agents

Agents are instantiated Python sub classes, in the ACA-Py repository,  that extend the `DemoAgent` base class and are run in `asyncio` event loops.

- Faber agent is initialized in [demo/runners/faber.py](https://github.com/petridishdev/aries-cloudagent-python/blob/openapi-demo/demo/runners/faber.py), specifically at the [`agent = FaberAgent(...`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/faber.py#L132-L138) line in the [`main`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/faber.py#L121) function
- Alice agent is initialized in [demo/runners/alice.py](https://github.com/petridishdev/aries-cloudagent-python/blob/openapi-demo/demo/runners/alice.py), specifically at the [`agent = AliceAgent(...`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/alice.py#L223-L229) line in the [`main`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/alice.py#L212) function
- Acme agent is initialized in [demo/runners/acme.py](https://github.com/petridishdev/aries-cloudagent-python/blob/openapi-demo/demo/runners/acme.py)
, specifically at the [`agent = AcmeAgent(...`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/acme.py#L102-L104) line in the [`main`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/acme.py#L91) function

##### Controllers

As of this current writing, controllers are a hybrid between web applications and subprocess that run off of agent event loops. Subprocesses implement webhook callbacks for incoming agent messages and triggers, while web interfaces call various REST API endpoints exposed by the agent to the controller. _Note: Over time, this will change as the web interfaces fully implement webhook handlers themselves._

**Faber**

Faber controller is a .NET Core 3.1 web application, built using C# classes that are compiled to bytecode by the `dotnet` SDK. The compiled application is run using the `dotnet` runtime. The application specifies a [`Program`](https://github.com/hyperledger/aries-acapy-controllers/blob/204c1ce07c4ac9caa611dff001fae7c37183f360/AliceFaberAcmeDemo/controllers/faber-controller/FaberController/Program.cs#L14) class in [Program.cs](controllers/faber-controller/FaberController/Program.cs) which contains a [`Main`](https://github.com/hyperledger/aries-acapy-controllers/blob/204c1ce07c4ac9caa611dff001fae7c37183f360/AliceFaberAcmeDemo/controllers/faber-controller/FaberController/Program.cs#L16) function for the application entrypoint. A [`Startup`](https://github.com/hyperledger/aries-acapy-controllers/blob/204c1ce07c4ac9caa611dff001fae7c37183f360/AliceFaberAcmeDemo/controllers/faber-controller/FaberController/Startup.cs#L16) configuration class is [referenced](https://github.com/hyperledger/aries-acapy-controllers/blob/204c1ce07c4ac9caa611dff001fae7c37183f360/AliceFaberAcmeDemo/controllers/faber-controller/FaberController/Program.cs#L25) here from [Startup.cs](controllers/faber-controller/FaberController/Startup.cs) that injects services to be used in the application and specifies other runtime settings. The [`main`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/faber.py#L121) function of the Faber agent runs as a controller subprocess at the [`asyncio.get_event_loop().run_until_complete(...`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/faber.py#L302-L304) line in [demo/runners/faber.py](https://github.com/petridishdev/aries-cloudagent-python/blob/openapi-demo/demo/runners/faber.py).

**Alice**

Alice controller is an Angular 7 web application built using TypeScript classes. Angular ships with a 'compiler' that will transpile the TypeScript to vanilla JavaScript code and bundle the application modules, which are referenced in a root `index.html` page via `<script>` tags. The `index.html` page can be served by any static web server and contains a root application web component where the main application module (typically called [AppModule](controllers/alice-controller/src/app/app.module.ts))  is bootstrapped and loaded when the page is served. The [main.ts](controllers/alice-controller/src/main.ts) file is responsible for bootstrapping the application in the browser at the [`platformBrowserDynamic().bootstrapModule(...`](https://github.com/hyperledger/aries-acapy-controllers/blob/204c1ce07c4ac9caa611dff001fae7c37183f360/AliceFaberAcmeDemo/controllers/alice-controller/src/main.ts#L13) line. The [`main`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/alice.py#L212) function of the Alice agent runs as a controller subprocess at the [`asyncio.get_event_loop().run_until_complete(...`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/alice.py#L299-L301) line in [demo/runners/alice.py](https://github.com/petridishdev/aries-cloudagent-python/blob/openapi-demo/demo/runners/alice.py).

**Acme**

Acme controller is an Express.js web application built using vanilla JavaScript and is run using the Node.js 10 runtime. The Node.js runtime contains a built-in `http` module which exposes a `createServer` method (that can accept an application configuration object as a parameter) for creating server instances. The webserver is created at the [var server = http.createServer(...](https://github.com/hyperledger/aries-acapy-controllers/blob/204c1ce07c4ac9caa611dff001fae7c37183f360/AliceFaberAcmeDemo/controllers/acme-controller/bin/www#L22) line in [bin/www](controllers/acme-controller/bin/www). The method references an `app` configuration object that is exported by [app.js](controllers/acme-controller/app.js), where the application specific configurations are set up. The [`main`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/acme.py#L91) function of the Acme agent runs as a controller subprocess at the [`asyncio.get_event_loop().run_until_complete(...`](https://github.com/petridishdev/aries-cloudagent-python/blob/d81665354bd84557c72107206a934cc0f3562162/demo/runners/acme.py#L213) line in [demo/runners/acme.py](https://github.com/petridishdev/aries-cloudagent-python/blob/openapi-demo/demo/runners/acme.py).

#### Generate Invitation

#### Receive Invitation

#### Offer Credential (Faber)

#### Request Credential (Alice)

#### Issue Credential (Faber)

#### Request Proof (Acme)

#### Receive Proof Request / Send Proof (Alice)

#### Verify Proof (Acme)

#### WebHooks processing

<!--
## UI Integration

 - Initialization
 - Events received
 - UI Updates
 -->