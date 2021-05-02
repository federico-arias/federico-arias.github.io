+++
title = "Quick tip: setting up PostgreSQL on Linux"
description = ""
date = "2020-01-14"
tags = "postgres"
+++

Here is a quick bash script to remind me how to set-up a Postgres DB locally
without knowing the postgres password.

```bash
#!/bin/bash
db_name=$1
db_user="${db_name}user"

cat << EOF > /tmp/createdb
create database ${db_name};
create user ${db_user};
alter user ${db_user} with password 'pwd';
grant all privileges on database ${db_name} to ${db_user};
show hba_file;
EOF

sudo -u postgres psql postgres -f /tmp/createdb
```

I usually use a Docker image for this, but on some occasions
this might come in handy.
