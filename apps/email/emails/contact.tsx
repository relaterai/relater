import { ContactTemplate } from '@repo/email/templates';

const ExampleContactEmail = () => (
  <ContactTemplate
    name="Relater AI"
    email="hello@relater.ai"
    message="Your AI pair creator."
  />
);

export default ExampleContactEmail;
