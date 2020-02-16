+++
title = "About me"
disqus = false
layout = "page"
+++

I am Federico Arias, a freelance **full-stack developer** based 
on Latin America. I have experience working with the following tools:

* **Front**: ES6 (D3.js, React, Jest, Node), SCSS. 
* **Back**: Golang, Scala, Python, Postgres, SQL Server, Linux, Redis.
* **DevOps**: Docker, AWS, Google Cloud, CircleCI, Fluentd, Grafana.
* **Tools**: Git, Vim, R, LaTex, XSLT.

### Current Stack

I have experimented with a lot of tools, frameworks and programming paradigms, 
from PHP to Scala, from MySQL to Neo4j. This is my preferred stack after
all that experimentation:

* **Postgres**: Writing SQL is just fun. I was never convinced by the
hype of document databases and the fact that the industry is coming
back to SQL reinforces my allegiance to the language. 
* **Redis**: I use it mainly to store transient data (verification tokens, 
session information, etc.), but I am hoping to use it in the future as a 
cache for complex Postgres queries.
* **Golang**: after years of PHP and Python development, discovering 
Go was a life-changing event. The batteries-included approach (a
documentation tool, a code formatter and a testing framework come
with the language), the simplicity, and the type-safety without the
verbosity made programming fun again.
* **React**: Currently, there is little competition in the front-end, so
React seems to be the obvious choice. Plus, if you throw a couple of linters,
a testing framework and Typescript, you can bypass a good part of 
Javascript shortcomings. 

I have adopted a TDD approach after years of avoiding it. Sometimes 
writing tests might be boring, but it's certainly better than 
having to refresh the browser over and over, or having to wait
for your whole app to load to test every small detail. This has also
allowed me to implement a CI/CD pipeline.  Back in the day, 
you could FTP into an Apache server and upload your LAMP app in a couple of steps. 
Nowadays, having to coordinate S3, EC2, ECS, ERS, RDS, ElastiCache and a myriad of other
services make the manual approach seem less feasible. 

I am building Docker images for all my apps and deploying them
to Heroku or AWS using an automated CircleCI configuration. I have a bash script
that sets up an IAM role, creates a VPC, a S3 bucket, an ElasticBeanstalk 
environment, a RDS database and takes care of a bunch of other tasks, but I am
planning on using Terraform in the future.

## Technical Writing

I am also an experienced Technical Writer with a demonstrated 
history of working in the e-learning industry. 

I have mostly worked with companies specialized 
in the fields of Business Intelligence and Big Data Analytics, 
helping them gather, systematize and transfer knowledge through 
a wide variety of delivery mediums including video and online manuals. 

This site was built with a custom-made template for [Hugo][2]. 
You can find it [here in my GitHub][github] along with other projects.

## Social media

If I stumble upon any interesting article, it'll probably 
end up on my [Twitter feed][1].  My learning path of all of the 
above is somehow documented in [StackOverflow][so].

I head a small foundation to foster **sustainable building practices** 
with the aim of strengthening community development, so you might find posts 
about both of these topics intertwined in my social media.

[1]: https://twitter.com/FedericoAriasR
[2]: https://gohugo.io/
[igram]: https://www.instagram.com/federico.360p/
[so]: https://stackoverflow.com/users/story/1797161
[github]: https://github.com/federico-arias/hugo-them
