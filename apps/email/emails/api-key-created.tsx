import ApiKeyCreatedTemplate from '@repo/email/templates/api-key-created';

const ExampleAPIKeyCreatedEmail = () => (
  <ApiKeyCreatedTemplate
    email="no-reply@relater.ai"
    token={{
      name: 'Relater API Key',
      type: 'All access',
      permissions: 'full access to all resources',
    }}
  />
);

export default ExampleAPIKeyCreatedEmail;
