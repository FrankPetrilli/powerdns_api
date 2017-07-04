const request = require('request');

module.exports = class PowerDNS {

    constructor(hostname, port, apiKey, version = 'v1', server = 'localhost') {
        const supportedVersions = ['v1'];
        if (!supportedVersions.includes(version)) {
            throw new Error(`Version '${version}' is not one of [${supportedVersions}].`);
        }
        this.hostname = hostname;
        this.port = port;
        this.apiKey = apiKey;
        this.server = server;
        this.version = version;
        this.baseUrl = `http://${hostname}:${port}/api/${version}/servers/${server}`;
        this.request = request.defaults({
            headers: {
                'X-API-Key': this.apiKey,
                'Accept': 'application/json'
            },
            baseUrl: this.baseUrl,
            json: true
        });
    }

    /* === ZONES === */

    getZones() {
        return new Promise((resolve, reject) => {
            this.request('/zones', (err, response, body) => {
                const failure = err || ((response.statusCode >= 300) ? new Error(JSON.stringify(response.body)) : false);
                if (failure) {
                    return reject(failure);
                }
                return resolve(body);
            });
        });
    }

    getZone(zoneName) {
        return new Promise((resolve, reject) => {
            this.request(`/zones/${zoneName}`, (err, response, body) => {
                const failure = err || ((response.statusCode >= 300) ? new Error(JSON.stringify(response.body)) : false);
                if (failure) {
                    return reject(failure);
                }
                return resolve(body);
            });
        });
    }

    createZone(zone) {
        return new Promise((resolve, reject) => {
            if (!zone.isZone) {
                return reject(Error('zone must be instance of Zone'));
            }
            this.request({
                url: '/zones', 
                method: 'POST',
                body: zone
            }, (err, response, body) => {
                const failure = err || ((response.statusCode >= 300) ? new Error(JSON.stringify(response.body)) : false);
                if (failure) {
                    return reject(failure);
                }
                return resolve(body);
            });
        });
    }

    updateZone(zoneName, rrsets) {
        return new Promise((resolve, reject) => {
            const isNotRRSet = rrsets.some((element) => !element.isRRSet);
            if (isNotRRSet) {
                return reject(Error('rrsets must be instance of RRSet, make sure you\'re calling .get()'));
            }
            this.request({
                url: `/zones/${zoneName}`, 
                method: 'PATCH',
                body: { rrsets: rrsets }
            }, (err, response) => {
                const failure = err || ((response.statusCode >= 300) ? new Error(JSON.stringify(response.body)) : false);
                if (failure) {
                    return reject(failure);
                }
                return resolve();
            });
        });
    }

    notifyZone(zoneName) {
        return new Promise((resolve, reject) => {
            this.request({
                url: `/zones/${zoneName}/notify`, 
                method: 'PUT',
            }, (err, response, body) => {
                const failure = err || ((response.statusCode != 204) ? new Error(JSON.stringify(response.body)) : false);
                if (failure) {
                    return reject(failure);
                }
                return resolve(body);
            });
        });
    }

    retrieveZone(zoneName) {
        return new Promise((resolve, reject) => {
            this.request({
                url: `/zones/${zoneName}/axfr-retrieve`, 
                method: 'PUT',
            }, (err, response, body) => {
                const failure = err || ((response.statusCode >= 300) ? new Error(JSON.stringify(response.body)) : false);
                if (failure) {
                    return reject(failure);
                }
                return resolve(body);
            });
        });
    }

    exportZone(zoneName) {
        return new Promise((resolve, reject) => {
            this.request({
                url: `/zones/${zoneName}/export`, 
                method: 'GET',
            }, (err, response, body) => {
                const failure = err || ((response.statusCode >= 300) ? new Error(JSON.stringify(response.body)) : false);
                if (failure) {
                    return reject(failure);
                }
                return resolve(body);
            });
        });
    }

    deleteZone(zoneName) {
        return new Promise((resolve, reject) => {
            this.request({
                url: `/zones/${zoneName}`, 
                method: 'DELETE',
            }, (err, response, body) => {
                const failure = err || ((response.statusCode >= 300) ? new Error(JSON.stringify(response.body)) : false);
                if (failure) {
                    return reject(failure);
                }
                return resolve(body);
            });
        });
    }
};

