'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const LambdaTester = require( 'lambda-tester' );

const jwtBuilder = require( 'jwt-builder' );

const configUtils = require( './config-utils' );

const MODULE_PATH = 'lib/vandium';

const Vandium = require( '../../' + MODULE_PATH );

const envRestorer = require( 'env-restorer' );

const plugins = require( '../../lib/plugins' );

const ExecPlugin = require( '../../lib/plugins/exec' );

//require( '../lib/logger' ).setLevel( 'debug' );

describe( MODULE_PATH, function() {

    beforeEach( function() {

        envRestorer.restore();
    });

    after( function() {

        envRestorer.restore();
    });

    describe( 'Vandium', function() {

        describe( 'constructor', function() {

            it( 'no configuration', function() {

                let vandium = new Vandium();

                expect( vandium.constructor.name ).to.equal( 'Vandium' );

                expect( vandium.stripErrors ).to.be.true;
                expect( vandium.logUncaughtExceptions ).to.be.true;
                expect( vandium.postHandler ).to.be.a( 'Function' );

                expect( vandium.plugins ).to.exist;

                expect( vandium.jwt ).to.to.exist;
                expect( vandium.jwt.state.enabled ).to.be.false;

                expect( vandium.validation ).to.to.exist;
                expect( vandium.validation.state.enabled ).to.be.false;

                expect( vandium.protect ).to.to.exist;
                expect( vandium.protect.state ).to.eql( { sql: { enabled: true, mode: 'report' } } );
            });

            it( 'with empty configuration', function() {

                let vandium = new Vandium( {} );

                expect( vandium.constructor.name ).to.equal( 'Vandium' );

                expect( vandium.stripErrors ).to.be.true;
                expect( vandium.logUncaughtExceptions ).to.be.true;
                expect( vandium.postHandler ).to.be.a( 'Function' );

                expect( vandium.plugins ).to.exist;

                expect( vandium.jwt ).to.to.exist;
                expect( vandium.jwt.state.enabled ).to.be.false;

                expect( vandium.validation ).to.to.exist;
                expect( vandium.validation.state.enabled ).to.be.false;

                expect( vandium.protect ).to.to.exist;
                expect( vandium.protect.state ).to.eql( { sql: { enabled: true, mode: 'report' } } );
            });

            it( 'with configuration', function() {

                let config = {

                    validation: {

                        schema: {

                            name: 'string:min=1,max=60,trim,required',
                        },

                        ignore: [ 'age' ]
                    },

                    jwt: {

                        algorithm: 'HS256',
                        secret: 'my-secret'
                    },

                    protect: {

                        mode: 'fail'
                    },

                    env: {

                        LIFE_THE_UNIVERSE_AND_EVERYTHING: '42'
                    },

                    logUncaughtExceptions: false,

                    stripErrors: 'no'
                };

                expect( process.env.LIFE_THE_UNIVERSE_AND_EVERYTHING ).to.not.exist;

                let vandium = new Vandium( config );

                expect( vandium.constructor.name ).to.equal( 'Vandium' );

                expect( vandium.stripErrors ).to.be.false;
                expect( vandium.logUncaughtExceptions ).to.be.false;

                expect( vandium.postHandler ).to.be.a( 'Function' );

                expect( vandium.plugins ).to.exist;

                expect( vandium.jwt ).to.to.exist;
                expect( vandium.jwt.state ).to.eql( {

                        enabled: true,
                        key: 'my-secret',
                        algorithm: 'HS256',
                        tokenName: 'jwt',
                        xsrf: false
                    });

                expect( vandium.validation ).to.to.exist;
                expect( vandium.validation.state ).to.eql( { enabled: true, keys: [ 'name' ], ignored: [ 'age' ] } );

                expect( vandium.protect ).to.to.exist;
                expect( vandium.protect.state ).to.eql( { sql: { enabled: true, mode: 'fail' } } );

                expect( process.env.LIFE_THE_UNIVERSE_AND_EVERYTHING ).to.equal( '42' );
            });
        });

        describe( '.validation', function() {

            it( 'normal operation', function() {

                let vandium = new Vandium();

                expect( vandium.validation ).to.equal( vandium.plugins.validation );
                expect( vandium.validation.constructor.name ).to.equal( 'ValidationPlugin' );
            });
        });

        describe( '.jwt', function() {

            it( 'normal operation', function() {

                let vandium = new Vandium();

                expect( vandium.jwt ).to.equal( vandium.plugins.jwt );
                expect( vandium.jwt.constructor.name ).to.equal( 'JWTPlugin' );
            });
        });

        describe( '.protect', function() {

            it( 'normal operation', function() {

                let vandium = new Vandium();

                expect( vandium.protect ).to.equal( vandium.plugins.protect );
                expect( vandium.protect.constructor.name ).to.equal( 'ProtectPlugin' );
            });
        });

        describe( '.configure', function() {

            it( 'without configuration', function() {

                let vandium = new Vandium();

                vandium.configure();

                expect( vandium.stripErrors ).to.be.true;
                expect( vandium.logUncaughtExceptions ).to.be.true;
                expect( vandium.postHandler ).to.be.a( 'Function' );

                expect( vandium.plugins ).to.exist;

                expect( vandium.jwt ).to.to.exist;
                expect( vandium.jwt.state.enabled ).to.be.false;

                expect( vandium.validation ).to.to.exist;
                expect( vandium.validation.state.enabled ).to.be.false;

                expect( vandium.protect ).to.to.exist;
                expect( vandium.protect.state ).to.eql( { sql: { enabled: true, mode: 'report' } } );
            });

            it( 'with empty configuration', function() {

                let vandium = new Vandium();

                vandium.configure( {} );

                expect( vandium.stripErrors ).to.be.true;
                expect( vandium.logUncaughtExceptions ).to.be.true;
                expect( vandium.postHandler ).to.be.a( 'Function' );

                expect( vandium.plugins ).to.exist;

                expect( vandium.jwt ).to.to.exist;
                expect( vandium.jwt.state.enabled ).to.be.false;

                expect( vandium.validation ).to.to.exist;
                expect( vandium.validation.state.enabled ).to.be.false;

                expect( vandium.protect ).to.to.exist;
                expect( vandium.protect.state ).to.eql( { sql: { enabled: true, mode: 'report' } } );
            });

            it( 'with valid configuration', function() {

                expect( process.env.LIFE_THE_UNIVERSE_AND_EVERYTHING ).to.not.exist;

                let vandium = new Vandium();

                let config = {

                    validation: {

                        schema: {

                            name: 'string:min=1,max=60,trim,required',
                        },

                        ignore: [ 'age' ]
                    },

                    jwt: {

                        algorithm: 'HS256',
                        secret: 'my-secret'
                    },

                    protect: {

                        mode: 'fail'
                    },

                    env: {

                        LIFE_THE_UNIVERSE_AND_EVERYTHING: '42'
                    },

                    logUncaughtExceptions: false,

                    stripErrors: 'no'
                };

                vandium.configure( config );

                expect( vandium.stripErrors ).to.be.false;
                expect( vandium.logUncaughtExceptions ).to.be.false;

                expect( vandium.postHandler ).to.be.a( 'Function' );

                expect( vandium.plugins ).to.exist;

                expect( vandium.jwt ).to.to.exist;
                expect( vandium.jwt.state ).to.eql( {

                        enabled: true,
                        key: 'my-secret',
                        algorithm: 'HS256',
                        tokenName: 'jwt',
                        xsrf: false
                    });

                expect( vandium.validation ).to.to.exist;
                expect( vandium.validation.state ).to.eql( { enabled: true, keys: [ 'name' ], ignored: [ 'age' ] } );

                expect( vandium.protect ).to.to.exist;
                expect( vandium.protect.state ).to.eql( { sql: { enabled: true, mode: 'fail' } } );

                expect( process.env.LIFE_THE_UNIVERSE_AND_EVERYTHING ).to.equal( '42' );
            });

            it( 'with valid configuration followed by empty configuration', function() {

                expect( process.env.LIFE_THE_UNIVERSE_AND_EVERYTHING ).to.not.exist;

                let vandium = new Vandium();

                let config = {

                    validation: {

                        schema: {

                            name: 'string:min=1,max=60,trim,required',
                        },

                        ignore: [ 'age' ]
                    },

                    jwt: {

                        algorithm: 'HS256',
                        secret: 'my-secret'
                    },

                    protect: {

                        mode: 'fail'
                    },

                    env: {

                        LIFE_THE_UNIVERSE_AND_EVERYTHING: '42'
                    },

                    logUncaughtExceptions: false,

                    stripErrors: 'no'
                };

                vandium.configure( config );

                expect( vandium.stripErrors ).to.be.false;
                expect( vandium.logUncaughtExceptions ).to.be.false;

                expect( vandium.postHandler ).to.be.a( 'Function' );

                expect( vandium.plugins ).to.exist;

                expect( vandium.jwt ).to.to.exist;
                expect( vandium.jwt.state ).to.eql( {

                        enabled: true,
                        key: 'my-secret',
                        algorithm: 'HS256',
                        tokenName: 'jwt',
                        xsrf: false
                    });

                expect( vandium.validation ).to.to.exist;
                expect( vandium.validation.state ).to.eql( { enabled: true, keys: [ 'name' ], ignored: [ 'age' ] } );

                expect( vandium.protect ).to.to.exist;
                expect( vandium.protect.state ).to.eql( { sql: { enabled: true, mode: 'fail' } } );

                expect( process.env.LIFE_THE_UNIVERSE_AND_EVERYTHING ).to.equal( '42' );

                // restore
                vandium.configure( {

                    env: {

                        LIFE_THE_UNIVERSE_AND_EVERYTHING: 'forty-two'
                    }
                });

                expect( vandium.stripErrors ).to.be.true;
                expect( vandium.logUncaughtExceptions ).to.be.true;
                expect( vandium.postHandler ).to.be.a( 'Function' );

                expect( vandium.plugins ).to.exist;

                expect( vandium.jwt ).to.to.exist;
                expect( vandium.jwt.state.enabled ).to.be.false;

                expect( vandium.validation ).to.to.exist;
                expect( vandium.validation.state.enabled ).to.be.false;

                expect( vandium.protect ).to.to.exist;
                expect( vandium.protect.state ).to.eql( { sql: { enabled: true, mode: 'report' } } );

                // should still be set to the original value
                expect( process.env.LIFE_THE_UNIVERSE_AND_EVERYTHING ).to.equal( '42' );
            });
        });

        describe( '.after', function() {

            it( '.normal operation', function() {

                let myFunction = function() {};

                let vandium = new Vandium();

                expect( vandium.postHandler ).to.exist;

                vandium.after( myFunction );
                expect( vandium.postHandler ).to.equal( myFunction );

                // wipe out configuration - post handler should still be set
                vandium.configure( {} );
                expect( vandium.postHandler ).to.equal( myFunction );

                // ignore non-functions
                vandium.after();
                expect( vandium.postHandler ).to.equal( myFunction );

                // replace
                vandium.after( function() {} );
                expect( vandium.postHandler ).to.not.equal( myFunction );
            });
        });

        describe( '.handler', function() {

            it( 'standard lambda handler with success', function( done ) {

                let vandium = new Vandium();

                let handler = vandium.handler( function() {

                    return Promise.resolve( 'ok' );
                });

                expect( handler ).to.exist;
                expect( handler.length ).to.equal( 3 );

                handler( {}, {}, function( err, result ) {

                    expect( result ).to.equal( 'ok' );
                    done();
                });
            });

            it( 'standard lambda handler with failure, stripErrors = true', function( done ) {

                let vandium = new Vandium();

                let handler = vandium.handler( function() {

                    return Promise.reject( new Error( 'bang') );
                });

                expect( handler ).to.exist;
                expect( handler.length ).to.equal( 3 );

                handler( {}, {}, function( err, result ) {

                    expect( err ).to.exist;
                    expect( err.message ).to.equal( 'bang' );
                    expect( err.stack.length ).to.equal( 0 );

                    expect( result ).to.not.exist;

                    done();
                });
            });

            it( 'standard lambda handler with failure, stripErrors = false', function( done ) {

                let vandium = new Vandium( {

                    stripErrors: false
                });

                let handler = vandium.handler( function() {

                    return Promise.reject( new Error( 'bang') );
                });

                expect( handler ).to.exist;
                expect( handler.length ).to.equal( 3 );

                handler( {}, {}, function( err, result ) {

                    expect( err ).to.exist;
                    expect( err.message ).to.equal( 'bang' );
                    expect( err.stack.length > 0 ).to.be.true;

                    expect( result ).to.not.exist;

                    done();
                });
            });

            it( 'standard lambda handler, post handler returns promise', function( done ) {

                let vandium = new Vandium();

                vandium.after( function() { return Promise.resolve(); } );

                let handler = vandium.handler( function() {

                    return Promise.resolve( 'ok' );
                });

                expect( handler ).to.exist;
                expect( handler.length ).to.equal( 3 );

                handler( {}, {}, function( err, result ) {

                    expect( result ).to.equal( 'ok' );
                    done();
                });
            });

            it( 'standard lambda handler, post handler with callback error', function( done ) {

                let vandium = new Vandium();

                vandium.after( function( callback ) { callback( new Error( 'error here!' ) ); } );

                let handler = vandium.handler( function() {

                    return Promise.resolve( 'ok' );
                });

                expect( handler ).to.exist;
                expect( handler.length ).to.equal( 3 );

                handler( {}, {}, function( err, result ) {

                    expect( result ).to.equal( 'ok' );
                    done();
                });
            });

            it( 'standard lambda handler, sync post handler throwing error', function( done ) {

                let vandium = new Vandium();

                vandium.after( function() { throw new Error( 'error here!' ); } );

                let handler = vandium.handler( function() {

                    return Promise.resolve( 'ok' );
                });

                expect( handler ).to.exist;
                expect( handler.length ).to.equal( 3 );

                handler( {}, {}, function( err, result ) {

                    expect( result ).to.equal( 'ok' );
                    done();
                });
            });

            // must be last test in this describe()
            //
            it( 'fail to run pipeline', function( done ) {

                class MyExecPlugin extends plugins.ExecPlugin {

                    constructor() {

                        super();
                    }

                    execute() {

                        throw new Error( 'bang' );
                    }
                }

                let vandium = new Vandium();

                // replace exec plugin - will get restored after
                plugins.ExecPlugin = MyExecPlugin;

                let handler = vandium.handler( function() {

                    return Promise.resolve( 'ok' );
                });

                expect( handler ).to.exist;
                expect( handler.length ).to.equal( 3 );

                handler( {}, {}, function( err, result ) {

                    expect( err ).to.exist;
                    expect( err.message ).to.equal( 'bang' );

                    expect( result ).to.not.exist;
                    
                    done();
                });
            });

            after( function() {

                plugins.ExecPlugin = ExecPlugin;
            });
        });
    });
});
