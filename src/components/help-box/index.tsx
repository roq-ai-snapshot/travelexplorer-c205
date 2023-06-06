import React from 'react';
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { useSession } from '@roq/nextjs';

export const HelpBox: React.FC = () => {
  const ownerRoles = ['Founder'];
  const roles = ['Founder', 'Travel Expert', 'Product', 'Customer Support', 'Guest'];
  const applicationName = 'TravelExplorer';
  const tenantName = 'Travel Planner';
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const userStories = `Founder:
1. As a founder, I want to be able to monitor the overall performance of the TravelExplorer app, so that I can make informed decisions about the direction of the company.
2. As a founder, I want to be able to view and analyze user feedback and reviews, so that I can identify areas for improvement and ensure customer satisfaction.
3. As a founder, I want to be able to track the growth and engagement of our user base, so that I can measure the success of our marketing efforts and make data-driven decisions.
4. As a founder, I want to be able to manage and oversee the work of the Travel Experts, Product, and Customer Support teams, so that I can ensure a high-quality user experience.

Travel Expert:
1. As a travel expert, I want to be able to create and update destination guides and recommendations, so that users have access to accurate and up-to-date information.
2. As a travel expert, I want to be able to respond to user inquiries and provide personalized recommendations, so that users feel supported and valued.
3. As a travel expert, I want to be able to collaborate with the Product team to develop new features and improvements, so that the app continues to meet the needs of our users.
4. As a travel expert, I want to be able to track the popularity and success of my recommendations, so that I can refine my approach and provide better advice to users.

Product:
1. As a product team member, I want to be able to analyze user behavior and feedback, so that I can identify areas for improvement and prioritize new features.
2. As a product team member, I want to be able to collaborate with Travel Experts and Customer Support to ensure that the app meets the needs of our users and provides a seamless experience.
3. As a product team member, I want to be able to track the performance of new features and updates, so that I can measure their impact and make data-driven decisions.
4. As a product team member, I want to be able to conduct user testing and gather feedback, so that I can ensure that new features are well-received and effective.

Customer Support:
1. As a customer support representative, I want to be able to quickly and effectively resolve user issues and inquiries, so that users feel supported and satisfied with the app.
2. As a customer support representative, I want to be able to escalate complex issues to the appropriate team members, so that users receive accurate and helpful information.
3. As a customer support representative, I want to be able to track and analyze common user issues, so that I can identify areas for improvement and work with the Product team to address them.

Guest:
1. As a guest, I want to be able to explore popular destinations and recommendations without creating an account, so that I can get a sense of the app's offerings before committing.
2. As a guest, I want to be able to access basic travel planning features, so that I can evaluate the usefulness of the app for my needs.
3. As a guest, I want to be able to easily create an account and access additional features, so that I can fully experience the benefits of the TravelExplorer app.`;

  const { session } = useSession();
  if (!process.env.NEXT_PUBLIC_SHOW_BRIEFING || process.env.NEXT_PUBLIC_SHOW_BRIEFING === 'false') {
    return null;
  }
  return (
    <Box width={1} position="fixed" left="20px" bottom="20px" zIndex={3}>
      <Popover placement="top">
        <PopoverTrigger>
          <IconButton
            aria-label="Help Info"
            icon={<FiInfo />}
            bg="blue.800"
            color="white"
            _hover={{ bg: 'blue.800' }}
            _active={{ bg: 'blue.800' }}
            _focus={{ bg: 'blue.800' }}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>App Briefing</PopoverHeader>
          <PopoverBody maxH="400px" overflowY="auto">
            <Text mb="2">Hi there!</Text>
            <Text mb="2">
              Welcome to {applicationName}, your freshly generated B2B SaaS application. This in-app briefing will guide
              you through your application. Feel free to remove this tutorial with the{' '}
              <Box as="span" bg="yellow.300" p={1}>
                NEXT_PUBLIC_SHOW_BRIEFING
              </Box>{' '}
              environment variable.
            </Text>
            <Text mb="2">You can use {applicationName} with one of these roles:</Text>
            <UnorderedList mb="2">
              {roles.map((role) => (
                <ListItem key={role}>{role}</ListItem>
              ))}
            </UnorderedList>
            {session?.roqUserId ? (
              <Text mb="2">You are currently logged in as a {session?.user?.roles?.join(', ')}.</Text>
            ) : (
              <Text mb="2">
                Right now, you are not logged in. The best way to start your journey is by signing up as{' '}
                {ownerRoles.join(', ')} and to create your first {tenantName}.
              </Text>
            )}
            <Text mb="2">
              {applicationName} was generated based on these user stories. Feel free to try them out yourself!
            </Text>
            <Box mb="2" whiteSpace="pre-wrap">
              {userStories}
            </Box>
            <Text mb="2">
              If you are happy with the results, then you can get the entire source code here:{' '}
              <Link href={githubUrl} color="cyan.500" isExternal>
                {githubUrl}
              </Link>
            </Text>
            <Text mb="2">
              Console Dashboard: For configuration and customization options, access our console dashboard. Your project
              has already been created and is waiting for your input. Check your emails for the invite.
            </Text>
            <Text mb="2">
              <Link href="https://console.roq.tech" color="cyan.500" isExternal>
                ROQ Console
              </Link>
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
