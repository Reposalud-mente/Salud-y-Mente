// src/app/components/Dashboard.tsx
"use client";

import React, { useState } from "react";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import SessionUpload from "./SessionUpload";
import SessionAnalysis from "./SessionAnalysis";
import Reports from "./Reports";
import AppointmentScheduler from "./AppointmentScheduler";
import SecureMessaging from "./SecureMessaging";

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default function Dashboard() {
  const [tabValue, setTabValue] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <AppBar position="static" color="default" role="navigation">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Dashboard Navigation Tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Video Upload" id="dashboard-tab-0" aria-controls="dashboard-tabpanel-0" />
          <Tab label="Analysis" id="dashboard-tab-1" aria-controls="dashboard-tabpanel-1" />
          <Tab label="Reports" id="dashboard-tab-2" aria-controls="dashboard-tabpanel-2" />
          <Tab label="Appointments" id="dashboard-tab-3" aria-controls="dashboard-tabpanel-3" />
          <Tab label="Messaging" id="dashboard-tab-4" aria-controls="dashboard-tabpanel-4" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <SessionUpload />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SessionAnalysis />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Reports />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <AppointmentScheduler />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <SecureMessaging />
      </TabPanel>
    </div>
  );
}
