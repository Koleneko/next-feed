import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Heading,
  Stack,
  StackDivider,
  TagLabel,
  Text,
  Flex,
  VStack,
  TabList,
  Tab,
  Tabs,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Post from "components/Post";

const userData: any = {};

const TirzProfile: React.FC = () => {
  return (
    <VStack overflow="hidden" mt={4} spacing={5}>
      <Box alignContent={"center"} mb={4}>
        <Text as="h1" fontSize="5xl" fontWeight={"bold"} align={"center"}>
          Tirz
        </Text>
        <Text>на сайте давно уже олд хуле</Text>
      </Box>
      <Divider />
      <Tabs alignSelf={"start"} pl={5} isLazy isFitted>
        <TabList>
          <Tab>Записи</Tab>
          <Tab>Комментарии</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Stack>
              <Post />
              <Post />
            </Stack>
          </TabPanel>
          <TabPanel>
            <Post />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default TirzProfile;
