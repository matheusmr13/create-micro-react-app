import React, { useState } from 'react';

import { List, Avatar, Typography, Input } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, GithubOutlined, SearchOutlined } from '@ant-design/icons';

import useLoggedUser from 'base/hooks/user';
import { useGithubApiRequest } from 'base/hooks/request';
import { Link, useRouteMatch } from 'react-router-dom';
import Page from 'base/components/page';
import useQuery from 'base/hooks/query-param';

const IconText: React.FC<{
  icon: any;
  text: any;
}> = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);

const Repos: React.FC<{}> = () => {
  const [searchText, setSearchText] = useState('');
  const [{ data: repos, loading }, fetchRepos] = useGithubApiRequest('/user/repos?type=owner');

  const queryParam = useQuery();

  const getUrlToImport = (repo: any) => {
    let url = `./github/import/${repo.full_name}`;
    if (queryParam.get('applicationId')) url += `?applicationId=${queryParam.get('applicationId')}`;
    return url;
  };

  return (
    <Page title="Github Repositories">
      <Input
        size="large"
        placeholder="Search"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <List
        itemLayout="vertical"
        size="large"
        loading={loading}
        dataSource={(repos || []).filter((repo: any) => repo.name.indexOf(searchText) > -1)}
        renderItem={(repo: any) => (
          <List.Item
            key={repo.id}
            actions={[
              <IconText icon={StarOutlined} text={repo.stargazers_count} key="list-vertical-star-o" />,
              <IconText icon={MessageOutlined} text={repo.open_issues} key="list-vertical-message" />,
            ]}
            extra={<Link to={getUrlToImport(repo)}>Import</Link>}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<GithubOutlined />} />}
              title={repo.name}
              description={repo.description}
            />
            {'asd'}
          </List.Item>
        )}
      />
    </Page>
  );
};

export default Repos;
