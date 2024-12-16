import { ContactTemplate } from '@repo/email/templates';

const ExampleContactEmail = () => (
  <ContactTemplate
    name="Later Labs"
    email="hello@later.run"
    message="Capture faster, review better."
  />
);

export default ExampleContactEmail;
