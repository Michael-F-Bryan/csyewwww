"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

import Map from "./components/Map";
import styles from "./page.module.css";
import { WarningArea } from "../types";
import { Input, UserInfo } from "./prompts";
import type { Advice } from "./gpt";

const fetcher = (url: string) => fetch(url).then(res => res.json());

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
  const [warningAreas, setWarningAreas] = useState<WarningArea[]>([]);

  useEffect(() => {
    fetch("/api/warnings")
      .then(r => r.json())
      .then(setWarningAreas);
  }, []);

  const onClick = (warningArea: WarningArea) => {
    console.log("On Click", { sendingPrompt });

    setSendingPrompt(true);

    postRequest(warningArea, userInfo)
      .then(advice => {
        console.log(advice);
        setAdvice(advice);
      })
      .finally(() => setSendingPrompt(false));
  };

  console.log(advice);

  return (
    <main className={styles.main}>
      <Map onClick={onClick} warningAreas={warningAreas} />
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

  if (false) {
    const response = await fetch("/api/advice", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      throw new Error(response.status + " " + response.statusText);
    }
    const advice = await response.json();
    console.log("Result", advice);

    return advice;
  }

  return {
    Title: "Fire",
    IncidentType: "Fire",
    ShortDescription: "",
    TimeSensitiveInformation: "",
  };
}
