import { UserInfo } from "@/prompts";

interface Props {
    info: UserInfo;
    infoChanged: (u: UserInfo) => void;
}

export default function Settings({ info, infoChanged }: Props) {
    function change(key: string, value: boolean) {
        infoChanged({
            ...info,
            [key]: value,
        });
    }

    const fields: Array<[keyof UserInfo, string]> = [
        ["elderly", "Elderly"],
        ["noVehicle", "No Vehicle Available"],
        ["hasLivestock", "Has Livestock"],
        ["hasFirefightingEquipment", "Firefighting Equipment"],
        ["requiresAssistance", "Requires Assistance"],
        ["mobilityIssues", "Mobility"],
    ];

    const checkboxes = fields.map(([key, label]) => {
        return (
            <div key={key}>
                <input
                    type="checkbox"
                    id={key}
                    checked={(info as any)[key]}
                    onChange={e => change(key, e.target.checked)}
                />
                <label htmlFor={key}>{label}</label>
            </div>)
    })

    return (
        <div style={{ display: "flex", flex: "1", justifyContent: "space-between", gap: "2em", padding: "1em" }}>
            {checkboxes}
        </div>
    );
}
