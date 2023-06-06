import React, { ReactNode } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
} from '@chakra-ui/react';
import {
  FiMail,
  FiUsers,
  FiMenu,
  FiUser,
  FiMessageCircle,
  FiFile,
  FiBox,
  FiCompass,
  FiStar,
  FiMap,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import {
  useSession,
  UserAccountDropdown,
  signIn,
  NotificationBell,
  ChatMessageBell,
  AccessServiceEnum,
  RoqResourceEnum,
  useAuthorizationApi,
  AccessOperationEnum,
} from '@roq/nextjs';
import Link from 'next/link';
import { HelpBox } from 'components/help-box';
import { AppLogo } from 'layout/app-logo';

interface LinkItemProps {
  name: string;
  icon?: IconType;
  path: string;
  entity: string;
  service?: AccessServiceEnum;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Users', icon: FiUsers, path: '/', entity: RoqResourceEnum.USER_PROFILE },
  { name: 'Profile', icon: FiUser, path: '/profile', entity: RoqResourceEnum.USER_PROFILE },
  { name: 'Invites', icon: FiMail, path: '/invites', entity: RoqResourceEnum.INVITE },
  { name: 'Chat', icon: FiMessageCircle, path: '/chat', entity: RoqResourceEnum.CONVERSATION },

  {
    name: 'Destination',
    path: '/destinations',
    entity: 'destination',
    service: AccessServiceEnum.PROJECT,
    icon: FiCompass,
  },
  {
    name: 'Recommendation',
    path: '/recommendations',
    entity: 'recommendation',
    service: AccessServiceEnum.PROJECT,
    icon: FiStar,
  },
  {
    name: 'Travel Planner',
    path: '/travel-planners',
    entity: 'travel_planner',
    service: AccessServiceEnum.PROJECT,
    icon: FiMap,
  },
  {
    name: 'User Destination',
    path: '/user-destinations',
    entity: 'user_destination',
    service: AccessServiceEnum.PROJECT,
    icon: FiBox,
  },
  {
    name: 'User Feedback',
    path: '/user-feedbacks',
    entity: 'user_feedback',
    service: AccessServiceEnum.PROJECT,
    icon: FiMessageCircle,
  },
  {
    name: 'User Recommendation',
    path: '/user-recommendations',
    entity: 'user_recommendation',
    service: AccessServiceEnum.PROJECT,
    icon: FiBox,
  },

  /** Add navigation item here **/
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <HelpBox />
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { hasAccess } = useAuthorizationApi();
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex bg="white" pos="fixed" h="20" w="100%" alignItems="center" mx="8" justifyContent="space-between">
        <AppLogo />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Box h="full" pt="20" pb="6" overflowY="auto">
        {LinkItems.filter((e) => hasAccess(e.entity, AccessOperationEnum.READ, e.service)).map((link) => (
          <NavItem key={link.name} icon={link.icon} path={link.path}>
            {link.name}
          </NavItem>
        ))}
      </Box>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: string | number;
  path: string;
}
const NavItem = ({ icon, children, path, ...rest }: NavItemProps) => {
  return (
    <Link href={path} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { session } = useSession();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <AppLogo isMobile />

      <HStack spacing={{ base: '0', md: '6' }}>
        {session?.roqUserId && <Text position="relative">{`${session.user?.roles?.join(', ')}`}</Text>}
        <NotificationBell />
        <Flex alignItems={'center'}>{session?.roqUserId && <UserAccountDropdown />}</Flex>
      </HStack>
    </Flex>
  );
};
