'use strict';

var serverApiRoot = '/health/';
var mdtApiRoot = '/mdt/';
var illHistoryApiRoot = '/illhistory/';

var hostname = window.location.hostname,
    port = window.location.port,
    protocol = window.location.protocol + '//';

switch (hostname) {
    case 'localhost':
    case '127.0.0.1':
    case '192.168.3.70':
    case '192.168.3.46':
    case '192.168.4.24':
    case '192.168.1.102':
    case '192.168.4.33':
    case '192.168.3.61':
    case '192.168.3.33':
    case '192.168.3.32':
    case '192.168.3.35':
    case '192.168.3.65':
    case '192.168.3.38':
    case '192.168.3.18':
    case '192.168.1.180':
        serverApiRoot = protocol + hostname + ':' + (port || '80') + '/vpn/health/';
        mdtApiRoot = protocol + hostname + ':' + (port || '80') + '/vpn/mdt/';
        illHistoryApiRoot = protocol + hostname + ':' + (port || '80') + '/vpn/illhistory/';
        break;
    default:
        serverApiRoot = protocol + hostname + '/health/';
        mdtApiRoot = protocol + hostname + '/mdt/';
        illHistoryApiRoot = protocol + hostname + '/illhistory/';
}


module.exports = {
    serverApiRoot: serverApiRoot,
    mdtApiRoot: mdtApiRoot,
    illHistoryApiRoot: illHistoryApiRoot,
    UpLoadDomain: 'community'
};
