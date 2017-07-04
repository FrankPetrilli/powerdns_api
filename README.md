PowerDNS API for Node.js
===

Supported API Versions
---

* v1

Features
---

* ❌ = Not Implemented

* Zones
  * Get list - `getZones()`
  * Get details / records - `getZone(zoneName)`
  * Create - `createZone(zone)`
    * Use .Zone helper class
  * Update / delete records - `updateZone(zoneName, rrsets)`
    * Use .RRSet helper class
  * Notify slaves - `notifyZone(zoneName)`
  * Retrieve - `retrieveZone(zoneName)`
  * Delete - `deleteZone(zoneName)`
  * Export to AXFR - `exportZone(zoneName)`
  * ❌ Update metadata
  * ❌ Check (not implemented in PowerDNS as of writing)
  * ❌ Get metadata
* ❌ Cryptokeys
* ❌ Search
* ❌ Cache (not implemented in PowerDNS as of writing)
* ❌ Logging
* ❌ Statistics
* ❌ Tracing / Failures

See `examples/examples.js` for use.

Testing
---

Set environment variables as seen in examples/examples.js and run against a test server using `npm test`
