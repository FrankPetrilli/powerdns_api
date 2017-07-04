module.exports = class Zone {
    constructor(name, kind, soaEditApi, masters = [], nameservers = []) {
        this.name = name;
        if (this.name.charAt(-1) != '.') {
            this.name += '.';
        }
        this.kind = kind;
        this.soa_edit_api = soaEditApi;
        this.masters = masters;
        this.nameservers = nameservers;
    }

    addNameserver(nameserver) {
        if (nameserver.charAt(-1) != '.') {
            nameserver += '.';
        }
        this.nameservers.push(nameserver);
    }

    addMaster(master) {
        this.masters.push(master);
    }

    get() {
        return {
            name: this.name,
            kind: this.kind,
            soa_edit_api: this.soa_edit_api,
            changetype: this.changetype,
            masters: this.masters,
            nameservers: this.nameservers,
            isZone: true
        };
    }
};

