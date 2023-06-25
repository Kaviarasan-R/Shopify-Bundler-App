import { Box, HorizontalStack, Text, LegacyCard } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { MainTab } from "../components";
import "../assets/styles.css";

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <MainTab />
      <Box padding='6'>
        <HorizontalStack>
          <Text variant='headingXl' as='h4'>
            About
          </Text>
        </HorizontalStack>
        <Box paddingBlockStart='6'>
          <LegacyCard>
            <LegacyCard.Section>
              <Text variant='headingLg' as='h5'>
                {t("Documentation.heading")}
              </Text>
              {Array(2)
                .fill(0)
                .map((_, index) => (
                  <Box paddingBlockStart='3' key={index}>
                    <Text variant='headingMd' as='p' fontWeight='regular'>
                      {t(`Documentation.introduction-${index + 1}`)}
                    </Text>
                  </Box>
                ))}
              <Box paddingBlockStart='6'>
                <Text variant='headingLg' as='h5'>
                  {t("Documentation.appFeatures")}
                </Text>
              </Box>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Box paddingBlockStart='3' key={index}>
                    <Text variant='headingMd' as='p' fontWeight='regular'>
                      {index + 1}. {t(`Documentation.appFeatures-${index + 1}`)}
                    </Text>
                  </Box>
                ))}
            </LegacyCard.Section>
            <LegacyCard.Section>
              <Text variant='headingMd' as='p' fontWeight='medium'>
                Built with ❤️ by Kaviarasan R
              </Text>
            </LegacyCard.Section>
          </LegacyCard>
        </Box>
      </Box>
    </>
  );
}
