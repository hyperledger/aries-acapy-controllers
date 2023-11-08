import fs from 'fs';
import koa from 'koa';
import router from 'koa-router';
import { koaBody } from 'koa-body';
import open from 'open';
import qrcode from 'qrcode';
import axios from 'axios';

const config = JSON.parse(fs.readFileSync('./config.json').toString('utf8'));
const app = new koa();
const routerInstance = new router();

let status = '';
let state = 'NEW';
let connectionId = null;
let revocationRegistryId = null;
let revocationId = null;
let presentationExchangeId = null;

// App endpoints
routerInstance.get('/', koaBody(), async ctx => {
    ctx.body = fs.readFileSync('./webpage.html').toString('utf8');
});

routerInstance.get('/qrcode', koaBody(), async ctx => {
    console.log('Getting QR Code.');
    // create a connection request
    let response = await sendTractionRequest('/connections/create-invitation', {}, {
        alias: 'demo-connection',
        auto_accept: true,
        multi_use: true,
        public: false
    });
    let invitationUrl = response.invitation_url;

    ctx.body = await qrcode.toBuffer(invitationUrl);
    ctx.type = 'image/png';
    state = 'CONNECTION INVITATION';
});

routerInstance.get('/status', koaBody(), async ctx => {
    ctx.body = status;
    ctx.status = 200;
});

routerInstance.post('/presentationRequest', koaBody(), async ctx => {
    console.log('Sending Presentation Request');
    // send request
    let body = {
        "connection_id": connectionId,
        "auto_verify": false,
        "trace": false,
        "proof_request": {
            "name": "proof-request",
            "nonce": "1234567890",
            "version": "1.0",
            "requested_attributes": {
                "demo_attributes": {
                    "names": [
                        "given_name",
                        "family_name"
                    ],
                    "restrictions": [
                        {
                            "cred_def_id": config.credentialDefinitionId
                        }
                    ]
                }
            },
            "requested_predicates": {
                "not_expired": {
                    "name": "expires",
                    "p_type": ">=",
                    "p_value": Number.parseInt(new Date().toISOString().substring(0, 10).replace(/-/g, '')),
                    "restrictions": [
                        {
                            "cred_def_id": config.credentialDefinitionId
                        }
                    ]
                }
            }
        }
    };
    let response = await sendTractionRequest('/present-proof/send-request', body);

    presentationExchangeId = response.presentation_exchange_id;
    status += '<div style="margin-top: 5px;">Presentation Request Sent.</div>';
    ctx.status = 200;
});

routerInstance.post('/revoke', koaBody(), async ctx => {
    console.log('Revoking credential.');
    await sendTractionRequest('/revocation/revoke', {
        "connection_id": connectionId,
        "rev_reg_id": revocationRegistryId,
        "cred_rev_id": revocationId,
        "publish": true,
        "notify": true
    });
    status += '<div style="margin-top: 5px;">Revocation sent.</div>';
    status += '<div style="margin-top: 5px;">Credential has been revoked.</div>';
    state = 'REVOKED';
    ctx.status = 200;
});

routerInstance.post('/reset', koaBody(), async ctx => {
    console.log('Resetting app.');
    status = '';
    state = 'NEW';
    connectionId = null;
    revocationRegistryId = null;
    revocationId = null;
    presentationExchangeId = null;
    ctx.status = 200;
});

