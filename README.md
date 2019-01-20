# Description

This is a minimal REST API intended for use with a Continuous Integration system for generating and publishing build Diffs using [diffoscope](https://diffoscope.org/).

# API

It exposes just 1 call:

* `POST /builds` - Add a new build result and update the PR comment.
* `POST /manual` - Add a new build result and update the PR comment.

By default it listens on `localhost:8080`.

# Usage

```bash
$ cat << EOF
{
    "APK": "https://status-im.ams3.digitaloceanspaces.com/StatusIm-190120-143716-e878af-nightly.apk",
    "APP": "https://status-im.ams3.digitaloceanspaces.com/StatusIm-190120-134447-e878af-nightly.AppImage",
    "WIN": "https://status-im.ams3.digitaloceanspaces.com/StatusIm-190120-142222-e878af-nightly.exe"
}
EOF >> /tmp/body/json

$ curl -s -XPOST http://localhost:8000/commit/e878afc -d@/tmp/body.json -H 'Content-Type: application/json'
{
    "status": "ok",
    "url": "http://localhost:8000/commit/e878afc
}
```

```bash
$ cat << EOF
{
    "options": [
        "--exclude='smali_classes*'"
    ],
    "files": [
        "https://status-im.ams3.digitaloceanspaces.com/StatusIm-190112-031332-40aff1-nightly.apk",
        "https://status-im.ams3.digitaloceanspaces.com/StatusIm-190120-142222-e878af-nightly.exe"
    ]
}
EOF >> /tmp/body/json

$ curl -s -XPOST http://localhost:8000/manual -d@/tmp/body.json -H 'Content-Type: application/json'
{
    "status": "ok",
    "url": "http://localhost:8000/manual/StatusIm-190112-031332-40aff1-nightly.apk/vs/StatusIm-190120-142222-e878af-nightly.exe"
}
```


# Configuration

There are few environment variables you can set:

* `LISTEN_PORT` - Self explanatory. (Default: `8000`)
* `DB_SAVE_INTERVAL` - How often database is written to disk. (Default: `5000`)
* `DB_PATH` - Path where the [LokiJS](http://lokijs.org/#/) DB file is stored. (Default: `/tmp/builds.db`)

# Building

* `yarn run start` - For production use.
* `yarn run devel` - For development use.
* `yarn run default` - For building use.
* `yarn run release` - To create and push the docker image use.
