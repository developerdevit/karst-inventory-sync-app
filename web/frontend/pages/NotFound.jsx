import { Card, EmptyState, Page } from '@shopify/polaris';
import { notFoundImage } from '../assets';

export default function NotFound() {
  return (
    <Page>
      <Card>
        <Card.Section>
          <EmptyState heading='404' image={notFoundImage}>
            <p>Page not found</p>
          </EmptyState>
        </Card.Section>
      </Card>
    </Page>
  );
}