// Webhook endpoints
routerInstance.post('/topic/connections', koaBody(), async ctx => {
    // incoming connection message
    // check authorization
    if (ctx.request.headers['x-api-key'] !== 'demo-issuance') {
        ctx.status = 401;
        return;
    }

    // unless the connection is made (state = active) and we're in the correct state, we just wait
    if (ctx.request.body.state !== 'active' || state !== 'CONNECTION INVITATION') {
        ctx.status = 200;
        return;
    }

    // now that the connection is made, offer the credential
    connectionId = ctx.request.body.connection_id;
    status = '<div>Connection has been made.</div>';
    console.log('Sending credential offer.');
    // create a credential offer
    await sendTractionRequest('/issue-credential/send-offer', {
        auto_issue: config.autoIssue,
        auto_remove: false,
        connection_id: connectionId,
        cred_def_id: config.credentialDefinitionId,
        trace: false,
        credential_preview: {
            '@type': 'issue-credential/1.0/credential-preview',
            attributes: [
                { name: 'given_name', value: config.credentialData.givenName },
                { name: 'family_name', value: config.credentialData.familyName },
                { name: 'expires', value: config.credentialData.expires }
            ]
        }
    });
    status += '<div>Credential offer has been sent.</div>';
    ctx.status = 200;
    state = 'OFFER SENT';
});

routerInstance.post('/topic/issue_credential', koaBody(), async ctx => {
    // incoming credential message
    // check authorization
    if (ctx.request.headers['x-api-key'] !== 'demo-issuance') {
        ctx.status = 401;
        return;
    }

    // if state = abandoned then user declined
    if (ctx.request.body.state === 'abandoned' && state === 'OFFER SENT') {
        console.log('User declined.')
        status += '<div>User declined credential offer.</div>';
    }
    // if state = credential_acked or credential_issued then user received the credential in their wallet
    if (['credential_acked', 'credential_issued'].includes(ctx.request.body.state) && ['OFFER SENT', 'CREDENTIAL ISSUED'].includes(state)) {
        revocationRegistryId = ctx.request.body.revoc_reg_id;
        revocationId = ctx.request.body.revocation_id;
        console.log('Issuance complete.');
        status += '<div>User received credential in their wallet.</div>';
        status += `<div style="padding-left: 10px;">Connection ID: ${connectionId}</div>`;
        status += `<div style="padding-left: 10px;">Revocation Registry ID: ${revocationRegistryId}</div>`;
        status += `<div style="padding-left: 10px;">Revocation ID: ${revocationId}</div>`;
        state = 'DONE';
    }
    // if state = request_received then we received the credential request
    if (ctx.request.body.state === 'request_received' && state === 'OFFER SENT') {
        status += '<div>Credential request received.</div>';
        // if we're not auto-issuing the credential then we must manually issue
        if (!ctx.request.body.auto_issue) {
            console.log('Issuing credential.');
            // create a credential offer
            await sendTractionRequest(`/issue-credential/records/${ctx.request.body.credential_exchange_id}/issue`);
            status += '<div>Credential has been issued.</div>';
        }
        state = 'CREDENTIAL ISSUED';
    }

    ctx.status = 200;
});

routerInstance.post('/topic/present_proof', koaBody(), async ctx => {
    if (presentationExchangeId === null || presentationExchangeId !== ctx.request.body.presentation_exchange_id) {
        ctx.status = 200;
        return;
    }

    if (ctx.request.body.state === 'verified') {
        console.log('User presented successfully.');
        status += '<div>Presentation has been verified.</div>';
        presentationExchangeId = null;
    } else if (ctx.request.body.state === 'abandoned') {
        console.log('User declined presentation.');
        status += '<div>Presentation has been declined.</div>';
        presentationExchangeId = null;
    }
});

app.use(routerInstance.routes()).use(routerInstance.allowedMethods());

app.listen(8080, function() {
    console.log('Demo Issuance App started.');
});

open('http://localhost:8080');

// helper function
async function authenticate() {
    console.log('Authenticating with Traction.');
    let result = await axios.post(`https://traction-sandbox-tenant-proxy.apps.silver.devops.gov.bc.ca/multitenancy/tenant/${config.tenantId}/token`, {
        api_key: config.apiKey
    });
    return result.data.token;
}

async function sendTractionRequest(relativeUrl, body = {}, params = null) {
    let token = await authenticate();
    console.log('Sending request to Traction.');
    let response = await axios.post(`https://traction-sandbox-tenant-proxy.apps.silver.devops.gov.bc.ca${relativeUrl}`, body, {
        params,
        headers: {
            'User-Agent': 'Traction Demo',
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}