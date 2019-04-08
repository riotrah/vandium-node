'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

const MODULE_PATH = 'lib/event_types/api/jwt';

const envRestorer = require( 'env-restorer' );

describe( MODULE_PATH, function() {

    let JWTValidator;

    let jwtStub;

    beforeEach( function() {

        // restore all env vars to defaults
        envRestorer.restore();

        jwtStub = {

            decode: sinon.stub(),

            validateXSRF: sinon.stub()
        };

        JWTValidator = proxyquire( '../../../../' + MODULE_PATH, {

            '../../jwt': jwtStub
        });
    });

    describe( 'JWTValidator', function() {

        const controlKey = '-----BEGIN CERTIFICATE-----\n' +
            'MIIC+DCCAeCgAwIBAgIJWWzat6EMiW/IMA0GCSqGSIb3DQEBBQUAMCMxITAfBgNV\n' +
            'BAMTGG11c2ljbGVzc29uYXBwLmF1dGgwLmNvbTAeFw0xNzAxMjcwMDE0MzJaFw0z\n' +
            'MDEwMDYwMDE0MzJaMCMxITAfBgNVBAMTGG11c2ljbGVzc29uYXBwLmF1dGgwLmNv\n' +
            'bTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALLGa6AxTe0CSirczxNN\n' +
            'W4217qXJxDhF+bbgfFADvSSBek8IkEqtptZgazlJPoo7iDlrwMUqyygNOyhpAmAj\n' +
            'NkOAuQk2BEt4wDuEZInK4wy1QqqZC84Lrf+PkTTGgopunFtqa29uW4WRFCE5k6+I\n' +
            'P3D66FheXSKQKn8+ZZDfiu/aosazyvl1fyzwq4K6dcxekwM4cQnaShIliehKE8e3\n' +
            'xIqNA1Mg8bYr5nUUPieoO9JKiJpNMEa12BM31kwAlRKToz73IgNmerF9rUJfUUuJ\n' +
            'RXICf0rh1V8pJZiOOeiD7vJkHTjXhQztK3tFQpY2Qw5TLizmxUILHEgK20WG+tWd\n' +
            'wocCAwEAAaMvMC0wDAYDVR0TBAUwAwEB/zAdBgNVHQ4EFgQU41br9S/UsyhFe2aL\n' +
            '5yEcCRRAPIMwDQYJKoZIhvcNAQEFBQADggEBAJLAf13gJA2foKOEXyWK/w9eESNz\n' +
            'Ocf5hj92bSaNjVhbaRD9c04CG8U3TDUtNtjLOOAkOFDqa1ZwpxlyC8vgH+bvrwDJ\n' +
            'UbR1LCj94n3gC17nBi31ZM5pGRk8eTxCjgy6lgaAw8YPzzNmIdOcc4bDFY2s5+ix\n' +
            'qM0WN9wAeekBx9bllS6TkX4ZP4+ls3I3WfBX5AcCZ3XCS2oSevzhH2b7RMgaHnZB\n' +
            'qMH3/ySkxZ3hr7jWC72mMYS5yNxsC77V80xqOPXE1IEfpGym3zBBXfjWSmUK3AS3\n' +
            'slGqC8NLb2GhZ2pMS/WJi3GpvwVic01XteHu0lb/w3sN93gnfMXHXigo9oI=\n' +
            '-----END CERTIFICATE-----\n'

        const keyWithoutArmor = 'MIIC+DCCAeCgAwIBAgIJWWzat6EMiW/IMA0GCSqGSIb3DQEBBQUAMCMxITAfBgNV' +
            'BAMTGG11c2ljbGVzc29uYXBwLmF1dGgwLmNvbTAeFw0xNzAxMjcwMDE0MzJaFw0z' +
            'MDEwMDYwMDE0MzJaMCMxITAfBgNVBAMTGG11c2ljbGVzc29uYXBwLmF1dGgwLmNv' +
            'bTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALLGa6AxTe0CSirczxNN' +
            'W4217qXJxDhF+bbgfFADvSSBek8IkEqtptZgazlJPoo7iDlrwMUqyygNOyhpAmAj' +
            'NkOAuQk2BEt4wDuEZInK4wy1QqqZC84Lrf+PkTTGgopunFtqa29uW4WRFCE5k6+I' +
            'P3D66FheXSKQKn8+ZZDfiu/aosazyvl1fyzwq4K6dcxekwM4cQnaShIliehKE8e3' +
            'xIqNA1Mg8bYr5nUUPieoO9JKiJpNMEa12BM31kwAlRKToz73IgNmerF9rUJfUUuJ' +
            'RXICf0rh1V8pJZiOOeiD7vJkHTjXhQztK3tFQpY2Qw5TLizmxUILHEgK20WG+tWd' +
            'wocCAwEAAaMvMC0wDAYDVR0TBAUwAwEB/zAdBgNVHQ4EFgQU41br9S/UsyhFe2aL' +
            '5yEcCRRAPIMwDQYJKoZIhvcNAQEFBQADggEBAJLAf13gJA2foKOEXyWK/w9eESNz' +
            'Ocf5hj92bSaNjVhbaRD9c04CG8U3TDUtNtjLOOAkOFDqa1ZwpxlyC8vgH+bvrwDJ' +
            'UbR1LCj94n3gC17nBi31ZM5pGRk8eTxCjgy6lgaAw8YPzzNmIdOcc4bDFY2s5+ix' +
            'qM0WN9wAeekBx9bllS6TkX4ZP4+ls3I3WfBX5AcCZ3XCS2oSevzhH2b7RMgaHnZB' +
            'qMH3/ySkxZ3hr7jWC72mMYS5yNxsC77V80xqOPXE1IEfpGym3zBBXfjWSmUK3AS3' +
            'slGqC8NLb2GhZ2pMS/WJi3GpvwVic01XteHu0lb/w3sN93gnfMXHXigo9oI=';

        describe( 'constructor', function() {

            it( 'no options, no env vars set', function() {

                let instance = new JWTValidator();

                expect( instance ).to.be.instanceof( JWTValidator );
                expect( instance.enabled ).to.be.false;
            });

            it( 'enabled = false', function() {

                let instance = new JWTValidator( { enabled: false } );

                expect( instance ).to.be.instanceof( JWTValidator );
                expect( instance.enabled ).to.be.false;
            });
            
            it( 'enabled = false, env vars set for algorithm and key', function() {
                
                process.env.VANDIUM_JWT_ALGORITHM = 'HS256';
                process.env.VANDIUM_JWT_KEY = 'super-secret';

                let instance = new JWTValidator( { enabled: false } );
                
                expect( instance ).to.be.instanceof( JWTValidator );
                expect( instance.enabled ).to.be.false;
            });

            it( 'no options, env vars set for algorithm and secret', function() {

                process.env.VANDIUM_JWT_ALGORITHM = 'HS256';
                process.env.VANDIUM_JWT_SECRET = 'super-secret';

                let instance = new JWTValidator();

                expect( instance.enabled ).to.be.true;
                expect( instance.algorithm ).to.equal( 'HS256' );
                expect( instance.key ).to.equal( 'super-secret' );
                expect( instance.tokenPath ).to.eql( [ 'headers', 'jwt' ] );
                expect( instance.xsrf ).to.be.false;
            });

            it( 'no options, env vars set for algorithm and key', function() {

                process.env.VANDIUM_JWT_ALGORITHM = 'HS256';
                process.env.VANDIUM_JWT_KEY = 'super-secret';

                let instance = new JWTValidator();

                expect( instance.enabled ).to.be.true;
                expect( instance.algorithm ).to.equal( 'HS256' );
                expect( instance.key ).to.equal( 'super-secret' );
                expect( instance.tokenPath ).to.eql( [ 'headers', 'jwt' ] );
                expect( instance.xsrf ).to.be.false;
            });

            it( 'no options, env vars set for algorithm and publicKey', function() {

                process.env.VANDIUM_JWT_ALGORITHM = 'RS256';
                process.env.VANDIUM_JWT_PUBKEY = controlKey;

                let instance = new JWTValidator();

                expect( instance.enabled ).to.be.true;
                expect( instance.algorithm ).to.equal( 'RS256' );
                expect( instance.key ).to.equal( controlKey );
                expect( instance.tokenPath ).to.eql( [ 'headers', 'jwt' ] );
                expect( instance.xsrf ).to.be.false;
            });

            it( 'no options, env vars set for algorithm (RS256) and key', function() {

                process.env.VANDIUM_JWT_ALGORITHM = 'RS256';
                process.env.VANDIUM_JWT_KEY = controlKey;

                let instance = new JWTValidator();

                expect( instance.enabled ).to.be.true;
                expect( instance.algorithm ).to.equal( 'RS256' );
                expect( instance.key ).to.equal( controlKey );
                expect( instance.tokenPath ).to.eql( [ 'headers', 'jwt' ] );
                expect( instance.xsrf ).to.be.false;
            });

            it( 'no options, env vars set for algorithm (RS256) and key without armor', function() {

                process.env.VANDIUM_JWT_ALGORITHM = 'RS256';
                process.env.VANDIUM_JWT_KEY = keyWithoutArmor;

                let instance = new JWTValidator();

                expect( instance.enabled ).to.be.true;
                expect( instance.algorithm ).to.equal( 'RS256' );
                expect( instance.key ).to.equal( controlKey );
                expect( instance.tokenPath ).to.eql( [ 'headers', 'jwt' ] );
                expect( instance.xsrf ).to.be.false;
            });

            it( 'no options, all env vars xsrf = true', function() {

                process.env.VANDIUM_JWT_ALGORITHM = 'HS256';
                process.env.VANDIUM_JWT_SECRET = 'super-secret';
                process.env.VANDIUM_JWT_USE_XSRF = 'TRUE';

                let instance = new JWTValidator();

                expect( instance.enabled ).to.be.true;
                expect( instance.algorithm ).to.equal( 'HS256' );
                expect( instance.key ).to.equal( 'super-secret' );
                expect( instance.tokenPath ).to.eql( [ 'headers', 'jwt' ] );
                expect( instance.xsrf ).to.be.true;
                expect( instance.xsrfTokenPath ).to.eql( [ 'headers', 'xsrf' ] );
                expect( instance.xsrfClaimPath ).to.eql( ['nonce'] );
            });

            it( 'no options, all env vars set including xsrf', function() {

                process.env.VANDIUM_JWT_ALGORITHM = 'HS256';
                process.env.VANDIUM_JWT_SECRET = 'super-secret';
                process.env.VANDIUM_JWT_USE_XSRF = 'TRUE';
                process.env.VANDIUM_JWT_XSRF_TOKEN_PATH = 'queryParamters.xsrf';
                process.env.VANDIUM_JWT_XSRF_CLAIM_PATH = 'app-data.my-xsrf-token';
                process.env.VANDIUM_JWT_TOKEN_PATH = 'queryParamters.jwt';

                let instance = new JWTValidator();

                expect( instance.enabled ).to.be.true;
                expect( instance.algorithm ).to.equal( 'HS256' );
                expect( instance.key ).to.equal( 'super-secret' );
                expect( instance.tokenPath ).to.eql( [ 'queryParamters', 'jwt' ] );
                expect( instance.xsrf ).to.be.true;
                expect( instance.xsrfTokenPath ).to.eql( [ 'queryParamters', 'xsrf' ] );
                expect( instance.xsrfClaimPath ).to.eql( [ 'app-data', 'my-xsrf-token'] );
            });

            it( 'configure with options for HS algorithm with secret', function() {

                let instance = new JWTValidator( {

                    algorithm: 'HS384',
                    secret: 'my-super-secret',
                    token: 'headers.JWT',
                    xsrf: true,
                    xsrfToken: 'headers.XSRF',
                    xsrfClaim: 'xsrfHere'
                });

                expect( instance.enabled ).to.be.true;
                expect( instance.algorithm ).to.equal( 'HS384' );
                expect( instance.key ).to.equal( 'my-super-secret' );
                expect( instance.tokenPath ).to.eql( [ 'headers', 'JWT' ] );
                expect( instance.xsrf ).to.be.true;
                expect( instance.xsrfTokenPath ).to.eql( [ 'headers', 'XSRF' ] );
                expect( instance.xsrfClaimPath).to.eql( ['xsrfHere'] );
            });

            it( 'configure with options for RS algorithm with secret', function() {

                let instance = new JWTValidator( {

                    algorithm: 'RS256',
                    publicKey: controlKey,
                    token: 'headers.JWT',
                    xsrf: true,
                    xsrfToken: 'headers.XSRF',
                    xsrfClaim: 'xsrfHere'
                });

                expect( instance.enabled ).to.be.true;
                expect( instance.algorithm ).to.equal( 'RS256' );
                expect( instance.key ).to.equal( controlKey );
                expect( instance.tokenPath ).to.eql( [ 'headers', 'JWT' ] );
                expect( instance.xsrf ).to.be.true;
                expect( instance.xsrfTokenPath ).to.eql( [ 'headers', 'XSRF' ] );
                expect( instance.xsrfClaimPath ).to.eql( ['xsrfHere'] );
            });

            it( 'fail when secret key is missing', function() {

                process.env.VANDIUM_JWT_ALGORITHM = 'HS256';

                try {

                    new JWTValidator();

                    throw new Error( 'should not get here' );
                }
                catch( err ) {

                    expect( err.message ).to.equal( 'missing required jwt configuration value: secret' );
                }
            });

            it( 'fail when public key is missing', function() {

                process.env.VANDIUM_JWT_ALGORITHM = 'RS256';

                try {

                    new JWTValidator();

                    throw new Error( 'should not get here' );
                }
                catch( err ) {

                    expect( err.message ).to.equal( 'missing required jwt configuration value: publicKey' );
                }
            });
        });

        describe( '.validate', function() {

            it( 'jwt disabled', function() {

                let instance = new JWTValidator();

                let event = {};

                instance.validate( event );

                expect( event ).to.eql( {} );

                expect( jwtStub.decode.called ).to.be.false;
                expect( jwtStub.validateXSRF.called ).to.be.false;
            });

            it( 'jwt enabled, no xsrf', function() {

                let instance = new JWTValidator( {

                    algorithm: 'HS256',
                    key: 'super-secret'
                });

                let event = {

                    headers: {

                        jwt: 'jwt-here'
                    }
                };

                const decoded = { claim1: 1, claim2: 2 };

                jwtStub.decode.returns( decoded );

                instance.validate( event );

                expect( jwtStub.decode.calledOnce ).to.be.true;
                expect( jwtStub.decode.firstCall.args ).to.eql( [ 'jwt-here', 'HS256', 'super-secret' ] );

                expect( jwtStub.validateXSRF.called ).to.be.false;

                expect( event.jwt ).to.exist;
                expect( event.jwt ).to.eql( decoded );
            });

            it( 'jwt enabled, Bearer in header value', function() {

                let instance = new JWTValidator( {

                    algorithm: 'HS256',
                    key: 'super-secret',
                    token: 'headers.Authorization'
                });

                let event = {

                    headers: {

                      Authorization: 'Bearer jwt-here'
                    }
                };

                const decoded = { claim1: 1, claim2: 2 };

                jwtStub.decode.returns( decoded );

                instance.validate( event );

                expect( jwtStub.decode.calledOnce ).to.be.true;
                expect( jwtStub.decode.firstCall.args ).to.eql( [ 'jwt-here', 'HS256', 'super-secret' ] );

                expect( jwtStub.validateXSRF.called ).to.be.false;

                expect( event.jwt ).to.exist;
                expect( event.jwt ).to.eql( decoded );
            });

            it( 'jwt enabled, with xsrf', function() {

                let instance = new JWTValidator( {

                    algorithm: 'HS256',
                    key: 'super-secret',
                    xsrf: true,
                    xsrfToken: 'headers.xsrf'
                });

                let event = {

                    headers: {

                        jwt: 'jwt-here',
                        xsrf: 'xsrfTokenHere'
                    }
                };

                const decoded = { claim1: 1, claim2: 2 };

                jwtStub.decode.returns( decoded );

                instance.validate( event );

                expect( jwtStub.decode.calledOnce ).to.be.true;
                expect( jwtStub.decode.firstCall.args ).to.eql( [ 'jwt-here', 'HS256', 'super-secret' ] );

                expect( jwtStub.validateXSRF.calledOnce ).to.be.true;

                expect( jwtStub.validateXSRF.firstCall.args ).to.eql( [ decoded, 'xsrfTokenHere', ['nonce'] ] );

                expect( event.jwt ).to.exist;
                expect( event.jwt ).to.eql( decoded );
            });
        });
    });
});
