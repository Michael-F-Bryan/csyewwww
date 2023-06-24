"use client";

import { useEffect, useState } from "react";
import Map from "./components/Map";
import styles from "./page.module.css";
import { Location, WarningArea } from "@/types";
import { Advice } from "./api/advice/route";
import { Input, UserInfo } from "./prompts";

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
  const [advice, setAdvice] = useState<Advice>();
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const [sendingPrompt, setSendingPrompt] = useState(false);
  const [selectedWarningArea, setSelectedWarningArea] = useState<WarningArea>();

  const onClick = (warningArea: WarningArea, location: Location) => {
    console.log("On Click", { sendingPrompt });
    if (!sendingPrompt) {
      setSelectedWarningArea(warningArea);
    }
  };

  useEffect(() => {
    if (selectedWarningArea) {
      setSendingPrompt(true);
      postRequest(selectedWarningArea, userInfo)
        .then(advice => {
          console.log(advice);
          setAdvice(advice);
          setSendingPrompt(false);
        })
    }

  }, [selectedWarningArea]);

  console.log(advice);

  return (
    <main className={styles.main}>
      <Map onClick={onClick} />
    </main>
  );
}

async function postRequest(
  warningArea: WarningArea,
  userInfo: UserInfo
): Promise<Advice> {
  console.log("Inside warning area", { location, warningArea });
  const input: Input = {
    incident: {
      cadNumber: warningArea.cadNumber,
      polygonLevel: "",
      type: "Advice",
    },
    user: userInfo,
  };

  queueMicrotask(() => {
    console.log(fetch);
  });

  const response = await fetch("/api/advice", {
    method: "POST",
    body: JSON.stringify(input),
  });
  console.log(response);
  if (!response.ok) {
    throw new Error(response.status + " " + response.statusText);
  }

  const result = await response.json();
  console.log("Result", result);

  return result;
}
