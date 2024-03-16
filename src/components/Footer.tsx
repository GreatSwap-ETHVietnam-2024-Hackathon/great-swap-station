'use client';

import { Box, Container, Hidden, Link, Theme, Typography } from '@mui/material';

export type ContactItem = {
  id: string;
  title: string;
  href: string;
  icon: string
};

export const navConfigs: ContactItem[] = [
  {
    id: 'x',
    title: 'X',
    href: 'https://twitter.com',
    icon: '/images/XIcon.png'
  },
  {
    id: 'telegram',
    title: 'Telegram',
    href: 'https://t.me',
    icon: '/images/TelegramIcon.png'
  },
  {
    id: 'discord',
    title: 'Discord',
    href: 'https://discord.gg',
    icon: '/images/DiscordIcon.png'
  },

];

function DesktopFooter() {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      className="flex justify-between items-center"
      pt={5}
      pb={5}
    >
      <Box>
        <Box display={'flex'} alignItems={'center'}>
          <Link
            href={'/'}
            sx={(theme: Theme) => ({
              img: {
                width: 124,
                height: 'auto',
                [theme.breakpoints.down('sm')]: {
                  width: 107,
                },
              },
            })}
          >
            <img src={'/images/greatswap.png'} alt="Great Swap logo" style={{ height: '3rem', width: '3rem' }} />
          </Link>
          <Typography variant='h1' color='primary.main' fontWeight={'600'} ml='1rem'>Great Swap</Typography>
        </Box>
        <Typography variant='h6'>On-chain trading bot with account abstraction</Typography>
      </Box>

      <Box display='flex' flexDirection='column' alignItems='end'>
        <img
          style={{ height: '5rem' }}
          src="https://images.squarespace-cdn.com/content/v1/629856e64f44db3799f8e3f6/edd60cf4-eddf-4dad-8062-5c365806a72d/Frame+14801.png?format=1500w"></img>
      </Box>
    </Box>
  );
}

function MobileFooter() {
  return (
    <Box pt={3} pb={3}>
      <Link
        href={'/'}
        sx={(theme: Theme) => ({
          img: {
            width: 124,
            height: 'auto',
            [theme.breakpoints.down('sm')]: {
              width: 107,
            },
          },
        })}
      >
        <img src={'/images/greatswap.png'} alt="Great Swap logo" />
      </Link>
      <Typography variant="body2" color='text.tertiary' sx={{ mt: 1 }}>
        Your keys - Your coins - Your trading power
      </Typography>
      <Box display='flex' flexDirection='column'>
        <Box component="nav" sx={{ display: 'flex', gap: 3, mt: 4 }}>
          {navConfigs.map((nav) => (
            <Link
              color={'secondary.main'}
              key={nav.id}
              href={nav.href}
            >
              <img src={nav.icon} width={40} height={40} alt={nav.icon} />
            </Link>
          ))}
        </Box>
        <Typography marginTop='1rem' variant='body2' color='text.tertiary'>
          Copyright © {new Date().getFullYear()} Great Swap. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default function Footer() {
  return (
    <Box id='contact' component="footer">
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Hidden implementation="css" smUp>
          <MobileFooter />
        </Hidden>
        <Hidden implementation="css" smDown>
          <DesktopFooter />
        </Hidden>
      </Container>
    </Box>
  );
}
