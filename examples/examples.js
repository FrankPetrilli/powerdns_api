/* eslint no-console: 0 */
const pdns = require('../');
const async = require('async');

const HOSTNAME = process.env.HOSTNAME || 'ns.example.com';
// In case you're using a different address to connect to the API
const NAMESERVER = process.env.NAMESERVER || 'ns.example.com'; 
const PORT = process.env.PORT || 8081;
const APIKEY = process.env.APIKEY || 'abcdefghijklmnopqrstuvwxyz';

const api = new pdns.PowerDNS(HOSTNAME, PORT, APIKEY);

async.waterfall([getZones, getZone, createZone, updateZone, updateZoneDelete, exportZone, deleteZone], (err) => {
    if (err) { 
        console.error('An error occurred: ');
        console.error(err);
    }
});

function getZones(callback) {
    console.log('===getZones===');
    api.getZones().then((zones) => {
        const masterCount = zones.filter((zone) => zone.kind === 'Master').length;
        const slaveCount = zones.filter((zone) => zone.kind === 'Slave').length;
        const nativeCount = zones.filter((zone) => zone.kind === 'Native').length;
        const dnssecCount = zones.filter((zone) => zone.dnssec).length;
        const highestSerial = Math.max.apply(Math, zones.map((zone) => zone.serial));
        console.log('Zones found:');
        console.log(`\tMasters: ${masterCount}`);
        console.log(`\tSlaves: ${slaveCount}`);
        console.log(`\tNatives: ${nativeCount}`);
        console.log();
        console.log(`\tDNSSEC: ${dnssecCount} ${((dnssecCount === 1) ? 'was' : 'were')} DNSSEC-secured`);
        console.log(`\tHighest serial: ${highestSerial}`);
        callback(null, ((zones[0] ? zones[0].name : null)));
    }).catch((e) => {
        callback(e);
    });
}

function getZone(zoneName, callback) {
    console.log('===getZone===');
    if (zoneName === null) {
        console.log('We have no zones to query details about.');
        callback(null);
        return;
    }
    api.getZone(zoneName).then((zone) => {
        const records = zone.rrsets.length;
        console.log(`Zone ${zone.name} has ${records} ${((records === 1) ? 'record' : 'records')}`);
        callback(null);
        return;
    }).catch((e) => {
        callback(e);
        return;
    });
}

function createZone(callback) {
    console.log('===createZone===');
    const name = 'test.example.com';
    // Use EPOCH because it's simple.
    let zone = new pdns.Zone(name, 'Master', 'EPOCH');
    // Add the machine we're talking to as a nameserver.
    zone.addNameserver(NAMESERVER);
    api.createZone(zone.get()).then(() => {
        console.log(`Created ${name}`);
        return callback(null, name);
    }).catch((e) => {
        if (e.message.match(/already exists/i)) {
            console.log(`INFO: Test domain ${name} already existed`);
            return callback(null, name);
        }
        callback(e);
    });

}

function updateZone(zoneName, callback) {
    console.log('===updateZone===');
    const disabled = false;
    const createPtr = false;
    const record = `pdns-nodejs-api-test.${zoneName}`;
    // Note that TXT records must be quoted.
    const content = '"PowerDNS NodeJS API Test"';
    // Note that this is a mutable object - addRecord and addComment change the RRSet
    let rrset = new pdns.RRSet(record, 'TXT', 5, 'REPLACE');
    rrset.addRecord(content, disabled, createPtr);
    const rrsets = [];
    rrsets.push(rrset.get());
    api.updateZone(zoneName, rrsets).then(() => {
        console.log(`We added a TXT record, ${record} with value ${content}`);
        callback(null, zoneName, record, content);
    }).catch((e) => {
        callback(e);
    });
}

function updateZoneDelete(zoneName, record, content, callback) {
    console.log('===updateZone - Delete===');
    const disabled = false;
    const createPtr = false;
    // Note that this is a mutable object - addRecord and addComment change the RRSet
    let rrset = new pdns.RRSet(record, 'TXT', 5, 'DELETE');
    rrset.addRecord(content, disabled, createPtr);
    const rrsets = [];
    rrsets.push(rrset.get());
    api.updateZone(zoneName, rrsets).then(() => {
        console.log(`We removed the TXT record ${record}`);
        callback(null, zoneName);
    }).catch((e) => {
        callback(e);
    });
}

function deleteZone(zoneName, callback) {
    console.log('===deleteZone===');
    api.deleteZone(zoneName).then(() => {
        console.log(`Zone ${zoneName} has been deleted`);
        callback(null);
    }).catch((e) => {
        callback(e);
    });
}

function exportZone(zoneName, callback) {
    console.log('===exportZone===');
    api.exportZone(zoneName).then((response) => {
        console.log(`Zone ${zoneName} has AXFR content:\n${response.zone}`);
        callback(null, zoneName);
    }).catch((e) => {
        callback(e);
    });
}
