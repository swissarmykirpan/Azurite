'use strict';

class SignedIdentifiers {
    SignedIdentifier: any[];
    constructor() {
        this.SignedIdentifier = [];
    }

    addSignedIdentifier(id, start, expiry, permissionlist) {
        this.SignedIdentifier.push({
            Id: id,
            AccessPolicy: {
                Start: start,
                Expiry: expiry,
                Permission: permissionlist 
            }
        });
    }
}

export default SignedIdentifiers;