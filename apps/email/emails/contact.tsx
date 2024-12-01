import { ContactTemplate } from '@repo/email/templates/contact';

const ExampleContactEmail = () => (
  <ContactTemplate
    name="Later Labs"
    email="hello@later.run"
    message="Build Your Creativity Space"
  />
);

export default ExampleContactEmail;
