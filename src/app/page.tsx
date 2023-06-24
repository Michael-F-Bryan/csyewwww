"use client";

import { useState } from "react";
import Map from "./components/Map";
import styles from "./page.module.css";
import { Location, WarningArea } from "@/types";
import type { UserInfo, Input, IncidentInfo } from "./api/advice/route";

const initialUserInfo: UserInfo = {
  elderly: false,
  noVehicle: false,
  hasLivestock: false,
  hasFirefightingEquipment: false,
  requiresAssistance: false,
  mobilityIssues: false,
  visionImpaired: false,
  hearingImpaired: false,
  accessIssues: false,
};

export default async function Home() {
  const [response, setResponse] = useState();
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);

  return (
    <main className={styles.main}>
      <Map
        onClick={(warningArea, location) => postRequest(warningArea, userInfo)}
      />
    </main>
  );
}

async function postRequest(
  warningArea: WarningArea,
  userInfo: UserInfo
): Promise<unknown> {
  console.log("Inside warning area", { location, warningArea });
  const input: Input = {
    incident: {
      cadNumber: warningArea.cadNumber,
      polygonLevel: "",
      type: "Advice",
    },
    user: userInfo,
  };

  const response = await fetch("/api/advice", { method: "POST", body: JSON.stringify(input) });
  console.log(response);
  if (!response.ok) {
    throw new Error(response.status + " " + response.statusText);
  }

  const result = await response.json();
  console.log("Result", result);

  return result;
}
