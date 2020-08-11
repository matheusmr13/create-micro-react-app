import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const tools = [
  {
    title: <>Core concepts</>,
    features: [
      {
        title: <>Divide and conquer</>,
        imageUrl: 'img/ilustration/undraw_divide.svg',
        description: <>CMRA simplifies how you construct your microfrontend architechture</>,
      },
      {
        title: <>As simple as Create React App</>,
        imageUrl: 'img/ilustration/undraw_react.svg',
        description: <>A full set of features on one tool, helping you concerning about what metters</>,
      },
      {
        title: <>Microfrontend development easy</>,
        imageUrl: 'img/ilustration/undraw_cup_of_tea.svg',
        description: <>Hot reload, environment simulation, intuitive and much more.</>,
      },
      {
        title: <>Communication out of the box</>,
        imageUrl: 'img/ilustration/undraw_spread_love.svg',
        description: <>Share state and interact with another microfrontend</>,
      },
      {
        title: <>Command line</>,
        imageUrl: 'img/ilustration/undraw_coding.svg',
        description: (
          <>
            Create. build. ship.
            <br /> easy.
          </>
        ),
      },
    ],
  },
  {
    title: <>How it works</>,
    imageUrl: 'img/ilustration/undraw_works.svg',
    features: [
      {
        title: <>Create your app</>,
        description: (
          <pre>
            ReactDOM.render(
            <br />
            {'  <ImportMicrofrontend>'}
            <br />
            {'    <Store />'}
            <br />
            {'  </ImportMicrofrontend>'}
            <br />, document.getElementById('root'));
          </pre>
        ),
      },
      {
        title: <>Create your microfrontend</>,
        description: (
          <pre>
            {'const Cart = () => <div>cart</div>;'}
            <br />
            {'ExportMicrofrontend({ view: Cart });'}
          </pre>
        ),
      },
      {
        title: <>Use it</>,
        description: (
          <pre>
            {'const Store = ({'}
            <br />
            {'   microfrontend: { view: Cart }'}
            <br />
            {'}) => ('}
            <br />
            {'  <div>your cart: <Cart /></div>'}
            <br />
            );
            <br />
            export default withMicrofrontend(
            <br />
            {'  Store,'}
            <br />
            {"  { microfrontendKey: 'cart' }"}
            <br />
            );
          </pre>
        ),
      },
    ],
  },
  {
    title: <>Command line</>,
    imageUrl: 'img/ilustration/undraw_under_construction.svg',
    features: [
      {
        title: <>Creating</>,
        description: (
          <>
            <code>npx @cmra/cli create my-app</code>
            <br />
            Helps you on your decisions.
          </>
        ),
      },
      {
        title: <>Developing</>,
        description: (
          <>
            <code>npx @cmra/cli start</code>
            <br />
            Facilitate your development life
          </>
        ),
      },
      {
        title: <>Shipping</>,
        description: (
          <>
            <code>npx @cmra/cli build</code>
            <br />
            Safe and reliable
          </>
        ),
      },
    ],
  },
  {
    title: <>Backoffice</>,
    features: [
      {
        title: <>Be aware</>,
        imageUrl: 'img/ilustration/undraw_apps.svg',
        description: <>Get control of what microfrontend versions are deployed</>,
      },
      {
        title: <>Be safe</>,
        imageUrl: 'img/ilustration/undraw_validation.svg',
        description: (
          <>Deploy multiple microfrontends combination, create beta versions and make sure everything is right</>
        ),
      },
      {
        title: <>Be whatever you wanna be</>,
        imageUrl: 'img/ilustration/undraw_placeholders.svg',
        description: <>Integrate with multiple platforms such as github or amazon s3</>,
      },
    ],
  },
];

function Tool({ imageUrl, title, description, features, odd }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <section className={styles.tool}>
      <div className={styles.toolBackground}>
        <div className={odd ? styles.toolBackgroundLeft : styles.toolBackgroundRight} />
      </div>
      <div className="container">
        {imageUrl && (
          <div className="row">
            <img className={styles.toolImage} src={imgUrl} alt={title} />
          </div>
        )}
        <div className="row">
          <h2 className={styles.toolTitle}>{title}</h2>
        </div>
        <div className={clsx('row', styles.toolFeatures)}>
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <img className={styles.heroLogo} src="./img/logo-white.svg" alt="" />
          <img className={styles.heroLogoWhite} src="./img/logo-dark.svg" alt="" />
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--outline button--secondary button--lg', styles.getStarted)}
              to={useBaseUrl('docs/')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>{tools && tools.length > 0 && tools.map((tool, i) => <Tool {...tool} odd={i % 2 === 0} />)}</main>
    </Layout>
  );
}

export default Home;
