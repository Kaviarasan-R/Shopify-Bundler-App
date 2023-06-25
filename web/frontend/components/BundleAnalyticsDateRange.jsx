import {
  VerticalStack,
  Box,
  Popover,
  TextField,
  LegacyCard,
  DatePicker,
  Icon,
} from "@shopify/polaris";
import { CalendarMinor } from "@shopify/polaris-icons";
import { useState, useEffect } from "react";

export function BundleAnalyticsDateRange(props) {
  const { selectedDate, setSelectedDate, minimumDate, maximumDate } = props;
  const [visible, setVisible] = useState(false);

  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });

  const formattedValue = selectedDate.toLocaleDateString("en-GB");

  function handleInputValueChange(value) {
    const selected = new Date(value);
    if (!isNaN(selected.getTime())) {
      setSelectedDate(selected);
    }
  }
  function handleOnClose({ relatedTarget }) {
    setVisible(false);
  }
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }
  function handleDateSelection({ end: newSelectedDate }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

    if (newSelectedDate > today) {
      setSelectedDate(today);
    } else {
      setSelectedDate(newSelectedDate);
    }

    setVisible(false);
  }

  useEffect(() => {
    if (selectedDate) {
      setDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);

  return (
    <VerticalStack inlineAlign='center' gap='4'>
      <Box minWidth='276px' padding={{ xs: 2 }}>
        <Popover
          active={visible}
          autofocusTarget='none'
          preferredAlignment='left'
          fullWidth
          preferInputActivator={false}
          preferredPosition='below'
          preventCloseOnChildOverlayClick
          onClose={handleOnClose}
          activator={
            <TextField
              role='combobox'
              label={minimumDate ? "Start Date" : "End Date"}
              prefix={<Icon source={CalendarMinor} />}
              value={formattedValue}
              onFocus={() => setVisible(true)}
              onChange={handleInputValueChange}
              autoComplete='off'
            />
          }
        >
          <LegacyCard>
            <DatePicker
              month={month}
              year={year}
              selected={selectedDate}
              onMonthChange={handleMonthChange}
              onChange={handleDateSelection}
              minDate={minimumDate}
              maxDate={maximumDate}
            />
          </LegacyCard>
        </Popover>
      </Box>
    </VerticalStack>
  );
}
