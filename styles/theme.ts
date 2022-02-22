import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  components: {
    Button: { baseStyle: { _focus: { boxShadow: "none" } } },
    FormLabel: { baseStyle: { mb: 0 } },
    FormHelperText: { baseStyle: { mt: "0px" } },

    /*
    TODO Remove outline on tabs at src/Components/LoginModal
    Tab: { baseStyle: { _focus: { boxShadow: "none" } } },
    Tabs: { baseStyle: { _focus: { boxShadow: "none" } } },*/
  },
});

export default theme;
