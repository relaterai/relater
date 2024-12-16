import LoginLinkTemplate from '@repo/email/templates/login-link';

const ExampleLoginLinkEmail = () => (
  <LoginLinkTemplate
    email="hello@later.run"
    url="http://app.localhost:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Fapp.localhost%3A3000%2Flogin&token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&email=youremail@gmail.com"
  />
);

export default ExampleLoginLinkEmail;
