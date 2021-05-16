+++
title = "A dashboard to assess occupational safety and health"
description = "The client needed a platform to create, manage and apply questionnaires to assess occupational safety. "
type = "project"
categories = ["react", "redux", "go", "postgres"]
shorttitle = "Qualivita"
mainimg = "qualivita-jumbotron.png"
img = "qualivita-bw.jpg"
imgs = ["1.jpg", "2.jpg"]
+++

The solution proposed was a single-page application
that allowed the user to create questionnaires that
generated instant visualizations and dashboards.

## FrontEnd

The React, Redux, Typescript combo was used to take
advantage of composability and to get rid of the
problems that were caused by a lack of type-safety
in previous projects.

<!--![A screenshot of the project][screenshot 1]-->

I also continued to work with [Nir Kaufman's design patterns
][nir] to organize asynchronous code as message passing,
ditching `react-thunk` in favor of middlewares.

## Backend

I am growing more and more fond of Go and decided to use it
for this project. I didn't use any framework, only the
following packages:

* [Migrate][migrate] to manage migrations.
* [GoMock][gomock] to mock structs directly from interfaces.
* [Gorilla mux][gomux] as an HTTP router.

The use of migrate was great when deploying,
but writing test data was a bit complicated.
I should probably try [Go Test Fixtures][gofixtures]
next time.

## Deployment

I used a Docker image deployed to ElasticBeanstalk in conjunction
with a Postgres database in RDS. Configuring everything to work
together proved to be quite a hassle, but fortunately you can script
almost anything so next time I start a project of similar
characteristics, I'll only have to call my current setup script.

This is a small example to show you how you can achieve almost
anything using the command line:

```bash
# creates a new user to
# perform all the database-related
# operations.
aws iam create-user \
	--user-name ${DB_USER} \
	--profile iam

aws iam attach-user-policy \
--policy-arn arn:aws:iam::aws:policy/AmazonRDSFullAccess \
--policy-arn arn:aws:iam::aws:policy/AmazonVPCFullAccess \
--policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess \
--user-name ${DB_USER} \
--profile iam

aws iam create-access-key --user-name ${DB_USER} --profile iam

read AWS_ID
read AWS_SECRET

aws configure set region us-east-2 --profile ${DB_USER}
aws configure set aws_access_key_id ${AWS_ID} --profile ${DB_USER}
aws configure set aws_secret_access_key ${AWS_SECRET} --profile ${DB_USER}

aws rds create-db-instance \
--allocated-storage 20 \
--db-instance-class db.t2.micro \
--db-instance-identifier ${DB_NAME} \
--engine postgres \
--master-username ${DB_USER} \
--port ${DB_CONTAINER_PORT} \
--enable-iam-database-authentication \
--master-user-password ${DB_PASSWORD} \
--db-security-groups
--profile ${DB_USER}
```

This portion of code assings AWS policies
to a user to create a new RDS instance.
Along with RDS, I used the following AWS services:

* IAM
* VPC
* ECR
* ElasticBeanstalk
* S3
* SQS
* Web Gateway

I used SQS to process some costly work
in the background (I also tought about using RabbitMQ, but since SQS
was already in AWS' ecosystem...). This mainly had
to do with PDF processing. I could have triggered a
goroutine but I preferred to use a separate worker.

[migrate]: https://github.com/golang-migrate/migrate/
[gomock]: https://github.com/golang/mock
[screenshot 1]: /qualivita-screenshot-1.jpg
[nir]: https://www.youtube.com/watch?v=JUuic7mEs-s
[gomux]: https://github.com/gorilla/mux
[gofixtures]: https://github.com/go-testfixtures/testfixtures
