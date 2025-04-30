import * as React from 'react'
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Link,
  Button
} from '@react-email/components'
import { getHotelsDetails } from '@/app/(action)/hotel.action'

interface Props {
  email: string
  hotelId: string
}

export default async function EmailTemplate({ email, hotelId }: Props) {
  const hotel = await getHotelsDetails(hotelId) as { nom: string }

  return (
    <Html lang="fr">
      <Head />
      <Preview>Vous avez une invitation {email}</Preview>
      <Body style={{ backgroundColor: '#f3f4f6', color: '#111827' }}>
        <Container
          style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <Heading style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Kims Hotel !
          </Heading>
          <Text style={{ marginTop: '16px', color: '#374151' }}>
            Vous avez été invité à être hôtelier dans l&apos;hôtel <strong>{hotel?.nom || 'Inconnu'}</strong>.
          </Text>
          <Button
            href={`http://localhost:3000/invitation/hotel/${hotelId}`}
            style={{
              backgroundColor: '#0d9488',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '5px',
              textDecoration: 'none',
              marginTop: '20px'
            }}
          >
            Rejoindre maintenant
          </Button>
          <Text style={{ marginTop: '24px' }}>
            <Link href={`http://localhost:3000/confidentialite`} style={{ color: '#0d9488' }}>
              Conditions d&apos;utilisation
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
