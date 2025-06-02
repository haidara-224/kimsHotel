import * as React from 'react'
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
 
  Button
} from '@react-email/components'

import { getDetailsHotel } from '@/app/(action)/hotel.action'

interface Props {
  email: string
  hotelId: string
}

export default async function EmailTemplateAcceptReservation({ email, hotelId }: Props) {
  const hotel = await getDetailsHotel(hotelId) as { nom: string }
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
                      Votre Reservation a été confirmée pour l&apos;l&lsquo;hotel <strong>{hotel?.nom || 'Inconnu'}</strong>.
                    </Text>
          <Button
           href={`https://kimshotel.net/reservations`} 
           // href={`http://localhost:3000/reservations`}
            style={{
              backgroundColor: '#0d9488',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '5px',
              textDecoration: 'none',
              marginTop: '20px'
            }}
          >
            Mes Reservations
          </Button>
        
        </Container>
      </Body>
    </Html>
  )
}
