# Test guide

---
This document facilitates an example of working commands to run two networks on a set of drand daemons. Nodes will be created using `docker-compose`.
The file can be found on drand repo, under `<project-folder>/test/docker*utils/docker-compose.yml`.

## Pre requisites

---
1) Build docker images as follows:

```bash
make build_docker_all
```

2) Start drand nodes as follows:

```bash
docker-compose up -d
```

**Note**: This docker compose file is located in drand repository [here](https://github.com/drand/drand/blob/9627b87986bd855f93ed16b055d21496040dc865/test/docker/docker-compose.yml).

## Start new networks

---

### Default network
#### Start leader
- nohup docker exec -u drand drand_3 /bin/sh -c 'drand share --leader --nodes 4 --threshold 3 --period "5s"' &

#### Start the rest of the nodes
- nohup docker exec -u drand drand_2 /bin/sh -c 'drand share --connect drand_3:8380 --tls-disable' &
- nohup docker exec -u drand drand_1 /bin/sh -c 'drand share --connect drand_3:8380 --tls-disable' &
- nohup docker exec -u drand drand_0 /bin/sh -c 'drand share --connect drand_3:8380 --tls-disable' &

_Notes_
- As it is thedefault network, the beacon id is not set on commands.
- Long-term keys for default network are not explicitly created by the operator because they are created automatically by docker image on startup.

### Second network
##### Generate keys
- nohup docker exec -u drand drand_0 /bin/sh -c 'drand generate-keypair --tls-disable --id test_beacon "drand_0:8080"' &
- nohup docker exec -u drand drand_1 /bin/sh -c 'drand generate-keypair --tls-disable --id test_beacon "drand_1:8180"' &
- nohup docker exec -u drand drand_2 /bin/sh -c 'drand generate-keypair --tls-disable --id test_beacon "drand_2:8280"' &
- nohup docker exec -u drand drand_3 /bin/sh -c 'drand generate-keypair --tls-disable --id test_beacon "drand_3:8380"' &

#### Start leader
- nohup docker exec -u drand drand_3 /bin/sh -c 'drand share --leader --nodes 4 --threshold 3 --period "60s" --id test_beacon' &


#### Start the rest of the nodes
- nohup docker exec -u drand drand_2 /bin/sh -c 'drand share --connect drand_3:8380 --tls-disable --id test_beacon' &
- nohup docker exec -u drand drand_1 /bin/sh -c 'drand share --connect drand_3:8380 --tls-disable --id test_beacon' &
- nohup docker exec -u drand drand_0 /bin/sh -c 'drand share --connect drand_3:8380 --tls-disable --id test_beacon' &


## Resharing networks 

---

### Default network
#### Pre requisites
- Copy group file **.drand/default/groups/drand_group.toml** from node 0 to node 4 volume

#### Start on leader
- nohup docker exec -u drand drand_0 /bin/sh -c 'drand share --transition --leader --nodes 5 --threshold 4' &

#### Start on the rest of the nodes
- nohup docker exec -u drand drand_2 /bin/sh -c 'drand share --transition  --connect drand_0:8080 --tls-disable' &
- nohup docker exec -u drand drand_1 /bin/sh -c 'drand share --transition  --connect drand_0:8080 --tls-disable' &
- nohup docker exec -u drand drand_3 /bin/sh -c 'drand share --transition  --connect drand_0:8080 --tls-disable' &
- nohup docker exec -u drand drand_4 /bin/sh -c 'drand share --connect drand_0:8080 --from ./data/drand/.drand/multibeacon/default/groups/drand_group.toml --tls-disable' &

_Notes_
- As it is thedefault network, the beacon id is not set on commands.
- Nodes which are part of the running network must use the flag **--transition**
- New nodes which will be part of this network must use the flag **--from**, providing the actual network group file. This file can be found on other nodes.

### Second network
#### Pre requisites
- Copy group file **.drand/test_beacon/groups/drand_group.toml** from node 0 to node 4 volume

#### Generate keys
- nohup docker exec -u drand drand_4 /bin/sh -c 'drand generate-keypair --tls-disable --id test_beacon "drand_4:8480"' &

#### Reshare on leader
- nohup docker exec -u drand drand_0 /bin/sh -c 'drand share --transition --leader --nodes 5 --threshold 4 --id test_beacon' &

#### Reshare on the rest of the nodes
- nohup docker exec -u drand drand_2 /bin/sh -c 'drand share --transition  --connect drand_0:8080 --tls-disable --id test_beacon' &
- nohup docker exec -u drand drand_1 /bin/sh -c 'drand share --transition  --connect drand_0:8080 --tls-disable --id test_beacon' &
- nohup docker exec -u drand drand_3 /bin/sh -c 'drand share --transition  --connect drand_0:8080 --tls-disable --id test_beacon' &
- nohup docker exec -u drand drand_4 /bin/sh -c 'drand share --connect drand_0:8080 --from ./data/drand/.drand/multibeacon/test_beacon/groups/drand_group.toml --tls-disable' &

_Notes_
- Nodes which are part of the running network must use the flag **--transition**
- New nodes which will be part of this network must use the flag **--from**, providing the actual network group file. This file can be found on other nodes.
