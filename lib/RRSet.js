module.exports = class RRSet {
    constructor(name, type, ttl, changetype) {
        this.name = name;
        if (this.name.charAt(-1) != '.') {
            this.name += '.';
        }
        this.type = type;
        this.ttl = ttl;
        this.changetype = changetype;
        this.records = [];
        this.comments = [];
    }

    addRecord(content, disabled, set_ptr) {
        this.records.push({
            content: content,
            disabled: !!disabled,
            'set-ptr': !!set_ptr
        });
    }

    addComment(account, content, modified_at) {
        this.comments.push({
            account: account,
            content: content,
            modified_at: modified_at
        });
    }

    get() {
        return {
            name: this.name,
            type: this.type,
            ttl: this.ttl,
            changetype: this.changetype,
            records: this.records,
            comments: this.comments,
            isRRSet: true
        };
    }
};
