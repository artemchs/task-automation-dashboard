import {
  AppShell,
  Burger,
  Group,
  NavLink as MantineNavLink,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { NavLink, Outlet } from 'react-router'
import { IconListCheck } from '@tabler/icons-react'
import { IconHome } from '@tabler/icons-react'

export function DashboardLayout() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group gap="xs">
            <IconListCheck size={24} color="var(--mantine-color-blue-filled)" />
            <Text size="md" fw={500}>
              Task Automation Dashboard
            </Text>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <MantineNavLink
          component={NavLink}
          to="/"
          label="Home"
          leftSection={<IconHome size="1rem" stroke={1.5} />}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
