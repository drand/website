---
title: Storage Backends
---

# Storage Backends

Drand supports multiple storage backends: BoltDB, PostgreSQL, in-memory storage, aka. MemDB.

To launch Drand with a specific backend, you need to provide the `--db` flag.

The supported values are: `bolt` for BoltDB, `postgres` for PostgreSQL, `memdb` for the in-memory backend.

## BoltDB

The BoltDB backend allows Drand to store beacon data under a local filesystem.

The database can be found under the `<storage-path>/multibeacon/<beacon-id>/db/drand.db`.

This is the _default_ storage backend.

### Usage example:
```shell
drand start \
  -db boltdb \
  <other "start" options here>
```

You can also omit the `-db` flag.

At the moment, there are no configurable options for this backend.

## PostgreSQL

**_This backend is supported since Drand v1.5+._**

The PostgreSQL backend allows Drand to store beacons in a database.

The database connection will use `UTC` as default timezone. This parameter is not currently configurable.

### Usage example:

Before using this backend, you'll need to create a user that can read/write into the database you want the
beacons to be stored in.

You'll also need to manually apply the migration schema [chain/postgresdb/schema/schema.sql](https://github.com/drand/drand/blob/f18ccee8e57babb635742f7f73d4289a943b533a/chain/postgresdb/schema/schema.sql).

_Note_: You should always apply the schema corresponding to your code version.

```shell
drand start \
  -db postgres \
  -pg-dsn 'postgres://drand:drand@services.local.rodb.ro:45432/drand?sslmode=disable&connect_timeout=5' \
  <other "start" options here>
```

### Supported options:

You can customize the PostgreSQL backend using the `-pg-dsn` option. This allows you to control various connection
properties.

The available options are:
- `sslmode` - If the SSL mode is disabled or not. Supports: `required` or `disabled`. Default `disabled`.
- `connect_timeout` - How many seconds to wait until the connection attempt times out. Default: 5 seconds.
- `max-idle` - The number of maximum idle connections to the database. Default: 2.
- `max-open` - The number of maximum open connections to the database. Default: 0 - unlimited.
  - If `max-idle` is greater than 0 and `max-open` is less than `max-idle`, then `max-idle` will be capped to `max-open` limit.

## In-memory (memDB)

**_This backend is supported since Drand v1.5+._**

The in-memory backend, also refered to as memdb, allows the node to store all beacons in-memory.

This backend will lose all the contents on node restart/stop.

**Warning:** Using this backend on a threshold amount of nodes can cause cathastrophic network disruptions if
all nodes reboot/fail at the same time.

### Usage example:
```shell
drand start \
  -db memdb \
  -memdb-size 2000 \
  <other "start" options here>
```
 #### Supported options:

You can customize the in-memory backend by specifying the following options:
- `-memdb-size` - The number of beacons that each network will store before purging.

Note, the `memdb-size` applies to individually to all the networks. E.g., for a `-memdb-size=2000`:
- If you plan to run a single network, then the total number of beacons in memory will be 2000.
- If you plan to run two networks, then the total number of beacons in memory will be 4000.
- If you plan to run N networks, then the total number of beacons in memory will be N * 2000.

To help you estimate the memory size required to operate an in-memory node, you can use a size
of about 200 bytes for each beacon value stored.

Besides the memory constraints, you'll also have to keep in mind the frequency of the network:
- For a 30 seconds period, 2000 beacons will cover the last 100 minutes of values.
- For a 3 seconds period, 2000 beacons will cover the last 10 minutes of values.
- For a 1 second period, 2000 beacons will cover the last 33 minutes of values
