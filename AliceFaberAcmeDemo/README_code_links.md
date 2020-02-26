# Links to code in the Faber-Alice-Acme Demo

List of common events in the FAA demo and links to code where these events are handled.

| **Event** | **Agent** | **Controller (Web)** | **Controller (Agent Subprocess)** |
| - | - | - | - | - |
| Initialization | [Faber](https://github.com/petridishdev/aries-cloudagent-python/blob/6f50cfdd0e3ff015b50cf82b0ed817436d4f70e5/demo/runners/faber.py#L132-L138) <br> [Alice](https://github.com/petridishdev/aries-cloudagent-python/blob/6f50cfdd0e3ff015b50cf82b0ed817436d4f70e5/demo/runners/alice.py#L223-L229) <br> [Acme](https://github.com/petridishdev/aries-cloudagent-python/blob/6f50cfdd0e3ff015b50cf82b0ed817436d4f70e5/demo/runners/acme.py#L129-L131) | Faber <br> Alice <br> Acme | Faber <br> Alice <br> Acme |
| Generate Invitation | | [Faber](https://github.com/petridishdev/aries-acapy-controllers/blob/a2744a36e0409c1267456fdc4e337bd56b6c5564/AliceFaberAcmeDemo/controllers/faber-controller/FaberController/Connection/Components/NewConnection.razor#L50) <br> [Alice](https://github.com/petridishdev/aries-acapy-controllers/blob/a2744a36e0409c1267456fdc4e337bd56b6c5564/AliceFaberAcmeDemo/controllers/alice-controller/src/app/connection/components/new-connection/new-connection.component.ts#L27) <br> [Acme](https://github.com/petridishdev/aries-acapy-controllers/blob/a2744a36e0409c1267456fdc4e337bd56b6c5564/AliceFaberAcmeDemo/controllers/acme-controller/routes/connection.js#L66) |
| Receive Invitation | | | Faber <br> Alice <br> Acme |
| Offer Credential (Faber) | | |
| Request Credential (Alice) | | |
| Issue Credential (Faber) | | |
| Request Proof (Faber, Acme) | | |
| Receive Proof Request / Send Proof (Alice) | | |
| Verify Proof (Faber, Acme) | | |
| WebHooks processing (Alice) | | |

## UI Integration

 - Initialization
 - Events received
 - UI Updates