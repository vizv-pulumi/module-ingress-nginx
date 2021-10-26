import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'

export interface IngressNginxArgs {
  namespaceName: pulumi.Input<string>
  ip: pulumi.Input<string>
}

export class IngressNginx extends pulumi.ComponentResource {
  public readonly chart: k8s.helm.v3.Chart

  constructor(
    name: string,
    args: IngressNginxArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('vizv:module:IngressNginx', name, {}, opts)

    this.chart = new k8s.helm.v3.Chart(
      name,
      {
        chart: 'ingress-nginx',
        fetchOpts: {
          repo: 'https://vizv-pulumi.github.io/helm-charts',
        },
        namespace: args.namespaceName,
        values: {
          controller: {
            ingressClassResource: {
              default: true,
            },
            service: {
              loadBalancerIP: args.ip,
              annotations: {
                'metallb.universe.tf/allow-shared-ip': args.ip,
              },
            },
          },
        },
      },
      {
        parent: this,
        protect: opts?.protect,
        dependsOn: opts?.dependsOn,
      },
    )
  }
}
