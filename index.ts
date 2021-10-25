import * as pulumi from '@pulumi/pulumi'
import { Metallb } from '@vizv/module-metallb'
import { IngressNginx } from './lib'

const config = new pulumi.Config()

new Metallb('metallb', {
  namespaceName: config.get('namespaceName') || 'default',
  addresses: config.require('addresses'),
})

new IngressNginx('ingress-nginx', {
  namespaceName: config.get('namespaceName') || 'default',
  ip: config.get('ip') || config.require('addresses').split('-')[0],
})
