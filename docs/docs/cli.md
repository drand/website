# Command line interface

The `drand` command can be used to fetch randomness from a running drand network. To do so, you'll need the group configuration file,
which can be obtained from a drand node operator using the [`drand show group` command](/operate/drand-cli/#drand-show).

Once you have the group file, the latest randomness can be obtained with [`drand get public`](/operate/drand-cli/#drand-get). The output will be in the same JSON format
as when fetching via HTTP.

For more information, see the [command line tools documentation](/operate/drand-cli/#usage).
