import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'GitLab',
    Svg: require('@site/static/img/gitlab.svg').default,
    description: (
      <>
        GitLab 安装、升级、配置、数据备份等使用方式
      </>
    ),
  },
  {
    title: 'GitLab Runner CI/CD',
    Svg: require('@site/static/img/CI_CD.svg').default,
    description: (
      <>
        GitLab Runner CI/CD，持续集成 CI、持续交付 CD、持续部署 CD 的安装、配置、使用说明等
      </>
    ),
  },
  {
    title: 'Kubernetes（k8s）',
    Svg: require('@site/static/img/kubernetes.svg').default,
    description: (
      <>
        Kubernetes（k8s）安装、配置、使用，以及高可用等配置说明
      </>
    ),
  },
  {
    title: 'Elasticsearch',
    Svg: require('@site/static/img/elastic.svg').default,
    description: (
      <>
        ELK（Elasticsearch、Logstash、Kibana）、EFK（Elasticsearch、Filebeat、Kibana） 安装、配置、使用等
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
