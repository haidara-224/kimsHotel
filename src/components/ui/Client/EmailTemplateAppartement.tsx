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
import { getDetailsAppartement } from '@/app/(action)/Logement.action'

interface Props {
  email: string
  logementId: string
}

export default async function EmailTemplate({ email, logementId }: Props) {
  const logement = await getDetailsAppartement(logementId) as { nom: string }
  return (
    <Html lang="fr">
      <Head />
      <Preview>Vous avez une invitation {email} </Preview>
      <Body style={{ backgroundColor: '#f3f4f6', color: '#111827' }}>
        <Container
          style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}
        >
          <Heading style={{ fontSize: '24px', fontWeight: 'bold' }}>
            KIMS HOTEL !
          </Heading>
           <Text style={{ marginTop: '16px', color: '#374151' }}>
                      Vous avez été invité à être gerant dans l&apos;l&lsquo;appartement <strong>{logement?.nom || 'Inconnu'}</strong>.
                    </Text>
          <Button
           href={`https://kimshotel.net/invitation/appartement/${logementId}`} 
          //  href={`http://localhost:3000/invitation/appartement/${logementId}`}
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
            <Link href={`https://kimshotel.net/confidentialite`} style={{ color: '#0d9488' }}>
              Conditions d&apos;utilisation
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
