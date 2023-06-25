import Head from "next/head";

import { useState } from "react";
import useSWR from "swr";
import { Input, UserInfo } from "../prompts";
import { Advice } from "../gpt";
import { WarningArea } from "../types";
import Map from "../components/Map";
import Modal from "../components/Modal";

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

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const { data } = useSWR<WarningArea[]>("/api/warnings", fetcher);
  const warningAreas = data || [];
  const [advice, setAdvice] = useState<Advice>();
  const [querying, setQuerying] = useState(false);

  const onClick = (warningArea: WarningArea) => {
    if (querying) {
      return;
    }
    setQuerying(true);
    postRequest(warningArea, userInfo)
      .then(advice => postNotification(advice, () => setAdvice(advice)))
      .finally(() => setQuerying(false));
  };

  return (
    <>
      <Head>
        <title>csyewwww</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="main"
        style={{ background: querying ? "lightslategrey" : undefined }}
      >
        <Map onClick={onClick} warningAreas={warningAreas} />
        {advice && (
          <Modal advice={advice} onClose={() => setAdvice(undefined)} />
        )}
      </main>
    </>
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

  const response = await fetch("/api/advice", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(response.status + " " + response.statusText);
  }
  return await response.json();
}

async function postNotification(
  advice: Advice,
  onClick: () => void
): Promise<void> {
  if (Notification.permission != "granted") {
    const result = await Notification.requestPermission();
    if (result == "denied") {
      return;
    }
  }

  const n = new Notification(advice.Title, {
    body: advice.ShortDescription,
    icon: iconLink(advice.IncidentType),
  });
  n.addEventListener("click", () => {
    console.log("Clicked!");
    onClick();
    n.close();
  });
  n.addEventListener("error", e => console.log("Error", e));
  n.addEventListener("show", e => console.log("Show", e));
  n.addEventListener("close", e => console.log("Close", e));
}

function iconLink(text: string): string | undefined {
  switch (text.toLocaleLowerCase()) {
    case "fire":
      return "https://em-content.zobj.net/thumbs/240/google/350/fire_1f525.png";
    default:
      return undefined;
  }
}
